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

    this.createUI();

    this.app.on('poi:register', this.registerPOI, this);
    this.app.on('ui:toggleTour', this.toggleEntireTourSystem, this); 
    this.app.on('ui:toggleVisibility', this.onCleanModeToggle, this); 
};

PoiManager.prototype.registerPOI = function(data) {
    var exists = this.pois.some(function(p) { return p.entity === data.entity; });
    if(exists) return;

    this.pois.push(data);
    this.addListItem(data, this.pois.length - 1);
    this.updateNavButtons();
};

PoiManager.prototype.update = function(dt) {
    if (this.isAutoTouring && this.pois.length > 0) {
        this.tourTimer += dt;
        if (this.tourTimer >= this.autoTourDelay) {
            this.next();
            this.tourTimer = 0;
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
    if (this.pois.length === 0) return;
    var nextIndex = (this.currentIndex + 1) % this.pois.length;
    this.jumpTo(nextIndex);
};

PoiManager.prototype.prev = function() {
    if (this.pois.length === 0) return;
    var prevIndex = (this.currentIndex - 1 + this.pois.length) % this.pois.length;
    this.jumpTo(prevIndex);
};

PoiManager.prototype.toggleAutoTour = function() {
    this.isAutoTouring = !this.isAutoTouring;
    this.tourTimer = 0;
    
    var btn = document.getElementById('poi-play-btn');
    if(btn) {
        btn.innerHTML = this.isAutoTouring ? '❚❚' : '▶';
        if(this.isAutoTouring) btn.classList.add('playing');
        else btn.classList.remove('playing');
    }
    
    if(this.isAutoTouring && this.currentIndex === -1) {
        this.next();
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
    this.listContainer.className = 'collapsed'; 
    
    this.listContainer.innerHTML = 
        '<div id="poi-sidebar-toggle"></div>' + 
        '<div class="poi-header">Orte & Infos</div>' +
        '<div id="poi-items"></div>';
    document.body.appendChild(this.listContainer);

    document.getElementById('poi-sidebar-toggle').onclick = () => this.toggleSidebar();

    this.navBar = document.createElement('div');
    this.navBar.id = 'poi-navbar';
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
        if (this.pois.length > 0) {
            this.updateNavTitle("Tour starten (" + this.pois.length + " Ziele)");
        } else {
            this.updateNavTitle("Keine Ziele");
        }
    }
};