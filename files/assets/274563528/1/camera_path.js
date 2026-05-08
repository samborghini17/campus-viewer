var CameraPath = pc.createScript('cameraPath');

CameraPath.attributes.add('pathPoints', { 
    type: 'number', array: true, title: 'Pfad (X, Y, Z)', description: 'Punkte, die die Kamera abfliegt' 
});
CameraPath.attributes.add('duration', { type: 'number', default: 5, title: 'Dauer (s)' });
CameraPath.attributes.add('lookSpeed', { type: 'number', default: 2.0, title: 'Blick-Geschwindigkeit' });
CameraPath.attributes.add('heightOffset', { type: 'number', default: 1.7, title: 'Augenhöhe' });

CameraPath.prototype.initialize = function() {
    // Wir starten nur, wenn es Punkte gibt
    if (!this.pathPoints || this.pathPoints.length < 6) return;

    this.points = [];
    for (var i = 0; i < this.pathPoints.length; i += 3) {
        this.points.push(new pc.Vec3(this.pathPoints[i], this.pathPoints[i+1] + this.heightOffset, this.pathPoints[i+2]));
    }

    this.cameraEntity = this.app.root.findByName('Camera');
    this.timer = 0;
    this.isWalking = false;

    // Wir hören auf das Reveal Event. Sobald der Level sichtbar wird, laufen wir los!
    this.app.on('scene:reveal', this.startWalk, this);
    
    this.on('destroy', () => {
         this.app.off('scene:reveal', this.startWalk, this);
    });
};

CameraPath.prototype.startWalk = function() {
    if (!this.cameraEntity || !this.entity.enabled) return;

    this.isWalking = true;
    this.timer = 0;

    // Steuerungen deaktivieren (damit User nicht dazwischen funkt)
    this.disableControls(true);

    // Kamera zum Startpunkt teleportieren (sanft)
    this.cameraEntity.setPosition(this.points[0]);
};

CameraPath.prototype.update = function(dt) {
    if (!this.isWalking) return;

    this.timer += dt;
    var progress = this.timer / this.duration;

    if (progress >= 1) {
        this.finishWalk();
        return;
    }

    // 1. Position berechnen (Interpolation zwischen Punkten)
    // Wir verteilen den Fortschritt gleichmäßig auf die Segmente
    var totalSegments = this.points.length - 1;
    var currentSegmentFloat = progress * totalSegments;
    var currentSegmentIndex = Math.floor(currentSegmentFloat);
    var segmentProgress = currentSegmentFloat - currentSegmentIndex;

    var pA = this.points[currentSegmentIndex];
    var pB = this.points[Math.min(currentSegmentIndex + 1, totalSegments)];

    // Lerp Position
    var newPos = new pc.Vec3().lerp(pA, pB, segmentProgress);
    this.cameraEntity.setPosition(newPos);

    // 2. Rotation (Blickrichtung)
    // Kamera soll leicht voraus schauen
    var lookTargetIndex = Math.min(currentSegmentIndex + 1, totalSegments);
    var lookTarget = this.points[lookTargetIndex].clone();
    
    // Smooth LookAt: Wir drehen die Kamera sanft zum nächsten Punkt
    var currentRot = this.cameraEntity.getRotation().clone();
    this.cameraEntity.lookAt(lookTarget);
    var targetRot = this.cameraEntity.getRotation().clone();
    
    // Zurücksetzen und Slerp (Spherical Interpolation)
    this.cameraEntity.setRotation(currentRot);
    var newRot = new pc.Quat().slerp(currentRot, targetRot, dt * this.lookSpeed);
    this.cameraEntity.setRotation(newRot);
};

CameraPath.prototype.finishWalk = function() {
    this.isWalking = false;
    // Steuerungen wieder aktivieren
    this.disableControls(false);
};

CameraPath.prototype.disableControls = function(disable) {
    // Versucht gängige Kamera-Skripte zu finden und zu toggeln
    var scripts = this.cameraEntity.script;
    if (!scripts) return;

    if (scripts.orbitCamera) scripts.orbitCamera.enabled = !disable;
    if (scripts.flyCamera) scripts.flyCamera.enabled = !disable;
    if (scripts.mouseInput) scripts.mouseInput.enabled = !disable;
    if (scripts.touchInput) scripts.touchInput.enabled = !disable;
};