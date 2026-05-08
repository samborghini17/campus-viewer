import { Script, platform, Asset, Entity } from '../../playcanvas-stable.min.mjs';

function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
class StreamedGsplat extends Script {
    initialize() {
        const app = this.app;
        this.isMobile = platform.mobile || window.innerWidth < 600;
        this._currentPreset = this.isMobile ? 'mob-low' : 'medium';
        if (app.scene.gsplat) {
            app.scene.gsplat.radialSorting = true;
            app.scene.gsplat.lodUpdateAngle = 90;
            app.scene.gsplat.lodBehindPenalty = 0.5;
            app.scene.gsplat.lodUpdateDistance = 1;
            app.scene.gsplat.lodUnderfillLimit = 10;
        }
        app.on('preset:ultra', ()=>this._setPreset('ultra'), this);
        app.on('preset:high', ()=>this._setPreset('high'), this);
        app.on('preset:medium', ()=>this._setPreset('medium'), this);
        app.on('preset:low', ()=>this._setPreset('low'), this);
        // Neue Mobile Presets
        app.on('preset:mob-med', ()=>this._setPreset('mob-med'), this);
        app.on('preset:mob-low', ()=>this._setPreset('mob-low'), this);
        app.on('colorize:toggle', this._toggleColorize, this);
        this._applyResolution();
        if (this.splatUrl) this.loadSplat(this.splatUrl, false);
        if (this.environmentUrl && this.environmentUrl !== this.splatUrl) this.loadSplat(this.environmentUrl, true);
        this.once('destroy', ()=>this.onDestroy());
    }
    loadSplat(url, isChild) {
        if (!url) return;
        const asset = new Asset(isChild ? 'Env_Asset' : 'Main_Asset', 'gsplat', {
            url: url
        });
        this.app.assets.add(asset);
        this.app.assets.load(asset);
        this._assets.push(asset);
        asset.ready((a)=>{
            if (!this.entity || !this.entity.enabled) return;
            let targetEntity = this.entity;
            if (isChild) {
                targetEntity = new Entity('EnvironmentGsplat');
                this.entity.addChild(targetEntity);
                this._children.push(targetEntity);
            } else {
                if (this.entity.gsplat) this.entity.removeComponent('gsplat');
            }
            targetEntity.addComponent('gsplat', {
                unified: true,
                asset: a
            });
            this._applyPreset();
        });
    }
    _getCurrentLod() {
        // MOBILE OVERRIDE: Echte LOD-Entfernungen statt Pixelierung
        if (this._currentPreset === 'mob-med') return {
            base: 10.0,
            mult: 2.0
        };
        if (this._currentPreset === 'mob-low') return {
            base: 5.0,
            mult: 1.5
        };
        switch(this._currentPreset){
            case 'ultra':
                return {
                    base: this.ultraLodBaseDistance,
                    mult: this.ultraLodMultiplier
                };
            case 'high':
                return {
                    base: this.highLodBaseDistance,
                    mult: this.highLodMultiplier
                };
            case 'medium':
                return {
                    base: this.mediumLodBaseDistance,
                    mult: this.mediumLodMultiplier
                };
            case 'low':
                return {
                    base: this.lowLodBaseDistance,
                    mult: this.lowLodMultiplier
                };
            default:
                return {
                    base: this.mediumLodBaseDistance,
                    mult: this.mediumLodMultiplier
                };
        }
    }
    _getCurrentLodRange() {
        if (this._currentPreset === 'mob-med') return [
            1,
            5
        ];
        if (this._currentPreset === 'mob-low') return [
            2,
            5
        ];
        switch(this._currentPreset){
            case 'ultra':
                return this.ultraLodRange;
            case 'high':
                return this.highLodRange;
            case 'medium':
                return this.mediumLodRange;
            case 'low':
                return this.lowLodRange;
            default:
                return [
                    0,
                    5
                ];
        }
    }
    _applyPreset() {
        const range = this._getCurrentLodRange();
        const lod = this._getCurrentLod();
        if (this.app.scene.gsplat) {
            this.app.scene.gsplat.lodRangeMin = range[0];
            this.app.scene.gsplat.lodRangeMax = range[1];
        }
        if (this.entity.gsplat) {
            this.entity.gsplat.lodBaseDistance = lod.base;
            this.entity.gsplat.lodMultiplier = lod.mult;
        }
        this._children.forEach((child)=>{
            if (child.gsplat) {
                child.gsplat.lodBaseDistance = 1000.0;
                child.gsplat.lodMultiplier = 5.0;
            }
        });
    }
    _setPreset(name) {
        this._currentPreset = name;
        this._applyPreset();
        this._applyResolution();
        this.app.fire('ui:setPreset', name);
    }
    _applyResolution() {
        const device = this.app.graphicsDevice;
        const dpr = window.devicePixelRatio || 1;
        // Kein Pixelbrei mehr! Wir nutzen Standard-Auflösung, nur LOD ist aggressiver.
        device.maxPixelRatio = this._highRes ? Math.min(dpr, 2) : Math.min(dpr, 1.5);
        this.app.resizeCanvas();
    }
    _toggleColorize() {
        this._colorize = !this._colorize;
        if (this.app.scene.gsplat) this.app.scene.gsplat.colorizeLod = this._colorize;
    }
    update() {
        this.app.fire('ui:updateStats', this.app.stats.frame.gsplats || 0);
    }
    onDestroy() {
        this.cleanup();
    }
    cleanup() {
        this._assets.forEach((a)=>{
            a.unload();
            this.app.assets.remove(a);
        });
        this._assets = [];
        if (this.entity.gsplat) this.entity.removeComponent('gsplat');
        this._children.forEach((c)=>c.destroy());
        this._children = [];
    }
    replaceSplat(newUrl) {
        this.cleanup();
        this.splatUrl = newUrl;
        this.environmentUrl = null;
        if (this.splatUrl) this.loadSplat(this.splatUrl, false);
    }
    constructor(...args){
        super(...args), /** @attribute {string} */ _define_property(this, "splatUrl", 'https://github.com/samborghini17/splat-host/blob/main/lemgo-max/lod-meta.json'), /** @attribute {string} */ _define_property(this, "environmentUrl", ''), /** @attribute {number} */ _define_property(this, "ultraLodBaseDistance", 150.0), /** @attribute {number} */ _define_property(this, "ultraLodMultiplier", 2.0), /** @attribute {number} */ _define_property(this, "highLodBaseDistance", 80.0), /** @attribute {number} */ _define_property(this, "highLodMultiplier", 2.0), /** @attribute {number} */ _define_property(this, "mediumLodBaseDistance", 15.0), /** @attribute {number} */ _define_property(this, "mediumLodMultiplier", 2.0), /** @attribute {number} */ _define_property(this, "lowLodBaseDistance", 5.0), /** @attribute {number} */ _define_property(this, "lowLodMultiplier", 2.0), /** @attribute {number[]} */ _define_property(this, "ultraLodRange", [
            0,
            5
        ]), /** @attribute {number[]} */ _define_property(this, "highLodRange", [
            0,
            5
        ]), /** @attribute {number[]} */ _define_property(this, "mediumLodRange", [
            0,
            5
        ]), /** @attribute {number[]} */ _define_property(this, "lowLodRange", [
            2,
            5
        ]), _define_property(this, "_assets", []), _define_property(this, "_children", []), _define_property(this, "_highRes", false), _define_property(this, "_colorize", false);
    }
}
_define_property(StreamedGsplat, "scriptName", 'streamedGsplat');

export { StreamedGsplat };
