# Hidden Rush — Motion-Graphics Build Brief (After Effects / Resolve Fusion)

**Video:** *Being Ignored Isn't Emotional. It's Physical.* · v01
These scenes are **built, not generated** — geometric/data motion warps in generative video, so make
them in AE or Fusion. Shared palette: bg `#070B1E` (navy) → `#0E0E12` (charcoal); ivory `#F5F0E6`;
accent red `#E1483C`; cold blue `#3A6EA5`. Global: 24 fps, subtle grain overlay, slight vignette,
motion-blur on all moving elements. Font: **Sora** (fallback Inter). Keep everything minimal.

---

## MG-1 · Cyberball ball-pass (Scenes 12–13, ~2:20–2:55)
**Goal:** three players tossing a ball; then the third gets excluded.
- Canvas 1920×1080, bg navy. Three ivory dots (r≈40px) as an equilateral triangle: top-left (P1),
  top-right (P2), bottom-center (YOU).
- **Ball:** small glowing ivory circle + soft outer glow; animate position along a shallow arc
  between dots (ease-in-out, ~0.6s per pass). Add a faint motion trail (echo/CC Force Motion Blur).
- Beat 1 (incl.): ball cycles P1→YOU→P2→YOU→P1 for ~8s, one soft "tick" SFX per catch.
- Beat 2 (exclusion): ball now only travels P1↔P2. YOU dot slowly desaturates to 40% grey and
  scales down 6% over 3s. Ticks continue but never land on YOU — the missing tick is the point.
- No labels needed; if used, tiny 60% ivory "you" under the bottom dot, 2s max.

## MG-2 · Brain node ignite → cool (Scenes 14, 28)
**Goal:** dACC lights up (S14), later cools blue (S28) — the emotional through-line, visual form.
- Use a simple side-profile **brain outline** (ivory stroke, 3px, on navy). Do NOT over-detail.
- S14: place one soft radial glow (red `#E1483C`) at the dACC position (upper-mid, behind forehead).
  Animate: 0→100% glow over 0.8s with a subtle pulse (scale 100→108→100, loop). One low resonant
  hit on ignition. Optional 1.5s lower-third label "dorsal anterior cingulate cortex", then fade.
- S15 (split): duplicate the glow — left panel captioned by VO as "burned hand", right as "excluded"
  — same red node both sides, mirrored. Match-cut whoosh.
- S28: same node, animate hue red→cold blue `#3A6EA5` + intensity down 60% over 1.5s. Tiny caption
  "dACC response ↓" 1s. This visually resolves S14.

## MG-3 · Wiring merge (Scene 19, ~4:45)
**Goal:** "it borrowed the alarm" — two systems become one.
- Two labeled line-paths on navy: left "PAIN" (red-tinted), right "REJECTION" (blue-tinted), drawn
  with trim-paths (write-on, 1.2s). They converge to a central node that pulses red on merge.
- Electric-hum SFX; single ivory pulse travels the merged line outward. ~4s total.

## MG-4 · Venn overlap (Scene 31, ~8:40)
**Goal:** "the border is blurrier than we assumed."
- Two large translucent circles (physical=cool, social=warm), 30% opacity, on navy. Animate them
  drifting toward each other until they overlap ~40%; the intersection glows soft red and softly
  breathes. Slow, ~5s. This is the nuance beat — keep it calm, no hard edges.

## MG-5 · Kinetic type cards (3 only — restraint)
Ivory `#F5F0E6`, one word in accent red; center; gentle scale-in (98→100%) + 8% opacity fade,
2–2.5s hold, subtle fade-out. NO template presets, NO character-by-character karaoke.
1. **Title (0:33):** "Being Ignored Isn't Emotional." (ivory) → beat → "It's Physical." (physical = red).
   Assemble from drifting particles if time allows; else clean fade. Follows the hook, never opens cold.
2. **"just ignore it" (5:50):** the phrase types on, then glitches apart (CC Glitch / displacement)
   on the VO line — red glitch accent. ~1.5s.
3. **"you were never too sensitive" (9:40):** slow, warm fade-in during the climax; "sensitive" in
   soft ivory (NOT red — this beat is tender, not alarming). Hold 2.5s.

## MG-6 · Lower-thirds & captions system
- One term lower-third only (dACC, S14). Style: thin ivory rule + 60% Sora caps, slides up 12px.
- Burned-in subtitles: import `12_Subtitles/HiddenRush_SocialPain_v01.srt`; Sora/Inter Semibold,
  ivory on 40% dark scrim, ≤2 lines, safe 10% margins; highlight only emphasis words in accent red
  (physical, borrowed, false alarm, fewer hurt feelings, not a flaw, name).

**Render:** all MG comps on transparent (alpha) where they overlay stills; otherwise full navy bg.
Export ProRes 4444 for editor compositing.
