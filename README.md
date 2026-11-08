# ModernWebsite-v

Landing page for **SongLearn**, a tape digitizing service (VHS, Hi8, Super 8, MiniDV). The hero is a
real-time 3D dusk scene: a glowing CRT television on a grassy knoll in a forest clearing, grass and
trees moving in the wind, deer, a fox, a hare and birds passing now and then,
drifting dust and a CRT power-on at load.

Built with [Vite](https://vite.dev) and [three.js](https://threejs.org), no framework.

Two pages:

- `index.html`: the landing page. The mouse cursor works as a lamp: over the 3D hero it lights the
  grass it points at, and over the other sections a warm pool of light follows it.
- `player.html` ("Put a song on"): only the TV in the clearing. Paste YouTube links (a video, a YouTube
  Music link, a Short or a whole playlist); they stack up in a queue shown as a dropdown, and play
  one after another on the TV's screen. Here the set is a 16:9 TV with a thin bezel; the video
  covers the glass inside a thin dark rim. Pick a time of day (Dusk, Night, Sunset, Dawn) and a
  season (Spring: blossom and petals, Summer, Autumn: falling leaves, Winter: snow, Rain: an
  overcast sky and falling rain); both are kept in the browser. The speaker button in the header
  opens the ambient sound: an on/off switch and a volume slider for wind, rain and thunder,
  crickets, birds and rustling leaves to match the sky and season. Reached from the header button
  and the footer.

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
```

`dist/` uses relative paths, so it can be uploaded to any static host as is.

## Structure

```
index.html            landing page: hero, services, formats, contacts, footer
player.html           the "Put a song on" page
src/main.js           header, mobile menu, in-page links, scene start-up
src/styles.css        tokens, layout, responsive rules (shared by both pages)
src/cursor-light.js   the 2D lamp that follows the cursor outside the 3D scene
src/compare.js        before/after frame (the VHS look is made in a 2D canvas)
src/form.js           request form: validation, then a pre-filled email
src/player/           the player page
  main.js             queue (kept in localStorage), YouTube player, dropdown, controls
  youtube.js          link parsing, titles from oEmbed, the IFrame API loader
  ambience.js         the ambient sound, made with the Web Audio API (no audio files)
  player.css          stage, deck and dropdown
src/scene/            the 3D scene, used by both pages ("hero" and "player" variants)
  index.js            renderer, camera, loop, pause, cursor light, video on the screen (CSS3D)
  terrain.js          hill shape and the clearing's edge, shared by ground, grass and trees
  forest.js           firs, broadleaf trees and bushes round the clearing (instanced)
  animals.js          the doe, buck, fox, hare and birds, their routes and stops
  grass.js            instanced grass blades with wind
  tv.js               television (classic 4:3 and wide 16:9 sets), screen shader with power-on
  themes.js           times of day (sky, sun or moon, stars, light) and seasons (grass, what falls)
  sky.js              sky, clouds, the bands of forest on the horizon
  particles.js        what drifts: dust, fireflies, snow, petals, leaves
  post.js             bloom, focus blur, grain and vignette
DESIGN.md             design direction and the reason behind each choice
```

