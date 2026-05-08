var CharacterController = pc.createScript('character-controller');

CharacterController.attributes.add('camera', { type: 'entity', title: 'Camera (Auto-Find)' });
CharacterController.attributes.add('speed', { type: 'number', default: 0.75 });
CharacterController.attributes.add('lookSens', { type: 'number', default: 0.15 });

CharacterController.prototype.initialize = function() {
    // AUTO-FIND: Sucht die Kamera, falls das Feld im Editor leer ist
    if (!this.camera) this.camera = this.app.root.findByName('Camera');
    if (this.camera) this.camera.setLocalPosition(0, 0.7, 0); // Player height 0.7m

    // AUTO-FIX PHYSIK: Garantiert, dass du dich bewegen kannst
    if (this.entity.rigidbody) {
        this.entity.rigidbody.type = pc.BODYTYPE_DYNAMIC;
        if (this.entity.rigidbody.mass === 0) this.entity.rigidbody.mass = 1;
        this.entity.rigidbody.angularFactor = pc.Vec3.ZERO;
        this.entity.rigidbody.restitution = 0; // Prevent bouncing on polygon edges
        this.entity.rigidbody.friction = 0;
    }

    this.pitch = 0;
    this.yaw = 0;
    this._mouseActive = false;
    this.lastX = null;
    this.lastY = null;
    this.isDragging = false;
    this.controlMode = 'joystick'; // 'joystick' or 'drag'
    this.mouseX = 0;
    this.mouseY = 0;

    // Bind mouse handlers
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);

    // Register enable/disable callbacks
    this.on('enable', this._enableMouse, this);
    this.on('disable', this._disableMouse, this);
    
    this.app.on('controls:setMode', function(mode) {
        this.controlMode = mode;
        this.lastX = null;
        this.lastY = null;
        this.isDragging = false;
    }, this);

    this.on('destroy', function() {
        this._disableMouse();
    }, this);
};

CharacterController.prototype._enableMouse = function() {
    if (this._mouseActive) return;
    if (this.app.mouse) {
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this._onMouseMove, this);
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this._onMouseDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this._onMouseUp, this);
        this._mouseActive = true;
        console.log('[CharCtrl] Mouse input enabled');
    }
};

CharacterController.prototype._disableMouse = function() {
    if (!this._mouseActive) return;
    if (this.app.mouse) {
        this.app.mouse.off(pc.EVENT_MOUSEMOVE, this._onMouseMove, this);
        this.app.mouse.off(pc.EVENT_MOUSEDOWN, this._onMouseDown, this);
        this.app.mouse.off(pc.EVENT_MOUSEUP, this._onMouseUp, this);
        this._mouseActive = false;
        this.lastX = null;
        this.lastY = null;
        this.isDragging = false;
        console.log('[CharCtrl] Mouse input disabled');
    }
};

// DER WICHTIGE FIX FÜR DEINE WERTE: 
// Wandelt [169, -20, -180] automatisch so um, dass du richtig herum stehst!
CharacterController.prototype.setStartRotation = function(rot) {
    if (this.camera) {
        this.camera.setLocalEulerAngles(rot.x, rot.y, rot.z);
        var fwd = this.camera.forward;
        this.yaw = Math.atan2(-fwd.x, -fwd.z) * pc.math.RAD_TO_DEG;
        this.pitch = Math.asin(fwd.y) * pc.math.RAD_TO_DEG;
    }
};

CharacterController.prototype.onMouseDown = function(e) {
    if (this.controlMode === 'drag' && e.button === pc.MOUSEBUTTON_LEFT) {
        this.isDragging = true;
        this.lastX = e.x;
        this.lastY = e.y;
    }
};

CharacterController.prototype.onMouseUp = function(e) {
    if (e.button === pc.MOUSEBUTTON_LEFT) {
        this.isDragging = false;
        this.lastX = null;
        this.lastY = null;
    }
};

CharacterController.prototype.onMouseMove = function(e) {
    this.mouseX = e.x;
    this.mouseY = e.y;

    if (!this.camera) return;

    if (this.controlMode === 'drag') {
        if (this.isDragging && this.lastX !== null && this.lastY !== null) {
            var dx = e.x - this.lastX;
            var dy = e.y - this.lastY;
            this.pitch -= dy * this.lookSens;
            this.yaw -= dx * this.lookSens;
            this.pitch = pc.math.clamp(this.pitch, -90, 90);
            this.camera.setLocalEulerAngles(this.pitch, this.yaw, 0);
        }
        if (this.isDragging) {
            this.lastX = e.x;
            this.lastY = e.y;
        }
    }
};

CharacterController.prototype.update = function(dt) {
    if (!this.entity.rigidbody || !this.camera) return;

    // Virtual Joystick logic
    if (this.controlMode === 'joystick') {
        // Prevent rotation if mouse hasn't moved yet (starts at 0,0)
        if (this.mouseX !== 0 || this.mouseY !== 0) {
            var w = window.innerWidth;
            var h = window.innerHeight;
            // Normalize coordinates to -1 to 1 relative to center
            var nx = (this.mouseX / w) * 2 - 1;
            var ny = (this.mouseY / h) * 2 - 1;
            
            // Add deadzone in center
            var deadzone = 0.15;
            if (Math.abs(nx) > deadzone) {
                this.yaw -= Math.sign(nx) * (Math.abs(nx) - deadzone) * this.lookSens * 8; // Reduced speed
            }
            if (Math.abs(ny) > deadzone) {
                this.pitch -= Math.sign(ny) * (Math.abs(ny) - deadzone) * this.lookSens * 8;
            }
            this.pitch = pc.math.clamp(this.pitch, -90, 90);
            this.camera.setLocalEulerAngles(this.pitch, this.yaw, 0);
        }
    }

    // Flatten forward/right to horizontal plane for ground walking
    var camFwd = this.camera.forward;
    var camRight = this.camera.right;
    var flatForward = new pc.Vec3(camFwd.x, 0, camFwd.z);
    var flatRight = new pc.Vec3(camRight.x, 0, camRight.z);
    if (flatForward.lengthSq() > 0.001) flatForward.normalize();
    if (flatRight.lengthSq() > 0.001) flatRight.normalize();

    var moveDir = new pc.Vec3();
    if (this.app.keyboard.isPressed(pc.KEY_W) || this.app.keyboard.isPressed(pc.KEY_UP)) moveDir.add(flatForward);
    if (this.app.keyboard.isPressed(pc.KEY_S) || this.app.keyboard.isPressed(pc.KEY_DOWN)) moveDir.sub(flatForward);
    if (this.app.keyboard.isPressed(pc.KEY_D) || this.app.keyboard.isPressed(pc.KEY_RIGHT)) moveDir.add(flatRight);
    if (this.app.keyboard.isPressed(pc.KEY_A) || this.app.keyboard.isPressed(pc.KEY_LEFT)) moveDir.sub(flatRight);

    // Verhindert das Einfrieren der Physik
    this.entity.rigidbody.activate(); 

    var moveSpeed = this.app.keyboard.isPressed(pc.KEY_SHIFT) ? this.speed * 2.0 : this.speed;
    if (moveDir.lengthSq() > 0) {
        moveDir.normalize().scale(moveSpeed);
    }

    // Preserve Y velocity (gravity) while controlling XZ from input
    var currentVel = this.entity.rigidbody.linearVelocity;
    var targetVel = new pc.Vec3();
    targetVel.x = pc.math.lerp(currentVel.x, moveDir.x, dt * 10);
    targetVel.z = pc.math.lerp(currentVel.z, moveDir.z, dt * 10);
    targetVel.y = currentVel.y; // Let gravity handle Y

    // Jumping removed per user request

    this.entity.rigidbody.linearVelocity = targetVel;
};