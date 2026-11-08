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
    [0.3, -0.08],
    [-0.3, 0.08],
    [-0.3, -0.08],
  ].map(([x, z]) => leg(hide, 0.86, 0.042, 0.022, [x, 0.88, z]));
  legs.forEach((l) => root.add(l));
  return { root, body, neck, head, legs, tail: null, ears: null };
}

function makeFox() {
  const fur = coat('#d0682c');
  const dark = coat('#2a1a12');
  const pale = coat('#f0e6d8');
  const root = new Group();
  const body = new Group();
  root.add(body);
  body.add(blob(fur, [0.3, 0.12, 0.1], [0, 0.37, 0]));
  body.add(blob(pale, [0.1, 0.1, 0.08], [0.2, 0.34, 0]));
  const neck = new Group();
  neck.position.set(0.25, 0.43, 0);
  body.add(neck);
  const head = new Group();
  head.position.set(0.05, 0.04, 0);
  neck.add(head);
  head.add(blob(fur, [0.1, 0.08, 0.075], [0.03, 0, 0]));
  head.add(blob(pale, [0.09, 0.035, 0.04], [0.12, -0.025, 0]));
  head.add(blob(dark, [0.018, 0.018, 0.018], [0.21, -0.02, 0]));
  for (const side of [-1, 1]) {
    const ear = new Mesh(new ConeGeometry(0.035, 0.09, 6), fur);
    ear.position.set(-0.01, 0.1, side * 0.04);
    head.add(ear);
  }
  const tail = new Group();
  tail.position.set(-0.28, 0.4, 0);
  body.add(tail);
  tail.add(blob(fur, [0.24, 0.075, 0.075], [-0.2, -0.05, 0], 0.3));
  tail.add(blob(pale, [0.07, 0.05, 0.05], [-0.42, -0.13, 0], 0.3));
  const legs = [
    [0.18, 0.06],
    [0.18, -0.06],
    [-0.18, 0.06],
    [-0.18, -0.06],
  ].map(([x, z]) => leg(dark, 0.33, 0.026, 0.018, [x, 0.34, z]));
  legs.forEach((l) => root.add(l));
  return { root, body, neck, head, legs, tail, ears: null };
}

function makeRabbit() {
  const fur = coat('#b8946a');
  const pale = coat('#eee6da');
  const root = new Group();
  const body = new Group();
  root.add(body);
  body.add(blob(fur, [0.15, 0.12, 0.11], [0, 0.13, 0], 0.25));
  for (const side of [-1, 1]) body.add(blob(fur, [0.08, 0.07, 0.04], [-0.06, 0.08, side * 0.08]));
  body.add(blob(pale, [0.045, 0.045, 0.045], [-0.15, 0.15, 0]));
  const neck = new Group();
  neck.position.set(0.1, 0.18, 0);
  body.add(neck);
  const head = new Group();
  head.position.set(0.04, 0.05, 0);
  neck.add(head);
  head.add(blob(fur, [0.075, 0.068, 0.065], [0, 0, 0]));
  const ears = new Group();
  ears.position.set(-0.02, 0.05, 0);
  head.add(ears);
  for (const side of [-1, 1]) ears.add(blob(fur, [0.022, 0.095, 0.014], [0, 0.08, side * 0.03], 0.15));
  // A big hare more than a rabbit, so it still shows over the far grass.
  root.scale.setScalar(2);
  return { root, body, neck, head, legs: [], tail: null, ears };
}

// Kinds of walker. `lane` is the range of distances behind the set (negative z) a route keeps
// to; `reach` is how far to each side the route starts and ends, out of sight in the trees.
const KINDS = {
  doe: { make: () => makeDeer(false), speed: 1.05, stride: 1.6, swing: 0.36, lane: [-18, -15], reach: 15, stop: 'graze' },
  buck: { make: () => makeDeer(true), speed: 0.95, stride: 1.7, swing: 0.34, lane: [-21, -18], reach: 16, stop: 'graze' },
  fox: { make: makeFox, speed: 1.7, stride: 0.75, swing: 0.55, lane: [-16, -13], reach: 14, stop: 'look' },
  rabbit: { make: makeRabbit, speed: 1.6, stride: 0.7, swing: 0, lane: [-15, -12], reach: 13, stop: 'sit', hops: true },
};

// Where each starts, so the first view (and the still frame under reduced motion) already has a
// doe grazing on the left and a rabbit sitting on the right; the others come later.
const OPENING = {
  doe: { x: -5.5, z: -16.5, dir: 1, stop: 9 },
  rabbit: { x: 4.6, z: -15, dir: -1, stop: 6 },
  fox: { away: 9 },
  buck: { away: 18 },
};

const ease = (dt, rate) => 1 - Math.exp(-dt * rate);

function createWalker(name, heightAt, rand) {
  const kind = KINDS[name];
  const model = kind.make();
  const a = {
    model,
    state: 'away',
    timer: 0,
    x: 0,
    z: 0,
    dir: 1,
    s: 0,
    length: 0,
    lane: 0,
    wave: 0,
    stops: [],
    step: 0,
    yaw: 0,
    neckAim: 0,
    headAim: 0,
    bodyAim: 0,
    lookAim: 0,
    hop: 0,
  };

  function plan(opening) {
    a.dir = opening?.dir ?? (rand() < 0.5 ? 1 : -1);
    a.lane = opening?.z ?? MathUtils.lerp(kind.lane[0], kind.lane[1], rand());
    a.wave = rand() * 6;
    a.length = kind.reach * 2;
    const startX = -a.dir * kind.reach;
    a.s = opening ? (opening.x - startX) * a.dir : 0;
    // Stops at the sides of the meadow, where the crest of the hill does not hide the ground:
    // usually one soon after coming out of the trees, sometimes one more before going back in.
    a.stops = [];
    if (rand() < 0.8) a.stops.push(kind.reach - 3 - rand() * 4.5);
    if (rand() < 0.6) a.stops.push(kind.reach + 3 + rand() * 4.5);
    if (opening) a.stops = [a.s, kind.reach + 5];
    a.state = 'move';
    a.timer = 0;
    model.root.visible = true;
    place(0);
  }

  function place(dt) {
    const startX = -a.dir * kind.reach;
    a.x = startX + a.dir * a.s;
    a.z = a.lane + 0.7 * Math.sin(a.s * 0.22 + a.wave);
    const dz = 0.7 * 0.22 * Math.cos(a.s * 0.22 + a.wave);
    const yaw = Math.atan2(-dz, a.dir);
    // Turn the short way round (a heading near half a turn flips between +pi and -pi).
    const turn = MathUtils.euclideanModulo(yaw - a.yaw + Math.PI, Math.PI * 2) - Math.PI;
    a.yaw = dt > 0 ? a.yaw + turn * ease(dt, 4) : yaw;
    model.root.position.set(a.x, heightAt(a.x, a.z) - 0.02, a.z);
    model.root.rotation.y = a.yaw;
  }

  function pose(dt, time, moving) {
    const k = dt > 0 ? ease(dt, 3) : 1;
    // Legs: diagonal pairs swing together; at rest they hang straight.
    const swing = moving ? kind.swing : 0;
    model.legs.forEach((l, i) => {
      const phase = a.step + (i === 0 || i === 3 ? 0 : Math.PI);
      const target = Math.sin(phase) * swing;
      l.rotation.z = moving ? target : l.rotation.z * (1 - k);
    });
    if (kind.hops) {
      const air = moving ? Math.max(0, Math.sin(a.hop)) : 0;
      model.body.position.y = air * 0.16;
      a.bodyAim = moving ? -0.25 * Math.cos(a.hop) : 0.55;
    } else {
      model.body.position.y = moving ? Math.abs(Math.sin(a.step)) * 0.018 : 0;
    }
    model.body.rotation.z += (a.bodyAim - model.body.rotation.z) * k;
    model.neck.rotation.z += (a.neckAim + (moving ? 0.05 * Math.sin(a.step * 2) : 0) - model.neck.rotation.z) * k;
    model.head.rotation.z += (a.headAim - model.head.rotation.z) * k;
    model.head.rotation.y += (a.lookAim - model.head.rotation.y) * k;
    if (model.tail) model.tail.rotation.z = 0.12 * Math.sin(time * 2.1 + a.wave);
    if (model.ears) model.ears.rotation.z = Math.sin(time * 1.7 + a.wave) > 0.93 ? -0.35 : 0;
  }

  function stopPose(time) {
    if (kind.stop === 'graze') {
      // Head down in the grass, up now and then to look round.
      const look = Math.sin(time * 0.45 + a.wave) > 0.35;
      a.neckAim = look ? 0 : -1.8;
      a.headAim = look ? 0 : 0.9;
      a.bodyAim = look ? 0 : -0.08;
      a.lookAim = look ? 0.5 * Math.sin(time * 0.3) : 0;
    } else if (kind.stop === 'look') {
      a.neckAim = 0.15;
      a.lookAim = 0.9 * Math.sin(time * 0.6 + a.wave);
    } else {
      a.neckAim = -0.55;
      a.lookAim = 0.4 * Math.sin(time * 0.8 + a.wave);
    }
  }

  const opening = OPENING[name];
  if (opening?.away != null) {
    a.timer = opening.away;
    model.root.visible = false;
  } else {
    // The opening pose: standing with the head up and turned a little toward the camera.
    plan(opening);
    a.state = 'stop';
    a.timer = opening.stop;
    a.stops.shift();
    a.neckAim = kind.stop === 'sit' ? -0.55 : 0;
    a.headAim = 0;
    a.lookAim = 0.35;
    a.bodyAim = kind.hops ? 0.55 : 0;
    model.neck.rotation.z = a.neckAim;
    model.head.rotation.y = a.lookAim;
    model.body.rotation.z = a.bodyAim;
  }

  return {
    root: model.root,
    update(dt, time) {
      if (a.state === 'away') {
        a.timer -= dt;
        if (a.timer <= 0) plan();
        else return;
      }
      if (a.state === 'stop') {
        a.timer -= dt;
        stopPose(time);
        if (a.timer <= 0) {
          a.state = 'move';
          a.lookAim = 0;
        }
        place(dt);
        pose(dt, time, false);
        return;
      }
      a.neckAim = 0;
      a.headAim = 0;
      a.bodyAim = 0;
      a.s += kind.speed * dt;
      a.step += ((kind.speed * dt) / kind.stride) * Math.PI * 2;
      a.hop += kind.speed * dt * 7;
      if (a.stops.length && a.s >= a.stops[0]) {
        a.stops.shift();
        a.state = 'stop';
        a.timer = kind.stop === 'graze' ? 5 + rand() * 6 : 2 + rand() * 3;
      }
      if (a.s >= a.length) {
        a.state = 'away';
        a.timer = 6 + rand() * 14;
        model.root.visible = false;
        return;
      }
      place(dt);
      pose(dt, time, true);
    },
  };
}

// One bird: a small body and two swept wings that flap round the line of flight.
function wingGeometry(side) {
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute([0.07, 0, 0, -0.07, 0, 0, -0.13, 0, side * 0.46], 3));
  g.computeVertexNormals();
  return g;
}

function makeBird(material) {
  const root = new Group();
  root.add(blob(material, [0.13, 0.035, 0.035], [0, 0, 0]));
  root.add(blob(material, [0.04, 0.03, 0.03], [0.12, 0.01, 0]));
  const wings = [-1, 1].map((side) => {
    const wing = new Mesh(wingGeometry(side), material);
    root.add(wing);
    return { wing, side };
  });
  return { root, wings };
}

// Flocks of three to six cross the sky above the trees, flapping and gliding, every so often.
// None set out while the time of day has no birds (night, rain); a flock already in the air flies on.
function createFlocks(live, rand, count) {
  const material = new MeshBasicMaterial({ color: '#1b2420', side: DoubleSide });
  const birds = Array.from({ length: count }, () => ({ ...makeBird(material), on: false }));
  const group = new Group();
  birds.forEach((b) => {
    b.root.visible = false;
    group.add(b.root);
  });
  let wait = 4;

  function launch() {
    const dir = rand() < 0.5 ? 1 : -1;
    const z = -26 - rand() * 18;
    const y = 4.8 + rand() * 2.4;
    const speed = 5 + rand() * 2;
    const size = 2 + Math.floor(rand() * 5);
    birds.slice(0, size).forEach((b, i) => {
      const row = Math.ceil(i / 2);
      const side = i % 2 ? 1 : -1;
      Object.assign(b, {
