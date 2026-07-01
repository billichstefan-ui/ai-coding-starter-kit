# Performance Qualification (PQ) — HPLC-System Agilent 1260 Infinity II

| Feld | Wert |
|---|---|
| Dokument-ID | PQ-2026-001 |
| Revision | R01 |
| Status | Demo / Entwurf |
| Author | QualiPilot |
| Datum | [DATUM] |
| Betreiber | Musterpharma GmbH, QC-Labor |
| Referenzen | VP-2026-001; URS-2026-001; RA-2026-001; OQ-2026-001; EU GMP Annex 15 |

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

Die Performance Qualification weist nach, dass das Gesamtsystem (Hardware + CDS + Bediener + Verfahren) unter routinenahen Bedingungen reproduzierbar geeignete Ergebnisse liefert. Grundlage ist ein repräsentatives Referenzverfahren mit **Koffein** als zertifizierter Referenzsubstanz. Voraussetzung: OQ-2026-001 abgeschlossen, Progression Approval erteilt.

## 2 Scope

Gesamtsystem-Leistung über **3 aufeinanderfolgende Arbeitstage** im QC-Labor: Systemeignung, Wiederholpräzision, Linearität, Zwischenpräzision und Robustheit im Routinebetrieb. Nicht enthalten: Validierung produktspezifischer Analysenmethoden (ICH Q2, separat).

## 3 Referenzverfahren (PQ-Testmethode)

| Parameter | Wert |
|---|---|
| Säule | C18, 150 × 4,6 mm, 5 µm |
| Mobile Phase | Wasser/Methanol 60:40 (v/v), isokratisch |
| Flussrate | 1,0 mL/min |
| Säulentemperatur | 40 °C |
| Detektion | DAD, 273 nm |
| Injektionsvolumen | 5 µL |
| Referenzsubstanz | Koffein (zertifiziert, rückführbar; IQ-T17) |
| Arbeitskonzentration | 100 µg/mL (= 100 %-Level) |

## 4 Prüfpunkte

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| PQ-T01 | **Systemeignungstest (SST)**: 6 Injektionen Koffein 100 µg/mL; Bewertung über CDS-SST-Funktion | Tailingfaktor 0,8–1,5; Bodenzahl ≥ 2000; RSD Retentionszeit ≤ 1 %; S/N ≥ 10 am Reporting-Level | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-010, RA-13 |
| PQ-T02 | **Wiederholpräzision**: RSD der Peakflächen aus den 6 SST-Injektionen (je Tag) | RSD **≤ 1 %** an jedem der 3 Tage | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-013, RA-03, RA-13 |
| PQ-T03 | **Linearität**: 5 Konzentrationslevel 50/75/100/125/150 µg/mL (50–150 %), je 2 Injektionen, lineare Regression | **R² ≥ 0,999**; y-Achsenabschnitt ≤ ±2 % des 100 %-Signals | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-013, RA-13 |
| PQ-T04 | **Zwischenpräzision (3 Tage)**: 100 %-Level an Tag 1–3, je frisch angesetzt, ggf. wechselnde Analysten | RSD der Tagesmittelwerte **≤ 2 %**; Wiederfindung je Tag 98–102 % | ☐ Pass ☐ Fail | [NAME] / [DATUM] | RA-13 |
| PQ-T05 | **Robustheit im Routinebetrieb**: Routinesequenz (≥ 20 Injektionen inkl. Blanks, Standards, Bracketing) pro Tag über 3 Tage, davon 1 Sequenz über Nacht unbeaufsichtigt | Alle Sequenzen vollständig ohne Systemfehler; SST-Kriterien in jeder Sequenz erfüllt; Retentionszeitdrift über 3 Tage ≤ 2 % | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-006, RA-13 |
| PQ-T06 | **Datenauswertung und Reporting**: Verifizierung der CDS-Berechnungen (Gehalt, RSD, Regression) einer PQ-Sequenz gegen unabhängige Nachrechnung; Report vollständig (Rohdatenverweis, Integrationsparameter, Audit-Trail-Referenz) | Nachrechnung identisch (Rundungsdifferenzen ≤ letzte signifikante Stelle); Report vollständig und korrekt | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-006, URS-022, RA-08, RA-13 |

## 5 Durchführungshinweise

- Tagesablauf je Tag 1–3: frische Standardansätze (rückführbare Einwaage, kalibrierte Waage), Systemäquilibrierung ≥ 30 min, SST vor Sequenzstart.
- Alle Sequenzen laufen unter Routine-Benutzerkonten (Analystenrolle), nicht unter Administratorkonten — die PQ prüft damit implizit das Berechtigungskonzept im Alltag.
- Ergebnisse werden ausschließlich im CDS erfasst; manuelle Übertragungen nur mit Vier-Augen-Prüfung.

## 6 Deviations and Deficiencies

Abweichungen werden als Validation Exception Reports (VER-PQ-01ff.) erfasst und vor Final Approval geschlossen.

| VER-Nr. | Bezug (Test ID) | Beschreibung | Klassifizierung | Maßnahme | Geschlossen von / Datum |
|---|---|---|---|---|---|
| VER-PQ-__ | | | ☐ Minor ☐ Major ☐ Critical | | [NAME] / [DATUM] |

## 7 Attachments

| Attachment-Nr. | Beschreibung |
|---|---|
| ATT-PQ-01 | Einwaageprotokolle und Ansatzdokumentation (Tag 1–3) |
| ATT-PQ-02 | Chromatogramme und CDS-Reports aller PQ-Sequenzen |
| ATT-PQ-03 | Regressionsauswertung Linearität (PQ-T03) |
| ATT-PQ-04 | Unabhängige Nachrechnung (PQ-T06) |
| ATT-PQ-05 | Verweis: Traceability-Matrix TM-2026-001 |

---

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | QualiPilot | Ersterstellung (Demo) |

*Generiert von QualiPilot — a Kordix AI product · Demo-Dokument*
