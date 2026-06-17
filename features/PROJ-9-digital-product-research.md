# PROJ-9: Digital Product Research (Demand Validation)

## Status: Planned
**Created:** 2026-06-17
**Last Updated:** 2026-06-17

## Dependencies
- Requires: PROJ-2 (Daily Suggestion Engine) — fügt eine 4. Kategorie in den bestehenden Generierungslauf ein
- Requires: PROJ-3 (Review & Approval Dashboard) — Produkt-Chancen werden im selben Dashboard geprüft/bestätigt
- Requires: PROJ-7 (Context-Aware Suggestions) — nutzt dieselbe Vorschlags-Historie zur Deduplizierung; Research-Sheet wird wie der Living Spec als Kontextquelle gelesen
- Requires: PROJ-4 (Monday Task Auto-Creation), PROJ-5 (Notion Document Auto-Creation), PROJ-8 (Notion-Dokument-Ausarbeitung) — bestätigte Produkt-Chancen nutzen denselben Handoff

## Übersicht
NORA generiert heute täglich Vorschläge in drei Kategorien (Content & Marketing, Produktentwicklung, Operations). Dieses Feature fügt eine **vierte Kategorie hinzu: „Produkt-Chance" (Digital Product)** — eine täglich generierte, nachfrage-validierte Idee für ein digitales Produkt, das Stefan als zusätzliche Einnahmequelle aufbauen könnte.

Der Kern ist **Nachfrage-Validierung vor Erstellung**: NORA schlägt nichts „aus dem Nichts" vor, sondern gründet jede Produkt-Chance auf einem nachweislich bereits verkauften Produktformat. Die Wissensbasis dafür ist die kuratierte Research-Sheet `docs/research/digital-product-research.md` (12 marktbewährte Formate mit Preis, Versprechen, Zielgruppe, Problem, Verkaufsplattformen, Nachfrage-Signal). NORA liest diese Sheet bei jeder Generierung — analog zum QualiPilot Living Spec aus PROJ-7 — und leitet daraus eine konkrete, umsetzbare Produkt-Chance ab, inklusive Begründung, **welches bewährte Format** als Nachfrage-Beleg dient.

Es werden **keine externen/bezahlten Datenquellen** angebunden und **nichts gescraped** (PRD-Constraint). Die Demand-Evidenz stammt ausschließlich aus der kuratierten Sheet plus Claudes Wissen. Stefan hält die Sheet über die Zeit aktuell; sie ist die einzige „Live"-Quelle für dieses Feature.

Die Produkt-Chancen sind **breit / nischenoffen**: jedes marktbewährte digitale Produkt (Planner, Journals, Notion-/Canva-Templates, Prompt-Packs, eBooks, Printables …) ist erlaubt — nicht auf Nexoras Pharma-Nische beschränkt. Ziel ist eine eigenständige Nebenerlös-Quelle für Stefan.

## User Stories
- Als Stefan möchte ich täglich **eine** nachfrage-validierte Idee für ein digitales Produkt bekommen, damit ich eine zusätzliche Einnahmequelle aufbauen kann, ohne selbst stundenlang Marktrecherche zu betreiben.
- Als Stefan möchte ich zu jeder Produkt-Chance sehen, **warum** sie Nachfrage hat (welches bereits verkaufte Format sie belegt), damit ich nichts baue, für das es keinen Markt gibt.
- Als Stefan möchte ich pro Produkt-Chance die wichtigsten Eckdaten auf einen Blick (Format, Preisrahmen, Versprechen, Zielgruppe, Problem, Verkaufsplattformen), damit ich in < 2 Minuten entscheiden kann, ob sich die Idee lohnt.
- Als Stefan möchte ich, dass eine bestätigte Produkt-Chance automatisch als Monday-Task und ausgearbeitetes Notion-Dokument landet, damit ich sie ohne manuellen Übertragungsaufwand weiterverfolgen kann.
- Als Stefan möchte ich, dass NORA keine Produkt-Chance wiederholt, die ich kürzlich schon abgelehnt oder bestätigt habe, damit jeder Tag eine neue Idee bringt.
- Als Stefan möchte ich, dass die Produkt-Chance still ausfällt, wenn die Research-Sheet fehlt — und der Rest der täglichen Vorschläge trotzdem normal läuft, damit mein Workflow nie blockiert wird.

## Out of Scope
- **Live-Marktdaten / Facebook Ads Library / TikTok / Etsy-Scraping** — PRD-Constraint: kein bezahltes/externes API, kein Web-Scraping im MVP. Demand-Evidenz kommt nur aus der kuratierten Sheet.
- **Web-Search-Datenquelle zur Generierungszeit** — bewusst verworfen (verletzt No-External-Data-Constraint); kann später als eigenes Feature evaluiert werden.
- **Beschränkung auf Nexora-Pharma-Nische** — verworfen; Produkt-Chancen sind nischenoffen (Entscheidung 2026-06-17).
- **Automatische Pflege/Aktualisierung der Research-Sheet durch NORA** — die Sheet ist von Stefan kuratiert; NORA liest sie nur. Auto-Anreicherung wäre ein eigenes Feature.
- **Erstellung des fertigen Produkts** (Design, Datei, Verkaufsseite, Pricing-Engine) — NORA validiert und beschreibt die Chance; das Bauen/Verkaufen macht Stefan außerhalb von NORA.
- **Eigene Erfolgs-/Umsatz-Tracking-Ansicht für verkaufte Produkte** — kein Sales-Dashboard; Tracking endet beim bestehenden Implementation-History-Flow (PROJ-6).
- **Eigener Trigger / eigener Cron-Job** — keine separate Generierung; die Produkt-Chance läuft im bestehenden täglichen Lauf mit.
- **Wöchentlicher Batch / On-Demand-Button** — verworfen zugunsten „täglich 1 Stück" (Entscheidung 2026-06-17).

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

- [ ] Angenommen die Research-Sheet existiert und der tägliche Generierungslauf startet, wenn NORA Vorschläge erzeugt, dann enthält der Batch genau **eine** Produkt-Chance der Kategorie „Produkt-Chance" zusätzlich zu den bestehenden Kategorien
- [ ] Angenommen eine Produkt-Chance wird generiert, wenn Stefan sie im Dashboard ansieht, dann sind Format, Preisrahmen, Versprechen, Zielgruppe, gelöstes Problem, Verkaufsplattformen und das belegende bewährte Format (Nachfrage-Signal) sichtbar
- [ ] Angenommen eine Produkt-Chance wird generiert, wenn NORA sie erzeugt, dann referenziert sie inhaltlich mindestens ein konkretes Format aus der Research-Sheet als Nachfrage-Beleg
- [ ] Angenommen dieselbe oder eine sehr ähnliche Produkt-Chance wurde in den letzten 30 Tagen bereits vorgeschlagen, wenn NORA neu generiert, dann schlägt sie diese nicht erneut vor
- [ ] Angenommen Stefan bestätigt eine Produkt-Chance, wenn die Bestätigung verarbeitet wird, dann wird sie wie jeder andere bestätigte Vorschlag als Monday-Task angelegt und als Notion-Dokument ausgearbeitet (PROJ-4/5/8)
- [ ] Angenommen die Research-Sheet fehlt oder ist leer, wenn der Generierungslauf startet, dann wird die Produkt-Chance still übersprungen und die übrigen Kategorien werden normal generiert — kein Fehler für Stefan sichtbar
- [ ] Angenommen Stefan lehnt eine Produkt-Chance ab, wenn er das tut, dann verschwindet sie aus der offenen Review-Liste und wird in der Historie als abgelehnt geführt (kein Monday/Notion-Output)

## Edge Cases
- **Research-Sheet fehlt / leer:** Produkt-Chance wird still übersprungen, restliche Kategorien laufen normal (best-effort wie PROJ-7-Quellen).
- **Research-Sheet sehr lang:** Nur ein begrenzter Auszug fließt in den Prompt (analog 3.000-Zeichen-Grenze beim Living Spec), um den Prompt nicht zu überladen — Detail entscheidet `/architecture`.
- **Alle bewährten Formate kürzlich schon vorgeschlagen:** NORA variiert innerhalb eines Formats (andere Zielgruppe/Nische/Winkel) oder lässt die Produkt-Chance an diesem Tag aus — lieber keine als eine Wiederholung.
- **Generierung der Produkt-Chance schlägt fehl, andere Kategorien erfolgreich:** Batch wird trotzdem gespeichert, nur ohne Produkt-Chance — die 4. Kategorie darf den Tageslauf nie blockieren.
- **Stefan bestätigt, aber Monday/Notion nicht erreichbar:** Verhalten wie bei bestehenden Vorschlägen (PROJ-4/5) — kein neuer Sonderfall, gleicher Retry/Fehler-Pfad.
- **Leere Vorschlags-Historie (frischer Start):** Kein Dedup-Kontext nötig — NORA generiert normal die erste Produkt-Chance.

## Technical Requirements
- Keine neuen externen Datenquellen, keine neuen bezahlten APIs (PRD-Constraint).
- Research-Sheet wird als best-effort-Kontextquelle gelesen; Ausfall → stiller Fallback (Produkt-Chance entfällt), analog PROJ-7.
- Die zusätzliche Kategorie darf die Gesamtlaufzeit des Cron-Generierungslaufs nur unwesentlich erhöhen (Richtwert: < 10s zusätzlich; kein wartender Nutzer).
- Dedup nutzt die bestehende Supabase-Historie (PROJ-7), keine neue Tabelle nötig.
- Keine neuen Env-Vars erwartet (Entscheidung final in `/architecture`).

## Open Questions
- [x] Wo lebt die „kanonische" Research-Sheet, die NORA liest? → **Als gebündelte TS-Konstante im App-Build** (analog `NORA_COMPANY_CONTEXT`). Die menschenlesbare Quelle bleibt `docs/research/digital-product-research.md`; daraus wird der String-Inhalt in ein Modul `digital-product-research.ts` übernommen. Garantiert verfügbar in der Vercel-Serverless-Umgebung, kein Notion-Roundtrip, kein Laufzeit-Dateizugriff. Stefan pflegt die Sheet per Commit/Redeploy (oder via Claude Code). Keine gespiegelte Notion-Seite im MVP. (Architecture 2026-06-17)
- [x] Strukturierte Spalten oder bestehendes Textfeld für die Detailfelder? → **Bestehende Spalten wiederverwenden, keine neuen Spalten.** Die Detailfelder (Format, Preisrahmen, Versprechen, Zielgruppe, Problem, Plattformen) werden als strukturierter Markdown-Text ins `body`-Feld gepackt; `insight` = Nachfrage-Begründung; `source` = belegendes Format aus der Sheet. So bleibt das Dashboard-Card-Rendering unverändert. (Architecture 2026-06-17)

## Decision Log

### Product Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Umsetzung als 4. Vorschlags-Kategorie statt eigenem Workspace | Maximale Wiederverwendung von Engine, Dashboard und Monday/Notion-Handoff; kein neues UI-Paradigma; hält den < 2-Min-Workflow intakt | 2026-06-17 |
| Demand-Evidenz nur aus kuratierter Research-Sheet (kein Live-Data) | Erfüllt PRD-Constraint „kein bezahltes/externes API, kein Scraping"; Stefan kontrolliert die Wissensbasis | 2026-06-17 |
| Produkt-Chancen nischenoffen (jedes bewährte Format), nicht auf Pharma beschränkt | Ziel ist eine eigenständige Nebenerlös-Quelle für Stefan, nicht QualiPilot-Funnel | 2026-06-17 |
| Täglich genau 1 Produkt-Chance, eingebettet in den bestehenden Batch | Kein zusätzlicher Trigger, kein Overload; hält tägliche Review schlank | 2026-06-17 |
| Jede Chance muss ein konkretes bewährtes Format als Beleg nennen | „Proof of demand vor Erstellung" ist der Kern des Features — verhindert Ideen ohne Markt | 2026-06-17 |
| Bestätigung nutzt denselben Monday-+-Notion-Handoff wie alle Vorschläge | Konsistente UX; kein Sonderpfad; Wiederverwendung von PROJ-4/5/8 | 2026-06-17 |
| Produkt-Chance ist best-effort — fällt sie aus, läuft der Rest weiter | Tageslauf darf nie blockieren (PRD-Constraint, analog PROJ-7) | 2026-06-17 |

### Technical Decisions
<!-- Added by /architecture -->
| Decision | Rationale | Date |
|----------|-----------|------|
| Eigene 4. Kategorie `digital_product` (Label „Produkt-Chance") statt Wiederverwendung von `product` | Klare Trennung von QualiPilot-Produktentwicklung; eigene Filterung/Farbe im Dashboard; eindeutige Dedup-Historie | 2026-06-17 |
| Separater Claude-Call `generateProductOpportunity()` statt Erweiterung von `generateSuggestions()` | Isolierte Fehlerbehandlung (best-effort): scheitert der Call, bleibt der Haupt-Batch unberührt; unverändertes Haupt-Schema; eigener, fokussierter Prompt mit Research-Sheet | 2026-06-17 |
| Research-Sheet als gebündelte TS-Konstante (`digital-product-research.ts`), nicht per FS-Read oder Notion | Garantierte Verfügbarkeit im Serverless-Bundle; konsistent mit `NORA_COMPANY_CONTEXT`; kein Laufzeit-Dateizugriff, keine neue externe Abhängigkeit | 2026-06-17 |
| Detailfelder in bestehendes `body` (Markdown) packen, keine neuen Spalten | Dashboard-Card rendert `body` unverändert; minimale DB-Änderung; AC-Sichtbarkeit voll erfüllt | 2026-06-17 |
| Kleine Migration: `category`-CHECK-Constraint um `digital_product` erweitern | Gleiches Muster wie PROJ-6 (`status`-Constraint); ohne Erweiterung lehnt die DB den Insert ab | 2026-06-17 |
| Dedup über bestehende PROJ-7-Historie, kein neuer Mechanismus | Produkt-Chancen landen mit ihrer Kategorie in `suggestions` und fließen automatisch in den Dedup-Kontext des Prompts | 2026-06-17 |
| `CATEGORY_ORDER` + Label/Farbe im Dashboard um `digital_product` erweitern | Hardcodierte Reihenfolge filtert unbekannte Kategorien sonst aus der Gruppenansicht heraus | 2026-06-17 |

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Überblick
Eine **vierte Vorschlagskategorie** `digital_product` wird in den bestehenden täglichen Lauf eingehängt. Statt das Haupt-Generierungs-Schema anzufassen, erzeugt ein **separater, best-effort Claude-Call** genau eine Produkt-Chance, gegroundet in der gebündelten Research-Sheet. Das Ergebnis wird wie jeder andere Vorschlag in `suggestions` gespeichert und durchläuft Dashboard, Approval und Monday/Notion-Handoff ohne Sonderpfad.

### Datenfluss

```
Vercel Cron / Dashboard-Button
        ↓
GET/POST /api/generate-suggestions            (bestehend — PROJ-2)
        ↓
fetchLiveContext(db)                          (bestehend — PROJ-7)
        ↓
generateSuggestions(liveContext)              (bestehend) → 3–5 Vorschläge (marketing/product/operations)
        ↓
generateProductOpportunity(liveContext)       (NEU, best-effort)
    ├── liest gebündelte Research-Sheet (DIGITAL_PRODUCT_RESEARCH-Konstante)
    ├── nutzt liveContext-Historie zur Deduplizierung (keine Wiederholung)
    └── try/catch → scheitert still, gibt null zurück (kein Abbruch des Laufs)
        ↓
[Haupt-Vorschläge] + [0 oder 1 Produkt-Chance]  → zusammenführen
        ↓
Insert → Supabase `suggestions` (category = 'digital_product' für die Chance)
        ↓
Dashboard (PROJ-3) zeigt sie als 4. Gruppe „Produkt-Chance"
        ↓
Bestätigung → Monday-Task (PROJ-4) + Notion-Ausarbeitung (PROJ-5/8)  [unverändert]
```

### Komponenten-/Modul-Struktur

```
Generierung (Backend)
├── src/lib/digital-product-research.ts   NEU — exportiert die kuratierte Sheet als String-Konstante
├── src/lib/anthropic.ts                  ERWEITERT — generateProductOpportunity() + Prompt
├── src/app/api/generate-suggestions/route.ts  ERWEITERT — ruft den neuen Call best-effort auf, merged Ergebnis
└── supabase/schema.sql                   ERWEITERT — category-CHECK-Constraint um 'digital_product'

Dashboard (Frontend)
├── dashboard-client.tsx   ERWEITERT — 'digital_product' zu CATEGORY_ORDER + Label „Produkt-Chance"
├── suggestion-card.tsx    ERWEITERT — Kategorie-Typ + CATEGORY_CONFIG (Label/Farbe)
└── history-view.tsx       ERWEITERT — CATEGORY_CONFIG (Label/Farbe)
        (Card-Layout selbst unverändert — rendert title/body/insight wie gehabt)
```

### Datenmodell (Klartext)
Keine neue Tabelle, keine neue Spalte. Eine Produkt-Chance ist eine ganz normale Zeile in `suggestions`:

```
Eine Produkt-Chance (Zeile in `suggestions`):
- category : "digital_product"   (neuer erlaubter Wert)
- title    : Name der Produkt-Chance (z. B. „Notion-Template: Freelancer-Finanz-OS")
- body     : strukturierter Markdown-Block mit
             Format · Preisrahmen · Versprechen · Zielgruppe · gelöstes Problem · Verkaufsplattformen
- insight  : WARUM es Nachfrage gibt (die Beleg-Begründung)
- source   : belegendes bewährtes Format aus der Sheet
             (z. B. „Belegt durch: Notion Business/Creator OS — Research-Sheet #3")
- status   : "pending" → "approved"/"rejected" (unverändert)

Gespeichert in: bestehende Supabase-Tabelle `suggestions`
Einzige DB-Änderung: category-CHECK-Constraint erlaubt zusätzlich 'digital_product'
```

### Wissensbasis: die Research-Sheet
- Menschenlesbare Quelle bleibt `docs/research/digital-product-research.md`.
- Für die Laufzeit wird der Inhalt als String-Konstante in `src/lib/digital-product-research.ts` gebündelt (gleiches Muster wie `NORA_COMPANY_CONTEXT` in `nora-context.ts`). So ist sie in der Serverless-Funktion garantiert verfügbar — kein Dateizugriff zur Laufzeit, keine Notion-Abhängigkeit.
- Aktualisierung: Stefan (oder Claude Code) editiert die Konstante und deployed neu. Bewusst kein Live-Editing-Pfad im MVP.
- Best-effort: Ist die Konstante leer/fehlt sie, gibt `generateProductOpportunity()` still `null` zurück — der restliche Tageslauf bleibt unberührt.

### Tech-Entscheidungen (warum so)
- **Separater Claude-Call statt erweitertem Haupt-Schema:** Eine Produkt-Chance braucht einen eigenen, fokussierten Prompt (mit der ganzen Sheet als Kontext) und darf den Hauptlauf bei Fehler nicht gefährden. Ein isolierter, in try/catch gekapselter Call erfüllt beides — exakt die Best-effort-Philosophie der PROJ-7-Quellen.
- **Wiederverwendung der bestehenden Spalten:** Die Detailfelder als Markdown im `body` halten das Dashboard-Card-Rendering unverändert und vermeiden eine invasivere Schema-Migration. Die AC-Sichtbarkeit ist voll erfüllt, weil die Card `body` bereits anzeigt.
- **Eigene Kategorie `digital_product`:** Saubere Trennung von der QualiPilot-Produktentwicklung (`product`), eigene Dashboard-Gruppe/Farbe und eine eindeutige Dedup-Historie.
- **Bundling statt FS/Notion:** Garantierte Verfügbarkeit ohne neue Infrastruktur; konsistent mit dem bestehenden Kontext-Muster.

### Dependencies (Pakete)
**Keine neuen Pakete.** Nutzt ausschließlich Bestehendes: `@anthropic-ai/sdk` (Generierung), Supabase-Client (Speicherung), bestehende Dashboard-/Handoff-Bausteine (PROJ-3/4/5/8).

### Env-Vars
**Keine neuen Env-Vars.** Nutzt `ANTHROPIC_API_KEY` und die bestehende Supabase-Verbindung.

### Implementierungs-Notizen — Frontend (2026-06-17)
Status: **In Progress** (Frontend fertig, Backend offen).

Umgesetzt — reine Konfigurations-Erweiterungen, kein neues UI-Bauteil (Card-Layout unverändert):
- `suggestion-card.tsx`: Kategorie-Union um `'digital_product'` erweitert; `CATEGORY_CONFIG` Eintrag `digital_product → { label: 'Produkt-Chance', color: '#7B81FF' }`.
- `history-view.tsx`: gleicher `CATEGORY_CONFIG`-Eintrag, damit die Kategorie auch im Verlauf korrekt mit Label/Farbe erscheint.
- `dashboard-client.tsx`: `'digital_product'` zu `CATEGORY_ORDER` hinzugefügt (sonst filtert die Gruppenansicht die Kategorie heraus) + Label in `CATEGORY_LABELS`.

Farbwahl: **Indigo/Periwinkle `#7B81FF`** aus dem Design-System (`docs/design-system.md`) — bislang von keiner anderen Kategorie genutzt und distinkt zu den Status-Farben (grün/teal/grau).

Verifikation: `npx tsc --noEmit` läuft sauber durch (exit 0). Die neue Kategorie rendert über denselben Card-/Gruppen-Pfad wie die drei bestehenden Kategorien; sie wird sichtbar, sobald das Backend (`/backend`) Produkt-Chancen mit `category = 'digital_product'` erzeugt.

### Implementierungs-Notizen — Backend (2026-06-17)
Umgesetzt:
- **`src/lib/digital-product-research.ts`** (neu): exportiert `DIGITAL_PRODUCT_RESEARCH` — die kuratierte Sheet als gebündelte String-Konstante (Muster wie `NORA_COMPANY_CONTEXT`). Inhalt aus `docs/research/digital-product-research.md` übernommen (12 Formate + Multi-Plattform-Hinweis).
- **`src/lib/anthropic.ts`** (erweitert): `generateProductOpportunity(liveContext)` — separater Claude-Call, der GENAU EINE Produkt-Chance liefert. Claude gibt strukturierte Felder (`format`, `price_range`, `promise`, `target_customer`, `problem`, `platforms`, `demand_evidence`, `proven_format`); daraus wird deterministisch `body` (Markdown mit allen Detailfeldern), `insight` (= Nachfrage-Beleg) und `source` (= „Belegt durch: <Format>") zusammengesetzt. Kategorie fix `digital_product`. **Best-effort:** fehlt die Sheet, fehlt der API-Key oder scheitert Claude nach 3 Versuchen → Rückgabe `null` (kein Wurf). Dedup: bereits vorgeschlagene `digital_product`-Titel aus der Historie werden im Prompt als „NICHT wiederholen" gelistet. `GeneratedSuggestion.category` auf `Category | 'digital_product'` erweitert; Haupt-`CATEGORIES` (3) unverändert, damit der Hauptlauf die 4. Kategorie nicht selbst erzeugt.
- **`src/app/api/generate-suggestions/route.ts`** (erweitert): nach `generateSuggestions()` wird `generateProductOpportunity()` best-effort aufgerufen und (falls ≠ null) an den Batch angehängt. Da die Funktion intern nie wirft, bleibt der Tageslauf bei Fehler unberührt.
- **`supabase/schema.sql`** (erweitert): PROJ-9-Migration erweitert die `category`-CHECK-Constraint um `'digital_product'` (idempotent: DROP IF EXISTS + ADD, gleiches Muster wie PROJ-6 `status`). **⚠️ Muss im Supabase SQL-Editor ausgeführt werden, sonst lehnt die DB den Insert der Produkt-Chance ab.**

Keine neuen Pakete, keine neuen Env-Vars, keine neue Tabelle, keine neue API-Route. RLS unverändert (Produkt-Chance ist eine normale `suggestions`-Zeile).

Tests: **120 grün** (`npm test`), `tsc --noEmit` exit 0.
- `anthropic.test.ts`: +5 Tests für `generateProductOpportunity` (null ohne API-Key, zusammengesetzte Chance + Detailfelder, Sheet im Prompt, Dedup nur für `digital_product`-Historie, null nach 3 Fehlversuchen).
- `route.test.ts`: +2 Tests (Produkt-Chance wird an Batch angehängt → count 4; best-effort null → count 3).

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
