var InfoHotspot = pc.createScript('infoHotspot');

// Attributes DE
InfoHotspot.attributes.add('title', { type: 'string', default: 'Info', title: 'Titel' });
InfoHotspot.attributes.add('description', { type: 'string', default: 'Beschreibung', title: 'Beschreibung' });
InfoHotspot.attributes.add('buttonText', { type: 'string', default: 'Interagieren', title: 'Button Text' });

// Attributes EN
InfoHotspot.attributes.add('title_en', { type: 'string', default: '', title: 'Titel (EN)' });
InfoHotspot.attributes.add('description_en', { type: 'string', default: '', title: 'Beschreibung (EN)' });
InfoHotspot.attributes.add('buttonText_en', { type: 'string', default: '', title: 'Button Text (EN)' });

InfoHotspot.attributes.add('sublevelIds', { type: 'string', array: true, title: 'Sublevel IDs (Ausklappmenü)' });

InfoHotspot.attributes.add('targetLevelId', { type: 'string', default: '', title: 'Ziel Level ID (Haupt-Klick)' });
InfoHotspot.attributes.add('linkUrl', { type: 'string', default: '', title: 'Link URL' });
InfoHotspot.attributes.add('baseDelay', { type: 'number', default: 0.0, title: 'Verzögerung (s)' });
InfoHotspot.attributes.add('randomWindow', { type: 'number', default: 0.0, title: 'Zufall (s)' });
InfoHotspot.attributes.add('radius', { type: 'number', default: 24, title: 'Größe (px)' });
InfoHotspot.attributes.add('primaryColor', { type: 'rgb', default: [1, 0.28, 0.34], title: 'Hauptfarbe' });
InfoHotspot.attributes.add('secondaryColor', { type: 'rgb', default: [1, 0.42, 0.51], title: 'Zweitfarbe' });
InfoHotspot.attributes.add('textColor', { type: 'rgb', default: [1, 0.42, 0.51], title: 'Textfarbe' });
InfoHotspot.attributes.add('showBorder', { type: 'boolean', default: true, title: 'Ring anzeigen' });
InfoHotspot.attributes.add('whiteCore', { type: 'boolean', default: false, title: 'Weißer Punkt' });
InfoHotspot.attributes.add('vrScale', { type: 'number', default: 2.0, title: 'VR Kugel Größe' });
InfoHotspot.attributes.add('customViewPoint', { type: 'entity', title: 'Custom View (Entity)' });
InfoHotspot.attributes.add('customPos', { type: 'vec3', title: 'Custom Position', default: [0,0,0] });
InfoHotspot.attributes.add('customRot', { type: 'vec3', title: 'Custom Rotation', default: [0,0,0] });

InfoHotspot.prototype.initialize = function() {
    this.currentLang = 'de';
    this.createDom();
    this.create3DSphere(); 
    this._globalVisible = true;
    this._revealed = false;

    this.app.on('scene:reveal', this.onReveal, this);
    this.app.on('ui:toggleVisibility', this.onToggleVisibility, this);
    this.app.on('ui:card:opened', this.onOtherCardOpened, this);
    this.app.on('vr:trigger', this.onVrTrigger, this); 
    this.app.on('lang:switch', this.onLangSwitch, this);

    this.app.fire('poi:register', { 
        entity: this.entity, title: this.title, type: 'hotspot',
        customView: this.customViewPoint, customPos: this.customPos, customRot: this.customRot
    });

    this.on('disable', this.hideDom, this);
    this.on('enable', this.prepareDom, this);
    this.on('destroy', this.onDestroy, this);
    
    this.on('attr', function() {
        this.updateContent();
        this.updateStyle();
    }, this);
    this.vec = new pc.Vec3();
};

InfoHotspot.prototype.onLangSwitch = function(lang) {
    this.currentLang = lang;
    this.updateContent();
};

InfoHotspot.prototype.create3DSphere = function() {
    this.sphereEntity = new pc.Entity();
    this.sphereEntity.addComponent("model", { type: "sphere" });
    this.sphereEntity.setLocalScale(this.vrScale, this.vrScale, this.vrScale); 
    var mat = new pc.StandardMaterial();
    mat.diffuse = new pc.Color(this.primaryColor.r, this.primaryColor.g, this.primaryColor.b);
    mat.emissive = new pc.Color(this.primaryColor.r, this.primaryColor.g, this.primaryColor.b);
    mat.useLighting = false;
    mat.update();
    this.sphereEntity.model.material = mat;
    this.entity.addChild(this.sphereEntity);
    this.sphereEntity.enabled = false;
};

InfoHotspot.prototype.onVrTrigger = function(rayOrigin, rayDir) {
    if (!this.entity.enabled || !this._globalVisible) return;
    if (!this.sphereEntity || !this.sphereEntity.enabled) return;
    var pos = this.entity.getPosition();
    var hitRadius = this.vrScale * 0.8; 
    var l = pos.clone().sub(rayOrigin);
    var tca = l.dot(rayDir);
    if (tca < 0) return; 
    var d2 = l.lengthSq() - tca * tca;
    if (d2 <= hitRadius * hitRadius) this.triggerAction();
};

InfoHotspot.prototype.onOtherCardOpened = function(opener) {
    if (opener !== this) this.closeCard();
};

InfoHotspot.prototype.onToggleVisibility = function(visible) {
    this._globalVisible = visible;
    if (!visible) {
        if (this.spot) this.spot.style.display = 'none';
        if (this.card) this.card.style.display = 'none';
        if (this.sphereEntity) this.sphereEntity.enabled = false;
    }
};

InfoHotspot.prototype.createDom = function() {
    var p = this.toCssColor(this.primaryColor);
    var s = this.toCssColor(this.secondaryColor);

    // GROSSE HITBOX (60x60 Pixel, unsichtbar!)
    this.spot = document.createElement('div');
    Object.assign(this.spot.style, {
        position: 'absolute', width: '60px', height: '60px',     
        cursor: 'pointer', transform: 'translate(-50%, -50%)',
        zIndex: '100', background: 'transparent', 
        opacity: '0', display: 'none', transition: 'opacity 0.5s ease' 
    });

    // SICHTBARER RING
    this.ring = document.createElement('div');
    Object.assign(this.ring.style, {
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', pointerEvents: 'none',
        transition: 'transform 0.2s ease', border: `2px solid ${p}`, boxShadow: `0 0 15px ${p}`,
        width: this.radius + 'px', height: this.radius + 'px'
    });
    this.spot.appendChild(this.ring);

    var core = document.createElement('div');
    var coreColor = this.whiteCore ? '#FFFFFF' : p;
    Object.assign(core.style, {
        position: 'absolute', width: '35%', height: '35%', borderRadius: '50%',
        backgroundColor: coreColor, top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', boxShadow: this.whiteCore ? '0 0 4px rgba(255,255,255,0.8)' : 'none'
    });
    this.ring.appendChild(core); // Core in den Ring legen
    
    // Hover triggert Ring-Animation
    this.spot.onmouseover = () => { this.ring.style.transform = 'translate(-50%, -50%) scale(1.2)'; };
    this.spot.onmouseout = () => { this.ring.style.transform = 'translate(-50%, -50%) scale(1.0)'; };
    document.body.appendChild(this.spot);

    this.card = document.createElement('div');
    this.card.className = 'info-card';
    Object.assign(this.card.style, {
        position: 'absolute', display: 'none', width: '280px',
        background: 'rgba(40, 40, 40, 0.6)', backdropFilter: 'blur(20px)', webkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        color: 'white', padding: '24px', borderRadius: '16px', fontFamily: "'Segoe UI', sans-serif", zIndex: '500'
    });

    // CLOSE BUTTON HAT RIESIGE HITBOX (40x40px)
    this.card.innerHTML = `
        <h3 id="hs-title" style="margin:0 0 8px; font-weight:600; font-size:18px;"></h3>
        <div id="hs-desc" style="margin:0 0 20px; font-size:14px; line-height:1.5; color:rgba(255,255,255,0.85)"></div>
        <button id="hs-btn" style="width:100%; padding:10px; border:none; border-radius:8px; font-weight:600; cursor:pointer; color:white; transition: filter 0.2s;"></button>
        <div id="close" style="position:absolute; top:5px; right:5px; width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:24px; opacity:0.6; color:white; transition: opacity 0.2s">&times;</div>
    `;
    document.body.appendChild(this.card);

    this.spot.onclick = (e) => { e.stopPropagation(); this.openCard(); };
    this.card.querySelector('#close').onclick = (e) => { e.stopPropagation(); this.closeCard(); };
    var btn = this.card.querySelector('#hs-btn');
    btn.onclick = (e) => { e.stopPropagation(); this.triggerAction(); };

    this.updateStyle();
    this.updateContent();
};

InfoHotspot.prototype.openCard = function() {
    this.app.fire('ui:card:opened', this);
    // Erzwingt Neuladen der Namen vor dem Aufklappen
    this.updateContent();
    this.card.style.display = 'block';
    this.update(); 
};

InfoHotspot.prototype.closeCard = function() { this.card.style.display = 'none'; };

InfoHotspot.prototype.triggerAction = function() {
    if (this.targetLevelId && this.targetLevelId.trim() !== "") {
        this.app.fire('level:switch', this.targetLevelId);
        this.closeCard();
    } else if (this.linkUrl && this.linkUrl.trim() !== "") {
        window.open(this.linkUrl, '_blank');
    }
};

InfoHotspot.prototype.updateStyle = function() {
    if(!this.spot || !this.card) return;
    var p = this.toCssColor(this.primaryColor);
    var s = this.toCssColor(this.secondaryColor);
    var t = this.toCssColor(this.textColor);

    this.ring.style.width = this.radius + 'px';
    this.ring.style.height = this.radius + 'px';
    this.ring.style.border = this.showBorder ? `2px solid ${p}` : 'none';
    this.ring.style.boxShadow = `0 0 15px ${p}`;
    
    if(this.ring.children[0]) {
        if (this.whiteCore) {
            this.ring.children[0].style.backgroundColor = '#FFFFFF';
            this.ring.children[0].style.boxShadow = '0 0 4px rgba(255,255,255,0.8)';
        } else {
            this.ring.children[0].style.backgroundColor = p;
            this.ring.children[0].style.boxShadow = 'none';
        }
    }

    this.card.querySelector('#hs-title').style.color = t;
    var btn = this.card.querySelector('#hs-btn');
    btn.style.background = `linear-gradient(135deg, ${p} 0%, ${s} 100%)`;
    btn.style.boxShadow = `0 4px 15px ${s.replace('rgb', 'rgba').replace(')', ', 0.3)')}`;
    
    if (this.sphereEntity && this.sphereEntity.model && this.sphereEntity.model.material) {
        this.sphereEntity.setLocalScale(this.vrScale, this.vrScale, this.vrScale);
        this.sphereEntity.model.material.diffuse = new pc.Color(this.primaryColor.r, this.primaryColor.g, this.primaryColor.b);
        this.sphereEntity.model.material.emissive = new pc.Color(this.primaryColor.r, this.primaryColor.g, this.primaryColor.b);
        this.sphereEntity.model.material.update();
    }
};

InfoHotspot.prototype.updateContent = function() {
    if(!this.card) return;
    
    var useEn = (this.currentLang === 'en');
    var t = (useEn && this.title_en && this.title_en.trim() !== '') ? this.title_en : this.title;
    var d = (useEn && this.description_en && this.description_en.trim() !== '') ? this.description_en : this.description;
    var b = (useEn && this.buttonText_en && this.buttonText_en.trim() !== '') ? this.buttonText_en : this.buttonText;
    
    var htmlDesc = d;
    
    if (this.sublevelIds && this.sublevelIds.length > 0) {
        var summaryText = useEn ? "Explore areas in this building" : "Hier findest du unter anderem";
        
        // INTERNER FALLBACK, falls ui.mjs die Daten nicht richtig freigegeben hat!
        var fallbackData = {
            'lemgo': { name_de: 'Innovation Campus Lemgo', name_en: 'Innovation Campus Lemgo' },
            'detmold': { name_de: 'Kreativ Campus Detmold', name_en: 'Kreativ Campus Detmold' },
            'innospin': { name_de: 'InnovationSPIN', name_en: 'InnovationSPIN' },
            'kio-innen-map-fusion': { name_de: 'KreativInstitut.OWL (KIO)', name_en: 'KreativInstitut.OWL (KIO)' },
            'mensa': { name_de: 'Mensa', name_en: 'Canteen' },
            'audimax': { name_de: 'Audimax', name_en: 'Auditorium' },
            'gebauede1': { name_de: 'Gebäude 1', name_en: 'Building 1' },
            'berufsfoerderzentrum': { name_de: 'Berufsförderzentrum', name_en: 'Vocational Training Center' },
            'pca': { name_de: 'Phoenix Contact Arena', name_en: 'Phoenix Contact Arena' },
            'smartfactory-innen': { name_de: 'SmartFactoryOWL', name_en: 'SmartFactoryOWL' },
            'smartfactory-innen-mit-licht': { name_de: 'SmartFactoryOWL', name_en: 'SmartFactoryOWL' },
            'fff-innen': { name_de: 'Future Food Factory', name_en: 'Future Food Factory' },
            'fff-labor-neu': { name_de: 'Future Food Factory (Labor)', name_en: 'Future Food Factory (Lab)' },
            'ciit': { name_de: 'CENTRUM INDUSTRIAL IT (CIIT)', name_en: 'CENTRUM INDUSTRIAL IT (CIIT)' },
            'ciit-citrus': { name_de: 'CIIT (Citrus)', name_en: 'CIIT (Citrus)' },
            'innospin-medienzentrum': { name_de: 'InnoSpin Medienzentrum', name_en: 'InnoSpin Media Center' },
            'fotostudio': { name_de: 'Fotostudio', name_en: 'Photo Studio' },
            'stereo-studio': { name_de: 'Stereo Studio', name_en: 'Stereo Studio' },
            'splat-studio-klein': { name_de: 'Kleines Studio', name_en: 'Small Studio' },
            'hoerraum': { name_de: 'Hörraum', name_en: 'Listening Room' },
            'surround-studio': { name_de: 'Surround Studio', name_en: 'Surround Studio' },
            'icl-bistro': { name_de: 'ICL Bistro', name_en: 'ICL Bistro' },
            'icl-ewerkstatt': { name_de: 'ICL E-Werkstatt', name_en: 'ICL E-Workshop' },
            'icl-fotostudio': { name_de: 'ICL Fotostudio', name_en: 'ICL Photo Studio' },
            'icl-sternwarte': { name_de: 'ICL Sternwarte', name_en: 'ICL Observatory' },
            'icl-sternwarte-rot': { name_de: 'ICL Sternwarte (Rotlicht)', name_en: 'ICL Observatory (Red light)' },
            'et-3et': { name_de: 'Elektrotechnik Labor (Ebene 3)', name_en: 'Electrical Engineering Lab (Level 3)' },
            'et-4et': { name_de: 'Elektrotechnik Labor (Ebene 4)', name_en: 'Electrical Engineering Lab (Level 4)' },
            'laufwege-map-fusion': { name_de: 'Laufwege', name_en: 'Walkways' },
            'laufwege-map-fusion-max-quality': { name_de: 'Laufwege', name_en: 'Walkways' },
            'icl-grosskueche-mensa': { name_de: 'ICL Großküche Mensa', name_en: 'ICL Canteen Kitchen' },
            'icl-holz-hauswirtschaft': { name_de: 'ICL Holz- & Hauswirtschaft', name_en: 'ICL Wood & Home Economics' },
            'icl-mac-raum': { name_de: 'ICL Mac-Raum', name_en: 'ICL Mac Room' },
            'icl-metallwerkstatt': { name_de: 'ICL Metallwerkstatt', name_en: 'ICL Metal Workshop' },
            'iku-owl-innen': { name_de: 'IKU.OWL', name_en: 'IKU.OWL' },
            'lemgo-max': { name_de: 'Lemgo Campus (Max Detail)', name_en: 'Lemgo Campus (Max Detail)' },
            'lernfabrik-innen': { name_de: 'Lernfabrik', name_en: 'Learning Factory' },
            'lt-2et': { name_de: 'LT 2. Etage', name_en: 'LT 2nd Floor' },
            'lt-eg': { name_de: 'LT Erdgeschoss', name_en: 'LT Ground Floor' }
        };
        
        var listHtml = '';
        for(var i = 0; i < this.sublevelIds.length; i++) {
            var lvlId = this.sublevelIds[i];
            
            // Nutze app.levelData, WENN ES EXISTIERT. Ansonsten unser internes Wörterbuch als Rettungsschirm!
            var lvlData = (this.app.levelData && this.app.levelData[lvlId]) ? this.app.levelData[lvlId] : fallbackData[lvlId];
            
            var lvlName = lvlId; 
            if (lvlData) {
                lvlName = useEn ? (lvlData.name_en || lvlData.name || lvlId) : (lvlData.name_de || lvlData.name || lvlId);
            }
            
            listHtml += `<button class="sublevel-btn" onclick="pc.app.fire('level:switch', '${lvlId}'); return false;">
                ➤ ${lvlName}
            </button>`;
        }
        
        htmlDesc += `
        <details class="sublevel-accordion">
            <summary>
                <span>${summaryText}</span>
                <span class="arrow-icon"></span>
            </summary>
            <div class="sublevel-list">
                ${listHtml}
            </div>
        </details>`;
    }

    this.card.querySelector('#hs-title').innerText = t;
    this.card.querySelector('#hs-desc').innerHTML = htmlDesc;
    var btn = this.card.querySelector('#hs-btn');
    btn.innerText = b;
    
    var hasAction = (this.targetLevelId || this.linkUrl);
    btn.style.display = hasAction ? 'block' : 'none';
};

InfoHotspot.prototype.onReveal = function() {
    if (!this.entity.enabled) return;
    this._revealed = true;
    var delayMs = this.baseDelay * 1000 + Math.random() * (this.randomWindow * 1000);
    setTimeout(() => {
        if(this.spot && this.entity.enabled) {
            this.spot.style.display = 'block';
            requestAnimationFrame(() => {
                this.spot.style.opacity = '1';
                this.spot.style.pointerEvents = 'auto'; 
            });
        }
    }, delayMs);
};

InfoHotspot.prototype.toCssColor = function(c) { return `rgb(${Math.floor(c.r*255)}, ${Math.floor(c.g*255)}, ${Math.floor(c.b*255)})`; };

InfoHotspot.prototype.hideDom = function() {
    if(this.spot) { this.spot.style.display = 'none'; this.spot.style.opacity = '0'; }
    if(this.card) { this.card.style.display = 'none'; }
    if(this.sphereEntity) { this.sphereEntity.enabled = false; }
};

InfoHotspot.prototype.prepareDom = function() {
    if(this.spot) { this.spot.style.display = 'none'; this.spot.style.opacity = '0'; }
};

InfoHotspot.prototype.onDestroy = function() {
    if(this.spot) this.spot.remove();
    if(this.card) this.card.remove();
    this.app.off('scene:reveal', this.onReveal, this);
    this.app.off('ui:toggleVisibility', this.onToggleVisibility, this);
    this.app.off('ui:card:opened', this.onOtherCardOpened, this);
    this.app.off('vr:trigger', this.onVrTrigger, this);
    this.app.off('lang:switch', this.onLangSwitch, this);
};

InfoHotspot.prototype.update = function() {
    if (!this._revealed) return;

    if (!this.entity.enabled || !this.spot || !this._globalVisible) {
        if (this.sphereEntity) this.sphereEntity.enabled = false; return;
    }
    if (this.spot.style.opacity === '0') {
        if (this.sphereEntity) this.sphereEntity.enabled = false; return;
    }
    if (this.app.xr && this.app.xr.active) {
        this.spot.style.display = 'none';
        if (this.card) this.card.style.display = 'none';
        if (this.sphereEntity && !this.sphereEntity.enabled) this.sphereEntity.enabled = true;
        return;
    }
    if (this.sphereEntity && this.sphereEntity.enabled) this.sphereEntity.enabled = false;
    
    var camera = this.app.root.findByName('Camera')?.camera;
    if (!camera) return;
    
    camera.worldToScreen(this.entity.getPosition(), this.vec);

    if (this.vec.z < 0) {
        this.spot.style.display = 'none';
        if(this.card.style.display === 'block') this.card.style.display = 'none';
    } else {
        this.spot.style.display = 'block';
        this.spot.style.left = this.vec.x + 'px';
        this.spot.style.top = this.vec.y + 'px';
        
        if(this.card.style.display === 'block') {
            var cW = this.card.offsetWidth || 328; 
            var cH = this.card.offsetHeight || 250;
            
            var tX = this.vec.x + 20;
            var tY = this.vec.y - 40;
            
            if (tX + cW > window.innerWidth) {
                tX = this.vec.x - cW - 20;
            }
            
            var safeTop = window.safeAreaInsets ? window.safeAreaInsets.top : 40;
            tX = Math.max(10, Math.min(tX, window.innerWidth - cW - 10));
            tY = Math.max(safeTop + 60, Math.min(tY, window.innerHeight - cH - 20));

            this.card.style.left = tX + 'px';
            this.card.style.top = tY + 'px';
        }
    }
};