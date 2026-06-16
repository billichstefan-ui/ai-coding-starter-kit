# PROJ-10: Design & Brand (Vorschlags-Kategorie)

## Status: Planned
**Created:** 2026-06-16
**Last Updated:** 2026-06-16

## Dependencies
- **Requires:** PROJ-2 (Daily Suggestion Engine) — `category`-Enum, Prompt & Output-Schema um `design` erweitern
- **Requires:** PROJ-3 (Review & Approval Dashboard) — Badge + Filter für die neue Kategorie
- **Requires:** PROJ-7 (Context-Aware Suggestions) / `src/lib/nora-context.ts` — visuellen Brand-Kontext einspeisen
- **Kompatibel mit:** PROJ-4 (Monday.com) / PROJ-5 (Notion) — kategorie-agnostisch, keine Änderung nötig

## User Stories
- Als Stefan möchte ich, dass NORA auch Vorschläge zu **Design & Brand** (visuelle Identität, Logo, Farben, Konsistenz) generiert, damit KIcasso markenkonform nach außen auftritt — ohne dass ich selbst daran denken muss.
- Als Stefan möchte ich, dass Design-Vorschläge auf dem **KIcasso Brand Guide** (Sora, #0078FF, Gradient Cyan→Violet, Navy #070B1E, Dark Premium) basieren, damit sie konkret statt generisch sind.
- Als Stefan möchte ich Design-Vorschläge im **selben Review-Dashboard** sehen und bestätigen wie die anderen Kategorien, damit mein 2-Minuten-Workflow gleich bleibt.
- Als Stefan möchte ich Design-Vorschläge im **Kategorie-Filter** ein-/ausblenden können, um gezielt nach Thema zu reviewen.
- Als Stefan möchte ich bestätigte Design-Vorschläge wie gewohnt als **Monday-Task / Notion-Doku** umsetzen lassen, ohne neuen Prozess.

## Out of Scope
- **Website/Landingpage, Social-Profile-Auftritt, PR & Sichtbarkeit** als Themen — bewusst ausgeklammert; Fokus rein auf visuelle Identität/Brand. Können später eigene Kategorien/Features werden.
- **Automatische Bild-/Grafik-Generierung** (Logo-Varianten, Post-Grafiken, Banner) — Vorschläge bleiben textuelle Entwürfe; visuelle Asset-Generierung wäre ein eigenes Feature.
- **Erhöhung der täglichen Vorschlagsmenge** — bleibt 3–5 gesamt.
- **Garantierter Design-Vorschlag** pro Tag/Woche — Verteilung bleibt flexibel (Claude entscheidet).
- **Eigene Monday-Boards / Notion-Bereiche** für Design — läuft durch dieselbe Pipeline wie bestehende Kategorien (PROJ-4/5), kein Sondermapping.
- **Live-/externe Brand-Daten** (z. B. aktueller Website-Stand) — über PROJ-7 hinaus, nicht Teil dieses Features.
- **Editierbarer Brand-Kontext via Settings-UI** — bleibt in der Config (`nora-context.ts`), wie bei PROJ-2.

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

### Kategorie-Generierung
- [ ] Angenommen NORA generiert Vorschläge, wenn ein Lauf abschließt, dann ist `design` ein gültiger Wert im `category`-Feld zusätzlich zu `marketing`, `product`, `operations`.
- [ ] Angenommen der visuelle Brand-Kontext (aus `docs/design-system.md`) ist in NORAs Wissensbasis hinterlegt, wenn NORA einen `design`-Vorschlag erzeugt, dann referenziert er konkrete Markenelemente (Sora-Font, Primärfarbe #0078FF, Gradient Cyan→Violet, Navy #070B1E, Dark-Premium-Stil) statt generischer Design-Tipps.
- [ ] Angenommen die Tagesmenge ist 3–5 Vorschläge gesamt, wenn NORA generiert, dann verteilt Claude diese flexibel über vier Kategorien (inkl. `design`) ohne feste Quote und ohne die Gesamtmenge zu erhöhen.
- [ ] Angenommen ein `design`-Vorschlag wird erzeugt, wenn er gespeichert wird, dann sind die Felder `title`, `body`, `insight`, `source`, `category` befüllt (wie bei allen Kategorien).

### Anzeige & Review (PROJ-3)
- [ ] Angenommen ein `design`-Vorschlag existiert, wenn Stefan das Dashboard öffnet, dann wird er mit einem eigenen Badge „Design & Brand" und einer eigenen Kategorie-Farbe angezeigt.
- [ ] Angenommen das Dashboard hat einen Kategorie-Filter, wenn Stefan „Design & Brand" auswählt, dann werden nur `design`-Vorschläge angezeigt.
- [ ] Angenommen ein `design`-Vorschlag wird angezeigt, wenn Stefan ihn bestätigt oder ablehnt, dann funktioniert der Review-Flow identisch zu den anderen Kategorien.

### Umsetzung & Robustheit
- [ ] Angenommen ein `design`-Vorschlag ist bestätigt, wenn Stefan ihn umsetzen lässt, dann läuft das über dieselbe Monday/Notion-Pipeline wie bei den bestehenden Kategorien (kein Sondermapping).
- [ ] Angenommen Vorschläge der Kategorien marketing/product/operations existieren, wenn die Kategorie `design` eingeführt wird, dann bleiben sie unverändert gültig und werden korrekt angezeigt (Rückwärtskompatibilität).
- [ ] Angenommen Claude liefert einen unbekannten/ungültigen category-Wert, wenn der Vorschlag verarbeitet wird, dann wird er nicht als gültig gespeichert (Schema-Validierung greift wie bisher).

## Edge Cases
- **Kein `design`-Vorschlag an einem Tag** → völlig normal (flexible Verteilung), kein Fehler.
- **Nur `design`-Vorschläge an einem Tag** → innerhalb 3–5 erlaubt, akzeptiert.
- **Alte DB-Einträge/Filter ohne `design`** → rückwärtskompatibel; neue Filter-Option kommt zusätzlich.
- **`docs/design-system.md` ändert sich** → NORA-Kontext muss manuell nachgezogen werden (kein Auto-Sync).
- **Vorschlag mischt Design + anderes Thema** → Claude wählt die dominante Kategorie (1 Kategorie pro Vorschlag, wie bisher).
- **Sehr generischer Vorschlag ohne Markenbezug** → Prompt erzwingt Markenbezug; QA prüft Stichprobe.

## Technical Requirements
- `category`-Enum/Schema erweitern (DB-Constraint **falls vorhanden**, Zod-Output-Schema, Prompt) ohne bestehende Werte zu brechen.
- Keine neue Tabelle — nutzt die bestehende `suggestions`-Tabelle.
- Brand-Kontext server-seitig (kein Client-Bundle).
- Dashboard sollte Kategorien möglichst datengetrieben behandeln (Badge/Filter nicht hart auf drei Werte verdrahtet).

## Open Questions
- [ ] Konkrete Badge-Farbe für „Design & Brand" (Vorschlag: Violett-Akzent #A720FF des Gradients) → final in `/frontend`.
- [ ] Ist `suggestions.category` ein DB-CHECK/Enum (Migration nötig) oder freier Text? → in `/architecture` bzw. `/backend` prüfen.

## Decision Log

### Product Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Fokus rein auf visuelle Identität/Brand | Website/Social/PR bewusst ausgeklammert → klarer, testbarer Scope | 2026-06-16 |
| DB-Wert `design`, Anzeige-Label „Design & Brand" | Konsistent mit bestehenden Enum-Werten; kompaktes Badge | 2026-06-16 |
| 3–5 Vorschläge/Tag gesamt, flexible Verteilung über 4 Kategorien | Hält 2-Minuten-Review realistisch; konsistent mit PROJ-2 | 2026-06-16 |
| Brand Guide (`design-system.md`) in NORA-Kontext einspeisen | Markenkonforme, konkrete Vorschläge statt generischer Tipps | 2026-06-16 |
| Gleiche Review-/Umsetzungs-Pipeline wie andere Kategorien | Kein neuer Prozess; minimaler Aufwand | 2026-06-16 |
| Vorschläge bleiben Text-Entwürfe (keine Visual-Generierung) | Konsistent mit „kein Auto-Posting"; hält Scope klein | 2026-06-16 |

### Technical Decisions
<!-- Added by /architecture -->
| Decision | Rationale | Date |
|----------|-----------|------|
| _Noch offen_ | _wird in `/architecture` ergänzt_ | |

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
