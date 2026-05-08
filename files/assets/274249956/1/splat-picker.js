var SplatPicker = pc.createScript('splatPicker');

SplatPicker.prototype.initialize = function() {
    // We listen for the Mousedown event
    if (this.app.mouse) {
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    }

    console.log("%c Splat Picker Active: Click anywhere to see coordinates in Console!", "color: orange; font-weight: bold;");
};

SplatPicker.prototype.onMouseDown = function(event) {
    // Only trigger on Left Click (Button 0)
    if (event.button === 0) {
        this.pickCoordinate(event.x, event.y);
    }
};

SplatPicker.prototype.pickCoordinate = function(screenX, screenY) {
    const camera = this.entity.camera;
    if (!camera) return;

    // 1. Create a ray from the camera through the mouse position
    const from = new pc.Vec3();
    const to = new pc.Vec3();
    camera.screenToWorld(screenX, screenY, 0, from);
    camera.screenToWorld(screenX, screenY, 1, to);
    const dir = to.sub(from);

    // 2. Intersect with the Ground Plane (Y = 0)
    // Most splats are aligned so the floor is roughly at Y=0
    const t = -from.y / dir.y;
    
    if (t > 0) {
        const hitPoint = new pc.Vec3().copy(dir).scale(t).add(from);
        
        // 3. Format the result for your LevelManager
        const result = `[${hitPoint.x.toFixed(2)}, 1.5, ${hitPoint.z.toFixed(2)}]`;
        
        console.log("%c Clicked Position:", "color: #00ff00;", result);
        
        // Optional: Auto-copy to clipboard so you can just paste into VS Code
        if (navigator.clipboard) {
            navigator.clipboard.writeText(result);
        }
    } else {
        console.log("You clicked the sky! Look down at the splat.");
    }
};