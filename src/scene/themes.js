import { Color } from 'three';

// Times of day: the sky, the sun (or the moon), the light, all in the colours of a forest:
// pine and moss greens, bark, mist and a warm low sun. Colours are sRGB hex; `sunDir` points at
// the sun and also sets which side of the grass and the trees catches the rim light. Grass,
// ground, pines and leaves here are the summer colours as each light shows them; seasons repaint
// them (below). `light.particles` tints a season's falling things (snow, petals, leaves) for this
// light. `birds` is how many flocks cross the sky: none at night.
export const THEMES = {
  dusk: {
    label: 'Dusk',
    sky: { top: '#16384a', mid: '#2c6070', low: '#78a8a0', horizon: '#f2c08e', sun: '#ffa868' },
    sunDir: [0.85, 0.04, -1],
    stars: 0,
    haze: '#557f78',
    clouds: { lit: '#f1ead8', shade: '#e8a888', opacity: 1 },
    treeline: { farTop: '#3e6a68', farLow: '#6c9890', nearTop: '#1d3c38', nearLow: '#3c6660' },
    pines: { dark: '#0b1a12', lit: '#3a5a2a' },
    leaves: { dark: '#0f1e10', lit: '#56702e' },
    grass: { base: '#0b1209', mid: '#24320f', tip: '#6f7a2c', tipGold: '#a98f3c', back: '#ffb455' },
    ground: { dark: '#0d1409', lit: '#202c10' },
    light: { sun: '#ffc08a', sky: '#6a9c98', particles: '#ffffff' },
    lamps: { hemiSky: '#7ab0a8', hemiGround: '#1c2612', hemi: 0.55, sun: '#ffb57e', sunI: 0.6, fill: '#88b4ac', fillI: 0.35 },
    particles: { color: '#eef2d8', color2: '#eef2d8', opacity: 1, fall: 1, size: 1 },
    birds: 1,
    exposure: 1,
  },
  night: {
    label: 'Night',
    sky: { top: '#020a0c', mid: '#06181c', low: '#0e2a2c', horizon: '#1c3c3a', sun: '#c8dccf' },
    sunDir: [-0.36, 0.2, -1],
    stars: 1,
