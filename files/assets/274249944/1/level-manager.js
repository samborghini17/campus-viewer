var COLLIDER_BASE = 'https://samborghini17.github.io/splat-host/Campus%20Collider%20Fertig/';
var COLLIDER_MAP = {
    'ciit-citrus': 'CIIT_Citrus.glb',
    'fff-innen': 'FFF_Innen.glb',
    'fff-labor-neu': 'FFF_Labor.glb',
    'audimax': 'ICL_Audimaxx.glb',
    'berufsfoerderzentrum': 'ICL_Berufsf%C3%B6rderungszentrum.glb',
    'icl-bistro': 'ICL_Bistro.glb',
    'ciit': 'ICL_CIIT_Innen.glb',
    'et-3et': 'ICL_ET_3ET.glb',
    'et-4et': 'ICL_ET_4ET.glb',
    'icl-ewerkstatt': 'ICL_EWerkstatt.glb',
    'icl-fotostudio': 'ICL_Fotostudio.glb',
    'gebauede1': 'ICL_Gebaeude_1.glb',
    'icl-grosskueche-mensa': 'ICL_Grosskueche_Mensa.glb',
    'icl-holz-hauswirtschaft': 'ICL_Holz_Hauswirtschaft.glb',
    'innospin': 'ICL_InnoSpin_Innen.glb',
    'lt-eg': 'ICL_LT_EG.glb',
    'icl-mac-raum': 'ICL_Mac_Raum.glb',
    'icl-metallwerkstatt': 'ICL_Metallwerkstatt.glb',
    'smartfactory-innen-mit-licht': 'ICL_SF_InnenmitLicht.glb',
    'icl-sternwarte': 'ICL_Sternwarte.glb',
    'innospin-medienzentrum': 'InnoSpin_Medienzentrum.glb',
    'lernfabrik-innen': 'Lernfabrik_Innen.glb',
    'iku-owl-innen': 'ikuOWL_Innen.glb'
};

var LevelManager = pc.createScript('levelManager');

LevelManager.attributes.add('mainSplatEntity', { type: 'entity', title: 'Main Splat Entity' });
LevelManager.attributes.add('envSplatEntity', { type: 'entity', title: 'Environment Splat (.sog)' });
LevelManager.attributes.add('hotspotDelay', { type: 'number', default: 2.0, title: 'Hotspot Delay (s)' });
LevelManager.attributes.add('levelFolders', { type: 'entity', array: true, title: 'Level Folders' });
LevelManager.attributes.add('collisionMeshes', { type: 'entity', array: true, title: 'Collision Meshes' });

// --- NEU: Kamera Speed Settings ---
LevelManager.attributes.add('outdoorSpeed', { type: 'number', default: 15, title: 'Outdoor Speed' });
LevelManager.attributes.add('outdoorFastSpeed', { type: 'number', default: 35, title: 'Outdoor Fast Speed (Shift)' });
LevelManager.attributes.add('indoorSpeed', { type: 'number', default: 0.4, title: 'Indoor Speed' });
LevelManager.attributes.add('indoorFastSpeed', { type: 'number', default: 1.2, title: 'Indoor Fast Speed (Shift)' });
LevelManager.attributes.add('defaultCullDistance', { type: 'number', default: 70, title: 'Default Indoor Cull Distance (m)' });

LevelManager.prototype.initialize = function() {
    this.cameraEntity = this.app.root.findByName('Camera');
    this.currentLevelId = 'lemgo'; 

    this.overlay = document.createElement('div');
    Object.assign(this.overlay.style, {
        position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: '#000000', opacity: '1', pointerEvents: 'auto', zIndex: '9999',
        transition: 'opacity 0.8s ease'
    });
    document.body.appendChild(this.overlay);

    this.app.systems.rigidbody.gravity.set(0, 0, 0);

    // Dynamic collision tracking
    this._dynamicColliderEntity = null;
    this._dynamicColliderAsset = null;
    this._collisionReady = false;

    this._debugMode = false;

    // Distance culling for indoor levels (DISABLED by default - enable via menu or K key)
    this._cullingEnabled = false;
    this._cullDistance = this.defaultCullDistance || 70;
    this._culledEntities = [];
    this._isIndoorLevel = false;

    this.levelConfig = [
        { 
            id: 'lemgo', 
            url: 'https://samborghini17.github.io/splat-host/lemgo-filter/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/lemgo-filter/environment.sog', 
            pos: [0, -75, 0], 
            rotation: [180, 0, 0], 
            cameraStart: [-52.89, 0.50, -101.36], 
            cameraStartRot: [-180, -28, -180], 
            mode: 'orbit', 
            collider: 'col_lemgo' 
        },
        { 
            id: 'detmold', 
            url: 'https://samborghini17.github.io/splat-host/detmold-v2/lod-meta.json', 
            envUrl: '', 
            splatPos: [0.00, -75.00, 0.00], 
            splatRot: [180, 0, 0], 
            cameraStart: [-160.28, 94.13, -195.46], 
            cameraStartRot: [160, -39, 180], 
            mode: 'orbit', 
            collider: 'Col_detmold' 
        },
        { 
            id: 'innospin', 
            url: 'https://samborghini17.github.io/splat-host/inno-spin/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/inno-spin/environment.sog', 
            splatPos: [-56.90, -1.90, -108.40], 
            splatRot: [-90, 25, 0], 
            cameraStart: [-53.03, 0.50, -101.08], 
            cameraStartRot: [165, -27, -180], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'kio-innen-map-fusion', 
            url: 'https://samborghini17.github.io/splat-host/kio-innen-map-fusion/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-innen-map-fusion/environment.sog', 
            splatPos: [0, 20, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [1.51, 16.26, 3.65],
            cameraStartRot: [178, 44, 180], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'audimax', 
            url: 'https://samborghini17.github.io/splat-host/audimax/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/audimax/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'berufsfoerderzentrum', 
            url: 'https://samborghini17.github.io/splat-host/berufsfoerderzentrum/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/berufsfoerderzentrum/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0.44, 1.10, -0.36], 
            cameraStartRot: [-14, -84, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'ciit-citrus', 
            url: 'https://samborghini17.github.io/splat-host/ciit-citrus/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/ciit-citrus/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'ciit', 
            url: 'https://samborghini17.github.io/splat-host/ciit/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/ciit/environment.sog', 
            splatPos: [0.00, 0.00, 0.00], 
            splatRot: [-88, 1.5, 1.5], 
            cameraStart: [3.34, 0.50, 0.19], 
            cameraStartRot: [175, -90, 180], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'et-3et', 
            url: 'https://samborghini17.github.io/splat-host/et-3et/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/et-3et/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'et-4et', 
            url: 'https://samborghini17.github.io/splat-host/et-4et/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/et-4et/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'fff-labor-neu', 
            url: 'https://samborghini17.github.io/splat-host/fff-labor-neu/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/fff-labor-neu/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'icl-bistro', 
            url: 'https://samborghini17.github.io/splat-host/icl-bistro/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/icl-bistro/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'icl-ewerkstatt', 
            url: 'https://samborghini17.github.io/splat-host/icl-ewerkstatt/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/icl-ewerkstatt/environment.sog', 
            splatPos: [0.00, 0.00, 0.00], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0.21, 1.27, 9.31], 
            cameraStartRot: [-2, 28, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'gebauede1', 
            url: 'https://samborghini17.github.io/splat-host/gebauede1/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/gebauede1/environment.sog', 
            splatPos: [1.00, 1.60, -100.00], 
            splatRot: [-90, 1, 1], 
            cameraStart: [32.00, 2.10, -118.05], 
            cameraStartRot: [-6, 45, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'icl-fotostudio', 
            url: 'https://samborghini17.github.io/splat-host/icl-fotostudio/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/icl-fotostudio/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'mensa', 
            url: 'https://samborghini17.github.io/splat-host/mensa/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/mensa/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'innospin-medienzentrum', 
            url: 'https://samborghini17.github.io/splat-host/innospin-medienzentrum/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/innospin-medienzentrum/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [-9.42, 1.32, 10.73],
            cameraStartRot: [-16, -53, -0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'smartfactory-innen-mit-licht', 
            url: 'https://samborghini17.github.io/splat-host/smartfactory-innen-mit-licht/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/smartfactory-innen-mit-licht/environment.sog', 
            splatPos: [0.00, 0.00, 0.00], 
            splatRot: [-90, 0, 0], 
            cameraStart: [-12.23, 1.51, -6.43], 
            cameraStartRot: [169, -20, -180], 
            mode: 'fly', 
            collider: null
        },
        { 
            id: 'smartfactory-innen', 
            url: 'https://samborghini17.github.io/splat-host/smartfactory-innen/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/smartfactory-innen/environment.sog', 
            splatPos: [0.00, 0.00, 0.00], 
            splatRot: [-90, 0, 0], 
            cameraStart: [-12.40, 1.55, -6.54], 
            cameraStartRot: [179, -19, -180], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'pca', 
            url: 'https://samborghini17.github.io/splat-host/pca/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/pca/environment.sog', 
            splatPos: [0.00, 0.00, 0.00], 
            splatRot: [-90, 0, 0], 
            cameraStart: [-34.66, 0.50, 60.23], 
            cameraStartRot: [180, -85, -180], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'fff-innen', 
            url: 'https://samborghini17.github.io/splat-host/fff-innen/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/fff-innen/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'icl-sternwarte', 
            url: 'https://samborghini17.github.io/splat-host/icl-sternwarte/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/icl-sternwarte/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'icl-sternwarte-rot', 
            url: 'https://samborghini17.github.io/splat-host/icl-sternwarte-rot/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/icl-sternwarte-rot/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'laufwege-map-fusion', 
            url: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'laufwege-map-fusion-max-quality-1', 
            url: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion-max-quality/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [-1.36, 1.44, -6.66],
            cameraStartRot: [-6, -82, 0],
            mode: 'fly', 
            collider: null 
        },
         { 
            id: 'laufwege-map-fusion-max-quality-2', 
            url: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion-max-quality/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [139.80, 0.50, -20.63],
            cameraStartRot: [-10, -6, 0], 
            mode: 'fly', 
            collider: null 
        },
         { 
            id: 'laufwege-map-fusion-max-quality-3', 
            url: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion-max-quality/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [431.59, 0.50, 161.30],
            cameraStartRot: [-28, 84, 0], 
            mode: 'fly', 
            collider: null 
        },
         { 
            id: 'laufwege-map-fusion-max-quality-4', 
            url: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion-max-quality/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [418.31, 0.50, -171.15],
            cameraStartRot: [166, 72, 180], 
            mode: 'fly', 
            collider: null 
        },
         { 
            id: 'laufwege-map-fusion-max-quality-5', 
            url: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion-max-quality/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [170.86, 0.50, -365.24],
            cameraStartRot: [179, -3, 180],
            mode: 'fly', 
            collider: null 
        },
         { 
            id: 'laufwege-map-fusion-max-quality-6', 
            url: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion-max-quality/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/laufwege-map-fusion/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [-41.60, 3.73, -224.48],
            cameraStartRot: [-1, -74, -0], 
            mode: 'fly', 
            collider: null 
        },
        // --- AB HIER: NEUE ORDNEREINTRÄGE AUS DEM SCREENSHOT ---
        { 
            id: 'icl-grosskueche-mensa', 
            url: 'https://samborghini17.github.io/splat-host/icl-grosskueche-mensa/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/icl-grosskueche-mensa/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0.00, 1.70, 0.00],
            cameraStartRot: [170, 9, 180], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'icl-holz-hauswirtschaft', 
            url: 'https://samborghini17.github.io/splat-host/icl-holz-hauswirtschaft/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/icl-holz-hauswirtschaft/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'icl-mac-raum', 
            url: 'https://samborghini17.github.io/splat-host/icl-mac-raum/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/icl-mac-raum/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'icl-metallwerkstatt', 
            url: 'https://samborghini17.github.io/splat-host/icl-metallwerkstatt/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/icl-metallwerkstatt/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [-0.39, 1.38, -0.42],
            cameraStartRot: [179, -10, 180],
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'iku-owl-innen', 
            url: 'https://samborghini17.github.io/splat-host/iku-owl-innen/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/iku-owl-innen/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0.37, 1.15, 6.46],
            cameraStartRot: [-178, -21, -180], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'lemgo-max', 
            url: 'https://samborghini17.github.io/splat-host/lemgo-max/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/lemgo-max/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'lernfabrik-innen', 
            url: 'https://samborghini17.github.io/splat-host/lernfabrik-innen/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/lernfabrik-innen/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'lt-2et', 
            url: 'https://samborghini17.github.io/splat-host/lt-2et/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/lt-2et/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'lt-eg', 
            url: 'https://samborghini17.github.io/splat-host/lt-eg/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/lt-eg/environment.sog', 
            splatPos: [0, 0, 0], 
            splatRot: [-90, 0, 0], 
            cameraStart: [0, 1.7, 0], 
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'Bibliothek', 
            url: 'https://samborghini17.github.io/splat-host/gebauede1/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/gebauede1/environment.sog', 
            splatPos: [1.00, 1.60, -100.00], 
            splatRot: [-90, 1, 1], 
            cameraStart: [0.60, 2.77, -99.23],
            cameraStartRot: [-179, 32, 180],
            mode: 'fly', 
            collider: null 
        },
        { 
            id: 'audiolab-1', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/audiolab-1/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/audiolab-1/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'audiolab-2', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/audiolab-2/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/audiolab-2/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'buero-alex', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-alex/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-alex/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'buero-cindy', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-cindy/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-cindy/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'buero-guido', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-guido/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-guido/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'buero-jan-p', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-jan-p/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-jan-p/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'buero-jan-w', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-jan-w/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-jan-w/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'buero-kcd', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-kcd/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-kcd/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'buero-marek', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-marek/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/buero-marek/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'encoding-lab', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/encoding-lab/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/encoding-lab/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'guardian-buero', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/guardian-buero/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/guardian-buero/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'hfm-buero', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/hfm-buero/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/hfm-buero/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'konferenzraum-gross', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/konferenzraum-gross/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/konferenzraum-gross/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'konferenzraum-klein', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/konferenzraum-klein/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/konferenzraum-klein/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'kueche-2', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/kueche-2/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/kueche-2/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'kueche-3', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/kueche-3/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/kueche-3/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'scanning-lab', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/scanning-lab/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/scanning-lab/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'upb-buero-klavier', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/upb-buero-klavier/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/upb-buero-klavier/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'upb-buero', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/upb-buero/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/upb-buero/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
        { 
            id: 'videostudio-xl-mp', 
            url: 'https://samborghini17.github.io/splat-host/kio-indoor/videostudio-xl-mp/lod-meta.json', 
            envUrl: 'https://samborghini17.github.io/splat-host/kio-indoor/videostudio-xl-mp/environment.sog', 
            splatPos: [0, 0, 0], splatRot: [-90, 0, 0], cameraStart: [0, 1.7, 0], mode: 'fly', collider: null 
        },
    ];

    this.currentContent = null;
    this.currentCollider = null;
    
    if (this.envSplatEntity) this.envSplatEntity.enabled = false;
    
    this.app.on('level:switch', this.switchLevel, this);
    this.app.on('camera:reset', this.resetCamera, this);

    if (this.levelFolders) this.levelFolders.forEach(e => { if(e) e.enabled = false; });
    if (this.collisionMeshes) this.collisionMeshes.forEach(e => { if(e) e.enabled = false; });

    if (!this.mainSplatEntity) return console.error("Main Splat Entity fehlt!");

    // Debug Mode: Press 'P' to copy position, press 'C' to toggle collider visibility
    // Screenshot: Press 'F2' to take a screenshot
    this.app.keyboard.on(pc.EVENT_KEYDOWN, function(e) {
        if (e.key === pc.KEY_P) {
            this._debugMode = !this._debugMode;
            // Log + copy current position
            var cam = this.cameraEntity;
            var playerRig = this.app.root.findByName('Character_Controller');
            var pos = playerRig ? playerRig.getPosition() : (cam ? cam.getPosition() : new pc.Vec3());
            var rot = cam ? cam.getLocalEulerAngles() : new pc.Vec3();
            var posStr = '[' + pos.x.toFixed(2) + ', ' + pos.y.toFixed(2) + ', ' + pos.z.toFixed(2) + ']';
            var rotStr = '[' + rot.x.toFixed(0) + ', ' + rot.y.toFixed(0) + ', ' + rot.z.toFixed(0) + ']';
            console.log('%c[Debug] Position: ' + posStr + ' Rotation: ' + rotStr, 'color: #00ff88; font-weight: bold;');
            if (navigator.clipboard) {
                navigator.clipboard.writeText('cameraStart: ' + posStr + ',\ncameraStartRot: ' + rotStr + ',');
                console.log('[Debug] Position copied to clipboard!');
            }
            console.log('[DebugMode] ' + (this._debugMode ? 'ON' : 'OFF'));
        }
        
        if (e.key === pc.KEY_C && this._dynamicColliderEntity && this._dynamicColliderEntity.render) {
            this._dynamicColliderEntity.render.enabled = !this._dynamicColliderEntity.render.enabled;
            console.log('[Collision] Visibility toggled to:', this._dynamicColliderEntity.render.enabled);
        }

        // Toggle culling with 'K'
        if (e.key === pc.KEY_K) {
            this._cullingEnabled = !this._cullingEnabled;
            console.log('[Culling] ' + (this._cullingEnabled ? 'ENABLED' : 'DISABLED'));
            if (!this._cullingEnabled) {
                // Show everything when culling is disabled
                this._showAllCulled();
            }
        }

        // Screenshot with F2
        if (e.key === pc.KEY_F2) {
            this._takeScreenshot();
        }
    }, this);

    // Culling toggle from UI
    this.app.on('culling:toggle', function(enabled) {
        this._cullingEnabled = enabled;
        if (!enabled) this._showAllCulled();
    }, this);
    this.app.on('culling:setDistance', function(dist) {
        this._cullDistance = dist;
    }, this);

    // Screenshot event from UI
    this.app.on('screenshot:take', function() {
        this._takeScreenshot();
    }, this);

    // Adaptive quality event from UI
    this._adaptiveQuality = false;
    this._adaptiveTarget = 30; // target FPS
    this._adaptiveTimer = 0;
    this.app.on('quality:adaptive:toggle', function(enabled) {
        this._adaptiveQuality = enabled;
        console.log('[Quality] Adaptive:', enabled);
    }, this);

    this.loadLevel('lemgo', true);
};

LevelManager.prototype.getEntityByName = function(list, name) {
    if (!list) return null;
    return list.find(function(e) { return e && e.name === name; });
};

LevelManager.prototype.getColliderByName = function(name) {
    if (!this.collisionMeshes || !name) return null;
    return this.collisionMeshes.find(function(entity) { return entity && entity.name === name; });
};

LevelManager.prototype.getConfigById = function(id) {
    return this.levelConfig.find(function(level) { return level.id === id; });
};

LevelManager.prototype.resetCamera = function(hasCollider) {
    var data = this.getConfigById(this.currentLevelId);
    if (!data) return;

    var startPos = data.cameraStart ? new pc.Vec3(data.cameraStart[0], data.cameraStart[1], data.cameraStart[2]) : new pc.Vec3(0, 1.6, 0);
    var startRot = null;
    if (data.cameraStartRot) {
        startRot = new pc.Vec3(data.cameraStartRot[0], data.cameraStartRot[1], data.cameraStartRot[2]);
    } else if (data.mode === 'fly') {
        startRot = new pc.Vec3(0, 0, 0);
    }

    var playerRig = this.app.root.findByName('Character_Controller');
    var controls = this.cameraEntity.script.cameraControls;

    if (data.mode === 'orbit' || !hasCollider) {
        if (playerRig) {
            playerRig.setPosition(startPos);
            if (startRot) playerRig.setEulerAngles(0, startRot.y, 0);
        }
        
        this.cameraEntity.setLocalPosition(0,0,0);
        if (startRot) this.cameraEntity.setLocalEulerAngles(startRot.x, 0, startRot.z);

        if (controls) {
            if (controls._pose) {
                controls._pose.position.copy(startPos);
                if (startRot) controls._pose.angles.copy(startRot);
            }
            if (controls._controller) {
                controls._controller.detach();
                controls._controller.attach(controls._pose);
            }
        }
    } else {
        // WALK MODE: Teleport via rigidbody for physics-based placement
        console.log('[ResetCam] WALK teleport to:', startPos.toString(), 'rot:', startRot ? startRot.toString() : 'none');
        if (playerRig && playerRig.rigidbody) {
            playerRig.rigidbody.linearVelocity = pc.Vec3.ZERO;
            playerRig.rigidbody.angularVelocity = pc.Vec3.ZERO;
            playerRig.rigidbody.teleport(startPos.x, startPos.y, startPos.z);
            playerRig.rigidbody.activate();
        }
        
        this.cameraEntity.setLocalPosition(0, 0, 0);
        
        var charCtrl = playerRig ? playerRig.script['character-controller'] : null;
        if (charCtrl && charCtrl.setStartRotation && startRot) {
            charCtrl.setStartRotation(startRot);
        }

        // Failsafe: re-teleport after a frame to counter Ammo.js init glitches
        var self = this;
        setTimeout(function() {
            if (playerRig && playerRig.rigidbody) {
                playerRig.rigidbody.linearVelocity = pc.Vec3.ZERO;
                playerRig.rigidbody.angularVelocity = pc.Vec3.ZERO;
                playerRig.rigidbody.teleport(startPos.x, startPos.y, startPos.z);
                playerRig.rigidbody.activate();
                console.log('[ResetCam] Failsafe re-teleport to:', startPos.toString());
            }
        }, 100);
    }
};

// --- DYNAMIC COLLISION METHODS ---

LevelManager.prototype.destroyDynamicCollider = function() {
    if (this._dynamicColliderEntity) {
        this._dynamicColliderEntity.destroy();
        this._dynamicColliderEntity = null;
    }
    if (this._dynamicColliderAsset) {
        this._dynamicColliderAsset.unload();
        this.app.assets.remove(this._dynamicColliderAsset);
        this._dynamicColliderAsset = null;
    }
    this._collisionReady = false;
    // Reset gravity when no collision
    this.app.systems.rigidbody.gravity.set(0, 0, 0);
};

LevelManager.prototype.loadCollisionFromUrl = function(levelId, splatPos, splatRot, callback) {
    var self = this;
    var glbFile = COLLIDER_MAP[levelId];
    if (!glbFile) {
        console.log('[Collision] No collision mesh mapped for: ' + levelId);
        if (callback) callback(false);
        return;
    }

    var url = COLLIDER_BASE + glbFile;
    console.log('[Collision] Loading: ' + url);

    var asset = new pc.Asset('Collider_' + levelId, 'container', { url: url });
    this._dynamicColliderAsset = asset;
    this.app.assets.add(asset);
    this.app.assets.load(asset);

    asset.ready(function(containerAsset) {
        // Check we haven't switched levels during load
        if (self._dynamicColliderAsset !== containerAsset) return;

        var renders = containerAsset.resource.renders;
        if (!renders || renders.length === 0) {
            console.warn('[Collision] No render assets in GLB: ' + glbFile);
            if (callback) callback(false);
            return;
        }

        var entity = new pc.Entity('DynamicCollider_' + levelId);

        // Add render component but HIDE it — collision meshes are invisible boundaries
        entity.addComponent('render', {
            type: 'asset',
            asset: renders[0],
            castShadows: false,
            receiveShadows: false
        });
        entity.render.enabled = false;

        // The collision meshes are already aligned to world origin (0,0,0) with pre-baked rotations
        // in Blender. So we do NOT apply splatPos/splatRot to them to avoid double-transformation!
        entity.setLocalPosition(0, 0, 0);
        entity.setLocalEulerAngles(0, 0, 0);

        // Add collision component (mesh type)
        entity.addComponent('collision', {
            type: 'mesh',
            renderAsset: renders[0]
        });

        // Add static rigidbody
        entity.addComponent('rigidbody', {
            type: 'static',
            friction: 0.7,
            restitution: 0.1
        });

        self.app.root.addChild(entity);
        self._dynamicColliderEntity = entity;
        self._collisionReady = true;

        console.log('[Collision] Entity pos:', entity.getPosition().toString());
        console.log('[Collision] Entity rot:', entity.getEulerAngles().toString());
        console.log('[Collision] Ready: ' + levelId + ' (waiting for physics settle)');

        // Wait for Ammo.js to register the new body before placing the player
        setTimeout(function() {
            console.log('[Collision] Physics settled, activating player');
            if (callback) callback(true);
        }, 800);
    });

    asset.on('error', function(err) {
        console.error('[Collision] Failed to load ' + glbFile + ':', err);
        if (callback) callback(false);
    });
};

// --- LEVEL LOADING ---

LevelManager.prototype.loadLevel = function(id, isStart) {
    var self = this;
    var data = this.getConfigById(id);
    if(!data) return;

    this.currentLevelId = id; 

    // --- Content folders (legacy) ---
    var contentFolder = this.getEntityByName(this.levelFolders, id);
    if (this.currentContent) this.currentContent.enabled = false; 
    this.currentContent = contentFolder;

    // --- Destroy previous dynamic collision ---
    this.destroyDynamicCollider();

    // --- Clear any culled entities from previous level ---
    this._showAllCulled();

    // --- Legacy static colliders (fallback) ---
    var colliderEntity = this.getColliderByName(data.collider); 
    if (this.currentCollider) this.currentCollider.enabled = false;
    this.currentCollider = colliderEntity;
    if (this.currentCollider) this.currentCollider.enabled = true;

    // --- Splat loading (unchanged) ---
    var splatScript = this.mainSplatEntity.script.streamedGsplat;
    var revealScript = this.mainSplatEntity.script.gsplatRevealRadial;

    var sp = data.splatPos || data.pos; 
    var sr = data.splatRot || data.rotation;

    if (splatScript && (!isStart || id !== 'lemgo')) {
        try {
            splatScript.replaceSplat(data.url);
        } catch (e) {
            console.error('[LevelMgr] Failed to replace main splat:', e);
        }
    }
    if (sr) this.mainSplatEntity.setLocalEulerAngles(sr[0], sr[1], sr[2]);
    if (sp) this.mainSplatEntity.setLocalPosition(sp[0], sp[1], sp[2]);
    this.mainSplatEntity.syncHierarchy(); 

    if (this.envSplatEntity && this.envSplatEntity.script && this.envSplatEntity.script.streamedGsplat) {
        if (data.envUrl) {
            if (isStart && id === 'lemgo') {
                console.log('[LevelMgr] Skipping env splat for initial lemgo');
            } else {
                this.envSplatEntity.enabled = true;
                
                if (sr) this.envSplatEntity.setLocalEulerAngles(sr[0], sr[1], sr[2]);
                if (sp) this.envSplatEntity.setLocalPosition(sp[0], sp[1], sp[2]);
                this.envSplatEntity.syncHierarchy();

                var envScript = this.envSplatEntity.script.streamedGsplat;
                setTimeout(function() {
                    try {
                        if (typeof envScript.replaceSplat === 'function') {
                            envScript.replaceSplat(data.envUrl);
                        } else {
                            envScript.splatUrl = data.envUrl;
                        }
                    } catch (e) {
                        console.error('[LevelMgr] Failed to replace environment splat:', e);
                    }
                }, 100);
            }
        } else {
            this.envSplatEntity.enabled = false; 
        }
    }

    if (revealScript) {
        var camStart = data.cameraStart ? 
             new pc.Vec3(data.cameraStart[0], data.cameraStart[1], data.cameraStart[2]) : new pc.Vec3(0,0,0);

        if (id === 'lemgo') {
             revealScript.restart(camStart);
        } else {
             var localPos = new pc.Vec3();
             var w2l = this.mainSplatEntity.getWorldTransform().clone().invert();
             w2l.transformPoint(camStart, localPos);
             revealScript.restart(localPos);
        }
    }

    // --- Dynamic collision loading ---
    try {
        var hasLegacyCollider = (data.collider != null && colliderEntity != null);
        var hasDynamicCollider = COLLIDER_MAP.hasOwnProperty(id);

        if (hasDynamicCollider && !hasLegacyCollider) {
            // Start in fly mode while collision loads
            this.setCameraMode(data.mode, data.bounds, false);
            this.resetCamera(false);

            this.loadCollisionFromUrl(id, sp, sr, function(success) {
                if (success && self.currentLevelId === id) {
                    // Collision loaded + physics settled - now enable walking
                    try {
                        self.setCameraMode(data.mode, data.bounds, true);
                        // Teleport player to start AFTER gravity is on
                        self.resetCamera(true);
                    } catch (e) {
                        console.error('[LevelMgr] Error setting camera mode after collision load:', e);
                    }
                    console.log('[Collision] Player placed, gravity active');
                }
                // Reveal scene
                self._finishReveal(isStart);
            });
        } else {
            // Legacy collider or no collider at all
            this.setCameraMode(data.mode, data.bounds, hasLegacyCollider);
            this.resetCamera(hasLegacyCollider);
            this._finishReveal(isStart);
        }
    } catch (e) {
        console.error('[LevelMgr] Critical error in loadLevel logic:', e);
        this._finishReveal(isStart); // Failsafe reveal
    }
}

LevelManager.prototype._finishReveal = function(isStart) {
    var self = this;
    setTimeout(function() {
        self.overlay.style.opacity = '0';
        self.overlay.style.pointerEvents = 'none';
        if (self.currentContent) self.currentContent.enabled = true;
        setTimeout(function() { self.app.fire('scene:reveal'); }, self.hotspotDelay * 1000);
    }, isStart ? 200 : 1000);
};

LevelManager.prototype._setCharControllerActive = function(playerRig, active) {
    if (!playerRig || !playerRig.script) return;
    var scripts = ['character-controller', 'desktopInput', 'mobileInput', 'gamePadInput'];
    for (var i = 0; i < scripts.length; i++) {
        var s = playerRig.script[scripts[i]];
        if (s) s.enabled = active;
    }
    console.log('[LevelMgr] Character controller scripts ' + (active ? 'ENABLED' : 'DISABLED'));
};

LevelManager.prototype.setCameraMode = function(mode, bounds, hasCollider) {
    var controls = this.cameraEntity.script.cameraControls;
    var flyCam = this.cameraEntity.script.universalFlyCam; 
    var playerRig = this.app.root.findByName('Character_Controller');

    if (controls && controls.setBounds) {
        if (bounds && bounds.length === 6) {
            controls.setBounds([bounds[0], bounds[1], bounds[2]], [bounds[3], bounds[4], bounds[5]]);
        } else {
            controls.setBounds(null, null);
        }
    }

    var canvas = this.app.graphicsDevice.canvas;

    if (mode === 'orbit') {
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
            playerRig.rigidbody.activate();
        }
        if (playerRig && playerRig.collision) {
            playerRig.collision.enabled = true;
        }

        if (playerRig && playerRig.script && playerRig.script['character-controller']) {
            var charCtrl = playerRig.script['character-controller'];
            charCtrl.speed = this.indoorSpeed;
            charCtrl.fastSpeed = this.indoorFastSpeed;
            charCtrl.gravityEnabled = hasCollider; // Fly freely if no collider
            
            if (hasCollider) {
                this.app.systems.rigidbody.gravity.set(0, -9.81, 0);
            } else {
                this.app.systems.rigidbody.gravity.set(0, 0, 0);
            }
        }
    }
};

LevelManager.prototype.switchLevel = function(id) {
    var self = this;
    this.overlay.style.opacity = '1';
    this.overlay.style.pointerEvents = 'auto';
    setTimeout(function() { self.loadLevel(id, false); }, 800);
};

// --- SCREENSHOT MODE ---

LevelManager.prototype._takeScreenshot = function() {
    var self = this;
    // Hide all UI
    var uiElements = document.querySelectorAll('#gsplat-controls, #poi-sidebar, .aeroglass-panel, #fps-crosshair, #fps-hint, #debug-hud');
    var visibility = [];
    uiElements.forEach(function(el) {
        visibility.push(el.style.display);
        el.style.display = 'none';
    });

    // Wait a frame for UI to hide, then capture
    setTimeout(function() {
        var canvas = self.app.graphicsDevice.canvas;
        try {
            var dataUrl = canvas.toDataURL('image/png');
            var link = document.createElement('a');
            link.download = 'campus-viewer-' + self.currentLevelId + '-' + Date.now() + '.png';
            link.href = dataUrl;
            link.click();
            console.log('[Screenshot] Saved!');
        } catch (e) {
            console.error('[Screenshot] Failed:', e);
        }
        // Restore UI
        uiElements.forEach(function(el, i) {
            el.style.display = visibility[i];
        });
    }, 100);
};

// --- ADAPTIVE QUALITY ---
// Monitors FPS and adjusts LOD distance to maintain target framerate

LevelManager.prototype._updateAdaptiveQuality = function(dt) {
    if (!this._adaptiveQuality) return;
    this._adaptiveTimer += dt;
    if (this._adaptiveTimer < 1.0) return; // Check once per second
    this._adaptiveTimer = 0;

    var fps = 1.0 / dt;
    var splatScript = this.mainSplatEntity ? this.mainSplatEntity.script.streamedGsplat : null;
    if (!splatScript) return;

    var currentLod = splatScript.lodBaseDistance || 10;
    if (fps < this._adaptiveTarget - 5) {
        // FPS too low: reduce quality (lower LOD distance)
        var newLod = Math.max(2, currentLod * 0.85);
        splatScript.lodBaseDistance = newLod;
        console.log('[Adaptive] FPS:', fps.toFixed(0), '→ LOD reduced to:', newLod.toFixed(1));
    } else if (fps > this._adaptiveTarget + 10 && currentLod < 25) {
        // FPS has headroom: increase quality
        var newLod = Math.min(25, currentLod * 1.1);
        splatScript.lodBaseDistance = newLod;
        console.log('[Adaptive] FPS:', fps.toFixed(0), '→ LOD increased to:', newLod.toFixed(1));
    }
};

// --- DISTANCE CULLING FOR INDOOR LEVELS ---

LevelManager.prototype._showAllCulled = function() {
    // Re-show any entities that were culled
    this._culledEntities.forEach(function(e) {
        if (e && !e._destroyed) e.enabled = true;
    });
    this._culledEntities = [];
};

LevelManager.prototype._isOutdoorLevel = function(levelId) {
    return levelId === 'lemgo' || levelId === 'detmold' || levelId === 'lemgo-max';
};

LevelManager.prototype.update = function(dt) {
    // Adaptive quality monitoring
    this._updateAdaptiveQuality(dt);

    // Orbit mode: switch cursor between grab/grabbing on mousedown
    if (this.currentLevelId) {
        var data = this.getConfigById(this.currentLevelId);
        if (data && data.mode === 'orbit') {
            var canvas = this.app.graphicsDevice.canvas;
            if (this.app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
                canvas.style.cursor = 'grabbing';
            } else {
                canvas.style.cursor = 'grab';
            }
        }
    }

    // Distance culling - only for indoor levels, disabled by default
    if (!this._cullingEnabled || this._isOutdoorLevel(this.currentLevelId)) return;
    
    var data = this.getConfigById(this.currentLevelId);
    if (!data || data.mode === 'orbit') return; // Skip outdoor/orbit modes
    
    var cam = this.cameraEntity;
    if (!cam) return;
    var camPos = cam.getPosition();
    var cullDistSq = this._cullDistance * this._cullDistance;
    
    // Cull gsplat children based on squared distance (performance)
    if (this.mainSplatEntity) {
        var children = this.mainSplatEntity.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (!child || !child.gsplat) continue;
            var childPos = child.getPosition();
            var dx = camPos.x - childPos.x;
            var dy = camPos.y - childPos.y;
            var dz = camPos.z - childPos.z;
            var distSq = dx * dx + dy * dy + dz * dz;
            if (distSq > cullDistSq) {
                if (child.enabled) {
                    child.enabled = false;
                    if (this._culledEntities.indexOf(child) === -1) {
                        this._culledEntities.push(child);
                    }
                }
            } else {
                if (!child.enabled) {
                    child.enabled = true;
                    var idx = this._culledEntities.indexOf(child);
                    if (idx !== -1) this._culledEntities.splice(idx, 1);
                }
            }
        }
    }
};