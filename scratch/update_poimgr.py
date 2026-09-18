with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\275960569\1\poi-manager.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''    // Re-enable orbit camera controls if present
    if (cam.script && cam.script.cameraControls) {
        var controls = cam.script.cameraControls;
        controls.enabled = true;
        if (controls._pose && controls._controller) {
            var target = this._currentOrbitCenter || new pc.Vec3().copy(worldPos).add(new pc.Vec3().copy(fwd).mulScalar(5.0));
            controls._controller.attach(controls._pose.look(worldPos, target), false);
        }
    }'''

replacement = '''    // Re-enable orbit camera controls if present
    if (cam.script && cam.script.cameraControls) {
        var controls = cam.script.cameraControls;
        controls.enabled = true;
        if (controls._pose && controls._controller) {
            // FIX: Prevent camera from snapping to old target or previous frame inputs.
            var target = this._currentOrbitCenter || new pc.Vec3().copy(worldPos).add(new pc.Vec3().copy(fwd).mulScalar(5.0));
            
            // Force the camera controller's target and pose immediately without smoothing
            var newPose = controls._pose.look(worldPos, target);
            controls._controller.attach(newPose, false);
            if (controls._controller.camera) {
                controls._controller.camera.setPosition(worldPos);
                controls._controller.camera.lookAt(target);
            }
            // Clear any pending mouse inputs
            if(controls._controller._mouse) {
                controls._controller._mouse.x = 0;
                controls._controller._mouse.y = 0;
            }
        }
    }'''

if target in c:
    c = c.replace(target, replacement)
else:
    print('Target not found')

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\275960569\1\poi-manager.js', 'w', encoding='utf-8') as f:
    f.write(c)
print('Updated poi-manager.js')
