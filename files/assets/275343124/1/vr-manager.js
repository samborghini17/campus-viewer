var VrManager = pc.createScript('vrManager');

VrManager.attributes.add('cameraEntity', { type: 'entity', title: 'Camera' });
VrManager.attributes.add('pcRig', { type: 'entity', title: 'PC Character Controller' });
VrManager.attributes.add('vrRig', { type: 'entity', title: 'VR Rig (Leeres Entity)' });
VrManager.attributes.add('vrFarClip', { type: 'number', default: 10, title: 'VR Sichtweite (Splats)' });
VrManager.attributes.add('renderScale', { type: 'number', default: 0.4, min: 0.1, max: 1.0, title: 'VR Render Auflösung' });

VrManager.prototype.initialize = function() {
    if (!this.app.xr.supported) return;
    this.createButton();
    if (this.app.xr.isAvailable(pc.XRTYPE_VR)) this.btn.style.display = 'block';
    else this.app.xr.on('available:' + pc.XRTYPE_VR, (available) => { if (available) this.btn.style.display = 'block'; });

    this.app.xr.on('start', this.onXrStart, this);
    this.app.xr.on('end', this.onXrEnd, this);
    this.app.on('update', this.updateVR, this);
    
    this._lastTrigger = false;
    this.setupPhysicalLasers(); // Physische Zylinder für die Laser bauen
};

VrManager.prototype.setupPhysicalLasers = function() {
    this.lasers = {};
    var self = this;
    ['left', 'right'].forEach(function(handedness) {
        var pivot = new pc.Entity();
        var laser = new pc.Entity();
        
        laser.addComponent('model', { type: 'cylinder' });
        var mat = new pc.StandardMaterial();
        mat.emissive = handedness === 'left' ? new pc.Color(1,0,0) : new pc.Color(0,1,1);
        mat.diffuse = new pc.Color(0,0,0);
        mat.useLighting = false;
        mat.update();
        laser.model.material = mat;
        
        // Zylinder dünn machen und 10 Meter lang
        laser.setLocalScale(0.005, 10, 0.005);
        // Entlang der Z-Achse ausrichten (Blickrichtung)
        laser.setLocalEulerAngles(90, 0, 0);
        // Nach vorne verschieben, damit der Ursprung am Controller liegt
        laser.setLocalPosition(0, 0, -5);
        
        pivot.addChild(laser);
        self.app.root.addChild(pivot);
        pivot.enabled = false;
        self.lasers[handedness] = pivot;
    });
};

VrManager.prototype.createButton = function() {
    this.btn = document.createElement('div');
    this.btn.textContent = "VR Starten";
    var bgPrimary = 'rgba(20, 20, 25, 0.35)', textSecondary = 'rgba(235, 235, 245, 0.7)';
    var textHover = 'rgba(255, 255, 255, 1)', borderCol = 'rgba(255, 255, 255, 0.1)';
    Object.assign(this.btn.style, {
        position: 'absolute', bottom: '10px', left: '10px', padding: '6px 12px', fontSize: '11px', 
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: textSecondary, 
        display: 'none', cursor: 'pointer', zIndex: '10000', userSelect: 'none', 
        background: bgPrimary, backdropFilter: 'blur(12px)', webkitBackdropFilter: 'blur(12px)', 
        border: '1px solid ' + borderCol, borderRadius: '20px', transition: 'all 0.2s ease'
    });
    this.btn.onmouseover = () => { this.btn.style.color = textHover; this.btn.style.background = 'rgba(40, 40, 45, 0.55)'; };
    this.btn.onmouseout = () => { this.btn.style.color = textSecondary; this.btn.style.background = bgPrimary; };
    this.btn.addEventListener('click', () => {
        if (!this.cameraEntity) return;
        if (this.app.xr.active) this.app.xr.end();
        else this.cameraEntity.camera.startXr(pc.XRTYPE_VR, pc.XRSPACE_LOCALFLOOR, { framebufferScaleFactor: this.renderScale });
    });
    document.body.appendChild(this.btn);
};

VrManager.prototype.onXrStart = function() {
    this.btn.style.display = 'none';
    
    if (this.cameraEntity && this.vrRig && this.pcRig) {
        var startPos = this.pcRig.getPosition();
        var pcEuler = this.pcRig.getEulerAngles();
        
        // Rig positionieren. WICHTIG: Strikte Nullung der X und Z Rotation gegen invertierten Kopf!
        this.vrRig.setPosition(startPos.x, startPos.y - 1.0, startPos.z);
        this.vrRig.setEulerAngles(0, pcEuler.y, 0); // Nur Y-Drehung übernehmen
        this.vrRig.setLocalScale(1, 1, 1);
        
        this.cameraEntity.reparent(this.vrRig);
        this.cameraEntity.setLocalPosition(0,0,0);
        this.cameraEntity.setLocalEulerAngles(0,0,0); // Kamera strikt nullen!
        this.cameraEntity.setLocalScale(1, 1, 1);
    }

    if (this.pcRig && this.pcRig.script && this.pcRig.script['character-controller']) this.pcRig.script['character-controller'].enabled = false;
    if (this.cameraEntity.script) {
        if (this.cameraEntity.script.cameraControls) this.cameraEntity.script.cameraControls.enabled = false;
        if (this.cameraEntity.script.universalFlyCam) this.cameraEntity.script.universalFlyCam.enabled = false;
    }
    
    var cameraComp = this.cameraEntity.camera;
    if (cameraComp) {
        this.originalClearColor = cameraComp.clearColor.clone(); 
        cameraComp.clearColor = new pc.Color(0, 0, 0, 1); 
        this.originalFarClip = cameraComp.farClip;
        cameraComp.farClip = this.vrFarClip; 
    }
    this.app.fire('preset:low');
};

VrManager.prototype.onXrEnd = function() {
    this.btn.style.display = 'block';
    
    // Laser verstecken
    if (this.lasers) {
        this.lasers.left.enabled = false;
        this.lasers.right.enabled = false;
    }
    
    if (this.cameraEntity && this.pcRig && this.vrRig) {
        var endPos = this.vrRig.getPosition();
        if (this.pcRig.rigidbody) this.pcRig.rigidbody.teleport(endPos.x, endPos.y + 1.0, endPos.z);
        else this.pcRig.setPosition(endPos.x, endPos.y + 1.0, endPos.z);
        
        this.cameraEntity.reparent(this.pcRig);
        this.cameraEntity.setLocalPosition(0,0,0);
    }

    if (this.pcRig && this.pcRig.script && this.pcRig.script['character-controller']) this.pcRig.script['character-controller'].enabled = true;
    if (this.cameraEntity.script) {
        if (this.cameraEntity.script.cameraControls) this.cameraEntity.script.cameraControls.enabled = true;
        if (this.cameraEntity.script.universalFlyCam) this.cameraEntity.script.universalFlyCam.enabled = true;
    }
    
    var cameraComp = this.cameraEntity.camera;
    if (cameraComp && this.originalClearColor) cameraComp.clearColor = this.originalClearColor;
    if (cameraComp && this.originalFarClip) cameraComp.farClip = this.originalFarClip;
    this.app.fire('preset:high');
};

VrManager.prototype.updateVR = function() {
    // Wenn Laser existieren, standardmäßig ausblenden (werden nur eingeschaltet, wenn Controller aktiv sind)
    if (this.lasers) {
        this.lasers.left.enabled = false;
        this.lasers.right.enabled = false;
    }

    if (!this.app.xr || !this.app.xr.active || !this.app.xr.input || !this.app.xr.input.inputSources) return;
    
    var inputSources = this.app.xr.input.inputSources;
    var triggerPressed = false;

    for (var i = 0; i < inputSources.length; i++) {
        var input = inputSources[i];
        
        // ECHTE PHYSISCHE LASER ZEICHNEN
        if (input && input.ray && this.lasers) {
            var pivot = this.lasers[input.handedness];
            if (pivot) {
                pivot.enabled = true;
                pivot.setPosition(input.ray.origin);
                // LookAt dreht die Z-Achse zum Ziel. Da unser Zylinder auf X=90 gedreht ist, zeigt er perfekt als Strahl nach vorne.
                var target = new pc.Vec3().copy(input.ray.direction).add(input.ray.origin);
                pivot.lookAt(target);
            }
        }
        
        if (input && input.gamepad && input.gamepad.buttons) {
            if ((input.gamepad.buttons[4] && input.gamepad.buttons[4].pressed) || 
                (input.gamepad.buttons[5] && input.gamepad.buttons[5].pressed)) {
                this.app.xr.end();
            }
            
            // Trigger (Zeigefinger) = Button 0
            if (input.gamepad.buttons[0] && input.gamepad.buttons[0].pressed) {
                triggerPressed = true;
                if (!this._lastTrigger && input.ray) {
                    this.app.fire('vr:trigger', input.ray.origin, input.ray.direction);
                }
            }
        }
    }
    this._lastTrigger = triggerPressed;
};