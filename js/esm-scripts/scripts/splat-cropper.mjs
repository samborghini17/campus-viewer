import { Script, Vec3 } from '../../playcanvas-stable.min.mjs';

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

class SplatCropper extends Script {
    initialize() {
        this.app.on('splat:crop:update', this._updateCrop, this);
        this._injectShader();
    }

    _injectShader() {
        if (!this.entity.gsplat) return;
        
        // Ensure material is available
        const inst = this.entity.gsplat.instance || (this.entity.gsplat.meshInstances ? this.entity.gsplat.meshInstances[0] : null);
        if (!inst || !inst.material) {
            setTimeout(() => this._injectShader(), 500);
            return;
        }

        const mat = inst.material;
        
        // Inject a custom chunk into the fragment shader to discard pixels outside the box
        // Or if 'blur' is needed, we could modify alpha. Discard is easiest for cropping.
        // PlayCanvas GSplats use vertex shaders to orient splats. Fragment shader just renders the gaussian.
        const customPS = `
            uniform vec3 uCropMin;
            uniform vec3 uCropMax;
            uniform float uCropEnabled;
            
            void main(void) {
                if (uCropEnabled > 0.5) {
                    if (vPositionW.x < uCropMin.x || vPositionW.x > uCropMax.x ||
                        vPositionW.y < uCropMin.y || vPositionW.y > uCropMax.y ||
                        vPositionW.z < uCropMin.z || vPositionW.z > uCropMax.z) {
                        
                        if (uCropEnabled > 1.5) {
                            // Masking mode: discard
                            discard;
                        } else {
                            // Blurring mode: reduce alpha or change color
                            gl_FragColor.a *= 0.1;
                        }
                    }
                }
            }
        `;
        
        mat.setParameter('uCropMin', this.cropMin.data);
        mat.setParameter('uCropMax', this.cropMax.data);
        mat.setParameter('uCropEnabled', this.enabled ? (this.mode === 'mask' ? 2.0 : 1.0) : 0.0);
        
        console.log('[SplatCropper] Injected crop parameters into material');
    }

    _updateCrop() {
        if (!this.entity.gsplat) return;
        const inst = this.entity.gsplat.instance || (this.entity.gsplat.meshInstances ? this.entity.gsplat.meshInstances[0] : null);
        if (inst && inst.material) {
            inst.material.setParameter('uCropMin', this.cropMin.data);
            inst.material.setParameter('uCropMax', this.cropMax.data);
            inst.material.setParameter('uCropEnabled', this.enabled ? (this.mode === 'mask' ? 2.0 : 1.0) : 0.0);
        }
    }

    update() {
        if (this._lastMin !== this.cropMin.toString() || this._lastMax !== this.cropMax.toString()) {
            this._lastMin = this.cropMin.toString();
            this._lastMax = this.cropMax.toString();
            this._updateCrop();
        }
    }

    constructor(...args) {
        super(...args);
        _define_property(this, "cropMin", new Vec3(-10, -10, -10));
        _define_property(this, "cropMax", new Vec3(10, 10, 10));
        _define_property(this, "mode", 'mask'); // 'mask' or 'blur'
    }
}
_define_property(SplatCropper, "scriptName", 'splatCropper');

export { SplatCropper };
