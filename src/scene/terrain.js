import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import { NOISE_GLSL } from './shared.js';

// One height function feeds both the ground mesh and the grass scatter, so blades sit on the ground.
export function heightAt(x, z) {
  const crest = 1.7 * Math.exp(-(x * x) / 20 - (z * z) / 9) - 1.7;
  const leftRise = 1.25 * Math.exp(-((x + 6.4) ** 2) / 8 - ((z - 5.2) ** 2) / 7);
  const rightFar = 1.3 * Math.exp(-((x - 13) ** 2) / 34 - ((z + 16) ** 2) / 26);
  const leftFar = 1.7 * Math.exp(-((x + 16) ** 2) / 50 - ((z + 22) ** 2) / 40);
  const roll = 0.07 * Math.sin(x * 0.55 + 1.3) * Math.cos(z * 0.72) + 0.035 * Math.sin(x * 1.7 + z * 1.1);
  return crest + leftRise + rightFar + leftFar + roll;
}

// The clearing the set stands in: an oval round the TV, open toward the camera, with a wavy
// edge. Returns how far a spot lies inside the forest (in scene units; 0 or less: the open
// meadow). Trees are planted by it, and the ground and grass darken under the canopy with it;
// CLEARING_GLSL is the same function for the shaders.
export function forestDepth(x, z) {
  const dz = z + 3;
  const wobble = 1 + 0.09 * Math.sin(Math.atan2(dz, x) * 5 + 1.7) + 0.05 * Math.sin(x * 0.35);
  const e = Math.hypot(x / 12.5, dz / 21) / wobble;
  const front = Math.min(1, Math.max(0, (-1 - z) / 3));
  return (e - 1) * 9 * front - (1 - front) * 4;
}

export const CLEARING_GLSL = /* glsl */ `
  float forestDepth(vec2 p) {
    float dz = p.y + 3.0;
    float wobble = 1.0 + 0.09 * sin(atan(dz, p.x) * 5.0 + 1.7) + 0.05 * sin(p.x * 0.35);
    float e = length(vec2(p.x / 12.5, dz / 21.0)) / wobble;
    float front = clamp((-1.0 - p.y) / 3.0, 0.0, 1.0);
    return (e - 1.0) * 9.0 * front - (1.0 - front) * 4.0;
  }
  // How much the canopy shades the floor here: none in the meadow, most of it a few trees in.
  float canopyShade(vec2 p) {
    return smoothstep(-0.5, 5.0, forestDepth(p));
  }
`;

export function createTerrain(uniforms) {
  const geometry = new PlaneGeometry(110, 80, 220, 160);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 0, -28);
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
  }
  geometry.computeVertexNormals();

  const material = new ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      varying vec3 vNormal;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        vNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDir;
      uniform vec3 uSunColor;
      uniform vec3 uSkyColor;
      uniform vec3 uGround;
      uniform vec3 uGroundLit;
      uniform vec3 uFogColor;
      uniform vec3 uTvPos;
      uniform vec3 uTvColor;
      uniform float uTvPower;
      uniform vec3 uCursorPos;
      uniform vec3 uCursorColor;
      uniform float uCursorPower;
      uniform float uFogNear;
      uniform float uFogFar;
      varying vec3 vWorld;
      varying vec3 vNormal;
      ${NOISE_GLSL}
      ${CLEARING_GLSL}
      void main() {
        vec3 n = normalize(vNormal);
        float k = vnoise(vWorld.xz * 1.4) * 0.6 + vnoise(vWorld.xz * 5.0) * 0.4;
        vec3 base = mix(uGround, uGroundLit, k * 0.7);
        base *= 1.0 - canopyShade(vWorld.xz) * 0.55;
        float sun = max(dot(n, uSunDir), 0.0);
        vec3 c = base * (uSunColor * (0.25 + sun * 0.9) + uSkyColor * (0.28 + 0.2 * n.y));
        float d = distance(vWorld, uTvPos);
        c += uTvColor * uTvPower * exp(-d * d / 1.4) * 0.35;
