# PROJ-10: Design & Brand (Vorschlags-Kategorie)

## Status: In Progress
**Created:** 2026-06-16
**Last Updated:** 2026-06-17

## Dependencies
- **Requires:** PROJ-2 (Daily Suggestion Engine) — `category`-Enum, Prompt & Output-Schema um `design` erweitern
- **Requires:** PROJ-3 (Review & Approval Dashboard) — Badge + Filter für die neue Kategorie
- **Requires:** PROJ-7 (Context-Aware Suggestions) / `src/lib/nora-context.ts` — visuellen Brand-Kontext einspeisen
- **Kompatibel mit:** PROJ-4 (Monday.com) / PROJ-5 (Notion) — kategorie-agnostisch, keine Änderung nötig

## User Stories
- Als Stefan möchte ich, dass NORA auch Vorschläge zu **Design & Brand** (visuelle Identität, Logo, Farben, Konsistenz) generiert, damit KIcasso markenkonform nach außen auftritt — ohne dass ich selbst daran denken muss.
- Als Stefan möchte ich, dass Design-Vorschläge auf dem **KIcasso Brand Guide** (Sora, #0078FF, Gradient Cyan→Violet, Navy #070B1E, Dark Premium) basieren, damit sie konkret statt generisch sind.
- Als Stefan möchte ich Design-Vorschläge im **selben Review-Dashboard** sehen und bestätigen wie die anderen Kategorien, damit mein 2-Minuten-Workflow gleich bleibt.
- Als Stefan möchte ich Design-Vorschläge in einem **eigenen, klar beschrifteten Abschnitt „Design & Brand"** sehen, um sie gezielt nach Thema zu reviewen.
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
- [ ] Angenommen offene `design`-Vorschläge existieren, wenn Stefan das Dashboard öffnet, dann werden sie in einem eigenen gruppierten Abschnitt „Design & Brand" zusammengefasst (analog zu den bestehenden Kategorie-Abschnitten Marketing/Produkt/Operations).
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
- [x] Ist `suggestions.category` ein DB-CHECK/Enum (Migration nötig)? → **Ja**, CHECK-Constraint `('marketing','product','operations')` auf `suggestions.category`. Erweiterung per idempotentem DROP/ADD CONSTRAINT (gleiches Muster wie PROJ-6 beim `status`-Feld). (`/architecture` 2026-06-16)
- [x] Konkrete Badge-Farbe für „Design & Brand" → **Violett `#A720FF`** (nach dem Neon-Reskin 2026-06-16: Operations ist jetzt Pink `#FF2D9C`, Teal `#0E9594` wird vom „Umgesetzt"-Status belegt → Violett ist frei und passt in die Neon-Palette). Final bestätigt in `/frontend`. (`/architecture`, akt. 2026-06-16)
- [x] Muss die Notion-„Kategorie"-Select-Property die Option „Design & Brand" explizit erhalten, oder legt Notion sie beim ersten Schreiben automatisch an? → **Beides abgedeckt:** Option ist jetzt explizit in `createNoraBizDevDatabase` (Farbe `purple`) für neu angelegte DBs; bei bestehenden DBs legt Notion die Select-Option beim ersten `createPage`-Schreiben automatisch an. (`/backend` 2026-06-17)

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
| Decision | Rationale | Date |
|----------|-----------|------|
| Erweiterung der bestehenden `category`-Mechanik statt eigenes Feature/Tabelle | Rückwärtskompatibel; nutzt die vorhandene Review→Monday/Notion-Pipeline; minimaler Aufwand | 2026-06-16 |
| Zentrale Kategorie-Liste (`CATEGORIES` in `src/lib/anthropic.ts`) als Single Source of Truth | Ein neuer Wert propagiert automatisch in das KI-Output-Schema (`z.enum`) und den `Category`-Typ | 2026-06-16 |
| DB: CHECK-Constraint auf `suggestions.category` per idempotentem DROP/ADD erweitern (Muster wie PROJ-6) | Sichere, mehrfach ausführbare Migration; vorhandener `idx_suggestions_category` bleibt gültig | 2026-06-16 |
| Anzeige als eigener gruppierter Abschnitt statt neuem Filter-Control | Konsistent mit bestehender Gruppierung (Marketing/Produkt/Operations sind bereits Sektionen); kein neues Widget; bei 3–5 Vorschlägen/Tag ausreichend | 2026-06-16 |
| Badge-Farbe Violett `#A720FF` für `design` | Nach Neon-Reskin: Marketing=Cyan, Produkt=Blau, Operations=Pink #FF2D9C, „Umgesetzt"=Teal #0E9594 → Violett ist frei, eindeutig und in der Palette | 2026-06-16 |
| Eigener Design-Ausarbeitungs-Prompt (PROJ-8) statt nur Fallback | Liefert markenkonforme, strukturierte Notion-Dokumente für Design-/Brand-Maßnahmen | 2026-06-16 |
| Visuelle Brand-Specs aus `docs/design-system.md` in `nora-context.ts` aufnehmen | Konkrete, markenkonforme Vorschläge statt generischer Design-Tipps (deckt AC „referenziert konkrete Markenelemente" ab) | 2026-06-16 |
| Monday- & Notion-Mapping um `design → „Design & Brand"` ergänzen | Bestätigte Design-Vorschläge landen in eigener Monday-Gruppe / korrekt getaggtem Notion-Dokument — gleiche Pipeline, kein Sondercode | 2026-06-16 |

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

**Designed:** 2026-06-16 · Braucht **Backend + Frontend** (keine reine UI-Änderung).

### Grundprinzip
„Design & Brand" ist **kein eigenes Modul**, sondern ein **vierter Wert** in der bereits existierenden Kategorie-Mechanik. Vorschläge entstehen, werden reviewt und umgesetzt über exakt dieselben Wege wie heute — nur dass an den Stellen, die die drei Kategorien fest kennen, ein vierter Wert ergänzt wird. Dadurch bleibt alles rückwärtskompatibel und der Aufwand klein.

### Was sich ändert (Touchpoint-Übersicht)

```
Generierung (NORA's Gehirn)
├── Kategorie-Liste: marketing, product, operations  →  + design   (zentrale Liste)
├── Generierungs-Prompt: "3 Kategorien"  →  "4 Kategorien" + Design-Anleitung
└── Wissensbasis (nora-context): + visuelle Brand-Specs aus design-system.md
        (Sora, #0078FF, Gradient Cyan→Violet, Navy #070B1E, Dark Premium)

Datenbank (Supabase)
└── Erlaubte Kategorie-Werte: + "design"   (sichere, wiederholbare Migration; Index bleibt)

Review-Dashboard (Frontend)
├── Vorschlags-Karte: Badge "Design & Brand" (Neon Violett #A720FF)
├── Dashboard: neuer gruppierter Abschnitt "Design & Brand"
└── Verlauf: erbt das Badge automatisch (nutzt dieselbe Karte)

Umsetzung (unverändert in der Logik, nur Mapping ergänzt)
├── Monday.com: neue Gruppe "Design & Brand" für bestätigte Design-Tasks
├── Notion: Kategorie-Option "Design & Brand" für getaggte Dokumente
└── Dokument-Ausarbeitung (PROJ-8): eigene Design-Schreibvorlage
        (Ausgangslage → markenkonforme Lösung → Umsetzungsschritte → Erfolgskriterium)
```

### Datenmodell (in Worten)
- Ein Vorschlag hat weiterhin: ID, Datum, **Kategorie**, Titel, Body, Insight, Quelle, Status.
- Die **Kategorie** kann künftig einer von vier Werten sein: Marketing, Produkt, Operations, **Design**.
- Gespeichert in der **bestehenden `suggestions`-Tabelle**. Die Datenbank-Regel, die die erlaubten Kategorien einschränkt, bekommt den neuen Wert hinzugefügt.
- **Keine neue Tabelle, keine neuen Felder.** Bestehende Vorschläge bleiben unverändert gültig.

### Tech-Entscheidungen (warum)
- **Erweitern statt neu bauen:** Eine zusätzliche Kategorie reicht — das ganze System (Review, Monday, Notion, Verlauf) funktioniert dadurch ohne neue Bausteine.
- **Eine zentrale Kategorie-Liste:** Der neue Wert wird an einer Stelle eingetragen und wirkt automatisch dort, wo die KI-Antwort geprüft wird → weniger Fehlerquellen.
- **Sichere DB-Migration:** Die Regel für erlaubte Kategorien wird nach dem schon bewährten Muster (wie beim Status-Feld in PROJ-6) erweitert — gefahrlos mehrfach ausführbar.
- **Gruppierter Abschnitt statt Filter:** Passt zum heutigen Dashboard (das schon nach Kategorie gruppiert) und ist bei 3–5 Vorschlägen/Tag völlig ausreichend.
- **Eigene Badge-Farbe (Neon Violett #A720FF):** klar unterscheidbar von den bestehenden drei Farben; Teal #0E9594 ist bereits der „Umgesetzt"-Status, daher Violett (finalisiert in `/frontend`).

### Abhängigkeiten / neue Pakete
- **Keine neuen Pakete.** Nutzt die vorhandenen Integrationen (Anthropic SDK, Supabase, Monday-/Notion-Anbindung).

### Hinweis für /backend
- Nach der Migration muss `supabase/schema.sql` einmal im Supabase SQL-Editor neu ausgeführt werden (idempotent, gefahrlos).
- Notion-„Kategorie"-Select-Option „Design & Brand" verifizieren (siehe Open Questions).

## Implementation Notes (Frontend)

**Implemented:** 2026-06-17 · `/frontend`

### Was gebaut wurde
- **Neues Modul `src/lib/categories.ts` als Single Source of Truth** für Kategorie-Werte
  (`CATEGORIES`/`Category`), Anzeige-Metadaten (`CATEGORY_META`: Label + Badge-Farbe),
  Reihenfolge (`CATEGORY_ORDER`) und einen robusten `categoryMeta()`-Helper (Fallback für
  unbekannte/Legacy-Werte). Bewusst **dependency-frei**, damit es sowohl von Client-
  Komponenten als auch server-seitig (Zod-Schema in `anthropic.ts`) importiert werden kann,
  ohne das Anthropic-SDK ins Client-Bundle zu ziehen.
- **`design` einmal ergänzt → propagiert überall:** Label „Design & Brand", Badge-Farbe
  **Violett `#A720FF`** (NICHT Teal `#0E9594` — das ist der „Umgesetzt"-Status; die ältere
  Tech-Design-Zeile war veraltet und wurde korrigiert).
- **Datengetrieben statt hartverdrahtet:** Die zuvor **dreifach duplizierten** Kategorie-
  Maps (`suggestion-card.tsx`, `history-view.tsx`, `dashboard-client.tsx`) wurden entfernt;
  alle nutzen jetzt `categoryMeta()` / `CATEGORY_ORDER`. `anthropic.ts` bezieht
  `CATEGORIES`/`Category`/`z.enum` aus `categories.ts` (re-exportiert für Bestandsimporte).
- **Dashboard:** rendert automatisch einen eigenen gruppierten Abschnitt „Design & Brand"
  (Reihenfolge: Marketing → Produkt → Operations → Design & Brand); der Verlauf erbt das
  Badge über dieselbe Karte. `Suggestion.category` von 3-Literal-Union auf den geteilten
  `Category`-Typ (4 Werte) erweitert — rückwärtskompatibel über den `categoryMeta`-Fallback.

### Verifikation
- `vitest run`: **122/122 grün**. `next build`: **grün** (TypeScript-Typecheck inkl.).
- **Visuelle Abnahme des Dashboards offen:** Der Design-Abschnitt erfordert Supabase-Auth +
  einen `design`-Vorschlag in der DB — im ephemeren Container ohne echte Credentials nicht
  erreichbar (`/dashboard` leitet auf `/login`). `/qa` verifiziert mit echten Daten.

### Frontend/Backend-Grenze — offen für `/backend`
Das `z.enum` erlaubt jetzt `design`, aber NORA generiert noch keine Design-Vorschläge.
`/backend` muss ergänzen:
- Generierungs-Prompt: „drei Kategorien" → vier inkl. `design` + Design-Anleitung.
- `nora-context.ts`: visuelle Brand-Specs aus `docs/design-system.md` einspeisen.
- DB: CHECK-Constraint auf `suggestions.category` um `design` erweitern (idempotent).
- Monday/Notion-Mapping + Design-Ausarbeitungs-Prompt (PROJ-8) für `design`.

### Hinweis (nicht durch dieses Feature verursacht)
`npm run lint` schlägt repo-weit fehl (`next lint` wurde in Next 16 entfernt) — Pre-existing,
sollte separat auf ESLint-CLI/`eslint .` umgestellt werden.

## Implementation Notes (Backend)

**Implemented:** 2026-06-17 · `/backend`

### Was gebaut wurde
- **Generierung (`src/lib/anthropic.ts`):** `buildPrompt` auf vier Kategorien (inkl.
  `design`) umgestellt — flexible Verteilung ohne feste Quote (Design optional pro Tag),
  plus eine Design-Anleitung, die konkrete Markenelemente erzwingt (Sora, Neon-Palette,
  Electric Blue #0078FF, Gradient Cyan→Violet, Navy #070B1E, Dark-Premium). Neuer
  `design`-Eintrag in `CATEGORY_PROMPTS` für die Notion-Ausarbeitung (PROJ-8):
  Ausgangslage → Markenkonforme Lösung → Umsetzungsschritte → Erfolgskriterium.
- **Wissensbasis (`src/lib/nora-context.ts`):** Abschnitt „Visuelle Identität & Brand
  Guide" um Sora-Typografie, vollständige Palette inkl. #0078FF, Gradient Cyan→Violet,
  Hintergründe (Navy/Charcoal/Surface) und Dark-Premium ergänzt → deckt AC „referenziert
  konkrete Markenelemente" ab.
- **DB (`supabase/schema.sql`):** category-CHECK-Constraint idempotent per DROP/ADD um
  `design` erweitert (Muster wie PROJ-6 beim status); `idx_suggestions_category` bleibt
  gültig.
- **Umsetzung:** `design → „Design & Brand"` in `CATEGORY_TO_GROUP` (Monday) und
  `CATEGORY_TO_NOTION` (Notion); Notion-DB-Schema um Select-Option „Design & Brand"
  (`purple`) ergänzt. Pipeline sonst unverändert (kein Sondermapping): `ensureGroup` legt
  die Monday-Gruppe bei Bedarf an, `createPage` taggt das Dokument.

### Verifikation
- `vitest run`: **124/124 grün** (Monday: 4 Gruppen/5 Calls; Notion: 4 Select-Optionen;
  neue Tests für Design-Generierungs- und -Ausarbeitungs-Prompt). `next build`: **grün**.

### Offene Aktion vor Produktivbetrieb
- ⚠️ `supabase/schema.sql` einmal im Supabase SQL-Editor ausführen, damit der erweiterte
  category-CHECK-Constraint greift (idempotent, gefahrlos). Erst danach lassen sich
  `design`-Vorschläge persistieren.

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
