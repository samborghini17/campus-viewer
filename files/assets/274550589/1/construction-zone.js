var ConstructionZone = pc.createScript('constructionZone');

// --- INHALT ---
ConstructionZone.attributes.add('title', { type: 'string', default: 'UNDER CONSTRUCTION' });
ConstructionZone.attributes.add('description', { type: 'string', default: 'Dieser Bereich wird bearbeitet.' });
ConstructionZone.attributes.add('addToTour', { type: 'boolean', default: false, title: 'In Tour anzeigen' });

// --- VERBINDUNG ---
ConstructionZone.attributes.add('mainSplatEntity', { type: 'entity', title: 'Main Splat Entity' });

// --- OPTIK (Hologramm / Digital Glass) ---
ConstructionZone.attributes.add('baseColor', { type: 'rgb', default: [0.05, 0.07, 0.1], title: 'Basis Farbe' });
ConstructionZone.attributes.add('glowColor', { type: 'rgb', default: [0.0, 0.8, 1.0], title: 'Scanline Farbe' }); 
ConstructionZone.attributes.add('targetOpacity', { type: 'number', default: 0.95, min: 0, max: 1, title: 'Deckkraft' });
ConstructionZone.attributes.add('scanlineIntensity', { type: 'number', default: 0.5, min: 0, max: 1, title: 'Linien Stärke' });

// --- RAHMEN ---
ConstructionZone.attributes.add('showBorderLines', { type: 'boolean', default: false, title: 'Rahmenlinien zeigen' });
ConstructionZone.attributes.add('borderColor', { type: 'rgb', default: [0, 0.8, 1], title: 'Rahmen Farbe' });

ConstructionZone.attributes.add('height', { type: 'number', default: 15, title: 'Block Höhe' });
ConstructionZone.attributes.add('showButtonBackground', { type: 'boolean', default: true, title: 'Button Hintergrund' });
ConstructionZone.attributes.add('fadeDistance', { type: 'number', default: 5.0, title: 'Fade Distanz (m)' });
ConstructionZone.attributes.add('polygonPoints', { type: 'number', array: true, title: 'Punkte (X, Z)', default: [-10, -10, 10, -10, 10, 10, -10, 10] });

// --- CUSTOM VIEW ---
ConstructionZone.attributes.add('customViewPoint', { type: 'entity', title: 'Custom View (Entity)' });
ConstructionZone.attributes.add('customPos', { type: 'vec3', title: 'Custom Position', default: [0,0,0] });
ConstructionZone.attributes.add('customRot', { type: 'vec3', title: 'Custom Rotation', default: [0,0,0] });

ConstructionZone.prototype.initialize = function() {
    this.localPoints = [];
    this.localCenter = new pc.Vec3();
    this.worldP1 = new pc.Vec3();
    this.worldP2 = new pc.Vec3();
    this.worldUiPos = new pc.Vec3();
    this.screenPos = new pc.Vec3();
    this.borderCol = new pc.Color();
    this.blockWorldPos = new pc.Vec3(); 
    
    this.isOpen = false; 
    this.fadeLevel = 0; 
    this._globalVisible = true; 
    this.textureOffset = 0;

    this.hologramTexture = this.createScanlineTexture();

    this.rebuildGeometry();
    this.createDom();

    this.on('attr:height', this.rebuildGeometry, this);
    this.on('attr:polygonPoints', this.rebuildGeometry, this);
    this.on('attr:baseColor', this.updateMaterial, this);
    this.on('attr:glowColor', this.updateMaterial, this);
    this.on('attr:scanlineIntensity', this.updateMaterial, this);
    this.on('attr:borderColor', this.updateMaterial, this);
    this.on('attr:showButtonBackground', this.updateSpotStyle, this); 

    this.app.on('ui:toggleVisibility', this.onToggleVisibility, this);
    this.app.on('ui:card:opened', this.onOtherCardOpened, this);

    if (this.addToTour) {
        this.app.fire('poi:register', { 
            entity: this.entity, 
            title: this.title, 
            type: 'construction',
            customView: this.customViewPoint,
            customPos: this.customPos,
            customRot: this.customRot
        });
    }

    this.on('disable', this.onDisable, this);
    this.on('enable', this.onEnable, this);
    this.on('destroy', this.onDestroy, this);
};

ConstructionZone.prototype.createScanlineTexture = function() {
    var size = 256;
    var canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,size,size);

    for(var i=0; i<size; i+=4) {
        ctx.fillStyle = '#FFFFFF';
        var alpha = (i % 8 === 0) ? 0.8 : 0.2; 
        ctx.globalAlpha = alpha;
        ctx.fillRect(0, i, size, 2);
    }

    var tex = new pc.Texture(this.app.graphicsDevice, {
        width: size, height: size,
        format: pc.PIXELFORMAT_R8_G8_B8_A8,
        magFilter: pc.FILTER_LINEAR,
        minFilter: pc.FILTER_LINEAR_MIPMAP_LINEAR,
        addressU: pc.ADDRESS_REPEAT,
        addressV: pc.ADDRESS_REPEAT,
        anisotropy: 16
    });
    tex.setSource(canvas);
    return tex;
};

ConstructionZone.prototype.update = function(dt) {
    if (!this.entity.enabled || !this.localPoints.length) return;

    var revealScript = null;
    if (this.mainSplatEntity && this.mainSplatEntity.script) {
        revealScript = this.mainSplatEntity.script.gsplatRevealRadial;
    }

    if (revealScript && revealScript.enabled) {
        var worldTransform = this.entity.getWorldTransform();
        worldTransform.getTranslation(this.blockWorldPos);
        var dx = this.blockWorldPos.x - revealScript.center.x;
        var dz = this.blockWorldPos.z - revealScript.center.z;
        var distToRevealCenter = Math.sqrt(dx*dx + dz*dz);
        var liftTime = Math.max(0, revealScript.effectTime - revealScript.delay);
        var currentWaveRadius = revealScript.speed * liftTime + 0.5 * revealScript.acceleration * liftTime * liftTime;
        var diff = currentWaveRadius - (distToRevealCenter - this.fadeDistance);
        this.fadeLevel = pc.math.clamp(diff / this.fadeDistance, 0, 1);
    } else {
        this.fadeLevel = 1;
    }
    
    if (this.material && this.material.emissiveMap) {
        this.textureOffset -= dt * 0.05; 
        this.material.emissiveMapOffset.set(0, this.textureOffset);
        this.material.update();
    }

    var matOpacity = this.fadeLevel * this.targetOpacity;
    if (this.material && Math.abs(this.material.opacity - matOpacity) > 0.01) {
        this.material.opacity = matOpacity;
        this.material.update();
    }
    
    this.updateUiState();
    this.updateUiPosition();

    if (this.showBorderLines && this.fadeLevel > 0) {
        this.borderCol.a = this.fadeLevel * 0.8;
        var h = this.height;
        var worldTransform = this.entity.getWorldTransform();
        for (var i = 0; i < this.localPoints.length; i++) {
            var p1 = this.localPoints[i];
            var p2 = this.localPoints[(i + 1) % this.localPoints.length];
            this.worldP1.set(p1.x, h, p1.z); this.worldP2.set(p2.x, h, p2.z);
            worldTransform.transformPoint(this.worldP1, this.worldP1);
            worldTransform.transformPoint(this.worldP2, this.worldP2);
            this.app.drawLine(this.worldP1, this.worldP2, this.borderCol);
        }
    }
};

ConstructionZone.prototype.updateUiState = function() {
    if (!this._globalVisible) {
        if (this.card) this.card.style.display = 'none';
        if (this.spot) this.spot.style.display = 'none';
        return;
    }
    if (this.fadeLevel <= 0.05) {
        if (this.spot) this.spot.style.display = 'none';
        return; 
    }

    if (this.isOpen) {
        if(this.card) { this.card.style.display = 'block'; this.card.style.opacity = this.fadeLevel; this.card.style.pointerEvents = 'auto'; }
        if(this.spot) { this.spot.style.display = 'none'; }
    } else {
        if(this.card) { this.card.style.opacity = '0'; this.card.style.pointerEvents = 'none'; this.card.style.display = 'none'; }
        if(this.spot) { this.spot.style.display = 'block'; this.spot.style.opacity = this.fadeLevel; this.spot.style.pointerEvents = 'auto'; }
    }
};

ConstructionZone.prototype.updateUiPosition = function() {
    if (!this._globalVisible || (!this.card && !this.spot) || this.fadeLevel <= 0.05) return;
    
    var camera = this.app.root.findByName('Camera')?.camera;
    if (!camera) return;

    var worldTransform = this.entity.getWorldTransform();
    if(this.localCenter) {
        worldTransform.transformPoint(this.localCenter, this.worldUiPos);
        this.worldUiPos.y += 0.5; 
        camera.worldToScreen(this.worldUiPos, this.screenPos);
        var behind = this.screenPos.z < 0;

        if (this.card) {
            this.card.style.display = (behind || !this.isOpen) ? 'none' : 'block';
            
            if(this.card.style.display === 'block') {
                var cW = 220; 
                var cH = this.card.offsetHeight || 100;
                var tX = this.screenPos.x;
                var tY = this.screenPos.y;
                
                var safeTop = window.safeAreaInsets ? window.safeAreaInsets.top : 40;
                
                tX = Math.max(cW/2 + 10, Math.min(tX, window.innerWidth - cW/2 - 10));
                tY = Math.max(safeTop + cH + 10, Math.min(tY, window.innerHeight - 10));

                this.card.style.left = tX + 'px'; 
                this.card.style.top = tY + 'px';
            }
        }
        if (this.spot) {
            this.spot.style.display = (behind || this.isOpen) ? 'none' : 'block';
            this.spot.style.left = this.screenPos.x + 'px'; 
            this.spot.style.top = this.screenPos.y + 'px';
        }
    }
};

ConstructionZone.prototype.toggleUi = function(open) {
    this.isOpen = open;
    if(open) this.app.fire('ui:card:opened', this);
    this.updateUiState();
};

ConstructionZone.prototype.rebuildGeometry = function() {
    this.localPoints = [];
    if (!this.polygonPoints || this.polygonPoints.length % 2 !== 0) return;
    for (var i = 0; i < this.polygonPoints.length; i += 2) {
        this.localPoints.push(new pc.Vec3(this.polygonPoints[i], 0, this.polygonPoints[i+1]));
    }
    this.localCenter.set(0, 0, 0);
    if (this.localPoints.length > 0) {
        for(var p of this.localPoints) this.localCenter.add(p);
        this.localCenter.scale(1 / this.localPoints.length);
    }
    this.localCenter.y = this.height / 2;

    this.createVolumeMesh();
    this.updateMaterial();
};

ConstructionZone.prototype.updateMaterial = function() {
    if(this.material) {
        if(this.borderColor) this.borderCol.set(this.borderColor.r, this.borderColor.g, this.borderColor.b, 1);
        this.material.diffuse.set(this.baseColor.r, this.baseColor.g, this.baseColor.b);
        this.material.emissive.set(this.glowColor.r * this.scanlineIntensity, this.glowColor.g * this.scanlineIntensity, this.glowColor.b * this.scanlineIntensity); 
        this.material.update();
    }
};

ConstructionZone.prototype.createVolumeMesh = function() {
    var device = this.app.graphicsDevice;
    var mesh = new pc.Mesh(device);
    var positions = [], normals = [], uvs = [], indices = [];
    var h = this.height;
    
    var topCenterIdx = 0;
    positions.push(this.localCenter.x, h, this.localCenter.z);
    normals.push(0, 1, 0); uvs.push(0.5, 0.5);
    var topStartIdx = 1;
    for (var i = 0; i < this.localPoints.length; i++) {
        var p = this.localPoints[i];
        positions.push(p.x, h, p.z); normals.push(0, 1, 0); 
        uvs.push(p.x * 0.1, p.z * 0.1); 
    }
    for (var i = 0; i < this.localPoints.length; i++) {
        indices.push(topCenterIdx, topStartIdx + i, topStartIdx + ((i + 1) % this.localPoints.length));
    }

    var baseIdx = positions.length / 3;
    for (var i = 0; i < this.localPoints.length; i++) {
        var p1 = this.localPoints[i]; 
        var p2 = this.localPoints[(i + 1) % this.localPoints.length]; 
        
        positions.push(p1.x, 0, p1.z); positions.push(p2.x, 0, p2.z);
        positions.push(p2.x, h, p2.z); positions.push(p1.x, h, p1.z);
        
        var n = new pc.Vec3().cross(new pc.Vec3(p2.x-p1.x, 0, p2.z-p1.z), new pc.Vec3(0,1,0)).normalize();
        for(var k=0; k<4; k++) { normals.push(n.x, n.y, n.z); }
        
        uvs.push(0, 0); uvs.push(1, 0); uvs.push(1, 1); uvs.push(0, 1);
        
        var idx = baseIdx + i * 4;
        indices.push(idx, idx+1, idx+2); indices.push(idx, idx+2, idx+3);
    }

    mesh.setPositions(positions); mesh.setNormals(normals); mesh.setUvs(0, uvs); mesh.setIndices(indices); mesh.update();

    if (!this.material) {
        this.material = new pc.StandardMaterial();
        this.material.useLighting = false; 
        this.material.blendType = pc.BLEND_NORMAL;
        this.material.opacity = 0.95;
        this.material.cull = pc.CULLFACE_NONE; 
        this.material.emissiveMap = this.hologramTexture;
        this.material.emissiveMapTint = true;
        this.updateMaterial();
    }

    var node = new pc.GraphNode();
    var meshInstance = new pc.MeshInstance(mesh, this.material, node);
    meshInstance.cull = false;

    if (this.entity.render) this.entity.removeComponent('render');
    if (!this.entity.model) this.entity.addComponent('model');
    var model = new pc.Model();
    model.graph = node; model.meshInstances = [meshInstance];
    this.entity.model.model = model;
};

ConstructionZone.prototype.createDom = function() {
    this.card = document.createElement('div');
    Object.assign(this.card.style, {
        position: 'absolute', display: 'none', width: '220px',
        background: 'rgba(10, 10, 10, 0.75)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)', borderLeft: '4px solid #f1c40f',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)', color: 'white', padding: '16px', borderRadius: '6px',
        fontFamily: "'Segoe UI', sans-serif", pointerEvents: 'auto', zIndex: '200',
        transform: 'translate(-50%, -100%)', transition: 'opacity 0.2s ease', opacity: '0'
    });
    this.card.innerHTML = `
        <div style="position:relative;">
            <div style="display:flex; align-items:center; margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.1);">
                <span style="font-size:18px; margin-right:10px;">🚧</span> 
                <h3 style="margin:0; font-weight:800; font-size:14px; color:#f1c40f; letter-spacing:1px;">${this.title}</h3>
            </div>
            <p style="margin:0; font-size:13px; color:rgba(255,255,255,0.7); line-height:1.4;">${this.description}</p>
            <div id="closeBtn" style="position:absolute; top:-15px; right:-15px; width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:24px; color:rgba(255,255,255,0.5);">&times;</div>
        </div>`;
    document.body.appendChild(this.card);
    this.card.querySelector('#closeBtn').onclick = (e) => { e.stopPropagation(); this.toggleUi(false); };

    // GROSSE HITBOX (60x60 Pixel, unsichtbar!)
    this.spot = document.createElement('div');
    Object.assign(this.spot.style, {
        position: 'absolute', width: '60px', height: '60px',     
        cursor: 'pointer', transform: 'translate(-50%, -50%)',
        zIndex: '199', background: 'transparent', 
        opacity: '0', display: 'none', transition: 'opacity 0.5s ease' 
    });

    // SICHTBARER RING
    this.ring = document.createElement('div');
    var bg = this.showButtonBackground ? 'rgba(10, 10, 10, 0.8)' : 'transparent';
    Object.assign(this.ring.style, {
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '24px', height: '24px', background: bg, border: '2px solid #f1c40f', borderRadius: '50%',
        boxShadow: '0 0 10px rgba(241, 196, 15, 0.4)', transition: 'transform 0.2s ease', pointerEvents: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color:'#f1c40f', fontWeight:'bold', fontSize:'14px'
    });
    this.ring.innerHTML = '+';
    this.spot.appendChild(this.ring);

    document.body.appendChild(this.spot);
    this.spot.onclick = (e) => { e.stopPropagation(); this.toggleUi(true); };
    this.spot.onmouseover = () => { this.ring.style.transform = 'translate(-50%, -50%) scale(1.2)'; };
    this.spot.onmouseout = () => { this.ring.style.transform = 'translate(-50%, -50%) scale(1.0)'; };
};

ConstructionZone.prototype.updateSpotStyle = function() {
    if(this.ring) this.ring.style.background = this.showButtonBackground ? 'rgba(10, 10, 10, 0.8)' : 'transparent';
};

ConstructionZone.prototype.onOtherCardOpened = function(opener) {
    if (opener !== this && this.isOpen) {
        this.toggleUi(false);
    }
};

ConstructionZone.prototype.onToggleVisibility = function(visible) {
    this._globalVisible = visible;
    if (!visible) {
        if (this.card) this.card.style.display = 'none';
        if (this.spot) this.spot.style.display = 'none';
    }
};

ConstructionZone.prototype.onEnable = function() {
    this.fadeLevel = 0;
    this.isOpen = false;
    if(this.card) this.card.style.opacity = '0';
    if(this.spot) this.spot.style.opacity = '0';
    this.updateUiState();
};

ConstructionZone.prototype.onDisable = function() { 
    if(this.card) this.card.style.display = 'none'; 
    if(this.spot) this.spot.style.display = 'none';
};

ConstructionZone.prototype.onDestroy = function() { 
    if(this.card) this.card.remove(); 
    if(this.spot) this.spot.remove();
    this.app.off('ui:toggleVisibility', this.onToggleVisibility, this);
    this.app.off('ui:card:opened', this.onOtherCardOpened, this);
};