const W = 1200;
const H = 900;

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

// Painted stand-in of the hero set, shown until the 3D still is ready or when WebGL is missing.
export function paintStandIn() {
  const c = makeCanvas(W, H);
  const g = c.getContext('2d');
  const rand = rng(7);

  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#16384a');
  sky.addColorStop(0.4, '#2c6070');
  sky.addColorStop(0.6, '#78a8a0');
  sky.addColorStop(0.74, '#f2c08e');
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);

  const sun = g.createRadialGradient(W * 0.85, H * 0.72, 0, W * 0.85, H * 0.72, W * 0.4);
  sun.addColorStop(0, 'rgba(255, 196, 140, 0.7)');
  sun.addColorStop(1, 'rgba(255, 196, 140, 0)');
  g.fillStyle = sun;
  g.fillRect(0, 0, W, H);

  // The edge of the wood: a row of fir tips behind the hill.
  g.fillStyle = '#26473c';
  g.beginPath();
  g.moveTo(0, H);
  g.lineTo(0, H * 0.72);
  for (let x = 0; x < W; x += W / 36) {
    g.lineTo(x + W / 72, H * (0.56 + rand() * 0.1));
    g.lineTo(x + W / 36, H * (0.7 - rand() * 0.03));
  }
  g.lineTo(W, H);
  g.fill();

