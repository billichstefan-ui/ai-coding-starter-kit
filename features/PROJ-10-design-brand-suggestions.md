# PROJ-10: Design & Brand (Vorschlags-Kategorie)

## Status: Approved
**Created:** 2026-06-16
**Last Updated:** 2026-06-23

## Dependencies
- **Requires:** PROJ-2 (Daily Suggestion Engine) — `category`-Enum, Prompt & Output-Schema um `design` erweitern
- **Requires:** PROJ-3 (Review & Approval Dashboard) — Badge + gruppierter Abschnitt für die neue Kategorie
- **Requires:** PROJ-7 (Context-Aware Suggestions) / `src/lib/nora-context.ts` — visuellen Brand-Kontext einspeisen
- **Kompatibel mit:** PROJ-4 (Monday.com) / PROJ-5 (Notion) / PROJ-8 (Ausarbeitung) — kategorie-agnostisch, keine Änderung nötig
- **Koexistiert mit:** PROJ-9 (Produkt-Chance) — `design` ist Teil der Haupt-Generierung (4 Kategorien), `digital_product` bleibt der separate best-effort Zusatz-Insert

## Übersicht
NORA generiert täglich Vorschläge in den Kategorien Marketing, Produkt und Operations. Dieses Feature fügt eine **vierte Kategorie in die Haupt-Generierung hinzu: „Design & Brand" (`design`)** — Maßnahmen zur visuellen Identität und Markenkonsistenz von Kordix AI (Logo-Einsatz, Farb- und Typografie-Konsistenz, Wiedererkennbarkeit über Touchpoints wie Website, LinkedIn-Grafiken, Pitch-Deck, Doku-Templates).

Damit Vorschläge konkret statt generisch sind, wird NORAs Wissensbasis (`src/lib/nora-context.ts`) um eine Sektion **„Visuelle Identität & Brand Guide"** ergänzt, abgeleitet aus `docs/design-system.md` (Kordix AI Dark Premium: Sora-Font, Primärfarbe Electric Blue #0078FF, Signature-Gradient Cyan→Violet #38E5FF→#A720FF, Navy #070B1E). Der Generierungs-Prompt verlangt für `design`-Vorschläge konkreten Bezug auf diesen Brand Guide.

Die Gesamtmenge bleibt **3–5 Vorschläge pro Tag**; Claude verteilt flexibel über vier Kategorien (keine feste Quote — an manchen Tagen passt kein Design-Vorschlag, das ist in Ordnung). Es werden keine Bilder/Grafiken generiert — nur textuelle Maßnahmen-Entwürfe.

> **Hinweis zur Markenentscheidung (2026-06-21):** Dieses Feature wurde aus dem ursprünglichen PR #2 herausgelöst. Der dort gebündelte „KIcasso"-Rebrand (Neon-Graffiti) wurde **verworfen**; die Dachmarke bleibt **Kordix AI** mit „Dark Premium"-Optik. Nur der reine Feature-Anteil (Design-Kategorie) wurde übernommen.

## User Stories
- Als Stefan möchte ich, dass NORA auch Vorschläge zu **Design & Brand** (visuelle Identität, Logo, Farben, Konsistenz) generiert, damit Kordix AI markenkonform auftritt — ohne dass ich selbst daran denken muss.
- Als Stefan möchte ich, dass Design-Vorschläge auf dem **Kordix AI Brand Guide** (Sora, #0078FF, Gradient Cyan→Violet, Navy #070B1E, Dark Premium) basieren, damit sie konkret statt generisch sind.
- Als Stefan möchte ich Design-Vorschläge im **selben Review-Dashboard** sehen und bestätigen wie die anderen Kategorien, damit mein 2-Minuten-Workflow gleich bleibt.
- Als Stefan möchte ich Design-Vorschläge in einem **eigenen, klar beschrifteten Abschnitt „Design & Brand"** sehen, um sie gezielt zu reviewen.
- Als Stefan möchte ich bestätigte Design-Vorschläge wie gewohnt als **Monday-Task / Notion-Doku** umsetzen lassen, ohne neuen Prozess.

## Out of Scope
- **Markenumbenennung / Rebrand** (z. B. „KIcasso") — verworfen (Markenentscheidung 2026-06-21). Dachmarke bleibt Kordix AI.
- **Automatische Bild-/Grafik-Generierung** (Logo-Varianten, Post-Grafiken, Banner) — Vorschläge bleiben textuelle Entwürfe.
- **Erhöhung der täglichen Vorschlagsmenge** — bleibt 3–5 gesamt.
- **Garantierter Design-Vorschlag** pro Tag/Woche — Verteilung bleibt flexibel (Claude entscheidet).
- **Eigene Monday-Boards / Notion-Bereiche** für Design — läuft durch dieselbe Pipeline (PROJ-4/5), kein Sondermapping.
- **Live-/externe Brand-Daten** (z. B. aktueller Website-Stand) — über PROJ-7 hinaus, nicht Teil dieses Features.
- **Editierbarer Brand-Kontext via Settings-UI** — bleibt in der Config (`nora-context.ts`), wie bei PROJ-2.

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

### Kategorie-Generierung
- [x] Angenommen NORA generiert Vorschläge, wenn ein Lauf abschließt, dann ist `design` ein gültiger Wert im `category`-Feld zusätzlich zu `marketing`, `product`, `operations`.
- [x] Angenommen der visuelle Brand-Kontext ist in NORAs Wissensbasis hinterlegt, wenn NORA einen `design`-Vorschlag erzeugt, dann referenziert er konkrete Markenelemente (Sora-Font, #0078FF, Gradient Cyan→Violet, Navy #070B1E, Dark-Premium-Stil) statt generischer Design-Tipps.
- [x] Angenommen die Tagesmenge ist 3–5 Vorschläge gesamt, wenn NORA generiert, dann verteilt Claude diese flexibel über vier Kategorien (inkl. `design`) ohne feste Quote und ohne die Gesamtmenge zu erhöhen.
- [x] Angenommen ein `design`-Vorschlag wird erzeugt, wenn er gespeichert wird, dann sind die Felder `title`, `body`, `insight`, `source`, `category` befüllt (wie bei allen Kategorien).

### Anzeige & Review (PROJ-3)
- [x] Angenommen ein `design`-Vorschlag existiert, wenn Stefan das Dashboard öffnet, dann wird er mit einem eigenen Badge „Design & Brand" und einer eigenen Kategorie-Farbe (Deep Teal #0E9594) angezeigt.
- [x] Angenommen offene `design`-Vorschläge existieren, wenn Stefan das Dashboard öffnet, dann werden sie in einem eigenen gruppierten Abschnitt „Design & Brand" zusammengefasst (analog zu Marketing/Produkt/Operations).
- [x] Angenommen ein `design`-Vorschlag wird angezeigt, wenn Stefan ihn bestätigt oder ablehnt, dann funktioniert der Review-Flow identisch zu den anderen Kategorien.

### Umsetzung & Robustheit
- [x] Angenommen ein `design`-Vorschlag ist bestätigt, wenn Stefan ihn umsetzen lässt, dann läuft das über dieselbe Monday/Notion-Pipeline (kein Sondermapping).
- [x] Angenommen Vorschläge der Kategorien marketing/product/operations existieren, wenn `design` eingeführt wird, dann bleiben sie unverändert gültig (Rückwärtskompatibilität).
- [x] Angenommen Claude liefert einen unbekannten/ungültigen category-Wert, wenn der Vorschlag verarbeitet wird, dann wird er nicht als gültig gespeichert (Zod-`z.enum` greift wie bisher).

## Edge Cases
- **Kein `design`-Vorschlag an einem Tag** → völlig normal (flexible Verteilung), kein Fehler.
- **Nur `design`-Vorschläge an einem Tag** → innerhalb 3–5 erlaubt, akzeptiert.
- **Alte DB-Einträge/Filter ohne `design`** → rückwärtskompatibel; die CHECK-Constraint wird nur erweitert.
- **`docs/design-system.md` ändert sich** → NORA-Kontext (`nora-context.ts`) muss manuell nachgezogen werden (kein Auto-Sync).
- **Vorschlag mischt Design + anderes Thema** → Claude wählt die dominante Kategorie (1 Kategorie pro Vorschlag, wie bisher).

## Technical Requirements
- `category` erweitern an drei Stellen ohne Bestehendes zu brechen: Zod-Output-Schema/`CATEGORIES` (`anthropic.ts`), DB-CHECK-Constraint (`supabase/schema.sql`, idempotent), Prompt-Guidance.
- Keine neue Tabelle — nutzt die bestehende `suggestions`-Tabelle.
- Brand-Kontext server-seitig (`nora-context.ts`, kein Client-Bundle).
- Dashboard-Kategorie-Configs additiv erweitern (Badge/Reihenfolge), konsistent mit dem PROJ-9-Muster (inline-Config je Komponente).

## Open Questions
- [x] Ist `suggestions.category` ein DB-CHECK (Migration nötig)? → **Ja**, CHECK-Constraint auf `suggestions.category`. Erweiterung per idempotentem DROP/ADD CONSTRAINT (gleiches Muster wie PROJ-6/PROJ-9).
- [x] Konkrete Badge-Farbe für „Design & Brand" → **Deep Teal `#0E9594`** — der verbleibende dokumentierte Kordix-Markenakzent (Marketing=Cyan, Produkt=Blau, Operations=Violett, Produkt-Chance=Periwinkle sind belegt). Bleibt strikt in der Dark-Premium-Palette; **kein** KIcasso-Neon. (Markenentscheidung 2026-06-21)
- [x] Notion-„Kategorie"-Select-Option „Design & Brand"? → Notion legt die Select-Option beim ersten `createPage`-Schreiben automatisch an; kein Sondermapping nötig.

## Decision Log

### Product Decisions
- **2026-06-21 — Aus PR #2 herausgelöst:** Feature (Design-Kategorie) übernommen, KIcasso-Rebrand verworfen. Dachmarke bleibt Kordix AI (Dark Premium).
- **Design ist Teil der Haupt-Generierung** (4 Kategorien), nicht ein separater Call wie PROJ-9. Begründung: Design-Maßnahmen konkurrieren mit Marketing/Produkt/Operations um dieselben 3–5 Tagesslots; eine flexible Verteilung ist gewollt.

### Technical Decisions
- **Badge-Farbe Deep Teal `#0E9594`** statt des in PR #2 vorgeschlagenen Violetts `#A720FF` — letzteres ist auf der Kordix-Marke bereits Operations. Teal ist der einzige freie dokumentierte Markenakzent.
- **Inline-Kategorie-Config beibehalten** (je Dashboard-Komponente), statt PR #2's `src/lib/categories.ts`-Refactor zu übernehmen — geringeres Risiko und konsistent mit dem bereits gemergten PROJ-9. Eine spätere Zentralisierung bleibt als optionaler Cleanup möglich.

## Implementation Notes (2026-06-21)
- **Geändert:** `src/lib/anthropic.ts` (`CATEGORIES` + `design` Generierungs-Guidance + `design`-Ausarbeitungs-Prompt), `src/lib/nora-context.ts` (Sektion „Visuelle Identität & Brand Guide"), `supabase/schema.sql` (CHECK um `design`), Dashboard-Komponenten (`dashboard-client.tsx`, `history-view.tsx`, `suggestion-card.tsx`).
- **Tests:** `src/lib/anthropic.test.ts` um Design-Ausarbeitungs- und Generierungs-Prompt-Tests erweitert. Gesamt grün; `tsc --noEmit` exit 0.
- **Offen vor Deploy:** `supabase/schema.sql` im Supabase SQL-Editor ausführen (idempotent), damit `category = 'design'`-Zeilen akzeptiert werden. Optionale formale `/qa`-Runde + `/deploy`.

## QA Test Results

**QA Engineer:** Claude Code
**Date:** 2026-06-23
**Status: APPROVED — kein Critical-, kein High-, kein Medium-Bug.**

### Test-Zusammenfassung
| Gate | Wert |
|---|---|
| Acceptance Criteria getestet | 10 / 10 |
| Acceptance Criteria bestanden | 10 / 10 |
| Unit-Tests gesamt | 123 (alle grün) |
| `tsc --noEmit` | exit 0 |
| Production-Build (`npm run build`) | ✅ erfolgreich (alle 6 Routen generiert) |
| Bugs gefunden | 0 |

### Testumgebung — Einschränkung
Frischer Container ohne `ANTHROPIC_API_KEY`/Supabase-Credentials — der Live-Generierungslauf und E2E gegen die echte DB sind hier nicht ausführbar (gleiche Einschränkung wie PROJ-7/PROJ-9). Verifikation stützt sich auf 123 Unit-Tests, erfolgreichen Production-Build und Code-Inspektion jeder AC-Stelle.

### Acceptance Criteria
| Bereich | Kriterium | Ergebnis | Beleg im Code |
|---|---|---|---|
| Generierung | `design` gültiger `category`-Wert | ✅ PASS | `anthropic.ts` `CATEGORIES = [...,'design']`; `SuggestionSchema` `z.enum(CATEGORIES)` |
| Generierung | `design`-Vorschlag referenziert konkrete Markenelemente (Sora, #0078FF, Gradient, Navy) | ✅ PASS | Prompt-Block „Kategorie design" + `nora-context.ts` Sektion „Visuelle Identität & Brand Guide" |
| Generierung | 3–5 gesamt, flexible Verteilung über 4 Kategorien, keine Quote | ✅ PASS | `buildPrompt()` „Verteile flexibel … keine feste Quote"; `MIN/MAX_SUGGESTIONS` unverändert |
| Generierung | `title/body/insight/source/category` befüllt | ✅ PASS | `SuggestionSchema` erzwingt alle Felder |
| Anzeige | eigenes Badge „Design & Brand" + Farbe Deep Teal #0E9594 | ✅ PASS | `suggestion-card.tsx`/`history-view.tsx` `CATEGORY_CONFIG.design = { label:'Design & Brand', color:'#0E9594' }` |
| Anzeige | eigener gruppierter Abschnitt | ✅ PASS | `dashboard-client.tsx` `CATEGORY_ORDER` enthält `design`; Gruppierung mappt darüber |
| Anzeige | Review-Flow (Approve/Reject) identisch | ✅ PASS | Approve/Reject in `actions/suggestions.ts` kategorie-agnostisch (keine category-Gates) |
| Umsetzung | dieselbe Monday/Notion-Pipeline | ✅ PASS | Handoff kategorie-agnostisch; zusätzlich eigener `design`-Ausarbeitungs-Prompt in `CATEGORY_PROMPTS` |
| Robustheit | bestehende Kategorien bleiben gültig (Rückwärtskompatibilität) | ✅ PASS | CHECK-Constraint nur additiv erweitert; `marketing/product/operations` unverändert |
| Robustheit | ungültiger `category`-Wert wird nicht gespeichert | ✅ PASS | `z.enum(CATEGORIES)` lehnt unbekannte Werte ab |

### Edge Cases
| Edge Case | Ergebnis |
|---|---|
| Kein `design`-Vorschlag an einem Tag | ✅ flexible Verteilung, kein Fehler |
| Nur `design`-Vorschläge (innerhalb 3–5) | ✅ erlaubt |
| Alte DB-Einträge ohne `design` | ✅ rückwärtskompatibel (CHECK nur erweitert) |
| Unbekannte Kategorie im Dashboard | ✅ Fallback-Config (`label`=Rohwert, Farbe `#8892B0`) statt Crash |

### Security-Audit (Red Team)
| Check | Ergebnis | Notiz |
|---|---|---|
| XSS über Claude-Output (design-`body`) | ✅ PASS | als Text gerendert (React escaped), kein `dangerouslySetInnerHTML` |
| Auth-Bypass `/api/generate-suggestions` | ✅ PASS | Cron-Secret ODER Session — unverändert |
| RLS auf `suggestions` | ✅ PASS | `design` ist normale `suggestions`-Zeile |
| Input-Validierung | ✅ PASS | `z.enum(CATEGORIES)` server-seitig |
| Neue Secrets / Env-Vars | ✅ PASS | keine |
| SQL-Injection | ✅ PASS | Supabase-SDK, parametrisiert |

### Regression
- 123/123 Unit-Tests grün (inkl. aller PROJ-2…PROJ-9-Tests).
- `tsc --noEmit` exit 0, Production-Build erfolgreich.
- Haupt-Generierung unverändert außer additiver 4. Kategorie; PROJ-9-Produkt-Chance (separater best-effort Insert) koexistiert konfliktfrei.

### Production-Ready-Einschätzung
**APPROVED — keine offenen Bugs.** Verbleibende Deploy-Voraussetzung (credential-gebunden, von Stefan auszuführen): `supabase/schema.sql` (idempotent) im Supabase SQL-Editor anwenden, damit `category = 'design'`-Zeilen akzeptiert werden — sonst lehnt Postgres den Insert ab. Da `design` Teil des Kern-Batch-Inserts ist (kein separater best-effort Insert wie PROJ-9), ist diese Migration vor dem nächsten Generierungslauf **Pflicht**.

## Deployment
_To be added by /deploy — siehe Deploy-Runbook (Supabase-Migration + Vercel) im Branch-Commit._
