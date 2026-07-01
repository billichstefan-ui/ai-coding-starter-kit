# Risikoanalyse (FMEA) nach ICH Q9(R1) — HPLC-System Agilent 1260 Infinity II

| Feld | Wert |
|---|---|
| Dokument-ID | RA-2026-001 |
| Revision | R01 |
| Status | Demo / Entwurf |
| Author | QualiPilot |
| Datum | [DATUM] |
| Betreiber | Musterpharma GmbH, QC-Labor |
| Referenzen | VP-2026-001; URS-2026-001; ICH Q9(R1); GAMP 5 (2nd Ed.) |

---

## 1 Introduction

Diese Risikoanalyse identifiziert und bewertet Risiken des HPLC-Systems (Hardware + CDS) nach der FMEA-Methodik gemäß ICH Q9(R1). Ergebnis ist eine risikobasierte Teststrategie: Jedes Risiko wird einer oder mehreren Qualifizierungsphasen (DQ/IQ/OQ/PQ) und konkreten Prüfpunkten zugeordnet.

## 2 Scope

Betrachtet werden Fehlermodi mit möglichem Einfluss auf Produktqualität, Datenintegrität und GMP-Konformität. Arbeitssicherheits- und reine Verfügbarkeitsrisiken sind nur enthalten, soweit GMP-relevant.

## 3 Bewertungsmethodik

**RPZ = S × W × E** (Risikoprioritätszahl), Skala je 1–5:

| Stufe | Schwere (S) | Wahrscheinlichkeit (W) | Entdeckbarkeit (E) |
|---|---|---|---|
| 1 | vernachlässigbar | sehr unwahrscheinlich | sicher entdeckt (Alarm/Systemstopp) |
| 2 | gering | unwahrscheinlich | sehr wahrscheinlich entdeckt |
| 3 | moderat (OOS-Risiko) | gelegentlich | wahrscheinlich entdeckt (SST/Review) |
| 4 | hoch (falsches Ergebnis freigegeben) | wahrscheinlich | schwer entdeckbar |
| 5 | kritisch (Patientenrisiko) | häufig | praktisch nicht entdeckbar |

**Risikoklassen:** RPZ ≥ 40 → **hoch** (dedizierter quantitativer Test zwingend); 20–39 → **mittel** (gezielter Test); < 20 → **niedrig** (Abdeckung durch Standardprüfung/Verfahren ausreichend).

## 4 FMEA-Risikoregister

| RA-ID | Fehlermodus | Mögliche Auswirkung | Bezug URS | S | W | E | RPZ | Klasse | Risikominderung / Abdeckung |
|---|---|---|---|---|---|---|---|---|---|
| RA-01 | Flussrate weicht vom Sollwert ab (Pumpenverschleiß, Ansaugfehler) | Verschobene Retentionszeiten, falsche Quantifizierung | URS-002, URS-011 | 4 | 3 | 3 | 36 | mittel | OQ-T01; laufend SST (PQ-T01), PM |
| RA-02 | Gradientenzusammensetzung fehlerhaft (Ventil-/Mischerfehler) | Veränderte Selektivität, Fehltrennung, OOS | URS-001, URS-012 | 4 | 2 | 3 | 24 | mittel | OQ-T02; SST |
| RA-03 | Injektionsvolumen unpräzise (Dosiereinheit, Nadelsitz) | Streuende Peakflächen, falsche Gehaltswerte | URS-003, URS-013 | 4 | 3 | 3 | 36 | mittel | OQ-T03; PQ-T02 (Wiederholpräzision) |
| RA-04 | Verschleppung (Carryover) zwischen Injektionen | Übererfassung niedrig konzentrierter Proben, falsch-positive Ergebnisse | URS-007 | 4 | 3 | 4 | 48 | hoch | OQ-T04 (Carryover-Test); Nadelwasch-Konfiguration |
| RA-05 | Wellenlängenfehler des DAD (Gittermechanik, Lampenalterung) | Mindergehalt/Fehlbewertung durch Detektion neben Absorptionsmaximum | URS-005, URS-014 | 4 | 2 | 4 | 32 | mittel | OQ-T05; jährliche Requalifizierung |
| RA-06 | Erhöhtes Detektorrauschen/Drift | Fehlintegration kleiner Peaks, LOQ-Verfehlung | URS-015 | 3 | 3 | 3 | 27 | mittel | OQ-T06; SST-Kriterien S/N |
| RA-07 | Säulentemperatur weicht ab oder schwankt | Retentionszeitverschiebung, RT-Fenster verfehlt | URS-004, URS-016 | 3 | 2 | 3 | 18 | niedrig | OQ-T07 |
| RA-08 | Audit Trail unvollständig, deaktivierbar oder manipulierbar | Verlust der Datenintegrität, Inspektionsbefund (kritisch) | URS-017, URS-021, URS-022 | 5 | 2 | 5 | 50 | hoch | DQ-T04 (Fähigkeit); OQ-T09 (Funktionstest inkl. Änderungsversuch) |
| RA-09 | Unberechtigter Zugriff / unzureichende Rollentrennung | Unautorisierte Datenänderung, Verstoß Part 11 / Annex 11 | URS-018, URS-019 | 5 | 2 | 4 | 40 | hoch | OQ-T10 (Access-Control-Challenge-Test); IQ-T11 (Konfiguration) |
| RA-10 | Datenverlust bei Stromausfall oder Backup-Fehler | Verlust von Rohdaten, nicht rekonstruierbare Ergebnisse | URS-020, URS-026 | 5 | 2 | 4 | 40 | hoch | OQ-T11 (Wiederanlauf); OQ-T12 (Backup/Restore); IQ-T14 (USV) |
| RA-11 | Fehlerhafte Installation / ungeeignete Umgebungsbedingungen (Temperatur, Vibration, Platz) | Instabile Messbedingungen, Geräteschäden | URS-024, (allg. Installation) | 3 | 2 | 2 | 12 | niedrig | IQ-T04, IQ-T05, IQ-T06–T09, IQ-T15 |
| RA-12 | Falsche/nicht freigegebene Software- oder Firmware-Version installiert | Undefiniertes Systemverhalten, nicht qualifizierter Zustand | URS-023, URS-024 | 4 | 2 | 3 | 24 | mittel | IQ-T11, IQ-T12, IQ-T13; Change Control |
| RA-13 | System erfüllt Eignung im Routinebetrieb nicht (Gesamtperformance über Zeit) | Nicht belastbare Routineergebnisse trotz bestandener Einzeltests | URS-010, URS-011–016 | 4 | 2 | 3 | 24 | mittel | PQ-T01–PQ-T05 (SST, Präzision, Linearität, 3-Tage-Robustheit) |
| RA-14 | Qualifizierungsmessmittel/Referenzstandards nicht rückführbar | Qualifizierungsergebnisse nicht belastbar | URS-028 | 4 | 2 | 4 | 32 | mittel | IQ-T17 (Zertifikatsprüfung); Standort-Kalibrierprogramm |

## 5 Abgeleitete Teststrategie

| Phase | Abgedeckte Risiken | Schwerpunkt |
|---|---|---|
| DQ | RA-08 (Fähigkeitsnachweis), RA-12 (Spezifikation), Lieferanteneignung | Papierprüfung URS ↔ Herstellerspezifikation, Lieferantenbewertung |
| IQ | RA-11, RA-12, RA-14, RA-10 (teilw.) | Korrekte, dokumentierte Installation; Versionen; Kalibrierstatus; Umgebung |
| OQ | RA-01–RA-10 | Quantitative Funktionstests Hardware + CDS-Compliance-Funktionen |
| PQ | RA-03, RA-06, RA-13 | Gesamtsystem-Leistung unter Routinebedingungen (Koffein-Referenzverfahren, 3 Tage) |

**Priorisierung:** Die vier Risiken der Klasse „hoch" (RA-04, RA-08, RA-09, RA-10) erhalten dedizierte Challenge-Tests mit quantitativen bzw. verhaltensbasierten Akzeptanzkriterien und werden im Abschlussbericht einzeln bewertet.

## 6 Rest-Risiko-Bewertung

Nach Umsetzung der Teststrategie und der betrieblichen Kontrollen (SST je Sequenz, PM-/Kalibrierprogramm, Change Control, periodischer Audit-Trail-Review) wird das Restrisiko für alle identifizierten Fehlermodi als **akzeptabel** eingestuft. Die formale Bestätigung erfolgt im Abschlussbericht QAB-2026-001.

---

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | QualiPilot | Ersterstellung (Demo) |

*Generiert von QualiPilot — a Kordix AI product · Demo-Dokument*
