import {
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
} from 'three';
import { mulberry32 } from './shared.js';

// Animals that pass through the clearing now and then: a doe and a buck, a fox and a rabbit on
// the meadow behind the set, flocks of birds over the trees. Each is built from a few soft shapes
// and lit by the scene's own lights. They walk lanes behind the crest of the hill, so on the
// player page none of them ever crosses the video; they come out of the wood on one side, stop
// once or twice (graze, sit up, look round) and go back into the wood on the other.
// Every model faces +x with its feet at y = 0.

const ball = new SphereGeometry(1, 14, 10);

// A touch of the coat's own colour as emissive keeps an animal readable in the dusk light
// without making it glow.
function coat(hex) {
  return new MeshStandardMaterial({
    color: hex,
    emissive: hex,
    emissiveIntensity: 0.06,
    roughness: 0.92,
    metalness: 0,
    envMapIntensity: 0.3,
  });
}

function blob(material, [sx, sy, sz], [x, y, z], tilt = 0) {
  const mesh = new Mesh(ball, material);
  mesh.scale.set(sx, sy, sz);
  mesh.position.set(x, y, z);
  mesh.rotation.z = tilt;
  return mesh;
}

