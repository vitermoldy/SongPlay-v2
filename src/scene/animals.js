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

// A leg hanging from its pivot at the hip or shoulder; swinging the pivot walks it.
function leg(material, length, top, bottom, [x, y, z]) {
  const geometry = new CylinderGeometry(top, bottom, length, 6);
  geometry.translate(0, -length / 2, 0);
  const pivot = new Group();
  pivot.position.set(x, y, z);
  pivot.add(new Mesh(geometry, material));
  return pivot;
}

function stick(material, length, radius, [x, y, z], tiltZ, tiltX = 0) {
  const geometry = new CylinderGeometry(radius * 0.6, radius, length, 5);
  geometry.translate(0, length / 2, 0);
  const mesh = new Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(tiltX, 0, tiltZ);
  return mesh;
}

function makeDeer(buck) {
  const hide = coat(buck ? '#9a6638' : '#b07842');
  const dark = coat('#3a2618');
  const pale = coat('#eadfcc');
  const root = new Group();
  const body = new Group();
  root.add(body);
  body.add(blob(hide, [0.46, 0.22, 0.19], [0, 0.93, 0]));
  body.add(blob(hide, [0.24, 0.23, 0.18], [-0.27, 0.95, 0]));
  body.add(blob(hide, [0.22, 0.25, 0.18], [0.28, 0.94, 0]));
  body.add(blob(pale, [0.06, 0.09, 0.05], [-0.5, 1.03, 0], 0.5));
  const neck = new Group();
  neck.position.set(0.36, 0.98, 0);
  body.add(neck);
  neck.add(blob(hide, [0.09, 0.28, 0.08], [0.1, 0.22, 0], -0.45));
  const head = new Group();
  head.position.set(0.21, 0.48, 0);
  neck.add(head);
  head.add(blob(hide, [0.15, 0.085, 0.075], [0.07, 0, 0], -0.35));
  head.add(blob(dark, [0.03, 0.03, 0.03], [0.21, -0.05, 0]));
  for (const side of [-1, 1]) {
    head.add(blob(hide, [0.03, 0.08, 0.02], [-0.03, 0.08, side * 0.06], 0.6));
    if (buck) {
      head.add(stick(dark, 0.34, 0.016, [0, 0.07, side * 0.035], 0.55, -side * 0.35));
      head.add(stick(dark, 0.16, 0.012, [-0.06, 0.2, side * 0.07], -0.2, -side * 0.3));
      head.add(stick(dark, 0.14, 0.011, [-0.15, 0.3, side * 0.1], 0.3, -side * 0.2));
    }
  }
  const legs = [
    [0.3, 0.08],
