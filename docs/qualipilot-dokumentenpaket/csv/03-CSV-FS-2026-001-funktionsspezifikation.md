# Funktionsspezifikation (FS) — QualiPilot v1.0 (MVP)

| Feld | Wert |
|---|---|
| **Dokument-ID** | CSV-FS-2026-001 |
| **Revision** | R01 |
| **Status** | Entwurf / Demo |
| **Author** | Kordix AI |
| **Datum** | [DATUM] |
| **System** | QualiPilot v1.0 [MVP] |
| **Referenzen** | CSV-URS-2026-001, DEV-SAD-2026-001, CSV-TM-2026-001 |

## 1. Zweck

Diese Funktionsspezifikation beschreibt, **wie** QualiPilot die Nutzeranforderungen (CSV-URS-2026-001) umsetzt. Jede Funktion (F-xxx) ist auf U-IDs gemappt und wird in der OQ (CSV-OQ-2026-001) verifiziert. Architekturdetails: DEV-SAD-2026-001; Konfigurationswerte: *[Anlage: Systemkonfiguration]*.

## 2. Systemübersicht

QualiPilot besteht aus einem Web-Frontend, einem KI-Service in Python (Modul `services/ai/app/qualipilot`; die Protokollerstellung erfolgt u. a. in `export.py`, Funktion `_build_iq_protocol`), der LLM-Anbindung über die Anthropic Claude API sowie einem Cloud-Deployment mit getrennten Umgebungen (Dev/Prod). Die Prüfschicht validiert generierte Akzeptanzkriterien vor der Ausgabe automatisch.

## 3. Funktionen

### F-001 Equipment-Profil-Eingabe

**Erfüllt:** U-001, U-008 (Eingabeseite) · **Verifiziert durch:** COQ-T04, COQ-T11 · **Risiken:** R-13

- Strukturierte Erfassung des Equipment-Profils über das Web-Frontend; für den Temperaturmapping-Assistenten sind 10 Raumparameter definiert (u. a. Raumtyp, Abmessungen, Soll-Temperaturbereich, Beladung, Sensorik-Randbedingungen; vollständige Feldliste: *[Anlage: Systemkonfiguration]*).
- Pflichtfeld- und Plausibilitätsvalidierung vor Übergabe an die Generierung; unvollständige Profile werden mit feldbezogener Fehlermeldung abgewiesen (kein Start der Generierung).
- Profile werden versioniert gespeichert und mit einer Referenz-ID versehen, auf die die Traceability-Matrix (F-005) verweist.

### F-002 DQ-Vorstufe und URS-Ableitung

**Erfüllt:** U-002, U-003 · **Verifiziert durch:** COQ-T05 · **Risiken:** R-01, R-02

- Ableitung von Design-Anforderungen (DQ-Vorstufe) und URS-Entwürfen aus dem Equipment-Profil; jede abgeleitete Anforderung referenziert das auslösende Profilfeld bzw. die zugrunde liegende Regel.
- Ausgabe ausschließlich als gekennzeichneter ENTWURF (siehe F-003, Entwurfskennzeichnung).

### F-003 Protokollgenerierung IQ/OQ/PQ

**Erfüllt:** U-004, U-005, U-006, U-007, U-008, U-010 · **Verifiziert durch:** COQ-T01, COQ-T02, COQ-T03, COQ-T04, COQ-T12 · **Risiken:** R-01, R-04

- Kernfunktion des KI-Service: Aufbau der Protokolle aus Vorlage (F-006) + Equipment-Profil (F-001) + LLM-generierten Inhalten (F-011). Für IQ-Protokolle implementiert in `export.py` / `_build_iq_protocol`.
- IQ-Protokolle folgen der Vorlage IQ001 R01 mit exakt 16 Test Sections; OQ-/PQ-Protokolle enthalten funktions- bzw. nutzungsbezogene, prüffähige Testpunkte; CSV-Begleitdokumente (VP, UAT, Bericht) analog.
- Prüfpunkte werden als ausfüllbare Test-Tabellen gerendert (Test ID, Prüfpunkt, Akzeptanzkriterium, Ergebnis Pass/Fail, Durchgeführt von/Datum, Referenz) — U-014.
- Jedes Dokument trägt auf jeder Seite/in Kopfbereich die Kennzeichnung **ENTWURF — Prüfung und Freigabe durch qualifizierte Person erforderlich** (Human-in-the-loop, U-010).

### F-004 Prüfschicht (automatische Validierung der Akzeptanzkriterien)

**Erfüllt:** U-009 · **Verifiziert durch:** COQ-T07, COQ-T08 · **Risiken:** R-01, R-05

- Nachgelagerte, deterministische Prüfstufe: validiert jedes generierte Akzeptanzkriterium gegen definierte Regeln (u. a. Messbarkeit/Prüfbarkeit, Konsistenz mit Profilgrenzwerten, Einheiten-/Bereichsplausibilität, Vorlagenkonformität).
- Fachlich oder formal falsche Kriterien werden abgelehnt bzw. zur Regenerierung/manuellen Korrektur markiert; qualitative, aber prüffähige Kriterien werden akzeptiert.
- Prüfschicht-Entscheidungen werden mit Regel-Referenz protokolliert (Eingang in Audit Trail, F-010).
- **Abgrenzung:** Die Prüfschicht ist eine technische Kontrolle, ersetzt aber nicht den Human-in-the-loop-Review (U-010).

### F-005 Traceability-Matrix-Generator

**Erfüllt:** U-013 · **Verifiziert durch:** COQ-T09 · **Risiken:** R-02

- Erzeugt zu jedem Dokument eine Traceability-Matrix: jede fachliche Aussage/jeder Prüfpunkt → Quelle (Equipment-Profil-Feld, Vorlagenabschnitt IQ001 R01, hinterlegtes Regelwerk/Norm-Referenz).
- Aussagen ohne auflösbare Quelle werden als „unbelegt" markiert und von der Prüfschicht (F-004) beanstandet.

### F-006 Vorlagen-Engine (IQ001 R01)

**Erfüllt:** U-011, U-012, U-014 · **Verifiziert durch:** COQ-T10, CIQ-T05 · **Risiken:** R-06

- Verwaltung versionierter Kundenvorlagen; Standard-IQ-Vorlage **IQ001 R01** (16 Test Sections) ist als Referenzvorlage installiert.
- Die Engine erzwingt Struktur, Reihenfolge und Benennung der Vorlagenabschnitte; das LLM füllt ausschließlich definierte Inhaltsslots — Struktur wird nicht vom LLM erzeugt (Kontrollprinzip gegen R-06).
- Vorlagenänderungen unterliegen Change Control (DEV-CC-2026-001).

### F-007 Export

**Erfüllt:** U-015, U-032 · **Verifiziert durch:** COQ-T06, CIQ-T04 · **Risiken:** R-04

- Export des vollständigen Dokuments in ein beim Kunden weiterverarbeitbares Format (implementiert in `export.py`).
- Vollständigkeitskontrolle beim Export: Abgleich Soll-Abschnittsliste (Vorlage) gegen Ist-Abschnitte; Abbruch mit Fehlermeldung statt Ausgabe eines trunkierten Dokuments.
- Die `max_tokens`-Konfiguration der LLM-Aufrufe ist auf die spezifizierte maximale Dokumentgröße ausgelegt und wird in der IQ verifiziert (CIQ-T04); bei Erreichen des Limits erfolgt kontrollierte Segmentierung bzw. definierter Fehler — niemals stilles Abschneiden.

### F-008 e-Signatur-Rendering

**Erfüllt:** U-023 · **Verifiziert durch:** COQ-T13 · **Risiken:** R-10

- Rendering von Signaturblöcken nach 21 CFR Part 11 in generierten Dokumenten: Name (Platzhalter), Rolle, Datum, Bedeutung der Signatur (z. B. „geprüft", „freigegeben").
- **Abgrenzung (ehrlich):** Es handelt sich um *Rendering* der Signaturfelder für den kundenseitigen Signaturprozess. Ein vollständiger elektronischer Signatur-Workflow (Authentifizierung beim Signieren, Signatur-Manifestation, Verknüpfung mit Audit Trail) ist **geplant**; gerenderte Blöcke sind bis dahin als „zur Signatur vorgesehen", nicht als vollzogene Signatur zu verstehen (siehe CSV-P11-2026-001).

### F-009 Benutzerverwaltung & Autorisierung — teilweise GEPLANT

**Erfüllt:** U-016 (implementiert), U-017 (**geplant, P1**), U-018 (**geplant, P2**) · **Verifiziert durch:** COQ-T16 (Authentifizierung; Autorisierung/SoD: nach Implementierung) · **Risiken:** R-07, R-08

- Implementiert: individuelle Benutzerkonten mit Authentifizierung (Details: *[Anlage: Systemkonfiguration]*), Session-Management, TLS (U-019 via F-012).
- **Geplant (P1):** Autorisierung mit Projekt-Scoping/Mehrmandantenfähigkeit. Übergangsmaßnahme: dedizierte Instanz pro Pilotkunde (physische Mandantentrennung auf Deployment-Ebene).
- **Geplant (P2):** technische Funktionstrennung (SoD, Ersteller ≠ Freigeber). Übergangsmaßnahme: organisatorisches Vier-Augen-Prinzip im kundenseitigen Freigabeprozess.
- Diese Teilfunktionen sind in CSV-TM-2026-001 als *deferred* ausgewiesen; Testfälle werden bei Implementierung nachgezogen.

### F-010 Audit Trail & Generierungs-Metadaten

**Erfüllt:** U-021, U-022, U-024 · **Verifiziert durch:** COQ-T15, CIQ-T09 · **Risiken:** R-09

- Unveränderlicher, zeitgestempelter Audit Trail generierungsrelevanter Ereignisse: Anmeldung, Profilanlage/-änderung, Generierungslauf, Prüfschicht-Entscheidungen, Export.
- Generierungs-Metadaten je Dokument: Zeitstempel, QualiPilot-Version, LLM-Modellversion, Vorlagen-ID/-Revision (z. B. IQ001 R01), Equipment-Profil-Referenz, Prüfschicht-Ergebnis.
- ALCOA+-Bewertung der Aufzeichnungen: CSV-P11-2026-001, Abschnitt 4.

### F-011 LLM-Schnittstellen-Management

**Erfüllt:** U-026, U-027, U-028, U-029 · **Verifiziert durch:** COQ-T14, COQ-T17, CIQ-T03 · **Risiken:** R-03, R-11, R-12

- Anbindung der Anthropic Claude API mit konfigurativ gepinnter Modellversion (verifiziert in CIQ-T03); Prompt-Vorlagen sind versioniert (DEV-KM-2026-001, DEV-SOP-AI-2026-001).
- Modellversionswechsel nur über Change Control (DEV-CC-2026-001) inkl. verpflichtendem Regressions-Testset (definierte Referenzprofile mit Soll-Ergebnisprüfung; DEV-TS-2026-001).
- Fehlerverhalten: Timeout-/Ausfall-Erkennung, keine Ausgabe von Teildokumenten, klare Nutzerfehlermeldung, Wiederholungsmöglichkeit; Ereignis wird protokolliert.
- Vertragliche Zusicherung des Anbieters: keine Nutzung der API-Daten zum Modelltraining (Bewertung: CSV-LB-2026-001).

### F-012 Betrieb, Deployment & Sicherheit

**Erfüllt:** U-019, U-020, U-025, U-030, U-031, U-033, U-034, U-035 · **Verifiziert durch:** CIQ-T01, CIQ-T02, CIQ-T06, CIQ-T07, CIQ-T08, CIQ-T10; COQ-T04 (Performance) · **Risiken:** R-14, R-15

- Getrennte Umgebungen Dev/Prod; Deployment über kontrollierten Prozess (DEV-CC-2026-001); Release-Kennung im System einsehbar (DEV-KM-2026-001).
- Secrets-Management für API-Schlüssel (DEV-SEC-2026-001); TLS für alle Verbindungen; Backups mit Wiederherstellungstest (*[Anlage: Systemkonfiguration]*).
- Monitoring/Verfügbarkeit und Incident-/Support-Prozess für Pilotkunden (prozedural).

## 4. Mapping-Übersicht (Kurzform)

| Funktion | U-IDs | Primäre Tests |
|---|---|---|
| F-001 | U-001, U-008 | COQ-T04, COQ-T11 |
| F-002 | U-002, U-003 | COQ-T05 |
| F-003 | U-004–U-008, U-010, U-014 | COQ-T01–T04, COQ-T12 |
| F-004 | U-009 | COQ-T07, COQ-T08 |
| F-005 | U-013 | COQ-T09 |
| F-006 | U-011, U-012 | COQ-T10, CIQ-T05 |
| F-007 | U-015, U-032 | COQ-T06, CIQ-T04 |
| F-008 | U-023 | COQ-T13 |
| F-009 | U-016, U-017*, U-018* | COQ-T16 (*deferred-Anteile nach Implementierung) |
| F-010 | U-021, U-022, U-024 | COQ-T15, CIQ-T09 |
| F-011 | U-026–U-029 | COQ-T14, COQ-T17, CIQ-T03 |
| F-012 | U-019, U-020, U-025, U-030, U-031, U-033–U-035 | CIQ-T01–T02, CIQ-T06–T08, CIQ-T10 |

Vollständige Matrix inkl. Risiken und UAT: CSV-TM-2026-001.

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung (Entwurf/Demo) |

*Kordix AI · QualiPilot CSV-Validierungspaket · Demo-Dokument*
