var PathVisualizer = pc.createScript('pathVisualizer');

PathVisualizer.attributes.add('targetLevelId', { type: 'string', title: 'Ziel Level ID' });
PathVisualizer.attributes.add('title', { type: 'string', default: 'Wegweiser', title: 'Titel' });
PathVisualizer.attributes.add('description', { type: 'string', default: 'Hier startet der Weg.', title: 'Beschreibung' });
PathVisualizer.attributes.add('buttonText', { type: 'string', default: 'Starten', title: 'Button Text' });

// --- VISUALS ---
PathVisualizer.attributes.add('baseDelay', { type: 'number', default: 0.0, title: 'Zusatz-Verzögerung (s)' });
PathVisualizer.attributes.add('randomWindow', { type: 'number', default: 0.5, title: 'Zufalls-Zeit (s)' });
PathVisualizer.attributes.add('revealDuration', { type: 'number', default: 1.0, title: 'Fade Dauer (s)' });
PathVisualizer.attributes.add('primaryColor', { type: 'rgb', default: [0, 1, 0], title: 'UI Hauptfarbe' });
PathVisualizer.attributes.add('secondaryColor', { type: 'rgb', default: [0.67, 1, 0.18], title: 'UI Zweitfarbe' });
PathVisualizer.attributes.add('pathColor', { type: 'rgb', default: [0, 1, 0], title: 'Pfad Farbe' });
PathVisualizer.attributes.add('pathWidth', { type: 'number', default: 0.6, title: 'Pfad Breite (m)' });
PathVisualizer.attributes.add('targetOpacity', { type: 'number', default: 0.8, min: 0, max: 1, title: 'Max Deckkraft' });
PathVisualizer.attributes.add('showBackground', { type: 'boolean', default: false, title: 'Weißer Hintergrund' });

// --- PUNKTE (JETZT 3D: X, Y, Z) ---
PathVisualizer.attributes.add('pathPoints', { type: 'number', array: true, title: 'Wegpunkte (X, Y, Z)', default: [0, 0, 0, 5, 0, 5] });

// Dieser Offset wird auf die individuelle Y-Koordinate draufgerechnet
PathVisualizer.attributes.add('yOffset', { type: 'number', default: 1.6, title: 'Zusatz-Höhe (Offset)' });

// --- CUSTOM VIEW ---
PathVisualizer.attributes.add('customViewPoint', { type: 'entity', title: 'Custom View (Entity)' });
PathVisualizer.attributes.add('customPos', { type: 'vec3', title: 'Custom Position', default: [0,0,0] });
PathVisualizer.attributes.add('customRot', { type: 'vec3', title: 'Custom Rotation', default: [0,0,0] });

PathVisualizer.prototype.initialize = function() {
    this.localPoints = [];
    this.uiWorldPos = new pc.Vec3();
    this.nextWorldPos = new pc.Vec3(); 
    this.screenPos = new pc.Vec3();
    this.screenPosNext = new pc.Vec3(); 
    
    this.timer = 0;
    this.fadeLevel = 0; 
    this.isOpen = false; 
    this.hasRevealed = false; 
    this.actualStartDelay = 0;
    this._globalVisible = true;

    this.rebuildGeometry();
    this.createDom();

    this.app.on('scene:reveal', this.onSceneReveal, this);
    this.app.on('ui:toggleVisibility', this.onToggleVisibility, this);
    this.app.on('ui:card:opened', this.onOtherCardOpened, this);

    this.on('attr:pathPoints', this.rebuildGeometry, this);
    this.on('attr:pathWidth', this.rebuildGeometry, this);
    this.on('attr:yOffset', this.rebuildGeometry, this);
    this.on('attr:pathColor', this.updateMaterial, this);
    this.on('attr:primaryColor', this.updateDomStyle, this);
    this.on('attr:secondaryColor', this.updateDomStyle, this);
    this.on('attr:showBackground', this.updateDomStyle, this); 
    this.on('attr:title', this.updateDomText, this);
    this.on('attr:description', this.updateDomText, this);
    this.on('attr:buttonText', this.updateDomText, this);

    // --- REGISTRIERUNG ---
    this.app.fire('poi:register', { 
        entity: this.entity, 
        title: this.title, 
        type: 'path',
        customView: this.customViewPoint,
        customPos: this.customPos,
        customRot: this.customRot
    });

    this.on('disable', this.onDisable, this);
    this.on('enable', this.onEnable, this);
    this.on('destroy', this.onDestroy, this);
};

PathVisualizer.prototype.onOtherCardOpened = function(opener) {
    if (opener !== this && this.isOpen) {
        this.isOpen = false;
        this.updateUiVisibility();
    }
};

PathVisualizer.prototype.onToggleVisibility = function(visible) {
    this._globalVisible = visible;
    if (!visible) {
        if (this.spot) this.spot.style.display = 'none';
        if (this.card) this.card.style.display = 'none';
        if (this.entity.model && this.entity.model.meshInstances[0]) {
            this.entity.model.meshInstances[0].visible = false;
        }
    }
};

PathVisualizer.prototype.onSceneReveal = function() {
    this.hasRevealed = true;
    this.timer = 0;
    this.actualStartDelay = this.baseDelay + (this.randomWindow > 0 ? Math.random() * this.randomWindow : 0);
};

PathVisualizer.prototype.onEnable = function() {
    this.timer = 0;
    this.fadeLevel = 0;
    this.isOpen = false;
    this.hasRevealed = false; 
    this.hideDom(); 
    
    if(this.entity.model && this.entity.model.meshInstances[0]) {
        this.entity.model.meshInstances[0].visible = false;
    }

    if(this.material) {
        this.material.opacity = 0;
        this.material.update();
    }
};

PathVisualizer.prototype.rebuildGeometry = function() {
    this.localPoints = [];
    
    if (!this.pathPoints || this.pathPoints.length % 3 !== 0) {
        console.error("PathVisualizer: pathPoints array length must be divisible by 3 (x,y,z)!");
        return;
    }

    for (var i = 0; i < this.pathPoints.length; i += 3) {
        var x = this.pathPoints[i];
        var y = this.pathPoints[i+1];
        var z = this.pathPoints[i+2];
        
        this.localPoints.push(new pc.Vec3(x, y + this.yOffset, z));
    }

    if(this.localPoints.length > 0) {
        this.localStartPoint = this.localPoints[0].clone(); 
        if(this.localPoints.length > 1) {
            this.localNextPoint = this.localPoints[1].clone();
        } else {
            this.localNextPoint = this.localStartPoint.clone(); 
        }
    }

    this.createPathMesh();
    this.updateMaterial();
};

PathVisualizer.prototype.createPathMesh = function() {
    if (this.localPoints.length < 2) return;

    var device = this.app.graphicsDevice;
    var mesh = new pc.Mesh(device);

    var positions = [], normals = [], uvs = [], indices = [];
    var halfWidth = this.pathWidth * 0.5;
    var up = pc.Vec3.UP;
    var tempDir = new pc.Vec3();
    var tempRight = new pc.Vec3();

    for (var i = 0; i < this.localPoints.length; i++) {
        var curr = this.localPoints[i];
        var dir = new pc.Vec3(0,0,0);
        
        if (i > 0) {
            tempDir.sub2(curr, this.localPoints[i - 1]).normalize();
            dir.add(tempDir);
        }
        if (i < this.localPoints.length - 1) {
            tempDir.sub2(this.localPoints[i + 1], curr).normalize();
            dir.add(tempDir);
        }
        
        if (dir.length() > 0) dir.normalize();
        tempRight.cross(up, dir).normalize().scale(halfWidth);
        
        positions.push(curr.x - tempRight.x, curr.y, curr.z - tempRight.z);
        positions.push(curr.x + tempRight.x, curr.y, curr.z + tempRight.z);

        normals.push(0, 1, 0); normals.push(0, 1, 0);
        uvs.push(0, 0); uvs.push(1, 0);
    }

    for (var i = 0; i < this.localPoints.length - 1; i++) {
        var base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
    }

    mesh.setPositions(positions);
    mesh.setNormals(normals);
    mesh.setUvs(0, uvs);
    mesh.setIndices(indices);
    mesh.update();

    if (!this.material) {
        this.material = new pc.StandardMaterial();
        this.material.useLighting = false;
        this.material.diffuse = new pc.Color(0, 0, 0);
        this.material.emissive = new pc.Color(0, 0, 0);
        this.material.opacity = 0;
        
        if (pc.CULLFACE_NONE !== undefined) {
            this.material.cull = pc.CULLFACE_NONE;
        } else {
            this.material.cull = 0;
        }

        this.material.blendType = pc.BLEND_NORMAL;
        this.material.update();
    }
    this.updateMaterial();

    var node = new pc.GraphNode();
    var meshInstance = new pc.MeshInstance(mesh, this.material, node);
    meshInstance.visible = false;

    if (this.entity.render) this.entity.removeComponent('render');
    if (!this.entity.model) this.entity.addComponent('model');
    var model = new pc.Model();
    model.graph = node;
    model.meshInstances = [meshInstance];
    this.entity.model.model = model;
};

PathVisualizer.prototype.updateMaterial = function() {
    if(this.material) {
        this.material.emissive.set(this.pathColor.r, this.pathColor.g, this.pathColor.b);
        this.material.diffuse.set(0,0,0);
        this.material.update();
    }
};

PathVisualizer.prototype.createDom = function() {
    // 1. UNSICHTBARE HITBOX (60x60 Pixel)
    this.spot = document.createElement('div');
    Object.assign(this.spot.style, {
        position: 'absolute', width: '60px', height: '60px', cursor: 'pointer',
        transform: 'translate(-50%, -50%)', zIndex: '100', display: 'none', opacity: '0'
    });
    document.body.appendChild(this.spot);

    // 2. DER SICHTBARE RING (Liegt zentriert IN der Hitbox)
    this.ring = document.createElement('div');
    Object.assign(this.ring.style, {
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '24px', height: '24px', borderRadius: '50%', textAlign: 'center',
        transition: 'transform 0.2s ease', pointerEvents: 'none'
    });
    this.ring.innerHTML = '<div id="arrow" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:16px; font-weight:bold; transition: transform 0.1s linear;">➜</div>';
    this.spot.appendChild(this.ring);

    this.card = document.createElement('div');
    Object.assign(this.card.style, {
        position: 'absolute', display: 'none', width: '280px',
        background: 'rgba(40, 40, 40, 0.5)', backdropFilter: 'blur(15px)', webkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        color: 'white', padding: '24px', borderRadius: '16px', fontFamily: "'Segoe UI', sans-serif", 
        zIndex: '500'
    });
    
    this.card.innerHTML = `
        <h3 id="uiTitle" style="margin:0 0 8px; font-weight:600; font-size:18px;">${this.title}</h3>
        <p id="uiDesc" style="margin:0 0 20px; font-size:14px; line-height:1.5; color:rgba(255,255,255,0.9)">${this.description}</p>
        <button id="uiBtn" style="width:100%; padding:10px; border:none; color:white; border-radius:8px; font-weight:600; cursor:pointer;">${this.buttonText}</button>
        <div id="close" style="position:absolute; top:15px; right:20px; cursor:pointer; font-size:20px; opacity:0.7">&times;</div>
    `;
    document.body.appendChild(this.card);

    this.updateDomStyle();

    this.spot.onclick = (e) => { 
        e.stopPropagation(); 
        this.isOpen = true; 
        this.app.fire('ui:card:opened', this);
        this.updateUiVisibility(); 
    };
    
    this.card.querySelector('#close').onclick = (e) => { e.stopPropagation(); this.isOpen = false; this.updateUiVisibility(); };
    this.card.querySelector('#uiBtn').onclick = (e) => {
        e.stopPropagation();
        if(this.targetLevelId) {
            this.app.fire('level:switch', this.targetLevelId);
            this.isOpen = false; 
            this.updateUiVisibility();
        }
    };

    // Die Animation betrifft nun nur den sichtbaren Ring!
    this.spot.onmouseover = () => { this.ring.style.transform = 'translate(-50%, -50%) scale(1.2)'; };
    this.spot.onmouseout = () => { this.ring.style.transform = 'translate(-50%, -50%) scale(1.0)'; };
};

PathVisualizer.prototype.updateDomStyle = function() {
    if(!this.spot || !this.card || !this.ring) return;
    var toCss = (c) => `rgb(${Math.floor(c.r*255)},${Math.floor(c.g*255)},${Math.floor(c.b*255)})`;
    var p = toCss(this.primaryColor);
    var s = toCss(this.secondaryColor);
    var bg = this.showBackground ? 'rgba(255, 255, 255, 0.9)' : 'transparent';

    this.ring.style.background = bg;
    this.ring.style.border = `3px solid ${p}`;
    this.ring.style.color = p;
    this.ring.style.boxShadow = `0 0 15px ${p}`;

    var h3 = this.card.querySelector('#uiTitle');
    if(h3) h3.style.color = s;

    var btn = this.card.querySelector('#uiBtn');
    if(btn) {
        btn.style.background = `linear-gradient(135deg, ${p} 0%, ${s} 100%)`;
        btn.style.boxShadow = `0 4px 15px ${p}`;
    }
};

PathVisualizer.prototype.updateDomText = function() {
    if(!this.card) return;
    var t = this.card.querySelector('#uiTitle'); if(t) t.innerText = this.title;
    var d = this.card.querySelector('#uiDesc'); if(d) d.innerText = this.description;
    var b = this.card.querySelector('#uiBtn'); if(b) b.innerText = this.buttonText;
};

PathVisualizer.prototype.hideDom = function() {
    if(this.spot) { this.spot.style.display = 'none'; this.spot.style.opacity = '0'; }
    if(this.card) { this.card.style.display = 'none'; }
    this.isOpen = false;
};

PathVisualizer.prototype.updateUiVisibility = function() {
    if (this.fadeLevel <= 0.05 || !this._globalVisible) {
        this.spot.style.display = 'none';
        this.card.style.display = 'none';
        return;
    }

    this.spot.style.display = 'block';
    this.spot.style.opacity = this.fadeLevel;

    if (this.isOpen) {
        this.card.style.display = 'block';
    } else {
        this.card.style.display = 'none';
    }
};

PathVisualizer.prototype.update = function(dt) {
    if (!this._globalVisible) {
        if (this.entity.model && this.entity.model.meshInstances[0]) {
            this.entity.model.meshInstances[0].visible = false;
        }
        return;
    }

    if (!this.entity.enabled || !this.localPoints.length) return;

    if (this.hasRevealed) {
        this.timer += dt;
        if (this.timer > this.actualStartDelay) {
            var animTime = this.timer - this.actualStartDelay;
            this.fadeLevel = pc.math.clamp(animTime / this.revealDuration, 0, 1);
        } else {
            this.fadeLevel = 0;
        }
    } else {
        this.fadeLevel = 0;
    }

    var matOpacity = this.fadeLevel * this.targetOpacity;
    if (this.material) {
        this.material.opacity = matOpacity;
        this.material.update();
    }
    
    if (this.entity.model && this.entity.model.meshInstances[0]) {
        var shouldBeVisible = (this.fadeLevel > 0.01);
        if (this.entity.model.meshInstances[0].visible !== shouldBeVisible) {
            this.entity.model.meshInstances[0].visible = shouldBeVisible;
        }
    }

    if (!this.spot || !this.card) return;

    this.updateUiVisibility();
    
    if(this.fadeLevel <= 0.05) return;

    var camera = this.app.root.findByName('Camera')?.camera;
    if (!camera) return;

    var worldTransform = this.entity.getWorldTransform();
    if(this.localStartPoint) {
        worldTransform.transformPoint(this.localStartPoint, this.uiWorldPos);
        this.uiWorldPos.y += 1.0; 
    }
    if(this.localNextPoint) {
        worldTransform.transformPoint(this.localNextPoint, this.nextWorldPos);
    }

    camera.worldToScreen(this.uiWorldPos, this.screenPos);
    camera.worldToScreen(this.nextWorldPos, this.screenPosNext);

    if (this.screenPos.z < 0) {
        this.spot.style.display = 'none';
        this.card.style.display = 'none';
    } else {
        var px = this.screenPos.x;
        var py = this.screenPos.y;

        this.spot.style.left = px + 'px';
        this.spot.style.top = py + 'px';
        
        var dx = this.screenPosNext.x - px;
        var dy = this.screenPosNext.y - py;
        var angle = Math.atan2(dy, dx) * (180 / Math.PI);
        // Wir drehen jetzt den Pfeil IM Ring!
        var arrowEl = this.ring.querySelector('#arrow');
        if (arrowEl) arrowEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        
        if(this.card.style.display !== 'none') {
            this.card.style.left = (px + 20) + 'px';
            this.card.style.top = (py - 40) + 'px';
        }
    }
};

PathVisualizer.prototype.onDisable = function() { 
    this.hideDom(); 
    this.hasRevealed = false;
};

PathVisualizer.prototype.onDestroy = function() { 
    if(this.spot) this.spot.remove();
    if(this.card) this.card.remove();
    this.app.off('scene:reveal', this.onSceneReveal, this);
    this.app.off('ui:toggleVisibility', this.onToggleVisibility, this);
    this.app.off('ui:card:opened', this.onOtherCardOpened, this);
};