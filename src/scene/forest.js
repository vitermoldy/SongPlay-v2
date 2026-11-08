import {
  ConeGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Quaternion,
  ShaderMaterial,
  Vector3,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { forestDepth, heightAt } from './terrain.js';
import { NOISE_GLSL, col, mulberry32 } from './shared.js';

// The forest round the clearing: firs and broadleaf trees, with low bushes along the edge so the
// meadow runs into the wood instead of stopping at a wall. Every tree is one instance of one of
// two small meshes, one unit tall; its instance matrix gives it a place, a turn and a size.

// aPart marks bark (0) and foliage (1). A canopy blob gets normals pointing out from its own
// centre, so it shades like a soft ball rather than a cut gem.
function part(geometry, foliage, centre) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  const count = g.attributes.position.count;
  g.setAttribute('aPart', new Float32BufferAttribute(new Float32Array(count).fill(foliage), 1));
  if (centre) {
    const pos = g.attributes.position;
    const nor = g.attributes.normal;
    const v = new Vector3();
    for (let i = 0; i < count; i++) {
      v.set(pos.getX(i) - centre[0], pos.getY(i) - centre[1], pos.getZ(i) - centre[2]).normalize();
      nor.setXYZ(i, v.x, v.y, v.z);
    }
  }
  return g;
}

function firGeometry() {
  const parts = [part(new CylinderGeometry(0.025, 0.04, 0.22, 6).translate(0, 0.11, 0), 0)];
  for (let i = 0; i < 4; i++) {
    const r = 0.3 - i * 0.06;
    const h = 0.36 - i * 0.04;
    parts.push(part(new ConeGeometry(r, h, 8, 1).translate(0, 0.12 + i * 0.2 + h / 2, 0), 1));
  }
  return mergeGeometries(parts);
}

function broadleafGeometry() {
  const parts = [part(new CylinderGeometry(0.03, 0.05, 0.56, 6).translate(0, 0.28, 0), 0)];
  const blobs = [
    [0, 0.6, 0, 0.27],
    [0.15, 0.7, 0.06, 0.21],
    [-0.15, 0.68, -0.05, 0.22],
    [0.02, 0.84, -0.02, 0.18],
    [0.04, 0.62, 0.17, 0.18],
  ];
  for (const [x, y, z, r] of blobs) {
    parts.push(part(new IcosahedronGeometry(r, 1).translate(x, y, z), 1, [x, y, z]));
  }
  return mergeGeometries(parts);
}

const vertexShader = /* glsl */ `
  attribute float aPart;
  attribute float aSeed;
  uniform float uTime;
  uniform vec2 uWindDir;
  uniform float uWind;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vH;
  varying float vPart;
  varying float vSeed;
  void main() {
    mat4 m = modelMatrix * instanceMatrix;
    vec4 w = m * vec4(position, 1.0);
    float h = position.y;
    float tall = length(m[1].xyz);
    // The crowns lean a little with the same wind that moves the grass.
    float sway = sin(uTime * 0.6 + aSeed * 6.2831 + w.x * 0.04) * 0.7 + sin(uTime * 1.3 + aSeed * 11.0) * 0.3;
    w.xz += uWindDir * sway * uWind * h * h * tall * 0.025;
    vWorld = w.xyz;
    vNormal = normalize(mat3(m) * normal);
    vH = h;
    vPart = aPart;
    vSeed = aSeed;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uDark;
  uniform vec3 uLit;
  uniform vec3 uBark;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec3 uSkyColor;
  uniform vec3 uBack;
  uniform vec3 uCursorPos;
  uniform vec3 uCursorColor;
  uniform float uCursorPower;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vH;
  varying float vPart;
  varying float vSeed;
  ${NOISE_GLSL}
