import { Vec3, Color } from '../../playcanvas-stable.min.mjs';
import { GsplatShaderEffect } from './gsplat-shader-effect.mjs';

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
const shaderGLSL = /* glsl */ `
uniform float uTime;
uniform vec3 uCenter;
uniform float uSpeed;
uniform float uAcceleration;
uniform float uDelay;
uniform vec3 uDotTint;
uniform vec3 uWaveTint;
uniform float uOscillationIntensity;
uniform float uEndRadius;

// Hilfsfunktion zur Distanzberechnung
float getDist(vec3 center) {
    return length(center - uCenter);
}

// 1. Position ändern
void modifySplatCenter(inout vec3 center) {
    float dist = getDist(center);
    
    if (dist > uEndRadius) return;
    
    float liftTime = max(0.0, uTime - uDelay);
    float wavePos = uSpeed * liftTime + 0.5 * uAcceleration * liftTime * liftTime;
    
    if (abs(dist - wavePos) < 1.0 && liftTime > 0.0) {
        center.y += sin((1.0 - abs(dist - wavePos)) * 3.14159) * uOscillationIntensity;
    }
}

// 2. Rotation und Skalierung ändern
// Signatur angepasst an gsplatModifyVS: (OriginalPos, ModifiziertePos, Rotation, Skalierung)
void modifySplatRotationScale(vec3 centerOrig, vec3 centerMod, inout vec4 rotation, inout vec3 scale) {
    float dist = getDist(centerMod);
    
    // Außerhalb des Radius -> Verstecken (Scale auf 0 setzen)
    if (dist > uEndRadius) { 
        scale = vec3(0.0);
        return; 
    }
    
    float liftTime = max(0.0, uTime - uDelay);
    float wavePos = uSpeed * liftTime + 0.5 * uAcceleration * liftTime * liftTime;
    
    // Wave Effekt (Größer machen)
    if (abs(dist - wavePos) < 1.0 && liftTime > 0.0) {
        float t = 1.0 - abs(dist - wavePos);
        scale *= (1.0 + t * 0.5);
    }
    // Noch nicht erreichte Splats -> Verstecken
    else if (dist > wavePos) {
        scale = vec3(0.0);
    }
}

// 3. Farbe ändern
// Signatur angepasst: Erwartet jetzt 'center' als ersten Parameter
void modifySplatColor(vec3 center, inout vec4 color) {
    float dist = getDist(center);
    
    if (dist > uEndRadius) return;
    
    float liftTime = max(0.0, uTime - uDelay);
    float wavePos = uSpeed * liftTime + 0.5 * uAcceleration * liftTime * liftTime;
    
    // Wave Farbe
    if (abs(dist - wavePos) < 1.5 && liftTime > 0.0) {
        float t = 1.0 - abs(dist - wavePos);
        // Additive Farbmischung für Leuchteffekt
        color.rgb += uWaveTint * t;
    } else {
        // Optional: Leichter Tint für bereits sichtbare Punkte
        color.rgb = mix(color.rgb, uDotTint, 0.1); 
    }
}
`;
class GsplatRevealRadial extends GsplatShaderEffect {
    getShaderGLSL() {
        return shaderGLSL;
    }
    // WebGPU Platzhalter
    getShaderWGSL() {
        return '';
    }
    updateEffect(effectTime, dt) {
        this.setUniform('uTime', effectTime);
        this._centerArray[0] = this.center.x;
        this._centerArray[1] = this.center.y;
        this._centerArray[2] = this.center.z;
        this.setUniform('uCenter', this._centerArray);
        this.setUniform('uSpeed', this.speed);
        this.setUniform('uAcceleration', this.acceleration);
        this.setUniform('uDelay', this.delay);
        this._dotTintArray[0] = this.dotTint.r;
        this._dotTintArray[1] = this.dotTint.g;
        this._dotTintArray[2] = this.dotTint.b;
        this.setUniform('uDotTint', this._dotTintArray);
        this._waveTintArray[0] = this.waveTint.r;
        this._waveTintArray[1] = this.waveTint.g;
        this._waveTintArray[2] = this.waveTint.b;
        this.setUniform('uWaveTint', this._waveTintArray);
        this.setUniform('uOscillationIntensity', this.oscillationIntensity);
        this.setUniform('uEndRadius', this.endRadius);
    }
    restart(newCenter) {
        this.effectTime = 0;
        this.enabled = true;
        if (newCenter) this.center.copy(newCenter);
    }
    constructor(...args){
        super(...args), _define_property(this, "_centerArray", new Float32Array(3)), _define_property(this, "_dotTintArray", new Float32Array(3)), _define_property(this, "_waveTintArray", new Float32Array(3)), /** @attribute {Vec3} */ _define_property(this, "center", new Vec3(0, 0, 0)), /** @attribute {number} */ _define_property(this, "speed", 15), /** @attribute {number} */ _define_property(this, "acceleration", 5), /** @attribute {number} */ _define_property(this, "delay", 1), /** @attribute {Color} */ _define_property(this, "dotTint", new Color(0, 1, 1)), /** @attribute {Color} */ _define_property(this, "waveTint", new Color(1, 0, 0)), /** @attribute {number} */ _define_property(this, "oscillationIntensity", 0.5), /** @attribute {number} */ _define_property(this, "endRadius", 200);
    }
}
_define_property(GsplatRevealRadial, "scriptName", 'gsplatRevealRadial');

export { GsplatRevealRadial };
