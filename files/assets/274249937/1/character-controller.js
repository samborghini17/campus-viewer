var CharacterController = pc.createScript('character-controller');

CharacterController.attributes.add('camera', { type: 'entity', title: 'Camera (Auto-Find)' });
CharacterController.attributes.add('speed', { type: 'number', default: 0.4 });
CharacterController.attributes.add('lookSens', { type: 'number', default: 0.15 });
CharacterController.attributes.add('cameraHeight', { type: 'number', default: 1.2 });
CharacterController.attributes.add('gravityEnabled', { type: 'boolean', default: true });

CharacterController.prototype.initialize = function() {
    if (!this.camera) this.camera = this.app.root.findByName('Camera');

    if (this.entity.rigidbody) {
        this.entity.rigidbody.type = pc.BODYTYPE_DYNAMIC;
        if (this.entity.rigidbody.mass === 0) this.entity.rigidbody.mass = 1;
        this.entity.rigidbody.angularFactor = pc.Vec3.ZERO;
        this.entity.rigidbody.restitution = 0;
        this.entity.rigidbody.friction = 0.5;
    }
    if (this.entity.collision) this.entity.collision.enabled = true;

    // --- LOOK STATE ---
    this.pitch = 0;
    this.yaw = 0;
    this._gravityOff = !this.gravityEnabled; 
    this._debugHud = null;
    this._speedMultiplier = 1.0;
    this._canvas = this.app.graphicsDevice.canvas;

    var self = this;

    // --- NATIVE KEYBOARD (Bypassing PlayCanvas for reliability) ---
    this._keys = {};
    this._nativeKeyDown = function(e) {
        self._keys[e.code] = true;
        // G = toggle gravity
        if (e.code === 'KeyG' && self.enabled) {
            self._gravityOff = !self._gravityOff;
            if (self._gravityOff) {
                self.app.systems.rigidbody.gravity.set(0, 0, 0);
                if (self.entity.rigidbody) {
                    self.entity.rigidbody.linearVelocity = new pc.Vec3(
                        self.entity.rigidbody.linearVelocity.x, 0,
                        self.entity.rigidbody.linearVelocity.z
                    );
                }
            } else {
                self.app.systems.rigidbody.gravity.set(0, -9.81, 0);
            }
        }
    };
    this._nativeKeyUp = function(e) {
        self._keys[e.code] = false;
    };
    window.addEventListener('keydown', this._nativeKeyDown);
    window.addEventListener('keyup', this._nativeKeyUp);

    // --- SHOOTER CONTROLS (Pointer Lock) ---
    this._isPointerLocked = false;
    this._onPointerLockChange = function() {
        self._isPointerLocked = (document.pointerLockElement === self._canvas);
    };
    document.addEventListener('pointerlockchange', this._onPointerLockChange);

    this._onMouseDown = function(e) {
        if (!self.enabled) return;
        // Only lock if left-clicking exactly on the canvas (not on UI)
        if (e.target === self._canvas && e.button === 0) {
            if (!self._isPointerLocked) {
                self._canvas.requestPointerLock();
            }
        }
    };
    this._canvas.addEventListener('mousedown', this._onMouseDown);

    this._onMouseMove = function(e) {
        if (!self.enabled || !self.camera || !self._isPointerLocked) return;
        
        var dx = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        var dy = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        self.yaw -= dx * self.lookSens;
        self.pitch -= dy * self.lookSens;
        self.pitch = pc.math.clamp(self.pitch, -89, 89);
        self.camera.setLocalEulerAngles(self.pitch, self.yaw, 0);
    };
    document.addEventListener('mousemove', this._onMouseMove);

    // Speed scroll
    this._onWheel = function(e) {
        if (!self.enabled) return;
        if (e.deltaY < 0) self._speedMultiplier = Math.min(5.0, self._speedMultiplier * 1.15);
        else self._speedMultiplier = Math.max(0.2, self._speedMultiplier / 1.15);
    };
    this._canvas.addEventListener('wheel', this._onWheel, { passive: true });

    // Mobile joystick + touch
    this._joystickX = 0;
    this._joystickY = 0;
    this._touchLookId = null;
    this._touchLookLastX = 0;
    this._touchLookLastY = 0;

    this._onTouchStart = function(e) {
        if (!self.enabled) return;
        var t = e.target;
        if (t && (t.closest('#burger-menu-container') || t.closest('#gsplat-controls') ||
            t.closest('#controls-card') || t.closest('#poi-sidebar') || t.closest('#poi-navbar') ||
            t.closest('#mobile-joystick-zone') || t.closest('#info-modal-overlay') ||
            t.closest('#collider-debug-panel') || t.closest('.aeroglass-panel'))) return;
        if (self._touchLookId === null && e.changedTouches.length > 0) {
            var touch = e.changedTouches[0];
            self._touchLookId = touch.identifier;
            self._touchLookLastX = touch.clientX;
            self._touchLookLastY = touch.clientY;
        }
    };
    this._onTouchMove = function(e) {
        if (!self.enabled || !self.camera) return;
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            if (touch.identifier === self._touchLookId) {
                var dx = pc.math.clamp(touch.clientX - self._touchLookLastX, -50, 50);
                var dy = pc.math.clamp(touch.clientY - self._touchLookLastY, -50, 50);
                self._touchLookLastX = touch.clientX;
                self._touchLookLastY = touch.clientY;
                self.yaw -= dx * self.lookSens * 0.8;
                self.pitch -= dy * self.lookSens * 0.8;
                self.pitch = pc.math.clamp(self.pitch, -89, 89);
                self.camera.setLocalEulerAngles(self.pitch, self.yaw, 0);
            }
        }
    };
    this._onTouchEnd = function(e) {
        for (var i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === self._touchLookId) self._touchLookId = null;
        }
    };
    this._canvas.addEventListener('touchstart', this._onTouchStart, { passive: true });
    this._canvas.addEventListener('touchmove', this._onTouchMove, { passive: true });
    this._canvas.addEventListener('touchend', this._onTouchEnd, { passive: true });
    this._canvas.addEventListener('touchcancel', this._onTouchEnd, { passive: true });

    this.app.on('joystick:move', function(x, y) { this._joystickX = x; this._joystickY = y; }, this);

    this.on('destroy', function() {
        window.removeEventListener('keydown', this._nativeKeyDown);
        window.removeEventListener('keyup', this._nativeKeyUp);
        document.removeEventListener('pointerlockchange', this._onPointerLockChange);
        this._canvas.removeEventListener('mousedown', this._onMouseDown);
        document.removeEventListener('mousemove', this._onMouseMove);
        this._canvas.removeEventListener('wheel', this._onWheel);
        this._canvas.removeEventListener('touchstart', this._onTouchStart);
        this._canvas.removeEventListener('touchmove', this._onTouchMove);
        this._canvas.removeEventListener('touchend', this._onTouchEnd);
        this._canvas.removeEventListener('touchcancel', this._onTouchEnd);
        this._removeDebugHud();
    }, this);

    this._createDebugHud();
};

CharacterController.prototype._isKey = function(code) {
    return !!this._keys[code];
};

CharacterController.prototype._applyCameraHeight = function() {
    if (this.camera) {
        var lp = this.camera.getLocalPosition();
        if (Math.abs(lp.y - this.cameraHeight) > 0.01)
            this.camera.setLocalPosition(lp.x, this.cameraHeight, lp.z);
    }
};

CharacterController.prototype.setStartRotation = function(rot) {
    if (!this.camera) return;
    this.camera.setLocalEulerAngles(rot.x, rot.y, rot.z);
    var fwd = this.camera.forward;
    this.pitch = Math.asin(pc.math.clamp(fwd.y, -1, 1)) * pc.math.RAD_TO_DEG;
    this.pitch = pc.math.clamp(this.pitch, -89, 89);
    this.yaw = Math.atan2(-fwd.x, -fwd.z) * pc.math.RAD_TO_DEG;
    this.camera.setLocalEulerAngles(this.pitch, this.yaw, 0);
};

// --- DEBUG HUD ---
CharacterController.prototype._createDebugHud = function() {
    this._debugHud = document.createElement('div');
    this._debugHud.id = 'debug-hud';
    Object.assign(this._debugHud.style, {
        position: 'fixed', bottom: '60px', left: '10px',
        backgroundColor: 'rgba(0,0,0,0.75)', color: '#00ff88',
        fontFamily: 'monospace', fontSize: '11px',
        padding: '8px 12px', borderRadius: '6px',
        zIndex: '10000', pointerEvents: 'none',
        display: 'none', lineHeight: '1.6',
        border: '1px solid rgba(0,255,136,0.3)'
    });
    document.body.appendChild(this._debugHud);
};
CharacterController.prototype._removeDebugHud = function() {
    if (this._debugHud && this._debugHud.parentNode) this._debugHud.parentNode.removeChild(this._debugHud);
};
CharacterController.prototype._updateDebugHud = function(dt) {
    if (!this._debugHud) return;
    var pos = this.entity.getPosition();
    var fps = (1.0 / Math.max(dt, 0.001)).toFixed(0);
    this._debugHud.innerHTML =
        '<b style="color:#ff0">🛠 DEBUG MODE</b><br>' +
        'FPS: ' + fps + '<br>' +
        'Pos: [' + pos.x.toFixed(2) + ', ' + pos.y.toFixed(2) + ', ' + pos.z.toFixed(2) + ']<br>' +
        'Pitch: ' + this.pitch.toFixed(1) + '° | Yaw: ' + this.yaw.toFixed(1) + '°<br>' +
        'Gravity: ' + (this._gravityOff ? '<span style="color:#f00">OFF</span>' : '<span style="color:#0f0">ON</span>') +
        ' | Speed: ' + (this.speed * this._speedMultiplier).toFixed(2);
};

// --- UPDATE LOOP ---
CharacterController.prototype.update = function(dt) {
    if (!this.entity.rigidbody || !this.camera) return;

    this._applyCameraHeight();
    this.camera.setLocalEulerAngles(this.pitch, this.yaw, 0);

    var flyActive = this._gravityOff || !this.gravityEnabled;
    if (flyActive) {
        this.app.systems.rigidbody.gravity.set(0, 0, 0);
    } else {
        this.app.systems.rigidbody.gravity.set(0, -9.81, 0);
    }

    var levelMgrDebug = false;
    var lm = this.app.root.findByName('LevelManager');
    if (lm && lm.script && lm.script.levelManager) levelMgrDebug = lm.script.levelManager._debugMode;
    if (this._debugHud) {
        this._debugHud.style.display = levelMgrDebug ? 'block' : 'none';
        if (levelMgrDebug) this._updateDebugHud(dt);
    }

    var camFwd = this.camera.forward;
    var camRight = this.camera.right;
    var ff = new pc.Vec3(camFwd.x, 0, camFwd.z);
    var fr = new pc.Vec3(camRight.x, 0, camRight.z);
    if (ff.lengthSq() > 0.001) ff.normalize();
    if (fr.lengthSq() > 0.001) fr.normalize();

    var moveDir = new pc.Vec3();

    if (this._isKey('KeyW') || this._isKey('ArrowUp')) moveDir.add(ff);
    if (this._isKey('KeyS') || this._isKey('ArrowDown')) moveDir.sub(ff);
    if (this._isKey('KeyD') || this._isKey('ArrowRight')) moveDir.add(fr);
    if (this._isKey('KeyA') || this._isKey('ArrowLeft')) moveDir.sub(fr);

    if (Math.abs(this._joystickX) > 0.05 || Math.abs(this._joystickY) > 0.05) {
        moveDir.add(ff.clone().mulScalar(this._joystickY));
        moveDir.add(fr.clone().mulScalar(this._joystickX));
    }

    if (flyActive) {
        if (this._isKey('KeyE') || this._isKey('Space')) moveDir.y += 1;
        if (this._isKey('KeyQ')) moveDir.y -= 1;
    }

    this.entity.rigidbody.activate();

    var sprint = this._isKey('ShiftLeft') || this._isKey('ShiftRight');
    var baseSpeed = sprint && this.fastSpeed ? this.fastSpeed : sprint ? this.speed * 2.5 : this.speed;
    var moveSpeed = baseSpeed * this._speedMultiplier;

    if (moveDir.lengthSq() > 0) moveDir.normalize().scale(moveSpeed);

    var cv = this.entity.rigidbody.linearVelocity;
    var tv = new pc.Vec3(moveDir.x, flyActive ? moveDir.y : cv.y, moveDir.z);

    var hSpeed = Math.sqrt(tv.x * tv.x + tv.z * tv.z);
    var maxH = moveSpeed * 1.2;
    if (hSpeed > maxH && hSpeed > 0) { var s = maxH / hSpeed; tv.x *= s; tv.z *= s; }

    this.entity.rigidbody.linearVelocity = tv;
};