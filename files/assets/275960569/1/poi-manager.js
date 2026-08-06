var PoiManager = pc.createScript('poiManager');

PoiManager.attributes.add('cameraEntity', { type: 'entity', title: 'Main Camera' });
PoiManager.attributes.add('lookDistance', { type: 'number', default: 5.0, title: 'Standard Abstand' });
PoiManager.attributes.add('autoTourDelay', { type: 'number', default: 8.0, title: 'Auto-Tour Zeit (s)' });

PoiManager.prototype.initialize = function() {
    this.pois = []; 
    this.currentIndex = -1;
    // Sidebar startet geschlossen
    this.isSidebarOpen = false; 
    this.isTourVisible = true; 
    this.isCleanMode = false;
    this.isAutoTouring = false;
    this.tourTimer = 0;
    this.activePois = [];

    this.createUI();

    this.app.on('poi:register', this.registerPOI, this);
    this.app.on('ui:toggleTour', this.toggleEntireTourSystem, this); 
    this.app.on('ui:toggleVisibility', this.onCleanModeToggle, this); 
    this.app.on('level:contentReady', this.refreshList, this);
    this.app.on('level:switch', this.onLevelSwitch, this);
    this.app.on('poi:refresh', this.refreshList, this);
};

PoiManager.prototype.onLevelSwitch = function() {
    // Stop any auto-tour when switching levels
    if (this.isAutoTouring) {
        this.isAutoTouring = false;
        this.tourTimer = 0;
        this.tourNodes = null;
        this._restoreCameraControls();
        this.updatePlayBtn();
    }
    this.currentIndex = -1;
    // Refresh list immediately with a short delay to let entities enable/disable
    var self = this;
    setTimeout(function() {
        self.refreshList();
    }, 200);
};

PoiManager.prototype.registerPOI = function(data) {
    var exists = this.pois.some(function(p) { return p.entity === data.entity; });
    if(exists) return;

    this.pois.push(data);
    // Delay refresh to allow all entities to initialize
    if (!this._refreshQueued) {
        this._refreshQueued = true;
        var self = this;
        setTimeout(function() {
            self.refreshList();
            self._refreshQueued = false;
        }, 100);
    }
};

PoiManager.prototype.refreshList = function() {
    var list = document.getElementById('poi-items');
    if (!list) return;
    list.innerHTML = '';
    
    // Prune destroyed entities
    this.pois = this.pois.filter(function(data) {
        return data.entity && !data.entity._destroyed;
    });

    function isEnabled(ent) {
        var curr = ent;
        var belongsToLevel = null;
        while(curr) {
            if(!curr.enabled) return false;
            // Check if this entity is a level entity (managed by LevelManager)
            if (curr.name && self.app.systems.script && self.app.root.findByName('LevelContainer')) {
                // If it's a child of LevelContainer, it's a level entity
                if (curr.parent && curr.parent.name === 'LevelContainer' && curr.name !== 'LevelContainer') {
                    belongsToLevel = curr.name;
                }
            }
            curr = curr.parent;
        }
        
        // If we are in a specific level (e.g., innospin), and the POI is not part of this level, hide it.
        // Exception: Lemgo is the main campus, so if we are in Lemgo, we might want to see global POIs.
        var levelManager = self.app.root.findByName('LevelManager');
        if (levelManager && levelManager.script && levelManager.script.levelManager) {
            var currentLevel = levelManager.script.levelManager.currentLevelId;
            if (currentLevel) {
                // If the POI is physically under a level entity, it MUST match the current level
                if (belongsToLevel && belongsToLevel !== currentLevel) {
                    return false;
                }
                // If the POI is GLOBAL (not under any specific level), hide it in sub-levels!
                if (!belongsToLevel && currentLevel !== 'lemgo') {
                    // Only show global POIs in lemgo, hide them in innospin/audimax etc.
                    return false;
                }
            }
        }
        return true;
    }
    
    var self = this;
    this.activePois = [];
    this.pois.forEach(function(data, index) {
        if (isEnabled(data.entity)) {
            self.activePois.push(index);
            self.addListItem(data, index);
        }
    });
    
    // Validate current index
    if (this.currentIndex !== -1 && this.activePois.indexOf(this.currentIndex) === -1) {
        this.currentIndex = -1;
    }
    
    this.updateNavButtons();
};

PoiManager.prototype.getTourNode = function(index) {
    var target = this.pois[index];
    var targetPos = target.entity.getPosition().clone();
    var camPos, camRot;

    if (target.customView) {
        camPos = target.customView.getPosition().clone();
        camRot = target.customView.getRotation().clone();
    } else if (target.customPos && (target.customPos.x !== 0 || target.customPos.y !== 0 || target.customPos.z !== 0)) {
        camPos = target.customPos.clone();
        if (target.customRot && (target.customRot.x !== 0 || target.customRot.y !== 0 || target.customRot.z !== 0)) {
            var tempEnt = new pc.Entity();
            tempEnt.setEulerAngles(target.customRot);
            camRot = tempEnt.getRotation().clone();
            tempEnt.destroy();
        } else {
            var tempEnt2 = new pc.Entity();
            tempEnt2.setPosition(camPos);
            tempEnt2.lookAt(targetPos);
            camRot = tempEnt2.getRotation().clone();
            tempEnt2.destroy();
        }
    } else {
        var offset = new pc.Vec3(0, 1.2, 1.5).normalize();
        var dist = this.lookDistance * 1.25;
        if (target.type === 'construction') { dist *= 2.2; offset.set(0.8, 1.4, 1.2).normalize(); } 
        else if (target.type === 'path') { dist *= 1.5; offset.set(0, 1.2, 1.4).normalize(); }
        offset.scale(dist);
        camPos = targetPos.clone().add(offset);
        
        var tempEnt3 = new pc.Entity();
        tempEnt3.setPosition(camPos);
        tempEnt3.lookAt(targetPos);
        camRot = tempEnt3.getRotation().clone();
        tempEnt3.destroy();
    }
    return { pos: camPos, rot: camRot, idx: index, title: target.title };
};

PoiManager.prototype.buildTourCurve = function() {
    this.tourNodes = [];
    if (this.activePois.length === 0) return;
    for (var i = 0; i < this.activePois.length; i++) {
        this.tourNodes.push(this.getTourNode(this.activePois[i]));
    }
};

PoiManager.prototype.getCatmullRom = function(p0, p1, p2, p3, t) {
    var t2 = t * t;
    var t3 = t2 * t;
    return new pc.Vec3(
        0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
        0.5 * ((2 * p1.z) + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3)
    );
};

PoiManager.prototype._disableCameraControls = function() {
    if (!this.cameraEntity) return;
    var controls = this.cameraEntity.script ? this.cameraEntity.script.cameraControls : null;
    if (controls) {
        this._savedControlsEnabled = controls.enabled;
        controls.enabled = false;
    }
};

PoiManager.prototype._restoreCameraControls = function() {
    if (!this.cameraEntity) return;
    var controls = this.cameraEntity.script ? this.cameraEntity.script.cameraControls : null;
    if (controls) {
        controls.enabled = true;
        if (controls._pose && controls._controller) {
            var pos = this.cameraEntity.getPosition();
            var forward = this.cameraEntity.forward;
            var target = this._currentOrbitCenter || new pc.Vec3().copy(pos).add(new pc.Vec3().copy(forward).mulScalar(5.0));
            controls._controller.attach(controls._pose.look(pos, target), false);
        }
    }
    
    // Sync Character Controller so controls are not buggy when moving manually after tour/jump
    var playerRig = this.app.root.findByName('Character_Controller');
    if (playerRig) {
        playerRig.setPosition(this.cameraEntity.getPosition());
        var euler = this.cameraEntity.getLocalEulerAngles();
        playerRig.setLocalEulerAngles(0, euler.y, 0);
    }
};

PoiManager.prototype.getOrbitalTransform = function(index, angleDeg) {
    if (index < 0 || index >= this.pois.length) return null;
    var target = this.pois[index];
    if (!target || !target.entity) return null;
    var targetPos = target.entity.getPosition().clone();
    
    var r = this.lookDistance * 1.25;
    var h = 1.6;
    if (target.type === 'construction') { r *= 2.2; h = 2.4; }
    else if (target.type === 'path') { r *= 1.5; h = 1.8; }

    var angleRad = (angleDeg || 0) * Math.PI / 180.0;
    var camPos = new pc.Vec3(
        targetPos.x + r * Math.cos(angleRad),
        targetPos.y + h,
        targetPos.z + r * Math.sin(angleRad)
    );

    var camRot = this._calcLookAtRot(camPos, targetPos);
    return { pos: camPos, rot: camRot, targetPos: targetPos, radius: r, height: h };
};

PoiManager.prototype.update = function(dt) {
    var orbitSpeed = 12.0; // 12 deg/sec -> 30s full 360 circle

    // 1. ACTIVE FLIGHT PHASE (Interpolating between fixed start and fixed arrival anchor)
    if (this._flight && this._flight.active) {
        this._flight.elapsed += dt;
        var p = Math.min(1.0, this._flight.elapsed / Math.max(0.001, this._flight.duration));
        
        // Smooth sinusoidal S-curve ease-in-out
        var u = 0.5 - 0.5 * Math.cos(Math.PI * p);
        
        // Parabolic vertical lift during flight for cinematic drone feel
        var arcLift = 4.0 * u * (1.0 - u) * (this._flight.arcHeight || 1.5);
        
        var curPos = new pc.Vec3().lerp(this._flight.startPos, this._flight.endPos, u);
        curPos.y += arcLift;
        
        var curRot = new pc.Quat().slerp(this._flight.startRot, this._flight.endRot, u);
        
        if (this.cameraEntity) {
            this.cameraEntity.setPosition(curPos);
            this.cameraEntity.setRotation(curRot);
        }

        var playerRig = this.app.root.findByName('Character_Controller');
        if (playerRig) {
            playerRig.setPosition(curPos);
            var euler = this.cameraEntity.getLocalEulerAngles();
            playerRig.setLocalEulerAngles(0, euler.y, 0);
        }

        if (p >= 1.0) {
            this._flight.active = false;
            this._isOrbiting = true;
            this.orbitAngle = this._flight.arrivalAngleDeg || 0;
            this._currentOrbitCenter = this._flight.targetCenter;
            this._currentOrbitRadius = this._flight.radius;
            this._currentOrbitHeight = this._flight.height;

            if (this.cameraEntity) {
                this.cameraEntity.setPosition(this._flight.endPos);
                this.cameraEntity.setRotation(this._flight.endRot);
            }

            if (this._flight.onComplete) {
                var cb = this._flight.onComplete;
                this._flight.onComplete = null;
                cb();
            }
        }
        return;
    }

    // 2. ORBITING / DWELL PHASE (Manual or AutoTour)
    if (this._isOrbiting && this._currentOrbitCenter && this.cameraEntity) {
        this.orbitAngle = ((this.orbitAngle || 0) + orbitSpeed * dt) % 360.0;
        var rad = this.orbitAngle * Math.PI / 180.0;
        var r = this._currentOrbitRadius || (this.lookDistance * 1.25);
        var h = this._currentOrbitHeight || 1.6;
        var c = this._currentOrbitCenter;

        var orbitPos = new pc.Vec3(
            c.x + r * Math.cos(rad),
            c.y + h,
            c.z + r * Math.sin(rad)
        );
        var orbitRot = this._calcLookAtRot(orbitPos, c);

        this.cameraEntity.setPosition(orbitPos);
        this.cameraEntity.setRotation(orbitRot);

        var playerRig = this.app.root.findByName('Character_Controller');
        if (playerRig) {
            playerRig.setPosition(orbitPos);
            var euler = this.cameraEntity.getLocalEulerAngles();
            playerRig.setLocalEulerAngles(0, euler.y, 0);
        }
    }

    // 3. AUTO-TOUR AUTOMATIC SEQUENCING
    if (!this.isAutoTouring || this.activePois.length <= 1) return;

    this.tourTimer += dt;
    var dwellDuration = 14.0; // Orbit around each POI for 14 seconds

    if (this.tourTimer >= dwellDuration) {
        this.tourTimer = 0;
        var currentActiveIdx = this.activePois.indexOf(this.currentIndex);
        var nextActiveIdx = (currentActiveIdx + 1) % this.activePois.length;
        var nextPoiIndex = this.activePois[nextActiveIdx];
        
        this.currentIndex = nextPoiIndex;
        this.highlightListItem(this.currentIndex);
        this.updateNavTitle(this.pois[nextPoiIndex].title);
        
        this._startSmoothFlight(nextPoiIndex, 1.8);
    }
};

PoiManager.prototype.getTargetCamTransform = function(index) {
    return this.getOrbitalTransform(index, this.orbitAngle || 0);
};

PoiManager.prototype.jumpTo = function(index, immediate) {
    if (index < 0 || index >= this.pois.length) return;
    
    this.currentIndex = index;
    var target = this.pois[index];
    if (!target || !target.entity) return;

    this._disableCameraControls();

    if (immediate) {
        if (this._flight) this._flight.active = false;
        var transform = this.getOrbitalTransform(index, 0);
        if (transform && this.cameraEntity) {
            this.cameraEntity.setPosition(transform.pos);
            this.cameraEntity.setRotation(transform.rot);
            this._isOrbiting = true;
            this.orbitAngle = 0;
            this._currentOrbitCenter = transform.targetPos;
            this._currentOrbitRadius = transform.radius;
            this._currentOrbitHeight = transform.height;
        }
    } else {
        var self = this;
        this._startSmoothFlight(index, 1.5, function() {
            self.tourTimer = 0;
        });
    }

    this.highlightListItem(index);
    this.updateNavTitle(target.title);
};

PoiManager.prototype._calcLookAtRot = function(fromPos, toPos) {
    var temp = new pc.Entity();
    temp.setPosition(fromPos);
    temp.lookAt(toPos);
    var rot = temp.getRotation().clone();
    temp.destroy();
    return rot;
};

PoiManager.prototype._startSmoothFlight = function(targetIndex, duration, onComplete) {
    if (!this.cameraEntity || targetIndex < 0 || targetIndex >= this.pois.length) return;
    var target = this.pois[targetIndex];
    if (!target || !target.entity) return;

    this._disableCameraControls();
    this._isOrbiting = false;

    var startPos = this.cameraEntity.getPosition().clone();
    var startRot = this.cameraEntity.getRotation().clone();
    var targetPos = target.entity.getPosition().clone();

    // Determine target orbital parameters
    var r = this.lookDistance * 1.25;
    var h = 1.6;
    if (target.type === 'construction') { r *= 2.2; h = 2.4; }
    else if (target.type === 'path') { r *= 1.5; h = 1.8; }

    // Compute entry arrival angle matching the departure vector
    var dx = startPos.x - targetPos.x;
    var dz = startPos.z - targetPos.z;
    var arrivalAngleRad = Math.atan2(dz, dx);
    var arrivalAngleDeg = arrivalAngleRad * 180.0 / Math.PI;

    var endPos = new pc.Vec3(
        targetPos.x + r * Math.cos(arrivalAngleRad),
        targetPos.y + h,
        targetPos.z + r * Math.sin(arrivalAngleRad)
    );
    var endRot = this._calcLookAtRot(endPos, targetPos);

    var travelDist = startPos.distance(endPos);
    var arcHeight = Math.min(3.5, Math.max(1.0, travelDist * 0.15));
    var flightDuration = duration || Math.max(1.2, Math.min(3.0, travelDist / 12.0));

    this._flight = {
        active: true,
        startPos: startPos,
        startRot: startRot,
        endPos: endPos,
        endRot: endRot,
        targetCenter: targetPos,
        radius: r,
        height: h,
        arrivalAngleDeg: arrivalAngleDeg,
        arcHeight: arcHeight,
        duration: flightDuration,
        elapsed: 0,
        onComplete: onComplete || null
    };
};

PoiManager.prototype.next = function() {
    if (this.activePois.length === 0) return;
    var currentActiveIdx = this.activePois.indexOf(this.currentIndex);
    var nextActiveIdx = (currentActiveIdx === -1) ? 0 : (currentActiveIdx + 1) % this.activePois.length;
    var nextPoiIndex = this.activePois[nextActiveIdx];

    this.currentIndex = nextPoiIndex;
    this.highlightListItem(this.currentIndex);
    this.updateNavTitle(this.pois[nextPoiIndex].title);

    this.tourTimer = 0;
    this._startSmoothFlight(nextPoiIndex, 1.4);
};

PoiManager.prototype.prev = function() {
    if (this.activePois.length === 0) return;
    var currentActiveIdx = this.activePois.indexOf(this.currentIndex);
    var prevActiveIdx = (currentActiveIdx === -1) ? (this.activePois.length - 1) : (currentActiveIdx - 1 + this.activePois.length) % this.activePois.length;
    var prevPoiIndex = this.activePois[prevActiveIdx];

    this.currentIndex = prevPoiIndex;
    this.highlightListItem(this.currentIndex);
    this.updateNavTitle(this.pois[prevPoiIndex].title);

    this.tourTimer = 0;
    this._startSmoothFlight(prevPoiIndex, 1.4);
};

PoiManager.prototype.toggleAutoTour = function() {
    this.isAutoTouring = !this.isAutoTouring;
    
    if (this.isAutoTouring) {
        this.tourTimer = 0;
        this.refreshList();
        this._disableCameraControls();

        if (this.currentIndex === -1 && this.activePois.length > 0) {
            this.currentIndex = this.activePois[0];
            this.highlightListItem(this.currentIndex);
            this.updateNavTitle(this.pois[this.currentIndex].title);
            this._startSmoothFlight(this.currentIndex, 1.5);
        } else if (this.currentIndex !== -1) {
            this._startSmoothFlight(this.currentIndex, 1.2);
        }
        console.log('[AutoTour] Started cinematic tour with ' + this.activePois.length + ' POIs');
    } else {
        // Stop Tour & resume manual camera controls cleanly
        this._isOrbiting = false;
        if (this._flight) this._flight.active = false;
        this._restoreCameraControls();
        console.log('[AutoTour] Stopped at current camera position');
    }

    var btn = document.getElementById('poi-play-btn');
    if(btn) {
        btn.innerHTML = this.isAutoTouring ? '❚❚' : '▶';
        if(this.isAutoTouring) btn.classList.add('playing');
        else btn.classList.remove('playing');
    }
};

PoiManager.prototype.toggleSidebar = function() {
    this.isSidebarOpen = !this.isSidebarOpen;
    var el = document.getElementById('poi-sidebar');
    if (el) {
        if(this.isSidebarOpen) el.classList.remove('collapsed');
        else el.classList.add('collapsed');
    }
};

PoiManager.prototype.toggleEntireTourSystem = function(forceState) {
    if (typeof forceState === 'boolean') this.isTourVisible = forceState;
    else this.isTourVisible = !this.isTourVisible;
    this.applyVisibility();
};

PoiManager.prototype.onCleanModeToggle = function(visible) {
    this.isCleanMode = !visible; 
    this.applyVisibility();
};

PoiManager.prototype.applyVisibility = function() {
    var show = this.isTourVisible && !this.isCleanMode;
    if (this.listContainer) this.listContainer.style.display = show ? 'flex' : 'none';
    if (this.navBar) this.navBar.style.display = show ? 'flex' : 'none';
};

PoiManager.prototype.createUI = function() {
    this.listContainer = document.createElement('div');
    this.listContainer.id = 'poi-sidebar';
    this.listContainer.className = 'aeroglass-panel collapsed'; 
    
    this.listContainer.innerHTML = 
        '<div id="poi-sidebar-toggle"></div>' + 
        '<div class="poi-header">Orte & Infos</div>' +
        '<div id="poi-items"></div>';
    document.body.appendChild(this.listContainer);

    document.getElementById('poi-sidebar-toggle').onclick = () => this.toggleSidebar();

    this.navBar = document.createElement('div');
    this.navBar.id = 'poi-navbar';
    this.navBar.className = 'aeroglass-panel';
    this.navBar.innerHTML = 
        '<button id="poi-prev-btn">←</button>' +
        '<button id="poi-play-btn" title="Auto-Tour">▶</button>' +
        '<div id="poi-current-title">Tour starten...</div>' +
        '<button id="poi-next-btn">→</button>';
    document.body.appendChild(this.navBar);

    var self = this;
    document.getElementById('poi-prev-btn').onclick = function() { self.prev(); };
    document.getElementById('poi-next-btn').onclick = function() { self.next(); };
    document.getElementById('poi-play-btn').onclick = function() { self.toggleAutoTour(); };
};

PoiManager.prototype.updatePlayBtn = function() {
    var btn = document.getElementById('poi-play-btn');
    if(btn) {
        btn.innerHTML = '▶';
        btn.classList.remove('playing');
    }
};

PoiManager.prototype.addListItem = function(data, index) {
    var list = document.getElementById('poi-items');
    var item = document.createElement('div');
    item.className = 'poi-item';
    item.id = 'poi-item-' + index;
    
    var icon = '<span style="color:#FF4757; font-size:16px;">📍</span>';
    if(data.type === 'construction') icon = '<span style="color:#FFC107; font-size:16px;">🚧</span>';
    if(data.type === 'path') icon = '<span style="color:#00E5FF; font-size:16px;">👣</span>';

    item.innerHTML = icon + ' ' + data.title;
    
    var self = this;
    item.onclick = function() {
        self.jumpTo(index);
        self.isAutoTouring = false; 
        self.updatePlayBtn();
    };
    list.appendChild(item);
};

PoiManager.prototype.highlightListItem = function(index) {
    var items = document.querySelectorAll('.poi-item');
    items.forEach(el => el.classList.remove('active'));
    var active = document.getElementById('poi-item-' + index);
    if(active) {
        active.classList.add('active');
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

PoiManager.prototype.updateNavTitle = function(title) {
    var el = document.getElementById('poi-current-title');
    if(el) el.innerText = title;
};

PoiManager.prototype.updateNavButtons = function() {
    if (this.currentIndex === -1) {
        if (this.activePois.length > 0) {
            this.updateNavTitle("Tour starten (" + this.activePois.length + " Ziele)");
        } else {
            this.updateNavTitle("Keine Ziele");
        }
    }
};