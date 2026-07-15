var SplatBlur = pc.createScript('splatBlur');

SplatBlur.attributes.add('radius', { type: 'number', default: 2.0, title: 'Radius/Size' });
SplatBlur.attributes.add('blurAmount', { type: 'number', default: 0.1, title: 'Blur (Glossiness)' });
SplatBlur.attributes.add('isSphere', { type: 'boolean', default: true, title: 'Use Sphere (else Box)' });

SplatBlur.prototype.initialize = function() {
    this.meshEntity = new pc.Entity('SplatBlurMesh');
    this.meshEntity.addComponent('model', {
        type: this.isSphere ? 'sphere' : 'box'
    });
    
    // Scale it
    this.meshEntity.setLocalScale(this.radius, this.radius, this.radius);
    
    var mat = new pc.StandardMaterial();
    // Simulate frosted glass / blur using refraction and low gloss
    mat.useRefraction = true;
    mat.refractionIndex = 1.5;
    mat.blendType = pc.BLEND_NORMAL;
    mat.opacity = 0.4;
    mat.diffuse = new pc.Color(0.1, 0.1, 0.1); // Darken slightly
    mat.gloss = this.blurAmount; // Low gloss = blurry reflection/refraction
    mat.metalness = 0.2;
    mat.useLighting = false;
    mat.update();
    
    this.meshEntity.model.material = mat;
    this.entity.addChild(this.meshEntity);
    
    this.on('attr', this.onAttr, this);
};

SplatBlur.prototype.onAttr = function (name, value, prev) {
    if (name === 'radius') {
        this.meshEntity.setLocalScale(value, value, value);
    } else if (name === 'blurAmount' && this.meshEntity.model.material) {
        this.meshEntity.model.material.gloss = value;
        this.meshEntity.model.material.update();
    } else if (name === 'isSphere') {
        this.meshEntity.model.type = value ? 'sphere' : 'box';
    }
};

SplatBlur.prototype.onEnable = function () {
    if (this.meshEntity) this.meshEntity.enabled = true;
};

SplatBlur.prototype.onDisable = function () {
    if (this.meshEntity) this.meshEntity.enabled = false;
};
