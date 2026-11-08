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
