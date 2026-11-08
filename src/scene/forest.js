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

