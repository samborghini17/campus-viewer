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
uniform float uDistanceCullEnabled;
uniform float uCullDistanceSq;
uniform vec3 uCullCameraWorld;
uniform float uPrivacyZoneCount;
uniform mat4 uSplatWorld;
uniform float uPrivacyPointCount[8];
uniform vec2 uPrivacyPoints[128];
uniform float uPrivacyMinY[8];
uniform float uPrivacyMaxY[8];
uniform float uPrivacyMode[8];
uniform float uPrivacyStrength[8];

bool privacyContains(vec3 point, int zone) {
    if (point.y < uPrivacyMinY[zone] || point.y > uPrivacyMaxY[zone]) return false;
    int count = int(uPrivacyPointCount[zone]);
    if (count < 3) return false;
    bool inside = false;
    for (int vertex = 0; vertex < 16; vertex++) {
        if (vertex >= count) break;
        int nextVertex = vertex + 1;
        if (nextVertex >= count) nextVertex = 0;
        vec2 a = uPrivacyPoints[zone * 16 + vertex];
        vec2 b = uPrivacyPoints[zone * 16 + nextVertex];
        bool crosses = (a.y > point.z) != (b.y > point.z);
        float edgeX = (b.x - a.x) * (point.z - a.y) / (b.y - a.y + 0.000001) + a.x;
        if (crosses && point.x < edgeX) inside = !inside;
    }
    return inside;
}

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
    vec3 worldCenter = (uSplatWorld * vec4(centerMod, 1.0)).xyz;
    if (uDistanceCullEnabled > 0.5) {
        vec3 cameraDelta = worldCenter - uCullCameraWorld;
        if (dot(cameraDelta, cameraDelta) > uCullDistanceSq) {
            scale = vec3(0.0);
            return;
        }
    }
    for (int i = 0; i < 8; i++) {
        if (float(i) >= uPrivacyZoneCount) break;
        bool inside = privacyContains(worldCenter, i);
        if (!inside) continue;
        if (uPrivacyMode[i] < 1.5) {
            scale = vec3(0.0);
            return;
        }
        scale *= max(1.0, uPrivacyStrength[i]);
    }
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
    vec3 worldCenter = (uSplatWorld * vec4(center, 1.0)).xyz;
    for (int i = 0; i < 8; i++) {
        if (float(i) >= uPrivacyZoneCount) break;
        bool inside = privacyContains(worldCenter, i);
        if (inside && uPrivacyMode[i] >= 1.5) {
            float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            color.rgb = vec3(luminance);
            color.a *= 0.7;
        }
    }
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
        this._ensurePrivacyState();
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
        this.setUniform('uDistanceCullEnabled', this._distanceCullEnabled ? 1 : 0);
        this.setUniform('uCullDistanceSq', this._cullDistance * this._cullDistance);
        const camera = this._cullCamera || this.app.systems.camera.cameras[0]?.entity;
        if (camera) {
            const position = camera.getPosition();
            this._cullCameraWorld[0] = position.x;
            this._cullCameraWorld[1] = position.y;
            this._cullCameraWorld[2] = position.z;
        }
        this.setUniform('uCullCameraWorld', this._cullCameraWorld);
        this.setUniform('uPrivacyZoneCount', this._privacyZoneCount);
        this.setUniform('uSplatWorld', this.entity.getWorldTransform().data);
        this.setUniform('uPrivacyPointCount', this._privacyPointCount);
        this.setUniform('uPrivacyPoints', this._privacyPoints);
        this.setUniform('uPrivacyMinY', this._privacyMinY);
        this.setUniform('uPrivacyMaxY', this._privacyMaxY);
        this.setUniform('uPrivacyMode', this._privacyMode);
        this.setUniform('uPrivacyStrength', this._privacyStrength);
    }
    _ensurePrivacyState() {
        if (this._privacyPoints) return;
        this._cullCameraWorld = new Float32Array(3);
        this._privacyPointCount = new Float32Array(8);
        this._privacyPoints = new Float32Array(256);
        this._privacyMinY = new Float32Array(8);
        this._privacyMaxY = new Float32Array(8);
        this._privacyMode = new Float32Array(8);
        this._privacyStrength = new Float32Array(8);
        this._privacyStrength.fill(1);
        this._privacyZoneCount = 0;
        this._distanceCullEnabled = false;
        this._cullDistance = 70;
        this._cullCamera = null;
    }
    setDistanceCulling(enabled, distance, camera) {
        this._ensurePrivacyState();
        this._distanceCullEnabled = !!enabled;
        this._cullDistance = Math.max(1, Number(distance) || 70);
        this._cullCamera = camera || null;
    }
    setPrivacyZones(zones) {
        this._ensurePrivacyState();
        this._privacyPointCount.fill(0);
        this._privacyPoints.fill(0);
        this._privacyMinY.fill(0);
        this._privacyMaxY.fill(0);
        this._privacyMode.fill(0);
        this._privacyStrength.fill(1);
        const activeZones = Array.isArray(zones) ? zones.filter((zone)=>zone && zone.enabled !== false).slice(0, 8) : [];
        this._privacyZoneCount = activeZones.length;
        activeZones.forEach((zone, index)=>{
            let points = Array.isArray(zone.points) ? zone.points.slice(0, 16) : [];
            if (points.length < 3 && Array.isArray(zone.min) && Array.isArray(zone.max)) {
                points = [[zone.min[0], 0, zone.min[2]], [zone.max[0], 0, zone.min[2]], [zone.max[0], 0, zone.max[2]], [zone.min[0], 0, zone.max[2]]];
            }
            this._privacyPointCount[index] = points.length;
            points.forEach((point, pointIndex)=>{
                const value = Array.isArray(point) ? point : [point.x, point.y, point.z];
                const offset = (index * 16 + pointIndex) * 2;
                this._privacyPoints[offset] = Number(value[0]) || 0;
                this._privacyPoints[offset + 1] = Number(value[2]) || 0;
            });
            const minY = Number(zone.minY ?? zone.min?.[1] ?? -10000);
            const maxY = Number(zone.maxY ?? zone.max?.[1] ?? 10000);
            this._privacyMinY[index] = Math.min(minY, maxY);
            this._privacyMaxY[index] = Math.max(minY, maxY);
            this._privacyMode[index] = zone.mode === 'blur' ? 2 : 1;
            this._privacyStrength[index] = Math.max(1, Number(zone.strength) || 8);
        });
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
