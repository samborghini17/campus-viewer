var AutoTour = pc.createScript('auto-tour');

AutoTour.attributes.add('cameraRig', { type: 'entity', title: 'Camera Rig' });
AutoTour.attributes.add('speed', { type: 'number', default: 1.0, title: 'Tour Speed Multiplier' });

AutoTour.prototype.initialize = function() {
    this._isPlaying = false;
    this._time = 0;
    this._duration = 0;
    this._points = [];
    
    this._posCurve = new pc.CurveSet();
    this._rotCurve = new pc.CurveSet();
    
    this.app.on('tour:play', this.play, this);
    this.app.on('tour:stop', this.stop, this);
};

AutoTour.prototype.play = function(pointsData) {
    if (!this.cameraRig || !pointsData || pointsData.length < 2) return;
    
    this._points = pointsData;
    this._posCurve.clear();
    this._rotCurve.clear();
    
    // Build the curve (Assuming pointsData is array of { pos: [x,y,z], rot: [x,y,z], duration: seconds })
    var currentTime = 0;
    for (var i = 0; i < this._points.length; i++) {
        var p = this._points[i];
        
        // Add keys to X, Y, Z curves
        this._posCurve.curves[0].add(currentTime, p.pos[0]);
        this._posCurve.curves[1].add(currentTime, p.pos[1]);
        this._posCurve.curves[2].add(currentTime, p.pos[2]);
        
        // Add keys to Euler Rotations (Note: naive interpolation might flip at boundaries, quaternions are better but let's stick to simple Euler for now)
        this._rotCurve.curves[0].add(currentTime, p.rot[0]);
        this._rotCurve.curves[1].add(currentTime, p.rot[1]);
        this._rotCurve.curves[2].add(currentTime, p.rot[2]);
        
        currentTime += (p.duration || 5.0) / this.speed;
    }
    
    this._posCurve.type = pc.CURVE_SPLINE; // Catmull-Rom
    this._rotCurve.type = pc.CURVE_SPLINE;
    
    this._duration = currentTime;
    this._time = 0;
    this._isPlaying = true;
    
    // Disable character controller during tour
    var cc = this.cameraRig.script['character-controller'];
    if (cc) cc.enabled = false;
    
    console.log("[AutoTour] Started cinematic tour, duration: " + this._duration + "s");
};

AutoTour.prototype.stop = function() {
    this._isPlaying = false;
    // Re-enable character controller
    if (this.cameraRig) {
        var cc = this.cameraRig.script['character-controller'];
        if (cc) cc.enabled = true;
    }
    console.log("[AutoTour] Stopped cinematic tour.");
};

AutoTour.prototype.update = function(dt) {
    if (!this._isPlaying) return;
    
    this._time += dt;
    if (this._time > this._duration) {
        this.stop(); // End of tour
        return;
    }
    
    // Evaluate curves
    var px = this._posCurve.curves[0].value(this._time);
    var py = this._posCurve.curves[1].value(this._time);
    var pz = this._posCurve.curves[2].value(this._time);
    
    var rx = this._rotCurve.curves[0].value(this._time);
    var ry = this._rotCurve.curves[1].value(this._time);
    var rz = this._rotCurve.curves[2].value(this._time);
    
    this.cameraRig.setLocalPosition(px, py, pz);
    
    // Also update the character controller's pitch and yaw so it doesn't snap back on stop
    var cc = this.cameraRig.script['character-controller'];
    if (cc) {
        cc.pitch = rx;
        cc.yaw = ry;
        cc.camera.setLocalEulerAngles(rx, ry, rz);
    } else {
        // Fallback if cameraRig is the camera itself
        this.cameraRig.setLocalEulerAngles(rx, ry, rz);
    }
};
