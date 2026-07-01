# Teststrategie — QualiPilot

| Feld | Wert |
|---|---|
| Dokument-ID | DEV-TS-2026-001 |
| Revision | R01 |
| Status | Entwurf |
| Autor | Kordix AI |
| Datum | [DATUM] |
| Geltungsbereich | QualiPilot |

## 1. Zweck

Diese Teststrategie definiert, wie QualiPilot auf Entwicklungsebene verifiziert wird — mit besonderem Fokus auf die Herausforderung, ein System mit **nicht-deterministischer LLM-Komponente** deterministisch und GxP-tauglich zu testen. Sie ergänzt die formalen Abnahmetests des CSV-Pakets (CSV-OQ-2026-001, CSV-UAT-2026-001) und liefert deren entwicklungsseitige Grundlage.

## 1.1 Begriffe

| Begriff | Bedeutung |
|---|---|
| Mock-LLM-Antwort | Versionierte, fixierte Antwortdatei, die in Tests anstelle der echten Claude API verwendet wird |
| Golden Master | Versioniertes Referenzdokument, gegen das neu gerenderte Dokumente strukturell/inhaltlich verglichen werden |
| Regressions-Testset | Versioniertes Set aus Equipment-Profilen, Bewertungskriterien und Referenzläufen für Tests gegen die echte Claude API |
| Referenzlauf | Dokumentierter Regressions-Testset-Lauf einer freigegebenen Modell-/Promptversion als Vergleichsbasis |
| Pflichtlauf | CI-Lauf, dessen Bestehen technisch erzwungene Voraussetzung für Merge/Deploy ist |

## 2. Grundsätze

1. **Trennung von Deterministik und LLM:** Die Architektur (DEV-SAD-2026-001, ADR-001/ADR-003) begrenzt das LLM auf Inhalts-Entwürfe. Alles Deterministische — Dokumentstruktur, Vorlagen-Treue, Prüfschicht, Traceability, Export, e-Signatur-Rendering — wird mit klassischen, reproduzierbaren Tests abgesichert.
2. **Risikobasierte Testtiefe:** Testumfang folgt der GxP-Kritikalität gemäß CSV-RA-2026-001; die höchste Tiefe erhalten Prüfschicht, Vorlagen-Engine, `export.py` und Traceability-Generator.
3. **Tests sind Merge-Bedingung:** Keine Änderung erreicht `main` ohne bestandene Pflichtläufe (Kap. 7); KI-generierter Code unterliegt denselben Regeln (DEV-SOP-AI-2026-001).
4. **Jeder gefundene Fehler wird zu einem Test** (DEV-SOP-AI-2026-001 Kap. 7).

## 3. Testpyramide

| Ebene | Ort | Gegenstand | Ausführung |
|---|---|---|---|
| Unit-Tests | Co-located neben dem Quellcode | Einzelfunktionen/-klassen: Prüfschicht-Regeln, Vorlagen-Rendering, Export-Bausteine, Prompt-Assembly-Logik, Frontend-Komponenten | Bei jedem Push (CI-Pflicht) |
| Integrationstests | Testverzeichnis des jeweiligen Service | Zusammenspiel der Pipeline-Stufen (Profil → Prompt → [Mock-LLM] → Prüfschicht → Dokumentaufbau → Export), Datenhaltung, API-Verträge Frontend ↔ KI-Service | Bei jedem Push (CI-Pflicht) |
| E2E-Tests | Separates Testverzeichnis (getrennt vom Quellcode) | Durchgängige Nutzerabläufe im Frontend gegen eine Testinstanz mit gemocktem bzw. kontrolliertem LLM | Vor Merge nach `main` und vor Deploy |
| Regressions-Testset LLM | Eigenes, versioniertes Testset | Siehe Kap. 5 | Bei Modell-/Prompt-/Vorlagenänderung; vor jedem Release |

### 3.1 Verifikationsmatrix je Komponente

| Komponente | Unit | Integration (Mock-LLM) | E2E | Golden Master | Regressions-Testset (echtes LLM) |
|---|---|---|---|---|---|
| Prompt-Assembly | Ja | Ja | indirekt | Ja | Ja |
| LLM-Anbindung | Ja (Fehlerpfade) | Ja (gemockt) | indirekt | — | Ja |
| Prüfschicht | Ja (je Regel) | Ja | indirekt | Ja | Ja (Quote, Kap. 5.2) |
| Vorlagen-Engine (IQ001 R01) | Ja | Ja | Ja | Ja | Ja (Struktur) |
| Traceability-Generator | Ja | Ja | indirekt | Ja | — |
| export.py / e-Signatur-Rendering | Ja | Ja | Ja | Ja | — |
| Datenhaltung / Metadaten | Ja | Ja | indirekt | — | — |
| Frontend (kritische Flüsse) | Ja (Komponenten) | — | Ja | — | — |

Deterministische Komponenten (Traceability, Export/e-Signatur) benötigen keinen Lauf gegen das echte LLM — ihre Eingaben sind durch die Prüfschicht normalisiert (ADR-002/ADR-003, DEV-SAD-2026-001).

## 4. LLM-Teststrategie — deterministischer Anteil

### 4.1 Tests mit gemockten LLM-Antworten

Die gesamte nachgelagerte Pipeline wird mit **gemockten, versionierten LLM-Antworten** getestet. Damit sind die Tests vollständig deterministisch, schnell und offline lauffähig:

- **Dokumentstruktur:** Bei gegebener Mock-Antwort erzeugt die Vorlagen-Engine exakt die erwartete Struktur — für die Standard-IQ-Vorlage **IQ001 R01** insbesondere: alle **16 Test Sections** vorhanden, korrekte Reihenfolge, korrekte Nummerierung, keine leeren Pflichtabschnitte.
- **Vorlagen-Treue:** Statische Vorlagentexte (Kopfdaten, Abschnittsüberschriften, e-Signatur-Blöcke) erscheinen unverändert; LLM-Inhalte nur an den vorgesehenen Einfügepunkten.
- **Prüfschicht:** Positiv- und Negativfälle je Validierungsregel — u. a. wohlgeformte Akzeptanzkriterien werden akzeptiert; unvollständige, unplausible oder strukturell fehlerhafte Kriterien werden zurückgewiesen bzw. markiert. Für jede Regel existiert mindestens ein Testpaar (bestehen/durchfallen).
- **Fehlerpfade:** Fehlerhafte, leere, abgeschnittene oder schemawidrige Mock-Antworten führen zu sichtbarem Scheitern, nie zu stiller Teilgenerierung (DEV-CS-2026-001 Kap. 5).
- **Traceability-Generator:** Vollständige und korrekte Zuordnung Anforderung ↔ Testabschnitt für definierte Eingaben.
- **export.py / e-Signatur-Rendering:** Exportierte Dokumente enthalten alle Part-11-relevanten Signaturelemente in exakt spezifizierter Form (Bezug CSV-P11-2026-001); Generierungs-Metadaten (Modellversion, Vorlagen-Revision) sind korrekt eingebettet.

### 4.2 Golden-Master-Referenzprotokolle

Für repräsentative Equipment-Profile werden **Golden-Master-Dokumente** gepflegt — vollständige Referenzprotokolle, erzeugt aus fixierten Eingaben und fixierten (aufgezeichneten) LLM-Antworten. Beispiel-Referenzfall: **Agilent 1260 HPLC** (Standard-IQ nach IQ001 R01).

- Der Golden-Master-Test rendert das Dokument aus den fixierten Eingaben neu und vergleicht es strukturell und inhaltlich gegen die Referenz (normalisierter Vergleich; volatile Felder wie Zeitstempel werden maskiert).
- Jede Abweichung schlägt fehl und erfordert eine bewusste Entscheidung: Fehler beheben **oder** Golden Master per reviewtem Commit aktualisieren (Änderung an Golden Mastern ist reviewpflichtig wie Code).
- Golden Master stehen unter Versionskontrolle (DEV-KM-2026-001 Kap. 5).

Prüfumfang je Golden-Master-Fall (Beispiel Agilent 1260 HPLC, IQ001 R01):

| Prüfaspekt | Erwartung |
|---|---|
| Test Sections | Alle 16 Sections vorhanden, korrekte Reihenfolge und Nummerierung |
| Kopfdaten | Dokument-ID, Vorlagen-Revision (IQ001 R01), Gerätedaten korrekt übernommen |
| Akzeptanzkriterien | Identisch zur Referenz (fixierte LLM-Antworten), von der Prüfschicht unbeanstandet |
| Traceability-Matrix | Vollständige Zuordnung, identisch zur Referenz |
| e-Signatur-Blöcke | Alle Signaturfelder in exakt spezifizierter Form (CSV-P11-2026-001) |
| Generierungs-Metadaten | Modellversion, Vorlagen-Revision, Prüfschicht-Ergebnis korrekt eingebettet |

## 5. LLM-Teststrategie — nicht-deterministischer Anteil (Regressions-Testset)

Für das Verhalten des echten LLM existiert ein eigenes, versioniertes **Regressions-Testset**, das verpflichtend läuft bei:

- Wechsel der LLM-Modellversion (Major Change, DEV-CC-2026-001 Kap. 6),
- Änderungen an Prompt-Assembly oder Prompt-Texten,
- Änderungen an Vorlagen (z. B. neue Revision von IQ001),
- Änderungen an der Prüfschicht,
- vor jedem Release zusätzlich als Gesamtlauf.

### 5.1 Aufbau

- Definierte Menge repräsentativer Equipment-Profile (u. a. der Referenzfall Agilent 1260 HPLC) mit erwarteten Eigenschaften der Ergebnisdokumente.
- Läufe gegen die echte Claude API mit den konfigurationsgeführten Produktionsparametern (Modellversion, max_tokens — DEV-KM-2026-001 Kap. 7).
- Mehrfachläufe pro Fall, um Streuung sichtbar zu machen.

### 5.2 Bewertungskriterien für nicht-deterministische Outputs

Da exakte Textgleichheit nicht erwartbar ist, wird gegen **objektive Kriterien** bewertet, nicht gegen Wortlaut:

| Kriterium | Prüfung | Art |
|---|---|---|
| Strukturkonformität | Alle Pflichtabschnitte/16 Test Sections vorhanden, Schema eingehalten | Automatisch, hart (Pass/Fail) |
| Prüfschicht-Quote | Anteil generierter Akzeptanzkriterien, der die Prüfschicht ohne Beanstandung passiert, ≥ definiertem Schwellwert; Absinken gegenüber Referenzlauf = Fail | Automatisch, Schwellwert |
| Vollständigkeit | Keine leeren Pflichtfelder, keine abgeschnittenen Inhalte | Automatisch, hart |
| Fachliche Plausibilität | Stichprobenbewertung generierter Testschritte/Akzeptanzkriterien gegen dokumentierte Fachkriterien (messbar, eindeutig, gerätespezifisch statt generisch) | Menschliche Bewertung mit Bewertungsbogen, dokumentiert |
| Regressionsvergleich | Kein qualitativer Rückschritt gegenüber dem dokumentierten Referenzlauf der Vorversion | Kombiniert |

### 5.3 Ablauf eines Regressionslaufs

1. **Vorbereitung:** Zielkonfiguration fixieren (Modellversion, Parameter, Vorlagen-Revision); Referenzlauf der aktuell freigegebenen Konfiguration identifizieren.
2. **Ausführung:** Alle Testset-Fälle mit Mehrfachläufen gegen die echte Claude API; Rohergebnisse archivieren.
3. **Automatische Auswertung:** Strukturkonformität, Vollständigkeit, Prüfschicht-Quote je Fall; Vergleich der Quoten gegen den Referenzlauf.
4. **Fachliche Stichprobe:** Dokumentierte Bewertung ausgewählter Outputs mit Bewertungsbogen (Kriterien Kap. 5.2).
5. **Entscheidung:** Pass/Fail-Feststellung mit Begründung; bei Pass wird der Lauf zum neuen Referenzlauf der Konfiguration.
6. **Archivierung:** Ergebnisse mit Datum, Modellversion, Parametern und Bewertung versioniert ablegen.

Ergebnisse jedes Regressionslaufs sind Freigabevoraussetzung für Modell-/Promptänderungen (DEV-CC-2026-001 Kap. 6) und dienen als Nachweis gegenüber CSV-OQ-2026-001.

## 6. Testdaten

- **Keine echten Kundendaten** in Entwicklungs- und Testumgebungen und in keiner Claude-Code-Session (DEV-SOP-AI-2026-001 Kap. 6, DEV-SEC-2026-001 Kap. 3).
- Testdaten sind synthetisch: fiktive Firmen-/Anlagendaten; Geräte-Referenzfälle basieren auf öffentlich verfügbaren Herstellerspezifikationen (z. B. Agilent 1260 HPLC).
- Testdaten und Mock-LLM-Antworten sind versioniert (DEV-KM-2026-001) und damit reproduzierbar.

## 7. CI-Pflichtläufe

| Trigger | Pflichtläufe |
|---|---|
| Push auf Feature-Branch | Linting, Typprüfung (Python + TypeScript strict), Unit-Tests, Integrationstests (Mock-LLM) |
| Merge-Request nach `main` | Zusätzlich: E2E-Tests, Golden-Master-Vergleiche |
| Release/Deploy | Zusätzlich: Regressions-Testset (Kap. 5) sofern LLM-relevante Änderungen enthalten; vollständiger Gesamtlauf vor jedem Release |

Rote Läufe blockieren Merge bzw. Deploy; Ausnahmen sind nicht vorgesehen (DEV-SOP-AI-2026-001 Kap. 4.7).

## 7.1 Testumgebung

- CI- und lokale Testläufe arbeiten gegen die Dev-Umgebung bzw. isolierte Testinstanzen (DEV-KM-2026-001 Kap. 6); Tests greifen nie auf Produktionsdaten zu.
- Unit-/Integrationstests laufen offline mit gemockten LLM-Antworten; nur das Regressions-Testset (Kap. 5) ruft die echte Claude API auf — mit synthetischen Daten und den konfigurationsgeführten Produktionsparametern.
- Testkonfiguration, Mock-Antworten und Golden Master sind versioniert; ein Testlauf ist damit auf einem beliebigen Stand reproduzierbar.

## 7.2 Fehlermanagement in der Entwicklung

| Schwere | Definition | Behandlung |
|---|---|---|
| Kritisch | Falscher oder unvollständiger Inhalt in generierten GMP-Dokumenten möglich; Integritäts-/Sicherheitsverlust | Sofortige Behebung vor jedem weiteren Deploy; ggf. Emergency Change und Kundeninformation (DEV-CC-2026-001, DEV-SEC-2026-001 Kap. 7) |
| Hoch | Kernfunktion beeinträchtigt, aber Fehler sichtbar (kein stilles Scheitern) | Behebung vor Release |
| Mittel/Niedrig | Eingeschränkter Komfort, kosmetische Fehler | Priorisierte Einplanung als Issue |

Jeder Befund wird als Issue mit Feature-ID-Bezug dokumentiert; für jeden behobenen Fehler wird ein Regressionstest ergänzt (DEV-SOP-AI-2026-001 Kap. 7). Befunde aus KI-generiertem Code werden zusätzlich mit Ursachenkategorie erfasst.

## 8. Abdeckungsziele

- **GxP-kritische Module** (Prüfschicht, Vorlagen-Engine, `export.py`, Traceability-Generator): Zeilen-/Zweigabdeckung ≥ 90 %, alle Fehlerpfade explizit getestet.
- **Übriger KI-Service:** ≥ 80 % Zeilenabdeckung.
- **Frontend:** Kritische Nutzerflüsse (Generierung, Review, Export) durch E2E abgedeckt; Komponentenlogik durch Unit-Tests.
- Abdeckung wird in der CI gemessen; Unterschreitungen sind Review-Befund. Abdeckung ist notwendige, nicht hinreichende Bedingung — maßgeblich bleibt die inhaltliche Testqualität (Review-Checkliste A.4, DEV-SOP-AI-2026-001).

## 8.1 Freigabekriterien (Exit-Kriterien je Stufe)

| Stufe | Exit-Kriterium |
|---|---|
| Merge nach `main` | Alle CI-Pflichtläufe grün; Review-Nachweis vorhanden; keine offenen kritischen/hohen Befunde im Diff-Umfang |
| Release | Gesamtlauf grün inkl. E2E und Golden Master; bei LLM-relevanten Änderungen Regressions-Testset bestanden und dokumentiert |
| Deploy Prod | Release-Kriterien erfüllt + Change-Control-Freigabe (DEV-CC-2026-001 Kap. 4); Deployment-Verifizierung geplant |

Testberichte und Regressionslauf-Protokolle werden versioniert archiviert und sind auf Anfrage für Auditoren und Pilotkunden-QA einsehbar (Lieferantennachweis, CSV-LB-2026-001).

## 9. Abgrenzung zu CSV-OQ/UAT

Diese Teststrategie beschreibt die **entwicklungsseitige Verifizierung** (Hersteller-Tests). Die formale Abnahme des Systems für den GxP-Einsatz erfolgt im CSV-Paket:

- **CSV-OQ-2026-001:** Operational Qualification gegen die funktionale Spezifikation (CSV-FS-2026-001).
- **CSV-UAT-2026-001:** User Acceptance Testing durch Pilotkunden-QA — zugleich fachliches Vier-Augen-Prinzip (DEV-SDP-2026-001 Kap. 6.2).
- Die Traceability von Anforderungen zu Tests führt CSV-TM-2026-001; die hier beschriebenen Entwicklungstests werden dort referenziert, wo sie Verifikationsnachweise liefern.

## 10. Referenzen

DEV-SDP-2026-001, DEV-SAD-2026-001, DEV-SOP-AI-2026-001, DEV-CS-2026-001, DEV-KM-2026-001, DEV-CC-2026-001, DEV-SEC-2026-001; CSV-FS-2026-001, CSV-RA-2026-001, CSV-OQ-2026-001, CSV-UAT-2026-001, CSV-P11-2026-001, CSV-TM-2026-001.

## Change History

| Revision | Datum | Autor | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung |

*Kordix AI · QualiPilot Software-Entwicklungspaket*
