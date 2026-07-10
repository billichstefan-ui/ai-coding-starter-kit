# Hidden Rush — Production Package

**Episode 1:** *Being Ignored Isn't Emotional. It's Physical.*
Faceless cinematic psychology documentary · ~10 min · ~1,650 words · English
Built 2026-07-10 · v01

> A complete, research-backed, production-ready YouTube documentary package for the **Hidden Rush**
> channel. Topic selected via a weighted scoring framework over 15 candidates; all load-bearing
> psychological claims are grounded in peer-reviewed research (see Sources/Fact-Check).

---

## 1. Executive concept

Being ignored isn't "just in your head." Social rejection runs through the **same brain circuitry
as physical pain** (dACC / anterior insula) because, for most of human history, being cast out of
the group meant death. The video reframes a universal, quietly shameful experience — the read
receipt, the empty chair, being talked over — as a real neurological alarm, then hands the viewer a
reframe that turns self-blame into self-understanding. Sensational-sounding, but true — which is the
whole trust play for episode 1.

---

## Output map (all 33 required sections → where they live)

| # | Section | File |
|---|---|---|
| 1 | Executive concept | this README + `02_Strategy/…Strategy` §1 |
| 2 | Research findings | `02_Strategy/…Strategy` §2 |
| 3 | Topic shortlist + scoring | `02_Strategy/…Strategy` §3 |
| 4 | Selected topic + rationale | `02_Strategy/…Strategy` §4 |
| 5 | Audience persona | `02_Strategy/…Strategy` §5 |
| 6 | Content-gap analysis | `02_Strategy/…Strategy` §6 |
| 7 | Central thesis | `02_Strategy/…Strategy` §7 |
| 8 | Title options + scoring | `02_Strategy/…Strategy` §8 |
| 9 | Final title | `02_Strategy/…Strategy` §9 |
| 10 | Thumbnail concepts | `02_Strategy/…Strategy` §10 |
| 11 | Final thumbnail | `02_Strategy/…Strategy` §11 |
| 12 | Thumbnail prompts | `02_Strategy/…Strategy` §12 |
| 13 | Retention architecture | `03_Script/…Script` §13 |
| 14 | Opening hooks | `03_Script/…Script` §14 |
| 15 | Final script | `03_Script/…Script` §15 |
| 16 | Fact-check table | `04_Sources/…Sources_FactCheck` §16 |
| 17 | Source list | `04_Sources/…Sources_FactCheck` §17 |
| 18 | Scene-by-scene table | `05_Storyboard/…SceneTable` |
| 19 | AI image prompts | `07_AI_Prompts/…AIPrompts` §19 |
| 20 | AI video prompts | `07_AI_Prompts/…AIPrompts` §20 |
| 21 | Voice-over instructions | `03_Script/…Script` §21 |
| 22 | Music & sound design | `09_Music_SFX/…SoundDesign` §22 |
| 23 | Editing blueprint | `10_Edit/…EditBlueprint` §23 |
| 24 | YouTube description | `13_YouTube_Metadata/…SEO` §24 |
| 25 | Chapters | `13_YouTube_Metadata/…SEO` §25 |
| 26 | Keywords/tags/hashtags | `13_YouTube_Metadata/…SEO` §26 |
| 27 | Pinned comment | `13_YouTube_Metadata/…SEO` §27 |
| 28 | Community post | `13_YouTube_Metadata/…SEO` §28 |
| 29 | Three Shorts | `14_Shorts/…Shorts` |
| 30 | Quality audit | `16_Archive/…QA` §30 |
| 31 | Production workflow | this README ↓ |
| 32 | File/folder structure | this README ↓ |
| 33 | Publishing checklist | this README ↓ |

---

## 32. Folder structure

```
Hidden-Rush/
├── 01_Research/           notes, raw source captures (add as you go)
├── 02_Strategy/           ★ Strategy: research, scoring, persona, gap, thesis, titles, thumbnails
├── 03_Script/             ★ Script: retention arch, hooks, final narration, VO direction
├── 04_Sources/            ★ Fact-check table + source list
├── 05_Storyboard/         ★ Scene-by-scene production table
├── 06_Visuals/            rendered stills/plates (output dir)
├── 07_AI_Prompts/         ★ Image + video prompts, per-platform
├── 08_Voiceover/          VO audio exports (output dir; direction lives in 03_Script)
├── 09_Music_SFX/          ★ Music + sound-design plan; license receipts
├── 10_Edit/               ★ Editing blueprint; project files
├── 11_Thumbnail/          exported thumbnail variants (A/B)
├── 12_Subtitles/          .srt / burned-caption exports
├── 13_YouTube_Metadata/   ★ SEO: title, description, chapters, tags, pinned comment, community post
├── 14_Shorts/             ★ 3 Shorts scripts + exports
├── 15_Localization/       dub/subtitle notes, culture-check list
└── 16_Archive/            ★ Quality audit; version snapshots
```
★ = populated in v01. Naming: `HiddenRush_SocialPain_<Section>_v01.md`.

---

## 31. Recommended production workflow

1. **Lock script** (`03_Script`) — do a read-aloud timing pass; trim Sections F/I ~120 words for a
   clean 10:00 if desired.
2. **Generate VO** (ElevenLabs w/ the prompt in §21) → `08_Voiceover`. This sets true runtime.
3. **Build MG assets** (Cyberball, brain node, venn, wiring) in AE/Resolve — *not* generative.
4. **Generate AI stills** (Midjourney/Flux via §19) → `06_Visuals`; select + upscale.
5. **Animate stills** (Veo/Runway/Kling via §20) → keep continuity anchors consistent.
6. **Thumbnails** (§12 prompts) → 2–3 variants → `11_Thumbnail`.
7. **Assemble to VO** per `10_Edit`; lock match-cut spine + red-accent grade rule.
8. **Sound design** (`09_Music_SFX`); place silence beats; heartbeat through-line.
9. **Captions** (`12_Subtitles`) per caption rules; emphasis-word highlights only.
10. **Metadata** (`13_YouTube_Metadata`) into YouTube Studio; schedule.
11. **Cut 3 Shorts** (`14_Shorts`) from the finished master.
12. **Localization prep** (`15_Localization`) — flag idioms for future dubs.

*Optional tooling available in this workspace:* Higgsfield (AI image/video/voice + virality
predictor), Adobe Firefly / Canva (thumbnails), Notion/Monday (task tracking), Spotify (music-style
reference only). Use where they speed a step — none were fabricated in this package.

## Decision log (major choices)
- **Topic:** chose credibility-anchored universality (#1) over higher-sensation options (#2 trauma
  bonding, #14 "people want you to fail") to build episode-1 trust. #2 banked as episode 2.
- **Format:** single-thesis cinematic explainer instead of the niche-dominant listicle → clearer
  differentiation for a new channel.
- **Honesty section kept in-script and in-description** (dACC-specificity debate) — deliberate trust
  signal, accepts a small retention cost for long-term credibility.
- **Title:** contradiction framing ("Isn't Emotional. It's Physical.") over pure-curiosity
  ("painkiller for a broken heart") as primary — lower misread risk on video 1; the bold one is A/B.

---

## 33. Publishing checklist

- [ ] Script timed to target runtime (read-aloud pass)
- [ ] VO generated, de-essed, leveled to ~-16 LUFS integrated
- [ ] All MG assets built (Cyberball, brain node, venn, wiring)
- [ ] AI stills generated, upscaled, continuity-checked
- [ ] Clips animated; red accent only on pain beats; match cuts intact
- [ ] Music licensed for monetized YT (receipts in `09_Music_SFX`)
- [ ] Silence beats + heartbeat motif placed
- [ ] Color grade pass (crushed blacks, teal/amber split, grain, vignette)
- [ ] Captions burned-in, emphasis highlights, safe margins, mobile-checked
- [ ] Thumbnail A + B exported (1280×720, < 2MB, legible at 120px)
- [ ] Title + description + chapters + tags entered; keyword not stuffed
- [ ] Pinned comment ready to post at upload
- [ ] End screen / next-video (ep. 2 tease) card set
- [ ] "Not medical advice" disclaimer present in video + description
- [ ] Sources listed in description (incl. the critique paper)
- [ ] 3 Shorts cut, captioned, scheduled (day 0 / +3 / +6)
- [ ] Community post queued for launch day
- [ ] Final QA: all `16_Archive/…QA` axes ≥ 9
- [ ] Localization notes filed for future dubs
