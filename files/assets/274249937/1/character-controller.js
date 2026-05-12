var CharacterController = pc.createScript('character-controller');

CharacterController.attributes.add('camera', { type: 'entity', title: 'Camera (Auto-Find)' });
CharacterController.attributes.add('speed', { type: 'number', default: 0.4 });
CharacterController.attributes.add('lookSens', { type: 'number', default: 0.04 });

CharacterController.prototype.initialize = function() {
    // AUTO-FIND: Sucht die Kamera, falls das Feld im Editor leer ist
    if (!this.camera) this.camera = this.app.root.findByName('Camera');
    if (this.camera) this.camera.setLocalPosition(0, 1.6, 0); // Player height 1.6m (eye level)

    // AUTO-FIX PHYSIK: Garantiert, dass du dich bewegen kannst
    if (this.entity.rigidbody) {
        this.entity.rigidbody.type = pc.BODYTYPE_DYNAMIC;
        if (this.entity.rigidbody.mass === 0) this.entity.rigidbody.mass = 1;
        this.entity.rigidbody.angularFactor = pc.Vec3.ZERO;
        this.entity.rigidbody.restitution = 0; // Prevent bouncing on polygon edges
        this.entity.rigidbody.friction = 0.5;
    }
    if (this.entity.collision) {
        this.entity.collision.enabled = true;
    }

    this.pitch = 0;
    this.yaw = 0;
    this._mouseActive = false;
    this.lastX = null;
    this.lastY = null;
    this.isDragging = false;
    this.controlMode = 'fps'; // Default to FPS (Pointer Lock)
    this._pointerLocked = false;
    this._debugGravityOff = false;
    this._debugHud = null;

    // Bind mouse handlers
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);

    // Pointer Lock change handler
    this._onPointerLockChange = this._handlePointerLockChange.bind(this);
    document.addEventListener('pointerlockchange', this._onPointerLockChange);
    document.addEventListener('mozpointerlockchange', this._onPointerLockChange);

    // Raw mouse move for Pointer Lock (bypasses PlayCanvas mouse system)
    this._onRawMouseMove = this._handleRawMouseMove.bind(this);
    document.addEventListener('mousemove', this._onRawMouseMove);

    // Register enable/disable callbacks
    this.on('enable', this._enableMouse, this);
    this.on('disable', this._disableMouse, this);
    
    this.app.on('controls:setMode', function(mode) {
        this.controlMode = mode;
        this.lastX = null;
        this.lastY = null;
        this.isDragging = false;
        
        // Exit pointer lock when switching away from FPS
        if (mode !== 'fps' && this._pointerLocked) {
            document.exitPointerLock();
        }
        console.log('[CharCtrl] Mode switched to:', mode);
    }, this);

    this.on('destroy', function() {
        this._disableMouse();
        document.removeEventListener('pointerlockchange', this._onPointerLockChange);
        document.removeEventListener('mozpointerlockchange', this._onPointerLockChange);
        document.removeEventListener('mousemove', this._onRawMouseMove);
        this._removeDebugHud();
        this._removeFpsUI();
    }, this);

    // Create debug HUD and FPS UI
    this._createDebugHud();
    this._createFpsUI();

    // Force enable on initialize
    this._enableMouse();

    console.log('[CharCtrl] Initialized - mode:', this.controlMode, 'speed:', this.speed);
};

// --- POINTER LOCK (FPS MODE) ---

CharacterController.prototype._handlePointerLockChange = function() {
    this._pointerLocked = (
        document.pointerLockElement === this.app.graphicsDevice.canvas ||
        document.mozPointerLockElement === this.app.graphicsDevice.canvas
    );
    console.log('[CharCtrl] Pointer lock:', this._pointerLocked);
    this._updateFpsUI();
};

CharacterController.prototype._handleRawMouseMove = function(e) {
    if (!this.camera || !this.enabled) return;
    if (this.controlMode !== 'fps' || !this._pointerLocked) return;

    var dx = e.movementX || 0;
    var dy = e.movementY || 0;

    // Fix for the "spinning at the sides" bug: ignore massive delta spikes that 
    // can occur when the cursor hits the screen bounds before the browser centers it.
    if (Math.abs(dx) > 150 || Math.abs(dy) > 150) return;

    this.yaw -= dx * this.lookSens;
    this.pitch -= dy * this.lookSens;
    this.pitch = pc.math.clamp(this.pitch, -89, 89);
    this.camera.setLocalEulerAngles(this.pitch, this.yaw, 0);
};

CharacterController.prototype._requestPointerLock = function() {
    var canvas = this.app.graphicsDevice.canvas;
    if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
    } else if (canvas.mozRequestPointerLock) {
        canvas.mozRequestPointerLock();
    }
};

// --- FPS UI (CROSSHAIR & HINTS) ---

CharacterController.prototype._createFpsUI = function() {
    this._crosshair = document.createElement('div');
    this._crosshair.id = 'fps-crosshair';
    Object.assign(this._crosshair.style, {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '4px', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: '1000', display: 'none',
        boxShadow: '0 0 3px rgba(0,0,0,0.8)'
    });
    
    this._fpsHint = document.createElement('div');
    this._fpsHint.id = 'fps-hint';
    Object.assign(this._fpsHint.style, {
        position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
        color: 'white', fontFamily: 'sans-serif', fontSize: '13px', letterSpacing: '0.5px',
        backgroundColor: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: '20px',
        pointerEvents: 'none', zIndex: '1000', display: 'none', backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.1)'
    });
    
    document.body.appendChild(this._crosshair);
    document.body.appendChild(this._fpsHint);
};

CharacterController.prototype._removeFpsUI = function() {
    if (this._crosshair && this._crosshair.parentNode) this._crosshair.parentNode.removeChild(this._crosshair);
    if (this._fpsHint && this._fpsHint.parentNode) this._fpsHint.parentNode.removeChild(this._fpsHint);
};

CharacterController.prototype._updateFpsUI = function() {
    if (!this._crosshair || !this._fpsHint) return;
    if (this.controlMode === 'fps') {
        this._crosshair.style.display = 'block';
        this._fpsHint.style.display = 'block';
        if (this._pointerLocked) {
            this._fpsHint.innerHTML = 'Drücke <b>ESC</b> für Maus';
            this._crosshair.style.backgroundColor = 'rgba(0, 255, 136, 0.9)'; // Cyan/green when active
        } else {
            this._fpsHint.innerHTML = 'Klicke zum Umsehen (FPS)';
            this._crosshair.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }
    } else {
        this._crosshair.style.display = 'none';
        this._fpsHint.style.display = 'none';
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

// --- MOUSE INPUT ---

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
    // Exit pointer lock
    if (this._pointerLocked) {
        document.exitPointerLock();
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
    // Only engage controls if the click was directly on the canvas.
    // This prevents interfering with the UI (burger menu, etc.)
    if (e.event && e.event.target !== this.app.graphicsDevice.canvas) return;

    if (this.controlMode === 'fps' && e.button === pc.MOUSEBUTTON_LEFT) {
        // Request pointer lock on click for FPS mode
        if (!this._pointerLocked) {
            this._requestPointerLock();
        }
    } else if (this.controlMode === 'drag' && e.button === pc.MOUSEBUTTON_LEFT) {
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
    if (!this.camera) return;

    // Drag mode: click+drag to look (PlayCanvas mouse events)
    if (this.controlMode === 'drag') {
        if (this.isDragging && this.lastX !== null && this.lastY !== null) {
            var dx = e.x - this.lastX;
            var dy = e.y - this.lastY;
            this.pitch -= dy * this.lookSens;
            this.yaw -= dx * this.lookSens;
            this.pitch = pc.math.clamp(this.pitch, -89, 89);
            this.camera.setLocalEulerAngles(this.pitch, this.yaw, 0);
        }
        if (this.isDragging) {
            this.lastX = e.x;
            this.lastY = e.y;
        }
    }
    // FPS mode uses raw mouse events via _handleRawMouseMove (Pointer Lock)
};

CharacterController.prototype.update = function(dt) {
    if (!this.entity.rigidbody || !this.camera) return;

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

    // --- DEBUG: Show/hide HUD when debug mode is active in level manager ---
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

    // DIRECT velocity application (no lerp!) - prevents barrier jumping
    var currentVel = this.entity.rigidbody.linearVelocity;
    var targetVel = new pc.Vec3();
    targetVel.x = moveDir.x;
    targetVel.z = moveDir.z;

    if (this._debugGravityOff) {
        targetVel.y = moveDir.y; // Direct vertical control when flying
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