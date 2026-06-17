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
- [ ] Wo lebt die „kanonische" Research-Sheet, die NORA liest — die Repo-Datei `docs/research/digital-product-research.md`, oder eine gespiegelte Notion-Seite (analog Living Spec), damit Stefan sie ohne Commit pflegen kann? → entscheidet `/architecture`
- [ ] Werden die Produkt-Chance-Detailfelder (Preis, Plattformen etc.) als strukturierte Spalten gespeichert oder im bestehenden `description`-Feld als formatierter Text? → entscheidet `/architecture`

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
| _To be added by /architecture_ | | |

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
