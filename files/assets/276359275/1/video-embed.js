var VideoTexture = pc.createScript('videoTexture');

// --- VIDEO QUELLE ---
VideoTexture.attributes.add('videoAsset', {
    title: 'Video Asset',
    description: 'MP4 Datei (Upload)',
    type: 'asset'
});
VideoTexture.attributes.add('videoUrl', {
    title: 'Video Url',
    description: 'Link zur MP4 Datei (URL)',
    type: 'string'
});

// --- EINSTELLUNGEN ---
VideoTexture.attributes.add('playAudio', {
    title: 'Ton abspielen',
    type: 'boolean',
    default: false
});
VideoTexture.attributes.add('volume', {
    title: 'Lautstärke',
    type: 'number',
    default: 1,
    min: 0, max: 1
});
VideoTexture.attributes.add('cullBack', {
    title: 'Rückseite ausblenden',
    type: 'boolean',
    default: false 
});

// --- NEU: SKALIERUNG ---
VideoTexture.attributes.add('videoScale', {
    title: 'Größe (Skalierung)',
    description: 'Ändert die Größe proportional. 1 = 1 Meter Höhe.',
    type: 'number',
    default: 1,
    min: 0.1,
    max: 100
});

VideoTexture.prototype.initialize = function() {
    var app = this.app;
    var self = this;

    // 1. Video Element erstellen & global speichern
    this.videoDom = document.createElement('video');
    this.videoDom.loop = true;
    this.videoDom.crossOrigin = "anonymous";
    this.videoDom.playsInline = true; 
    
    // Ton initial
    this.updateAudio();

    // 2. Quelle setzen
    var src = this.videoAsset ? this.videoAsset.getFileUrl() : this.videoUrl;
    if (!src) return;
    this.videoDom.src = src;

    // 3. Event: Wenn Metadaten da sind -> Skalieren
    this.videoDom.addEventListener('loadedmetadata', function() {
        self.updateScale();
        self.tryPlay();
    });

    // 4. Textur erstellen
    this.videoTexture = new pc.Texture(app.graphicsDevice, {
        format: pc.PIXELFORMAT_R8_G8_B8,
        minFilter: pc.FILTER_LINEAR_MIPMAP_LINEAR,
        magFilter: pc.FILTER_LINEAR,
        addressU: pc.ADDRESS_CLAMP_TO_EDGE,
        addressV: pc.ADDRESS_CLAMP_TO_EDGE,
        mipmaps: true
    });
    this.videoTexture.setSource(this.videoDom);

    // 5. Material Setup
    this.updateMaterial();

    // iOS Workaround
    var style = this.videoDom.style;
    style.width = '1px'; style.height = '1px'; 
    style.position = 'absolute'; style.opacity = '0'; 
    style.zIndex = '-1000'; style.pointerEvents = 'none';
    document.body.appendChild(this.videoDom);

    // --- LIVE UPDATES IM EDITOR ---
    this.on('attr:videoScale', function() { this.updateScale(); }, this);
    this.on('attr:cullBack', function() { this.updateMaterial(); }, this);
    this.on('attr:volume', function() { this.updateAudio(); }, this);
    this.on('attr:playAudio', function() { this.updateAudio(); }, this);

    this.on('destroy', function() {
        if (this.videoTexture) this.videoTexture.destroy();
        this.videoDom.remove();
    }, this);
};

// --- HILFSFUNKTIONEN ---

VideoTexture.prototype.updateScale = function() {
    if (!this.videoDom || !this.videoDom.videoWidth) return;
    
    var w = this.videoDom.videoWidth;
    var h = this.videoDom.videoHeight;
    var ratio = w / h;
    
    // Wir nutzen 'videoScale' als Höhe (Z bei Plane)
    // Breite (X) ergibt sich aus Höhe * Ratio
    // Y (Dicke) lassen wir auf 1
    
    // Plane (gedreht 90° X): 
    // Local X = Breite
    // Local Y = Dicke (egal)
    // Local Z = Höhe
    this.entity.setLocalScale(this.videoScale * ratio, 1, this.videoScale);
};

VideoTexture.prototype.updateAudio = function() {
    if(!this.videoDom) return;
    if (this.playAudio) {
        this.videoDom.muted = false;
        this.videoDom.volume = this.volume;
    } else {
        this.videoDom.muted = true;
    }
};

VideoTexture.prototype.updateMaterial = function() {
    var meshInstances = this.entity.render ? this.entity.render.meshInstances : (this.entity.model ? this.entity.model.meshInstances : []);
    if (meshInstances.length > 0) {
        var material = meshInstances[0].material;
        
        // Textur neu binden (sicher ist sicher)
        if(this.videoTexture) {
            material.emissiveMap = this.videoTexture;
            material.emissive = new pc.Color(1,1,1);
            material.diffuse = new pc.Color(0,0,0);
        }
        
        // Culling Update
        if (this.cullBack) {
            material.cull = pc.CULLFACE_BACK; 
        } else {
            material.cull = pc.CULLFACE_NONE; 
        }
        
        material.update();
    }
};

VideoTexture.prototype.tryPlay = function() {
    var playPromise = this.videoDom.play();
    if (playPromise !== undefined) {
        playPromise.catch((error) => {
            console.warn("Autoplay blockiert. Warte auf Klick...");
            var unlock = () => {
                this.videoDom.play();
                window.removeEventListener('click', unlock);
                window.removeEventListener('touchstart', unlock);
            };
            window.addEventListener('click', unlock);
            window.addEventListener('touchstart', unlock);
        });
    }
};

VideoTexture.prototype.update = function(dt) {
    if (this.videoTexture) this.videoTexture.upload();
};