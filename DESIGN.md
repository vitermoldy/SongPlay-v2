# SongLearn: design direction

Direction source: the owner's two reference screenshots (desktop and phone) of a dusk scene with a
glowing CRT television on a grassy hill, which the owner later moved into a forest clearing with a
forest palette. Everything below is derived from them.

Design Read: a consumer service landing page (home-video digitizing) for families holding old
tapes, in a cinematic dusk 3D style. Dial: ENERGY 3 / RHYTHM 2 / MOTION 2.

## Identity

- **Motif: the camcorder viewfinder.** Thin corner brackets frame the hero and the before/after
  frame, the way a camcorder framed the footage people now want saved.
- **Motif: the handwritten tape label.** Dancing Script appears only where a person would have
  written by hand: the first headline line, the labels drawn on the cassettes, the closing
  "Start with one tape."
- **Motif: the cursor is a lamp.** From the owner's reference, where the grass glows gold around
  the pointer. In the 3D scenes the pointer is cast onto the hill and lights the blades there; on
  the flat sections a warm pool follows the mouse (screen blend on night, multiply on paper). Mouse
  only, never on touch, and off when the scene runs without a GPU.
- **One accent: tube glow amber `#ffc56b`.** It is the colour of the lit screen in the scene, so it
  marks only the main action (the wave icon on the button) and keyboard focus on dark grounds.

## Palette (2 cores + 1 accent)

| Token | Value | Reason |
|---|---|---|
| `--night` | `#0f1d17` | The wood after dark; sections read as the same evening going on under the trees. |
| `--cream` | `#f4efe6` | Cassette label paper; the one contrasting ground (Formats) and the button fill. |
| `--glow` | `#ffc56b` | The TV screen; one accent, used at the main action only. |

The scene's own colours (a teal and sage sky, mist, pine and moss greens, bark, a warm low sun) live
only inside the 3D scene. The page takes its night green from it, and moss for the buttons that sit
over the scene.

## Type

- **Nunito Sans (variable):** rounded terminals sit well with the soft scene and stay legible for an
  older audience reading about their parents' tapes.
- **Dancing Script 700:** handwriting on a tape label (see motif).
- Fonts are self-hosted through Fontsource: a privacy-first service should not call a font CDN.

## Motion (dial 2)

- Hero scene: grass in wind, drifting dust, a CRT power-on at load. Purpose: the page opens like a
  tape starting to play. It pauses with the "Pause scene" button, stops when the hero is off
  screen, and starts paused under `prefers-reduced-motion`.
- Hero text enters once on load. No fade-in on scroll anywhere.
- Hover: buttons lift 1px and press on click; links draw an underline.

## Decisions taken against a rule, and why

- **WebGL on a service page.** 3D scenes usually belong to tech pages; the owner's reference is
  a 3D scene, and the owner asked for this look.
- **Forest, not mountains** (owner's request: "vibesnya itu hutan"). The set stands on its knoll in
  a clearing of firs and broadleaf trees, with low bushes where the meadow meets the wood and three
  hazy bands of forest on the horizon where the mountains were. The clearing runs well back behind
  the set, so the far side of the wood stays a band under the sky and the time of day still shows;
  the trees at the sides, nearer the camera, frame the shot.
- **Forest palette** (owner's request). Every time of day is repainted in forest colours: teal and
  sage skies, green mist, pine and moss, bark, yellow-green fireflies at night. The page's navy
  became pine-night green and the periwinkle buttons became moss. Violet is gone from the page and
  from the scene.
- **The TV body is lacquered rust.** The reference set is blue; in the green wood a blue set broke
  the palette and sank into the shade. Rust (bark, autumn leaves) stands out warm against the green.
- **Animals** (owner's request: animals passing through). A doe, a buck, a fox and a hare cross the
  meadow behind the set now and then; flocks of birds cross the sky, none at night or in the rain.
  They walk lanes behind the crest of the hill, so none ever passes in front of the video, and they
  stop to graze, sit up or look round at the sides, where the meadow shows. They belong to the
  scene's motion: Pause scene stops them, and under reduced motion the scene starts still with a
  doe and a hare standing in view.
- **Uppercase nav labels.** From the reference; they echo the PLAY / REW / FF keys on a VCR. Tracking
  stays small (0.04em).
- **"GET STARTED" replaced** with "Start with one tape": the button says what happens (owner
  approved).
- **No Pricing section**: no real prices yet, and made-up numbers would mislead (owner chose to
  drop it).
- **Name: SongLearn** (owner's request), set as a two-tone wordmark like the old one: "Song" in
  white, "Learn" muted. The landing copy still describes the tape digitizing service.
- **Player TV is 16:9** with a thin bezel (owner asked for the video to fill the TV): YouTube
  videos are 16:9, so a wide tube shows them edge to edge with no black bars. The landing page
  keeps the classic 4:3 set of the reference.
- **The set always fits** (owner: "yang penting pas, ga berantakan"): the player TV is sized to
  the free stage between header and deck, the video sits inside a thin dark rim of the glass, and
  on wide screens the pickers move into the header bar to give the set that room. On a phone this
  puts the video under YouTube's 200px guideline; keeping the whole set on screen came first.
- **The player is a wide shot**: the camera stands at one fixed distance from the TV on every
  screen, so the composition (TV about a fifth of the width, like the reference, with the meadow,
  the wood and the sky round it) never changes; the set scales with the window. Sizing the TV to a fixed pixel size
  zoomed in on short laptop screens, which the owner rejected twice. The video is smaller than
  YouTube's 200px guideline on most laptops as a result; YouTube's fullscreen button is there.
  The eye stands a little above the set, looking down onto the hill, with the TV in the middle of
  the window, so the meadow and the far side of the wood show behind it (the owner's earlier point
  of view).
  The set only moves off centre, by tilting the view, when it would meet the controls.
- **Seasons** (owner's request) are a second choice beside the time of day: a season paints the
  grass, the ground and the trees and picks what falls (petals, leaves, snow, rain); the time of day lights it.
  Rain also clouds the sky over: sky, haze, clouds and the distant treeline turn to a cool grey of
  their own brightness, the sun goes in, the stars go out and the birds stay in the trees. Autumn
  turns the broadleaf trees red and orange while the firs stay green; winter lays snow on the boughs.
- **Ambient sound** (owner's request): off by default, made in the browser (no files to license
  or download). The speaker in the header opens a small panel with the switch and the volume, so
