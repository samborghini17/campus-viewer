with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249944\1\level-manager.js', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''    if (mode === 'orbit') {
        // OUTDOOR: Orbit + fly camera, no physics
        console.log('[LevelMgr] Mode: ORBIT (outdoor)');
        canvas.style.cursor = 'grab';
        this.app.systems.rigidbody.gravity.set(0, 0, 0);
        if (controls) { 
            controls.enabled = true; 
            controls.enableOrbit = true; 
            controls.enableFly = true; 
            controls.moveSpeed = this.outdoorSpeed;
            controls.moveFastSpeed = this.outdoorFastSpeed;
            controls.maxOrbitDistance = 2000;
            controls.zoomSpeed = 0.05;
        }
        if (flyCam) flyCam.enabled = false;
        this._setCharControllerActive(playerRig, false);
        if (playerRig && playerRig.rigidbody) playerRig.rigidbody.enabled = false;
        if (playerRig && playerRig.collision) playerRig.collision.enabled = false;
    } else {
        if (flyCam) flyCam.enabled = false; 

        // INDOOR: Always use Character Controller (shooter mode)
        console.log('[LevelMgr] Mode: WALK/FLY (indoor, collider: ' + hasCollider + ')');
        canvas.style.cursor = 'default';
        if (controls) controls.enabled = false; 
        
        this._setCharControllerActive(playerRig, true);
        if (playerRig && playerRig.rigidbody) {
            playerRig.rigidbody.enabled = true;
            playerRig.rigidbody.type = pc.BODYTYPE_DYNAMIC;
        }
    }'''

replacement = '''    window.appSettings = window.appSettings || { indoorMouseOnly: false };
    var useIndoorMouse = (mode === 'walk' && window.appSettings.indoorMouseOnly);

    if (mode === 'orbit' || useIndoorMouse) {
        // ORBIT / MOUSE ONLY MODE
        console.log('[LevelMgr] Mode: ' + (useIndoorMouse ? 'ORBIT (indoor mouse-only)' : 'ORBIT (outdoor)'));
        canvas.style.cursor = 'grab';
        
        if (!useIndoorMouse) {
            this.app.systems.rigidbody.gravity.set(0, 0, 0);
        } else {
            this.app.systems.rigidbody.gravity.set(0, -9.81, 0);
        }

        if (controls) { 
            controls.enabled = true; 
            controls.enableOrbit = true; 
            controls.enableFly = true; 
            controls.moveSpeed = useIndoorMouse ? 2 : this.outdoorSpeed;
            controls.moveFastSpeed = useIndoorMouse ? 4 : this.outdoorFastSpeed;
            controls.maxOrbitDistance = useIndoorMouse ? 200 : 2000;
            controls.zoomSpeed = useIndoorMouse ? 0.02 : 0.05;
        }
        if (flyCam) flyCam.enabled = false;
        this._setCharControllerActive(playerRig, false);
        if (playerRig && playerRig.rigidbody) playerRig.rigidbody.enabled = false;
        if (playerRig && playerRig.collision) playerRig.collision.enabled = false;
    } else {
        if (flyCam) flyCam.enabled = false; 

        // INDOOR: WASD Character Controller (shooter mode)
        console.log('[LevelMgr] Mode: WALK/FLY (indoor, collider: ' + hasCollider + ')');
        canvas.style.cursor = 'default';
        if (controls) controls.enabled = false; 
        
        this._setCharControllerActive(playerRig, true);
        if (playerRig && playerRig.rigidbody) {
            playerRig.rigidbody.enabled = true;
            playerRig.rigidbody.type = pc.BODYTYPE_DYNAMIC;
        }
    }'''

if target in c:
    c = c.replace(target, replacement)
    print("LevelMgr target found!")
else:
    print("LevelMgr target NOT found!")

with open(r'C:\Users\S024_Calc1\Documents\TH OWL Campus Viewer\files\assets\274249944\1\level-manager.js', 'w', encoding='utf-8') as f:
    f.write(c)
print('Updated level-manager.js')
