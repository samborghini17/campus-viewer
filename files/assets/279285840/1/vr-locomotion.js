var VrLocomotion = pc.createScript('vrLocomotion');

VrLocomotion.attributes.add('cameraEntity', { type: 'entity', title: 'VR Camera' });
VrLocomotion.attributes.add('speed', { type: 'number', default: 12.0, title: 'Lauf-Geschwindigkeit' });
VrLocomotion.attributes.add('smoothTurn', { type: 'boolean', default: false, title: 'Weiches Drehen (Smooth Turn)' });
VrLocomotion.attributes.add('snapAngle', { type: 'number', default: 45.0, title: 'Snap-Winkel (Grad)' });
VrLocomotion.attributes.add('turnSpeed', { type: 'number', default: 90.0, title: 'Smooth-Drehgeschwindigkeit' });

VrLocomotion.prototype.initialize = function() {
    this.canSnapTurn = true; 
    this.moveVec = new pc.Vec3();
};

VrLocomotion.prototype.update = function(dt) {
    if (!this.app.xr || !this.app.xr.active || !this.app.xr.input || !this.app.xr.input.inputSources) return;
    if (!this.cameraEntity) return;

    var inputSources = this.app.xr.input.inputSources;
    var rightStickX = 0;
    
    for (var i = 0; i < inputSources.length; i++) {
        var input = inputSources[i];
        
        if (input.gamepad && input.gamepad.axes) {
            var axes = input.gamepad.axes;
            var xAxis = axes.length > 2 ? axes[2] : axes[0];
            var zAxis = axes.length > 3 ? axes[3] : axes[1];

            // LINKER CONTROLLER: Laufen
            if (input.handedness === 'left') {
                if (Math.abs(xAxis) > 0.1 || Math.abs(zAxis) > 0.1) {
                    var forward = this.cameraEntity.forward.clone();
                    var right = this.cameraEntity.right.clone();
                    
                    forward.y = 0; forward.normalize();
                    right.y = 0; right.normalize();

                    this.moveVec.set(0, 0, 0);
                    this.moveVec.add(forward.mulScalar(-zAxis * this.speed * dt));
                    this.moveVec.add(right.mulScalar(xAxis * this.speed * dt));
                    
                    this.entity.translate(this.moveVec);
                }
            }

            // RECHTER CONTROLLER: Drehen
            if (input.handedness === 'right') {
                rightStickX = xAxis;
            }
        }
    }

    // DREH-LOGIK (Smooth oder Snap)
    if (Math.abs(rightStickX) > 0.2) {
        if (this.smoothTurn) {
            // Weiches Drehen
            this.entity.rotateLocal(0, -rightStickX * this.turnSpeed * dt, 0);
        } else {
            // 45-Grad Snap Turn (erfordert Loslassen des Sticks)
            if (Math.abs(rightStickX) > 0.5 && this.canSnapTurn) {
                var sign = rightStickX > 0 ? -1 : 1; 
                this.entity.rotateLocal(0, sign * this.snapAngle, 0);
                this.canSnapTurn = false; 
            }
        }
    } else {
        this.canSnapTurn = true; 
    }
};