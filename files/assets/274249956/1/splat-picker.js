var SplatPicker = pc.createScript('splatPicker');

SplatPicker.prototype.initialize = function() {
    this.lastClickTime = 0;
    this.doubleClickThreshold = 300; // ms

    if (this.app.mouse) {
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    }
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
    }

    // Create a visual marker for the orbit point
    this.marker = new pc.Entity('OrbitMarker');
    this.marker.addComponent('model', { type: 'sphere' });
    this.marker.setLocalScale(0.3, 0.3, 0.3);
    
    // Create a glowing cyan material for the marker
    var material = new pc.StandardMaterial();
    material.diffuse = new pc.Color(0, 0.9, 1);
    material.emissive = new pc.Color(0, 0.9, 1);
    material.update();
    this.marker.model.material = material;
    
    this.app.root.addChild(this.marker);
    this.marker.enabled = false;
    this.markerTimer = 0;
};

SplatPicker.prototype.onMouseDown = function(event) {
    if (event.button !== 0) return;
    this.checkDoubleClick(event.x, event.y);
};

SplatPicker.prototype.onTouchStart = function(event) {
    if (event.touches.length === 1) {
        this.checkDoubleClick(event.touches[0].x, event.touches[0].y);
    }
};

SplatPicker.prototype.checkDoubleClick = function(x, y) {
    var now = Date.now();
    if (now - this.lastClickTime < this.doubleClickThreshold) {
        this.setOrbitPoint(x, y);
        this.lastClickTime = 0; // reset
    } else {
        this.lastClickTime = now;
    }
};

SplatPicker.prototype.setOrbitPoint = function(screenX, screenY) {
    var camera = this.entity.camera;
    if (!camera) return;

    var from = new pc.Vec3();
    var to = new pc.Vec3();
    camera.screenToWorld(screenX, screenY, camera.nearClip, from);
    camera.screenToWorld(screenX, screenY, camera.farClip, to);

    // Raycast against the physics mesh
    var hit = this.app.systems.rigidbody.raycastFirst(from, to);
    
    if (hit) {
        var hitPoint = hit.point;
        
        // Show marker
        this.marker.setPosition(hitPoint);
        this.marker.enabled = true;
        this.markerTimer = 2.0; // Hide after 2 seconds
        
        // Set camera focus and mode
        if (this.entity.script && this.entity.script.cameraControls) {
            this.app.fire('controls:setMode', 'orbit');
            this.entity.script.cameraControls.focusPoint = hitPoint;
            
            // Dispatch event to update UI if necessary
            var mockFps = document.getElementById('mock-ctrl-fps');
            var mockDrag = document.getElementById('mock-ctrl-drag');
            if (mockFps && mockDrag) {
                mockDrag.click();
            }
        }
    }
};

SplatPicker.prototype.update = function(dt) {
    if (this.marker.enabled) {
        this.markerTimer -= dt;
        if (this.markerTimer <= 0) {
            this.marker.enabled = false;
        }
    }
};