var CharacterController = pc.createScript('character-controller');

CharacterController.attributes.add('camera', { type: 'entity', title: 'Camera (Auto-Find)' });
CharacterController.attributes.add('speed', { type: 'number', default: 0.4 });
CharacterController.attributes.add('lookSens', { type: 'number', default: 0.15 });
CharacterController.attributes.add('cameraHeight', { type: 'number', default: 1.6 });

CharacterController.prototype.initialize = function() {
    // AUTO-FIND camera
    if (!this.camera) this.camera = this.app.root.findByName('Camera');

    // AUTO-FIX physics
    if (this.entity.rigidbody) {
        this.entity.rigidbody.type = pc.BODYTYPE_DYNAMIC;
        if (this.entity.rigidbody.mass === 0) this.entity.rigidbody.mass = 1;
        this.entity.rigidbody.angularFactor = pc.Vec3.ZERO;
        this.entity.rigidbody.restitution = 0;
        this.entity.rigidbody.friction = 0.5;
    }
    if (this.entity.collision) {
        this.entity.collision.enabled = true;
    }

    this.pitch = 0;
    this.yaw = 0;
    this._mouseActive = false;
    this.isDragging = false;
    this.lastX = null;
    this.lastY = null;
    this.controlMode = 'fps'; // Default: right-click-drag FPS
    this._debugGravityOff = false;
    this._debugHud = null;

    // --- RIGHT-CLICK DRAG: Best practice for 3D viewer ---
    // Uses raw DOM events on the canvas to avoid browser interference.
    this._canvas = this.app.graphicsDevice.canvas;
    this._isLooking = false; // True while right button is held

    this._onContextMenu = function(e) { e.preventDefault(); }; // Block right-click menu
    this._canvas.addEventListener('contextmenu', this._onContextMenu);

    var self = this;

    this._onCanvasMouseDown = function(e) {
        if (!self.enabled) return;
        // Right click (button 2) → start looking
        if (e.button === 2 && self.controlMode === 'fps') {
            self._isLooking = true;
            self.lastX = e.clientX;
            self.lastY = e.clientY;
            self._canvas.style.cursor = 'crosshair';
            e.preventDefault();
        }
        // Left click (button 0) + drag mode
        if (e.button === 0 && self.controlMode === 'drag') {
            self.isDragging = true;
            self.lastX = e.clientX;
            self.lastY = e.clientY;
        }
    };
    this._onDocMouseMove = function(e) {
        if (!self.enabled || !self.camera) return;
        if ((self.controlMode === 'fps' && self._isLooking) ||
            (self.controlMode === 'drag' && self.isDragging)) {
            if (self.lastX === null) { self.lastX = e.clientX; self.lastY = e.clientY; return; }
            var dx = e.clientX - self.lastX;
            var dy = e.clientY - self.lastY;
            self.lastX = e.clientX;
            self.lastY = e.clientY;
            self.yaw -= dx * self.lookSens;
            self.pitch -= dy * self.lookSens;
            self.pitch = pc.math.clamp(self.pitch, -89, 89);
            self.camera.setLocalEulerAngles(self.pitch, self.yaw, 0);
        }
    };
    this._onDocMouseUp = function(e) {
        if (e.button === 2) {
            self._isLooking = false;
            self.lastX = null;
            self.lastY = null;
            self._canvas.style.cursor = '';
        }
        if (e.button === 0) {
            self.isDragging = false;
            self.lastX = null;
            self.lastY = null;
        }
    };

    this._canvas.addEventListener('mousedown', this._onCanvasMouseDown);
    document.addEventListener('mousemove', this._onDocMouseMove);
    document.addEventListener('mouseup', this._onDocMouseUp);

    // Mode switch from UI
    this.app.on('controls:setMode', function(mode) {
        this.controlMode = mode;
        this._isLooking = false;
        this.isDragging = false;
        this.lastX = null;
        this.lastY = null;
        console.log('[CharCtrl] Mode switched to:', mode);
    }, this);

    this.on('destroy', function() {
        this._canvas.removeEventListener('contextmenu', this._onContextMenu);
        this._canvas.removeEventListener('mousedown', this._onCanvasMouseDown);
        document.removeEventListener('mousemove', this._onDocMouseMove);
        document.removeEventListener('mouseup', this._onDocMouseUp);
        this._removeDebugHud();
    }, this);

    // Create debug HUD
    this._createDebugHud();

    console.log('[CharCtrl] Initialized - mode:', this.controlMode, 'speed:', this.speed, 'height:', this.cameraHeight);
};

// --- CAMERA HEIGHT ---
// Called after resetCamera to ensure the camera is always at eye level.
// The level-manager resets camera localPos to (0,0,0) during teleport,
// so we must re-apply height every frame.
CharacterController.prototype._applyCameraHeight = function() {
    if (this.camera) {
        var localPos = this.camera.getLocalPosition();
        if (Math.abs(localPos.y - this.cameraHeight) > 0.01) {
            this.camera.setLocalPosition(localPos.x, this.cameraHeight, localPos.z);
        }
    }
};

// --- START ROTATION ---
CharacterController.prototype.setStartRotation = function(rot) {
    if (this.camera) {
        this.camera.setLocalEulerAngles(rot.x, rot.y, rot.z);
        var fwd = this.camera.forward;
        this.yaw = Math.atan2(-fwd.x, -fwd.z) * pc.math.RAD_TO_DEG;
        this.pitch = Math.asin(fwd.y) * pc.math.RAD_TO_DEG;
    }
};

// --- DEBUG HUD ---

CharacterController.prototype._createDebugHud = function() {
    this._debugHud = document.createElement('div');
    this._debugHud.id = 'debug-hud';
    Object.assign(this._debugHud.style, {
        position: 'fixed',
        bottom: '60px',
        left: '10px',
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: '#00ff88',
        fontFamily: 'monospace',
        fontSize: '11px',
        padding: '8px 12px',
        borderRadius: '6px',
        zIndex: '10000',
        pointerEvents: 'none',
        display: 'none',
        lineHeight: '1.6',
        border: '1px solid rgba(0,255,136,0.3)'
    });
    document.body.appendChild(this._debugHud);
};

CharacterController.prototype._removeDebugHud = function() {
    if (this._debugHud && this._debugHud.parentNode) {
        this._debugHud.parentNode.removeChild(this._debugHud);
    }
};

CharacterController.prototype._updateDebugHud = function() {
    if (!this._debugHud) return;
    var pos = this.entity.getPosition();
    var camAngles = this.camera ? this.camera.getLocalEulerAngles() : { x: 0, y: 0, z: 0 };
    this._debugHud.innerHTML = 
        '<b style="color:#ff0">🛠 DEBUG MODE</b><br>' +
        'Pos: [' + pos.x.toFixed(2) + ', ' + pos.y.toFixed(2) + ', ' + pos.z.toFixed(2) + ']<br>' +
        'Rot: [' + camAngles.x.toFixed(0) + ', ' + camAngles.y.toFixed(0) + ', ' + camAngles.z.toFixed(0) + ']<br>' +
        'Gravity: ' + (this._debugGravityOff ? '<span style="color:#f00">OFF (G held)</span>' : '<span style="color:#0f0">ON</span>') + '<br>' +
        'Mode: ' + this.controlMode + ' | Speed: ' + this.speed.toFixed(2) + '<br>' +
        '<span style="color:#888">P=copy pos | G=no gravity | C=collider</span>';
};

// --- UPDATE LOOP ---

CharacterController.prototype.update = function(dt) {
    if (!this.entity.rigidbody || !this.camera) return;

    // Always enforce camera height (level-manager resets it to 0,0,0 on teleport)
    this._applyCameraHeight();

    // --- DEBUG: Hold G to disable gravity ---
    var gPressed = this.app.keyboard.isPressed(pc.KEY_G);
    if (gPressed && !this._debugGravityOff) {
        this._debugGravityOff = true;
        this.app.systems.rigidbody.gravity.set(0, 0, 0);
        this.entity.rigidbody.linearVelocity = new pc.Vec3(
            this.entity.rigidbody.linearVelocity.x,
            0,
            this.entity.rigidbody.linearVelocity.z
        );
    } else if (!gPressed && this._debugGravityOff) {
        this._debugGravityOff = false;
        this.app.systems.rigidbody.gravity.set(0, -9.81, 0);
    }

    // --- DEBUG: Show/hide HUD when debug mode is active ---
    var levelMgrDebug = false;
    var lm = this.app.root.findByName('LevelManager');
    if (lm && lm.script && lm.script.levelManager) {
        levelMgrDebug = lm.script.levelManager._debugMode;
    }
    if (this._debugHud) {
        this._debugHud.style.display = (levelMgrDebug || this._debugGravityOff) ? 'block' : 'none';
        if (levelMgrDebug || this._debugGravityOff) {
            this._updateDebugHud();
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

    // Vertical movement when gravity is off (debug fly)
    if (this._debugGravityOff) {
        if (this.app.keyboard.isPressed(pc.KEY_E)) moveDir.y += 1;
        if (this.app.keyboard.isPressed(pc.KEY_Q)) moveDir.y -= 1;
    }

    // Prevent physics sleep
    this.entity.rigidbody.activate(); 

    var moveSpeed = this.app.keyboard.isPressed(pc.KEY_SHIFT) && this.fastSpeed ? this.fastSpeed : this.app.keyboard.isPressed(pc.KEY_SHIFT) ? this.speed * 2.5 : this.speed;
    
    if (moveDir.lengthSq() > 0) {
        moveDir.normalize().scale(moveSpeed);
    }

    // DIRECT velocity application (no lerp) - prevents barrier jumping
    var currentVel = this.entity.rigidbody.linearVelocity;
    var targetVel = new pc.Vec3();
    targetVel.x = moveDir.x;
    targetVel.z = moveDir.z;

    if (this._debugGravityOff) {
        targetVel.y = moveDir.y;
    } else {
        targetVel.y = currentVel.y; // Let gravity handle Y
    }

    // Clamp maximum horizontal velocity to prevent flying through walls
    var maxHorizontalSpeed = moveSpeed * 1.2;
    var hSpeed = Math.sqrt(targetVel.x * targetVel.x + targetVel.z * targetVel.z);
    if (hSpeed > maxHorizontalSpeed && hSpeed > 0) {
        var scale = maxHorizontalSpeed / hSpeed;
        targetVel.x *= scale;
        targetVel.z *= scale;
    }

    this.entity.rigidbody.linearVelocity = targetVel;
};