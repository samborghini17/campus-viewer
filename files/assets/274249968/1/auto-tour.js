var AutoTour = pc.createScript('auto-tour');

AutoTour.attributes.add('cameraRig', { type: 'entity', title: 'Camera Rig' });
AutoTour.attributes.add('speed', { type: 'number', default: 1.0, title: 'Tour Speed Multiplier' });

AutoTour.prototype.initialize = function() {
    this._isPlaying = false;
    this._time = 0;
    this._duration = 0;
    this._points = [];
    
    this.app.on('tour:play', this.play, this);
    this.app.on('tour:stop', this.stop, this);
};

AutoTour.prototype.play = function() {
    if (!this.cameraRig) {
        this.cameraRig = this.app.root.findByName('Character_Controller') || this.app.root.findByName('Camera');
    }
    
    var scripts = this.app.root.findComponents('script');
    var poiManager = null;
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].poiManager) {
            poiManager = scripts[i].poiManager;
            break;
        }
    }
    
    this._targets = [];
    
    if (poiManager && poiManager.activePois.length > 0) {
        for (var j = 0; j < poiManager.activePois.length; j++) {
            var index = poiManager.activePois[j];
            var target = poiManager.pois[index];
            if (!target) continue;
            
            var centerPos;
            if (target.customPos && (target.customPos.x !== 0 || target.customPos.y !== 0 || target.customPos.z !== 0)) {
                centerPos = target.customPos.clone();
                centerPos.y -= 1.0; 
            } else if (target.entity) {
                centerPos = target.entity.getPosition().clone();
            } else {
                continue;
            }
            
            this._targets.push({
                center: centerPos,
                radius: 6.0,
                heightOffset: 0.5,
                orbitDuration: 6.0,
                orbitAngleStart: j * 45
            });
        }
    } else {
        var camPos = this.cameraRig.getPosition();
        this._targets.push({ center: new pc.Vec3(camPos.x, camPos.y, camPos.z - 5), radius: 5, heightOffset: 0, orbitDuration: 5, orbitAngleStart: 0 });
        this._targets.push({ center: new pc.Vec3(camPos.x + 10, camPos.y, camPos.z - 5), radius: 5, heightOffset: 0, orbitDuration: 5, orbitAngleStart: 90 });
    }
    
    if (this._targets.length < 1) return;
    
    this._currentTargetIndex = 0;
    this._state = 'FLY'; 
    this._stateTime = 0;
    
    // Determine which camera script we have
    this._ccScript = this.cameraRig.script['character-controller'];
    this._ufcScript = this.cameraRig.script['universalFlyCam'];
    
    // Disable them
    if (this._ccScript) this._ccScript.enabled = false;
    if (this._ufcScript) this._ufcScript.enabled = false;
    
    if (this.cameraRig.rigidbody) {
        this._wasRigidbodyEnabled = this.cameraRig.rigidbody.enabled;
        this.cameraRig.rigidbody.enabled = false;
    }
    
    // Calculate start pos/rot safely
    this._flyStartPos = this.cameraRig.getPosition().clone();
    
    // If we have CC, the actual visual camera is a child
    if (this._ccScript && this._ccScript.camera) {
        this._flyStartQuat = this._ccScript.camera.getRotation().clone();
    } else {
        this._flyStartQuat = this.cameraRig.getRotation().clone();
    }
    
    var dest = this._getOrbitTransform(this._targets[0], 0);
    this._flyEndPos = dest.pos;
    this._flyEndQuat = dest.quat;
    
    var dist = this._flyStartPos.distance(this._flyEndPos);
    this._flyDuration = Math.max(2.0, dist / 12.0); 
    
    this._isPlaying = true;
    console.log("[AutoTour] Started cinematic tour state machine.");
};

AutoTour.prototype._getOrbitTransform = function(target, progress) {
    var angle = target.orbitAngleStart + (progress * 90);
    var rad = angle * pc.math.DEG_TO_RAD;
    
    var ox = target.center.x + Math.sin(rad) * target.radius;
    var oz = target.center.z + Math.cos(rad) * target.radius;
    var oy = target.center.y + target.heightOffset;
    
    var pos = new pc.Vec3(ox, oy, oz);
    
    var tempEnt = new pc.Entity();
    this.app.root.addChild(tempEnt);
    tempEnt.setPosition(pos);
    
    // Prevent exactly identical points causing NaN LookAt
    var diff = new pc.Vec3().sub2(target.center, pos);
    if (diff.lengthSq() < 0.0001) {
        tempEnt.setEulerAngles(0,0,0);
    } else {
        tempEnt.lookAt(target.center);
    }
    
    var quat = tempEnt.getRotation().clone();
    tempEnt.destroy();
    
    return { pos: pos, quat: quat };
};

AutoTour.prototype.update = function(dt) {
    if (!this._isPlaying) return;
    
    this._stateTime += dt * this.speed;
    
    if (this._state === 'FLY') {
        var progress = this._stateTime / this._flyDuration;
        if (progress >= 1.0) {
            progress = 1.0;
            this._state = 'ORBIT';
            this._stateTime = 0;
        }
        
        var u = progress * progress * (3 - 2 * progress); // smoothstep
        var curPos = new pc.Vec3().lerp(this._flyStartPos, this._flyEndPos, u);
        
        // Prevent slerp identical quat crash
        var curQuat = new pc.Quat();
        var dot = this._flyStartQuat.x * this._flyEndQuat.x + this._flyStartQuat.y * this._flyEndQuat.y + this._flyStartQuat.z * this._flyEndQuat.z + this._flyStartQuat.w * this._flyEndQuat.w;
        if (Math.abs(dot) > 0.9999) {
            curQuat.copy(this._flyEndQuat);
        } else {
            curQuat.slerp(this._flyStartQuat, this._flyEndQuat, u);
        }
        
        this._applyTransform(curPos, curQuat);
        
    } else if (this._state === 'ORBIT') {
        var target = this._targets[this._currentTargetIndex];
        var progress = this._stateTime / target.orbitDuration;
        
        if (progress >= 1.0) {
            this._currentTargetIndex = (this._currentTargetIndex + 1) % this._targets.length;
            var nextTarget = this._targets[this._currentTargetIndex];
            
            this._flyStartPos = this.cameraRig.getPosition().clone();
            if (this._ccScript && this._ccScript.camera) {
                this._flyStartQuat = this._ccScript.camera.getRotation().clone();
            } else {
                this._flyStartQuat = this.cameraRig.getRotation().clone();
            }
            
            var dest = this._getOrbitTransform(nextTarget, 0);
            this._flyEndPos = dest.pos;
            this._flyEndQuat = dest.quat;
            
            var dist = this._flyStartPos.distance(this._flyEndPos);
            this._flyDuration = Math.max(2.0, dist / 12.0);
            
            this._state = 'FLY';
            this._stateTime = 0;
            return;
        }
        
        var transform = this._getOrbitTransform(target, progress);
        this._applyTransform(transform.pos, transform.quat);
    }
};

AutoTour.prototype._applyTransform = function(pos, quat) {
    this.cameraRig.setPosition(pos);
    
    if (this._ccScript && this._ccScript.camera) {
        this._ccScript.camera.setRotation(quat);
    } else {
        this.cameraRig.setRotation(quat);
    }
};

AutoTour.prototype.stop = function() {
    this._isPlaying = false;
    
    if (this.cameraRig) {
        // We must sync the camera's visual rotation back to the controller's internal variables
        var finalRot = new pc.Vec3();
        if (this._ccScript && this._ccScript.camera) {
            finalRot = this._ccScript.camera.getEulerAngles();
        } else {
            finalRot = this.cameraRig.getEulerAngles();
        }
        
        // Restore Character Controller
        if (this._ccScript) {
            this._ccScript.pitch = finalRot.x;
            this._ccScript.yaw = finalRot.y;
            this._ccScript.enabled = true;
            if (this._ccScript.controller) {
                this._ccScript.controller.look.set(finalRot.y, finalRot.x);
            }
        }
        
        // Restore Universal Fly Cam
        if (this._ufcScript) {
            this._ufcScript.pitch = finalRot.x;
            this._ufcScript.yaw = finalRot.y;
            this._ufcScript.enabled = true;
        }
        
        // Restore Rigidbody
        if (this.cameraRig.rigidbody && this._wasRigidbodyEnabled) {
            this.cameraRig.rigidbody.teleport(this.cameraRig.getPosition());
            this.cameraRig.rigidbody.linearVelocity = pc.Vec3.ZERO;
            this.cameraRig.rigidbody.angularVelocity = pc.Vec3.ZERO;
            this.cameraRig.rigidbody.enabled = true;
        }
    }
    
    this.app.fire('tour:stop');
    console.log("[AutoTour] Stopped cinematic tour.");
};
