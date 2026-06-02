var UniversalFlyCam = pc.createScript('universalFlyCam');

UniversalFlyCam.attributes.add('speed', { type: 'number', default: 10, title: 'Speed' });
UniversalFlyCam.attributes.add('fastSpeed', { type: 'number', default: 20, title: 'Fast Speed' });
UniversalFlyCam.attributes.add('sensitivity', { type: 'number', default: 0.2, title: 'Look Sensitivity' });

UniversalFlyCam.prototype.initialize = function() {
    this.pitch = 0;
    this.yaw = 0;
    this.lastTouchPoint = new pc.Vec2();
    this.isTouching = false;
    this._isRightDragging = false;
    this._lastMouseX = 0;
    this._lastMouseY = 0;

    var self = this;

    // Desktop: Right-click-drag to look (NO pointer lock)
    this._onMouseDown = function(e) {
        if (e.button === 2) {
            self._isRightDragging = true;
            self._lastMouseX = e.clientX;
            self._lastMouseY = e.clientY;
        }
    };
    this._onMouseUp = function(e) {
        if (e.button === 2) self._isRightDragging = false;
    };
    this._onMouseMoveDoc = function(e) {
        if (!self._isRightDragging || !self.enabled) return;
        var dx = e.clientX - self._lastMouseX;
        var dy = e.clientY - self._lastMouseY;
        self._lastMouseX = e.clientX;
        self._lastMouseY = e.clientY;
        self.rotateCamera(dx, dy);
    };
    this._onContextMenu = function(e) { e.preventDefault(); };

    var canvas = this.app.graphicsDevice.canvas;
    canvas.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mouseup', this._onMouseUp);
    document.addEventListener('mousemove', this._onMouseMoveDoc);
    canvas.addEventListener('contextmenu', this._onContextMenu);

    // Mobile: Touch Events
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
    }
};

UniversalFlyCam.prototype.update = function(dt) {
    var app = this.app;
    var speed = this.speed;

    // --- DESKTOP CONTROLS ---
    if (app.keyboard.isPressed(pc.KEY_SHIFT)) {
        speed = this.fastSpeed;
    }

    if (app.keyboard.isPressed(pc.KEY_W)) this.entity.translateLocal(0, 0, -speed * dt);
    if (app.keyboard.isPressed(pc.KEY_S)) this.entity.translateLocal(0, 0, speed * dt);
    if (app.keyboard.isPressed(pc.KEY_A)) this.entity.translateLocal(-speed * dt, 0, 0);
    if (app.keyboard.isPressed(pc.KEY_D)) this.entity.translateLocal(speed * dt, 0, 0);
    if (app.keyboard.isPressed(pc.KEY_E)) this.entity.translateLocal(0, speed * dt, 0); // Up
    if (app.keyboard.isPressed(pc.KEY_Q)) this.entity.translateLocal(0, -speed * dt, 0); // Down

    // --- MOBILE CONTROLS ---
    // If holding with 2 fingers, move forward
    if (this.app.touch && this.app.touch.touches.length === 2) {
        this.entity.translateLocal(0, 0, -speed * dt);
    }
    // If holding with 3 fingers, move backward
    if (this.app.touch && this.app.touch.touches.length === 3) {
        this.entity.translateLocal(0, 0, speed * dt);
    }
};

// onMouseMove is no longer used (replaced by _onMouseMoveDoc in initialize)

UniversalFlyCam.prototype.onTouchStart = function(event) {
    var touch = event.touches[0];
    this.lastTouchPoint.set(touch.x, touch.y);
};

UniversalFlyCam.prototype.onTouchMove = function(event) {
    // Only look around if using 1 finger
    if (event.touches.length === 1) {
        var touch = event.touches[0];
        var dx = touch.x - this.lastTouchPoint.x;
        var dy = touch.y - this.lastTouchPoint.y;
        
        this.rotateCamera(dx, dy);
        
        this.lastTouchPoint.set(touch.x, touch.y);
    }
};

UniversalFlyCam.prototype.rotateCamera = function(dx, dy) {
    this.yaw -= dx * this.sensitivity;
    this.pitch -= dy * this.sensitivity;
    this.pitch = pc.math.clamp(this.pitch, -90, 90);
    this.entity.setLocalEulerAngles(this.pitch, this.yaw, 0);
};