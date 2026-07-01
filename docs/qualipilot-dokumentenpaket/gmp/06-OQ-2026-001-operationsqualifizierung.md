# Operational Qualification (OQ) — HPLC-System Agilent 1260 Infinity II

| Feld | Wert |
|---|---|
| Dokument-ID | OQ-2026-001 |
| Revision | R01 |
| Status | Demo / Entwurf |
| Author | QualiPilot |
| Datum | [DATUM] |
| Betreiber | Musterpharma GmbH, QC-Labor |
| Referenzen | VP-2026-001; URS-2026-001; RA-2026-001; IQ-2026-001; EU GMP Annex 15 |

### Pre-Approval

| Rolle | Approved by | Signature | Position | Date |
|---|---|---|---|---|
| Author | [NAME] | | | [DATUM] |
| Document Owner | [NAME] | | | [DATUM] |
| Quality | [NAME] | | | [DATUM] |

### Final Approval

| Rolle | Approved by | Signature | Position | Date |
|---|---|---|---|---|
| Author | [NAME] | | | [DATUM] |
| Document Owner | [NAME] | | | [DATUM] |
| Quality | [NAME] | | | [DATUM] |

---

## 1 Introduction

Die Operational Qualification weist nach, dass das installierte HPLC-System (IQ-2026-001 erfolgreich abgeschlossen, Progression Approval liegt vor) in den spezifizierten Betriebsbereichen funktioniert. Geprüft werden die Leistungsparameter der Hardware-Module sowie die GMP-relevanten CDS-Funktionen (Audit Trail, Access Control, Wiederanlauf, Backup/Restore).

## 2 Scope

- Funktionstests Pumpe, Autosampler, Säulenthermostat, DAD
- CDS-Compliance-Funktionen gemäß 21 CFR Part 11 / EU Annex 11
- Nicht enthalten: Gesamtleistung unter Routinebedingungen (PQ-2026-001), Methodenvalidierung

## 3 Voraussetzungen

| Voraussetzung | Nachweis |
|---|---|
| IQ abgeschlossen, Progression Approval erteilt | IQ-2026-001, Test Section 14 |
| Messmittel/Referenzmaterialien rückführbar kalibriert | IQ-T17 |
| Testpersonal geschult, im Signature Register erfasst | Schulungsnachweise / Signature Register |
| System ≥ 1 h äquilibriert (Lampe, Thermostat) vor Leistungstests | Protokolleintrag |

## 4 Testausrüstung und Materialien

- Kalibrierte Analysenwaage (Auflösung 0,1 mg), Referenzthermometer (kalibriert, ±0,1 °C)
- Koffein-Referenzlösungen (zertifizierte Referenzsubstanz) in Wasser/Methanol
- HPLC-Wasser, Acetonitril (Gradient Grade), Aceton-Tracer für Gradiententest
- Restriktionskapillare für Gegendruck (Tests ohne Säule) bzw. C18-Säule 150×4,6 mm, 5 µm

## 5 Prüfpunkte (Test Sections)

### 5.1 Pumpe

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| OQ-T01 | **Flussgenauigkeit**: gravimetrische Messung des Flusses bei 0,5 / 1,0 / 2,0 mL/min (Wasser, je 10 min sammeln, Dichtekorrektur) | Abweichung vom Sollwert **±1 %** je Flussrate | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-002, URS-011, RA-01 |
| OQ-T02 | **Gradiententreue**: Stufengradient 0/10/50/90/100 % B mit Aceton-Tracer (UV 265 nm), Kanalkombinationen A/B und C/D | Gemessene Stufenzusammensetzung **±1 % absolut** je Stufe | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-001, URS-012, RA-02 |

### 5.2 Autosampler

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| OQ-T03 | **Injektionspräzision**: 6 Injektionen à 5 µL Koffein-Lösung (100 µg/mL), Auswertung Peakflächen | RSD der Peakflächen **≤ 0,5 %** | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-003, URS-013, RA-03 |
| OQ-T04 | **Carryover**: Blank-Injektion (Wasser) unmittelbar nach hochkonzentrierter Koffein-Lösung (1000 µg/mL) | Peakfläche im Blank **≤ 0,05 %** der vorherigen Injektion | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-007, RA-04 |
| OQ-T08 | **Injektorlinearität**: Injektionsvolumina 1 / 2 / 5 / 10 / 20 µL derselben Koffein-Lösung, Regression Fläche vs. Volumen | Bestimmtheitsmaß **R² ≥ 0,999** | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-003, URS-013, RA-03 |

### 5.3 Detektor (DAD)

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| OQ-T05 | **Wellenlängengenauigkeit**: Verifizierung über eingebauten Holmiumoxid-Filter (361/453/536 nm) und Koffein-Absorptionsmaxima (205/273 nm) | Abweichung **±1 nm** je Referenzwellenlänge | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-005, URS-014, RA-05 |
| OQ-T06 | **Rauschen und Drift**: Basislinienmessung bei 254 nm, trockene Zelle bzw. Wasserfluss, 20 min nach Äquilibrierung (ASTM-Auswertung) | Rauschen **≤ ±1×10⁻⁵ AU** (Peak-to-Peak); Drift **≤ 1×10⁻³ AU/h** | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-015, RA-06 |

### 5.4 Säulenthermostat

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| OQ-T07 | **Temperaturgenauigkeit/-stabilität**: Sollwert 40 °C, Messung mit kalibriertem Referenzthermometer über 30 min nach Stabilisierung | Genauigkeit **±0,8 °C**; Stabilität **±0,1 °C** | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-004, URS-016, RA-07 |

### 5.5 CDS-Funktionen (Datenintegrität / Compliance)

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| OQ-T09 | **Audit Trail**: (a) Erzeugen definierter Ereignisse (Methodenänderung, Neuintegration, fehlgeschlagener Login); (b) Versuch der Deaktivierung/Änderung mit Analystenrolle | Alle Ereignisse mit Benutzer, Zeitstempel, Alt-/Neuwert und Begründung protokolliert; Deaktivierung/Änderung durch Analystenrolle **technisch nicht möglich** | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-017, URS-021, URS-022, RA-08 |
| OQ-T10 | **Access Control (Challenge-Test)**: Login mit falschem Passwort (Sperrung nach n Fehlversuchen), Rollentrennung (Analyst kann keine Methoden freigeben/Daten löschen), automatische Session-Sperre, e-Signatur zweikomponentig mit Bedeutung | Alle Challenge-Szenarien verhalten sich gemäß Konfigurationsspezifikation; keine Umgehung möglich | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-018, URS-019, RA-09 |
| OQ-T11 | **Stromausfall/Wiederanlauf**: kontrollierte Netztrennung während laufender Testsequenz, danach Wiederanlauf | Bereits gespeicherte Daten vollständig und lesbar; Abbruch der Sequenz eindeutig im Audit Trail/Logbuch nachvollziehbar; System startet in definiertem Zustand | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-026, RA-10 |
| OQ-T12 | **Backup & Restore**: Datensicherung eines definierten Testdatensatzes, anschließende Wiederherstellung auf Prüfumgebung/Verzeichnis | Restore vollständig; wiederhergestellte Daten inhaltlich identisch (inkl. Metadaten und Audit Trail) | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-020, URS-025, RA-10 |

## 6 Deviations and Deficiencies

Abweichungen werden als Validation Exception Reports (VER-OQ-01ff.) erfasst, klassifiziert (Minor/Major/Critical) und vor Final Approval durch Quality geschlossen. Offene Critical/Major-VERs blockieren die Progression zur PQ.

| VER-Nr. | Bezug (Test ID) | Beschreibung | Klassifizierung | Maßnahme | Geschlossen von / Datum |
|---|---|---|---|---|---|
| VER-OQ-__ | | | ☐ Minor ☐ Major ☐ Critical | | [NAME] / [DATUM] |

## 7 Handover/Progression Approval

*Freigabe zum Übergang in die PQ (Voraussetzung: alle Prüfpunkte abgeschlossen, keine offenen Critical/Major-VERs).*

| Rolle | Approved by | Signature | Position | Date |
|---|---|---|---|---|
| Author | [NAME] | | | [DATUM] |
| Document Owner | [NAME] | | | [DATUM] |
| Quality | [NAME] | | | [DATUM] |

## 8 Attachments

| Attachment-Nr. | Beschreibung |
|---|---|
| ATT-OQ-01 | Rohdaten Flussmessung (Wägeprotokolle) |
| ATT-OQ-02 | Chromatogramme/Reports OQ-T02 bis OQ-T08 |
| ATT-OQ-03 | Audit-Trail-Auszüge und Screenshots (OQ-T09/T10) |
| ATT-OQ-04 | Backup-/Restore-Protokoll (OQ-T12) |
| ATT-OQ-05 | Verweis: Traceability-Matrix TM-2026-001 |

---

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | QualiPilot | Ersterstellung (Demo) |

*Generiert von QualiPilot — a Kordix AI product · Demo-Dokument*
