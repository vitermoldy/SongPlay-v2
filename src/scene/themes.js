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
    haze: '#0e2222',
    clouds: { lit: '#2c4a48', shade: '#142828', opacity: 0.55 },
    treeline: { farTop: '#0c2020', farLow: '#122c2a', nearTop: '#040e0c', nearLow: '#0a1a18' },
    pines: { dark: '#020604', lit: '#0e2018' },
    leaves: { dark: '#030704', lit: '#12241a' },
    grass: { base: '#03070a', mid: '#0b1818', tip: '#24403c', tipGold: '#3c5a4c', back: '#9cc8b8' },
    ground: { dark: '#04080a', lit: '#0b1614' },
    light: { sun: '#9cc0b8', sky: '#1f4844', particles: '#8aa49c' },
    lamps: { hemiSky: '#2f6660', hemiGround: '#05080a', hemi: 0.4, sun: '#c0dcd2', sunI: 0.5, fill: '#2e5650', fillI: 0.2 },
    // Fireflies: yellow-green, a few warmer.
    particles: { color: '#d6f57a', color2: '#ffe08a', opacity: 1, fall: 1, size: 1 },
    birds: 0,
    exposure: 1,
  },
  sunset: {
    label: 'Sunset',
    sky: { top: '#1d3a46', mid: '#b46a50', low: '#f0944e', horizon: '#ffd07a', sun: '#ff8a3a' },
    sunDir: [0.55, 0.05, -1],
    stars: 0,
    haze: '#a07e62',
