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
    clouds: { lit: '#ffd3a2', shade: '#a65a44', opacity: 1 },
    treeline: { farTop: '#5c5a46', farLow: '#94785c', nearTop: '#2a2e22', nearLow: '#58503c' },
    pines: { dark: '#100c05', lit: '#4e4418' },
    leaves: { dark: '#120d05', lit: '#6a5418' },
    grass: { base: '#140d05', mid: '#3a2a0c', tip: '#9a7426', tipGold: '#dca03c', back: '#ffa53a' },
    ground: { dark: '#130c05', lit: '#2e1f0e' },
    light: { sun: '#ffae6c', sky: '#c4886a', particles: '#ffdcbc' },
    lamps: { hemiSky: '#d8946e', hemiGround: '#2a1a0e', hemi: 0.6, sun: '#ffa050', sunI: 1, fill: '#7a8a62', fillI: 0.25 },
    particles: { color: '#ffe2b8', color2: '#ffe2b8', opacity: 0.9, fall: 1, size: 1 },
    birds: 1,
    exposure: 1,
  },
  dawn: {
    label: 'Dawn',
    sky: { top: '#4a82a4', mid: '#98c2c4', low: '#d2e6da', horizon: '#ffe4c2', sun: '#fff0c4' },
    sunDir: [-0.8, 0.08, -1],
    stars: 0,
    haze: '#b2ccc0',
    clouds: { lit: '#ffffff', shade: '#efd2bc', opacity: 0.9 },
    treeline: { farTop: '#8aae9e', farLow: '#b4d0c2', nearTop: '#557c6a', nearLow: '#86aa98' },
    pines: { dark: '#0b1c10', lit: '#447230' },
    leaves: { dark: '#0e2010', lit: '#5e8c34' },
    grass: { base: '#0a1607', mid: '#284812', tip: '#66962c', tipGold: '#a6b646', back: '#fff2a6' },
    ground: { dark: '#0c1a08', lit: '#243f18' },
    light: { sun: '#fff0d2', sky: '#a4cec4', particles: '#ffffff' },
    lamps: { hemiSky: '#b8e0d2', hemiGround: '#20301a', hemi: 0.9, sun: '#fff0d0', sunI: 1, fill: '#c0dcd0', fillI: 0.4 },
    particles: { color: '#ffffff', color2: '#ffffff', opacity: 0.6, fall: 1, size: 1 },
    birds: 1,
    exposure: 1,
  },
};

// Seasons paint the grass, the ground and the trees, and choose what falls through the air.
// Their colours are given as they would look in the dusk light; each time of day then relights
// them. particles.shape: 1 = round snowflakes, 2 = spinning petals or leaves, 3 = rain. No
// particles: the time of day keeps its own motes (pollen, or fireflies at night).
export const SEASONS = {
  spring: {
    label: 'Spring',
    grass: { base: '#0f1a0a', mid: '#2f5214', tip: '#7aa83a', tipGold: '#ec9cbc' },
    ground: { dark: '#101c0a', lit: '#28401a' },
    pines: { dark: '#0d1c12', lit: '#46682c' },
    leaves: { dark: '#12240e', lit: '#7a9e3a' },
    particles: { shape: 2, color: '#ffb6cf', color2: '#ffe3ee', opacity: 0.95, fall: 0.6, size: 1.35 },
  },
  summer: {
    label: 'Summer',
    grass: THEMES.dusk.grass,
    ground: THEMES.dusk.ground,
    pines: THEMES.dusk.pines,
    leaves: THEMES.dusk.leaves,
    particles: null,
  },
  autumn: {
    label: 'Autumn',
    grass: { base: '#1a0e06', mid: '#4a2a0e', tip: '#b8642a', tipGold: '#d89a3a' },
    ground: { dark: '#160c06', lit: '#3a2410' },
    // The pines stay green; the broadleaf trees turn.
    pines: { dark: '#0d1a10', lit: '#3a5428' },
    leaves: { dark: '#2a1206', lit: '#d0702a' },
    particles: { shape: 2, color: '#e0702a', color2: '#a63a18', opacity: 1, fall: 1.1, size: 1.8 },
  },
  winter: {
    label: 'Winter',
    grass: { base: '#8a96a8', mid: '#c4cedb', tip: '#eef3f8', tipGold: '#ffffff' },
    ground: { dark: '#a6b2c2', lit: '#dde4ec' },
    // Snow lies on the tops of the boughs; the shaded undersides stay dark.
    pines: { dark: '#1c2a2a', lit: '#d4dee6' },
    leaves: { dark: '#4e5862', lit: '#dfe6ee' },
    particles: { shape: 1, color: '#ffffff', color2: '#e2eaff', opacity: 1, fall: 1.7, size: 1.1 },
  },
  // The rainy season also clouds the sky over: `overcast` greys whatever the time of day shows.
  rain: {
    label: 'Rain',
    grass: { base: '#08130a', mid: '#1a3416', tip: '#3f6a34', tipGold: '#5c8048' },
    ground: { dark: '#0a120a', lit: '#1a2a16' },
    pines: { dark: '#08140c', lit: '#2c4a26' },
    leaves: { dark: '#0a160a', lit: '#3e6030' },
    overcast: { tint: '#5c6a66', amount: 0.62 },
    particles: { shape: 3, color: '#d8e6ff', color2: '#aabedf', opacity: 1, fall: 30, size: 3 },
  },
};

export const THEME_NAMES = Object.keys(THEMES);
export const SEASON_NAMES = Object.keys(SEASONS);

// The colours the scene eases between, as paths into a theme.
export const COLOR_PATHS = [
  'sky.top',
  'sky.mid',
  'sky.low',
  'sky.horizon',
  'sky.sun',
  'haze',
  'clouds.lit',
  'clouds.shade',
  'treeline.farTop',
  'treeline.farLow',
  'treeline.nearTop',
  'treeline.nearLow',
  'pines.dark',
  'pines.lit',
  'leaves.dark',
  'leaves.lit',
  'grass.base',
  'grass.mid',
  'grass.tip',
  'grass.tipGold',
  'grass.back',
  'ground.dark',
  'ground.lit',
  'light.sun',
  'light.sky',
  'lamps.hemiSky',
  'lamps.hemiGround',
  'lamps.sun',
  'lamps.fill',
  'particles.color',
  'particles.color2',
];

export const NUMBER_PATHS = [
  'stars',
  'clouds.opacity',
  'lamps.hemi',
  'lamps.sunI',
  'lamps.fillI',
  'particles.opacity',
  'particles.fall',
  'particles.size',
  'birds',
  'exposure',
];

const SEASON_PATHS = [
  'grass.base',
  'grass.mid',
  'grass.tip',
  'grass.tipGold',
  'ground.dark',
  'ground.lit',
  'pines.dark',
  'pines.lit',
  'leaves.dark',
  'leaves.lit',
];

export const read = (theme, path) => path.split('.').reduce((o, k) => o?.[k], theme);

