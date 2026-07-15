var AutoTour = pc.createScript('auto-tour');

AutoTour.attributes.add('cameraRig', { type: 'entity', title: 'Camera Rig' });
AutoTour.attributes.add('speed', { type: 'number', default: 1.0, title: 'Tour Speed Multiplier' });

AutoTour.prototype.initialize = function() {
    this._isPlaying = false;
    this._time = 0;
    this._duration = 0;
    this._points = [];
    
    this._posCurve = new pc.CurveSet();
    this._rotCurve = new pc.CurveSet();
    
    this.app.on('tour:play', this.play, this);
    this.app.on('tour:stop', this.stop, this);
};

AutoTour.prototype.play = function() {
    if (!this.cameraRig) {
        this.cameraRig = this.app.root.findByName('Character_Controller') || this.app.root.findByName('Camera');
    }
    
    // Fetch active POIs from PoiManager
    var scripts = this.app.root.findComponents('script');
    var poiManager = null;
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].poiManager) {
            poiManager = scripts[i].poiManager;
            break;
        }
    }
    
    var pointsData = [];
    var camPos = this.cameraRig.getPosition();
    var camRot = this.cameraRig.getEulerAngles();
    pointsData.push({ pos: [camPos.x, camPos.y, camPos.z], rot: [camRot.x, camRot.y, camRot.z], duration: 0 });
    
    if (poiManager && poiManager.activePois.length > 0) {
        for (var j = 0; j < poiManager.activePois.length; j++) {
            var index = poiManager.activePois[j];
            var target = poiManager.pois[index];
            
            var tp, tr;
            if (target.customView) {
                var cp = target.customView.getPosition();
                var cr = target.customView.getEulerAngles();
                tp = [cp.x, cp.y, cp.z];
                tr = [cr.x, cr.y, cr.z];
            } else if (target.customPos && (target.customPos.x !== 0 || target.customPos.y !== 0 || target.customPos.z !== 0)) {
                tp = [target.customPos.x, target.customPos.y, target.customPos.z];
                if (target.customRot) {
                    var tempEnt = new pc.Entity();
                    tempEnt.setEulerAngles(target.customRot);
                    var er = tempEnt.getEulerAngles();
                    tr = [er.x, er.y, er.z];
                    tempEnt.destroy();
                } else {
                    tr = [-30, 0, 0];
                }
            } else {
                var entPos = target.entity.getPosition();
                var offset = new pc.Vec3(0, 0.5, 1).normalize().scale(5);
                var camP = entPos.clone().add(offset);
                tp = [camP.x, camP.y, camP.z];
                var tempEnt2 = new pc.Entity();
                this.app.root.addChild(tempEnt2);
                tempEnt2.setPosition(camP);
                tempEnt2.lookAt(entPos);
                var er2 = tempEnt2.getEulerAngles();
                tr = [er2.x, er2.y, er2.z];
                tempEnt2.destroy();
            }
            
            var lastP = pointsData[pointsData.length - 1].pos;
            var dx = tp[0] - lastP[0], dy = tp[1] - lastP[1], dz = tp[2] - lastP[2];
            var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
            // Speed = 8 units per sec. Minimum 1s so we don't snap
            var dur = Math.max(1.0, dist / 8.0);
            
            pointsData.push({ pos: tp, rot: tr, duration: dur });
        }
    } else {
        pointsData.push({ pos: [camPos.x, camPos.y + 5, camPos.z], rot: [camRot.x - 30, camRot.y + 45, camRot.z], duration: 4 });
        pointsData.push({ pos: [camPos.x + 5, camPos.y + 5, camPos.z + 5], rot: [camRot.x - 30, camRot.y + 90, camRot.z], duration: 4 });
    }
    
    if (pointsData.length < 2) return;
    
    this._points = pointsData;
    this._posCurve = new pc.CurveSet();
    this._posCurve.curves = [new pc.Curve(), new pc.Curve(), new pc.Curve()];
    this._rotCurve = new pc.CurveSet();
    this._rotCurve.curves = [new pc.Curve(), new pc.Curve(), new pc.Curve()];
    
    var currentTime = 0;
    var lastRot = [pointsData[0].rot[0], pointsData[0].rot[1], pointsData[0].rot[2]];
    for (var i = 0; i < this._points.length; i++) {
        var p = this._points[i];
        
        this._posCurve.curves[0].add(currentTime, p.pos[0]);
        this._posCurve.curves[1].add(currentTime, p.pos[1]);
        this._posCurve.curves[2].add(currentTime, p.pos[2]);
        
        // Prevent naive Euler wrap-around flipping by finding shortest path
        var rx = p.rot[0], ry = p.rot[1], rz = p.rot[2];
        if (i > 0) {
            while (rx - lastRot[0] > 180) rx -= 360;
            while (rx - lastRot[0] < -180) rx += 360;
            while (ry - lastRot[1] > 180) ry -= 360;
            while (ry - lastRot[1] < -180) ry += 360;
            while (rz - lastRot[2] > 180) rz -= 360;
            while (rz - lastRot[2] < -180) rz += 360;
        }
        
        this._rotCurve.curves[0].add(currentTime, rx);
        this._rotCurve.curves[1].add(currentTime, ry);
        this._rotCurve.curves[2].add(currentTime, rz);
        
        lastRot = [rx, ry, rz];
        currentTime += (p.duration || 5.0) / this.speed;
    }
    
    this._posCurve.type = pc.CURVE_SPLINE; // Catmull-Rom
    this._rotCurve.type = pc.CURVE_SPLINE;
    
    this._duration = currentTime;
    this._time = 0;
    this._isPlaying = true;
    
    // Disable character controller & rigidbody during tour
    var cc = this.cameraRig.script['character-controller'];
    if (cc) cc.enabled = false;
    
    if (this.cameraRig.rigidbody) {
        this._wasRigidbodyEnabled = this.cameraRig.rigidbody.enabled;
        this.cameraRig.rigidbody.enabled = false;
    }
    
    console.log("[AutoTour] Started cinematic tour, duration: " + this._duration + "s");
};

AutoTour.prototype.stop = function() {
    this._isPlaying = false;
    // Re-enable character controller
    if (this.cameraRig) {
        var cc = this.cameraRig.script['character-controller'];
        if (cc) cc.enabled = true;
        
        // Re-enable rigidbody and teleport
        if (this.cameraRig.rigidbody && this._wasRigidbodyEnabled) {
            this.cameraRig.rigidbody.enabled = true;
            this.cameraRig.rigidbody.teleport(this.cameraRig.getPosition());
            this.cameraRig.rigidbody.activate();
        }
    }
    
    // Notify UI
    this.app.fire('tour:stop');
    console.log("[AutoTour] Stopped cinematic tour.");
};

AutoTour.prototype.update = function(dt) {
    if (!this._isPlaying) return;
    
    this._time += dt;
    if (this._time > this._duration) {
        this.stop(); 
        return;
    }
    
    var px = this._posCurve.curves[0].value(this._time);
    var py = this._posCurve.curves[1].value(this._time);
    var pz = this._posCurve.curves[2].value(this._time);
    
    var rx = this._rotCurve.curves[0].value(this._time);
    var ry = this._rotCurve.curves[1].value(this._time);
    var rz = this._rotCurve.curves[2].value(this._time);
    
    this.cameraRig.setPosition(px, py, pz);
    
    var cc = this.cameraRig.script['character-controller'];
    if (cc) {
        cc.pitch = rx;
        cc.yaw = ry;
        cc.camera.setLocalEulerAngles(rx, ry, rz);
    } else {
        this.cameraRig.setLocalEulerAngles(rx, ry, rz);
    }
};
