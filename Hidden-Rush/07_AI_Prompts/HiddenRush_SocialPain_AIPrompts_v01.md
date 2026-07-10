# Hidden Rush — AI Image & Video Prompts

**Video:** *Being Ignored Isn't Emotional. It's Physical.* · v01 · 16:9

**Global style token** (append to every image prompt for consistency):
`— cinematic minimalist psychological documentary, charcoal & deep-navy palette, muted ivory
subject, single restrained red accent, volumetric low-key lighting, subtle film grain, shallow
depth of field, generous negative space, editorial realism, 16:9 —`

**Global negative** (every prompt):
`no logos, no watermark, no captions, no random text, no distorted/extra faces, no extra limbs,
no oversaturation, no busy clutter, no gore, no melting artifacts`

**Continuity anchors:** the recurring "protagonist" is a genderless ivory-lit silhouette, same
proportions across scenes; the recurring "alarm" motif is a single warm-red glow at the sternum;
the "brain node" is one glowing region on a dark ivory brain outline.

---

## 19. AI Image Prompts (by scene)

**S3/S21/S32 — Protagonist silhouette (hero, reused)**
> Midjourney/Flux: `A single genderless human silhouette from chest up, seen three-quarter from
> behind, rendered in soft ivory rim-light against a deep charcoal-navy void, shoulders subtly
> tense, immense negative space around them, moody, contemplative, cinematic ::` + global style.
> **Ideogram (for text-safe variants):** same, add `clean empty upper-left region for text overlay`.

**S6/S7 — The empty chair**
> `An empty wooden chair at the edge of a warm candle-lit dinner table, other seats occupied by
> softly out-of-focus laughing figures, the empty chair catching a colder isolated light, bokeh
> warmth behind cold foreground` + global style.
> *S7 variant:* `the same empty chair now completely alone in darkness, a single hard top spotlight,
> everything else swallowed by black.`

**S16 — Ancestral ridge**
> `A lone human silhouette standing on a savanna ridge at dusk, vast dramatic sky, long shadow
> stretching across dry grass, distant tiny firelight, epic scale, warm-amber horizon fading to
> deep blue night` + global style.

**S17/S18 — Fire circle / walking away**
> `A small circle of prehistoric human figures gathered around a low fire at night, backs to an
> encroaching darkness, warm amber firelight on faces turned inward, cold void beyond` + global.
> *S18:* `one figure walking alone away from a distant fire into total darkness, growing smaller,
> amber light abandoning them, bleak, cinematic.`

**S24/S25 — Smoke detector / toast**
> `A single white smoke detector on a dark ceiling in an empty room, one tiny red LED blinking,
> low-angle, ominous stillness, deep shadow` + global.
> *S25:* `a thin wisp of pale toast smoke curling upward under a blinking smoke detector, macro,
> soft warm smoke against a cold dark ceiling.`

**S26 — The pill (key visual / thumbnail source)**
> `A single plain white pill resting centered on a charcoal matte surface, a barely-visible
> hairline red crack running beneath it, dramatic spotlight, stark, symbolic, macro, high contrast`
> + global style.

**Thumbnail prompts:** see `02_Strategy/HiddenRush_SocialPain_Strategy_v01.md` §12 (Concepts A/B/C).

---

## 20. AI Video Prompts (image→video, per platform)

For each: camera move · subject motion · environment motion · speed · duration · start/end frame ·
realism · consistency · artifact avoidance.

**V-S1 — Read receipt (Runway Gen-3 / Kling)**
> Start frame: macro dark phone, "Read" + three typing dots. `Slow 8% push-in. The three typing
> dots pulse gently twice, then disappear; screen brightness dips slightly. No hands, no reflection
> change. Very slow, restrained.` Duration 4s. End frame: dots gone, screen darker. Realism: high.
> **Kling note:** set motion strength low (2–3) to avoid warping the UI. **Avoid:** text morphing,
> flicker, added notifications.

**V-S12/13 — Cyberball ball-pass (After Effects/MG preferred; or Pika)**
> 2D motion graphic, not generative: three ivory dots on navy, a glowing ball arcs between them in
> a loop; after 3 passes the ball only travels between two dots while the third slowly desaturates
> and stills. 6s loop. (Generative tools warp geometric motion — build this in AE/Canva.)

**V-S16 — Ancestral ridge (Veo / Google Flow / Sora)**
> `Cinematic slow crane-up on a lone silhouette on a savanna ridge at dusk; grass ripples in soft
> wind, distant firelight flickers, clouds drift slowly across an amber-to-navy sky. Epic, patient,
> photoreal, shallow atmosphere haze.` Duration 6s. Camera: rising crane. Subject: near-still,
> slight hair/cloth movement. Realism: high. **Consistency:** keep silhouette proportions matching
> hero. **Avoid:** face detail, flickering limbs, warp on horizon.

**V-S18 — Walking into darkness (Veo / Runway)**
> `Locked wide shot; a single figure walks slowly away from a distant campfire directly into
> darkness, becoming smaller and dimmer until nearly swallowed. Embers drift. Firelight recedes.`
> 6s. Camera static. Motion: subject recedes at steady slow pace. **Avoid:** figure turning back,
> speed ramp glitches, extra figures spawning.

**V-S25 — Toast smoke under alarm (Higgsfield / Kling)**
> `Macro; a thin ribbon of pale smoke curls and drifts upward past a blinking red LED on a dark
> ceiling. Slow, hypnotic, natural turbulence.` 5s. Camera: micro drift up. Environment: smoke
> fluid sim. Realism: high. **Avoid:** smoke becoming a face/shape, LED flicker jitter.

**V-S26 — Pill reveal (Runway / Kling)**
> `Very slow push-in on a single white pill on charcoal; a hairline red crack beneath it faintly
> pulses once with light. Dust motes drift through the spotlight. Minimal, ominous, elegant.` 5s.
> Camera: 6% push. Motion: crack glow pulse, dust. **Avoid:** pill multiplying, text on pill, melt.

**V-S32 — Warmth returns (Veo / Runway)**
> `Slow push-in on the hero ivory silhouette in a dark room; warm golden light gradually blooms
> from off-screen left, softening the cold, the figure's posture easing. Emotional, restorative.`
> 6s. Camera: slow push. Light: warm bloom rises. **Consistency:** same silhouette as S3/S21.
> **Avoid:** face appearing, over-bright blowout, posture snapping.

**Platform routing cheat-sheet**
| Need | Best tool |
|---|---|
| Photoreal atmospheric scenes (ridge, fire, room) | **Veo / Google Flow / Sora** |
| Controlled push-ins on objects (phone, pill) | **Runway Gen-3 / Kling** |
| Geometric/data motion (Cyberball, brain node, venn) | **After Effects / Canva MG** — not generative |
| Stylized b-roll / quick fills | **Pika / Higgsfield** |
| Stills for thumbnails | **Midjourney / Flux** (realism), **Ideogram** (text-safe area) |
