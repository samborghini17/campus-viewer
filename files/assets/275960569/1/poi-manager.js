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
        var offset = new pc.Vec3(0, 0.5, 1).normalize();
        var dist = this.lookDistance;
        if (target.type === 'construction') { dist *= 2.5; offset.set(1, 1, 1).normalize(); } 
        else if (target.type === 'path') { dist *= 1.5; offset.set(0, 0.8, 1).normalize(); }
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
    if (controls && this._savedControlsEnabled !== undefined) {
        controls.enabled = this._savedControlsEnabled;
    }
    
    // Sync Character Controller so controls are not buggy when moving manually after tour/jump
    var playerRig = this.app.root.findByName('Character_Controller');
    if (playerRig) {
        playerRig.setPosition(this.cameraEntity.getPosition());
        var euler = this.cameraEntity.getLocalEulerAngles();
        playerRig.setLocalEulerAngles(0, euler.y, 0);
    }
};

PoiManager.prototype.update = function(dt) {
    if (!this.isAutoTouring || !this.tourNodes || this.tourNodes.length === 0) return;
    
    this.tourTimer += dt;
    
    var count = this.tourNodes.length;
    if (count <= 1) {
        if (count === 1 && this.cameraEntity) {
            this.cameraEntity.setPosition(this.tourNodes[0].pos);
            this.cameraEntity.setRotation(this.tourNodes[0].rot);
        }
        return;
    }
    
    // Each segment: dwellTime at node + flyTime between nodes
    var dwellTime = 12.0;  // Stay longer at each POI
    var flyTime = this.autoTourDelay; // time to fly between POIs
    var segmentDuration = dwellTime + flyTime;
    var totalDuration = count * segmentDuration;
    if (this.tourTimer >= totalDuration) this.tourTimer = 0;
    
    // Which segment are we in?
    var segIndex = Math.floor(this.tourTimer / segmentDuration);
    if (segIndex >= count) segIndex = 0;
    var segTime = this.tourTimer - (segIndex * segmentDuration);
    
    var n1 = this.tourNodes[segIndex];
    
    if (segTime < dwellTime) {
        // DWELL PHASE: orbit around the POI slowly
        if (this.cameraEntity) {
            var actualPoi = this.pois[n1.idx];
            if (actualPoi) {
                var centerPos = actualPoi.entity.getPosition();
                var radius = new pc.Vec3().sub2(n1.pos, centerPos).length();
                if (radius < 0.1) radius = this.lookDistance;
                
                var orbitSpeed = 360 / dwellTime; // Orbit completely and seamlessly return to start
                var currentAngle = segTime * orbitSpeed;
                
                var relPos = new pc.Vec3().sub2(n1.pos, centerPos);
                var rotQuat = new pc.Quat().setFromEulerAngles(0, currentAngle, 0);
                var rotatedRelPos = rotQuat.transformVector(relPos);
                var newCamPos = new pc.Vec3().add2(centerPos, rotatedRelPos);
                
                var startRotQuat = new pc.Quat().setFromEulerAngles(n1.rot.x, n1.rot.y, n1.rot.z);
                var newCamRotQuat = new pc.Quat().mul2(rotQuat, startRotQuat);
                var newCamRot = newCamRotQuat.getEulerAngles();
                
                this.cameraEntity.setPosition(newCamPos);
                this.cameraEntity.setLocalEulerAngles(newCamRot.x, newCamRot.y, newCamRot.z);
            } else {
                this.cameraEntity.setPosition(n1.pos);
                this.cameraEntity.setRotation(n1.rot);
            }
        }
        if (this.currentIndex !== n1.idx) {
            this.currentIndex = n1.idx;
            this.highlightListItem(n1.idx);
            this.updateNavTitle(n1.title);
        }
    } else {
        // FLY PHASE: interpolate to the next POI
        var f = (segTime - dwellTime) / flyTime;
        
        var ease = f < 0.5 ? 2 * f * f : -1 + (4 - 2 * f) * f;
        f = (f * 0.3) + (ease * 0.7);
        
        var i0 = (segIndex - 1 + count) % count;
        var i2 = (segIndex + 1) % count;
        var i3 = (segIndex + 2) % count;
        
        var n0 = this.tourNodes[i0];
        var n2 = this.tourNodes[i2];
        var n3 = this.tourNodes[i3];
        
        // Return to start position of orbit for seamless fly
        var flyStartPos = n1.pos;
        var flyStartRot = n1.rot;
        
        // Ensure shortest path for quaternions
        var qResult = new pc.Quat();
        var dot = flyStartRot.x * n2.rot.x + flyStartRot.y * n2.rot.y + flyStartRot.z * n2.rot.z + flyStartRot.w * n2.rot.w;
        var tRot = n2.rot.clone();
        if (dot < 0) {
            tRot.x *= -1; tRot.y *= -1; tRot.z *= -1; tRot.w *= -1;
        }
        
        var pos = this.getCatmullRom(n0.pos, flyStartPos, n2.pos, n3.pos, f);
        qResult.slerp(flyStartRot, tRot, f);
        
        if (this.cameraEntity) {
            this.cameraEntity.setPosition(pos);
            this.cameraEntity.setRotation(qResult);
        }
        
        // Show the NEXT POI title as soon as we start flying toward it
        if (this.currentIndex !== n2.idx) {
            this.currentIndex = n2.idx;
            this.highlightListItem(n2.idx);
            this.updateNavTitle(n2.title); // Removed arrow
        }
    }
};

PoiManager.prototype.jumpTo = function(index) {
    if (index < 0 || index >= this.pois.length) return;
    
    this.currentIndex = index;
    var target = this.pois[index];
    var entity = target.entity;
    var targetPos = entity.getPosition().clone(); 

    var camPos, camRot;

    // 1. Entity?
    if (target.customView) {
        camPos = target.customView.getPosition().clone();
        camRot = target.customView.getRotation().clone();
    } 
    // 2. Koordinaten?
    else if (target.customPos && (target.customPos.x !== 0 || target.customPos.y !== 0 || target.customPos.z !== 0)) {
        camPos = target.customPos.clone();
        if (target.customRot && (target.customRot.x !== 0 || target.customRot.y !== 0 || target.customRot.z !== 0)) {
            var tempEnt = new pc.Entity();
            tempEnt.setEulerAngles(target.customRot);
            camRot = tempEnt.getRotation().clone();
            tempEnt.destroy();
        }
    }
    // 3. Fallback
    else {
        var offset = new pc.Vec3(0, 0.5, 1).normalize();
        var dist = this.lookDistance;

        if (target.type === 'construction') { dist *= 2.5; offset.set(1, 1, 1).normalize(); } 
        else if (target.type === 'path') { dist *= 1.5; offset.set(0, 0.8, 1).normalize(); }

        offset.scale(dist);
        camPos = targetPos.clone().add(offset);
    }

    if (this.cameraEntity) {
        this.cameraEntity.setPosition(camPos);
        if (camRot) this.cameraEntity.setRotation(camRot);
        else this.cameraEntity.lookAt(targetPos);
        
        // Sync Character Controller so controls are not buggy when moving manually
        var playerRig = this.app.root.findByName('Character_Controller');
        if (playerRig) {
            playerRig.setPosition(this.cameraEntity.getPosition());
            var euler = this.cameraEntity.getLocalEulerAngles();
            playerRig.setLocalEulerAngles(0, euler.y, 0);
        }
    }

    if (this.cameraEntity && this.cameraEntity.script && this.cameraEntity.script.cameraControls) {
        var controls = this.cameraEntity.script.cameraControls;
        if (controls.focus) controls.focus(targetPos);
        else if (controls.pivotPoint) controls.pivotPoint.copy(targetPos);
    }

    this.tourTimer = 0;
    this.highlightListItem(index);
    this.updateNavTitle(target.title);
};

PoiManager.prototype.next = function() {
    if (this.activePois.length === 0) return;
    var currentActiveIdx = this.activePois.indexOf(this.currentIndex);
    var nextActiveIdx = (currentActiveIdx + 1) % this.activePois.length;
    this.jumpTo(this.activePois[nextActiveIdx]);
};

PoiManager.prototype.prev = function() {
    if (this.activePois.length === 0) return;
    var currentActiveIdx = this.activePois.indexOf(this.currentIndex);
    if (currentActiveIdx === -1) currentActiveIdx = 0;
    var prevActiveIdx = (currentActiveIdx - 1 + this.activePois.length) % this.activePois.length;
    this.jumpTo(this.activePois[prevActiveIdx]);
};

PoiManager.prototype.toggleAutoTour = function() {
    this.isAutoTouring = !this.isAutoTouring;
    
    if (this.isAutoTouring) {
        this.tourTimer = 0;
        this.refreshList();
        this.buildTourCurve();
        this._disableCameraControls();
        if (this.currentIndex !== -1) {
            var idx = this.activePois.indexOf(this.currentIndex);
            if (idx !== -1) {
                var dwellTime = 5.0;
                var flyTime = this.autoTourDelay;
                var segmentDuration = dwellTime + flyTime;
                this.tourTimer = idx * segmentDuration;
            }
        }
        console.log('[AutoTour] Started with ' + (this.tourNodes ? this.tourNodes.length : 0) + ' nodes');
    } else {
        // PAUSE: keep camera where it is (don't snap back)
        this.tourNodes = null;
        this._restoreCameraControls();
        console.log('[AutoTour] Paused at current position');
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
    document.getElementById('poi-prev-btn').onclick = function() { self.prev(); self.isAutoTouring = false; self.updatePlayBtn(); };
    document.getElementById('poi-next-btn').onclick = function() { self.next(); self.isAutoTouring = false; self.updatePlayBtn(); };
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
    
    // Pinke Pins wie im Screenshot
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