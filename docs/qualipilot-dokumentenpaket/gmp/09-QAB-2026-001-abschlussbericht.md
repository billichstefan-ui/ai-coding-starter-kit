# Qualifizierungs-Abschlussbericht — HPLC-System Agilent 1260 Infinity II

| Feld | Wert |
|---|---|
| Dokument-ID | QAB-2026-001 |
| Revision | R01 |
| Status | Demo / Entwurf |
| Author | QualiPilot |
| Datum | [DATUM] |
| Betreiber | Musterpharma GmbH, QC-Labor |
| Referenzen | VP-2026-001; URS-2026-001; RA-2026-001; DQ/IQ/OQ/PQ-2026-001; TM-2026-001 |

---

## 1 Introduction

Dieser Bericht fasst die Qualifizierung des HPLC-Systems Agilent 1260 Infinity II (G7111B, G7129A, G7116A, G7115A) mit CDS im QC-Labor der Musterpharma GmbH zusammen und dokumentiert die Freigabeempfehlung gemäß Qualifizierungsplan VP-2026-001 und EU GMP Annex 15.

## 2 Zusammenfassung der Phasen

| Phase | Protokoll | Prüfpunkte | Ergebnis |
|---|---|---|---|
| DQ | DQ-2026-001 | DQ-T01–T06 | Alle 6 Prüfpunkte **bestanden**; 29/29 URS-Anforderungen per Design abgedeckt, Lieferant als geeignet bewertet |
| IQ | IQ-2026-001 | IQ-T01–T18 | Alle 18 Prüfpunkte **bestanden** (1 Minor-Abweichung, geschlossen — siehe Abschnitt 3); Progression Approval erteilt |
| OQ | OQ-2026-001 | OQ-T01–T12 | Alle 12 Prüfpunkte **bestanden** (1 Minor-Abweichung, geschlossen); u. a. Flussgenauigkeit ≤ ±1 %, Wellenlängengenauigkeit ≤ ±1 nm, Audit-Trail- und Access-Control-Challenge-Tests ohne Befund |
| PQ | PQ-2026-001 | PQ-T01–T06 | Alle 6 Prüfpunkte **bestanden**; Wiederholpräzision RSD ≤ 1 % an allen 3 Tagen, Linearität R² ≥ 0,999, 3-Tage-Routinebetrieb ohne Systemfehler |

**Traceability:** TM-2026-001 weist 100 % Abdeckung aller 29 URS-Anforderungen durch 42 Prüfpunkte nach; alle Statuseinträge stehen nach Abschluss auf „bestanden".

## 3 Abweichungen (Validation Exception Reports)

| VER-Nr. | Phase / Bezug | Beschreibung | Klassifizierung | Maßnahme | Status |
|---|---|---|---|---|---|
| VER-IQ-01 | IQ / IQ-T03 | Konformitätserklärung des Moduls G7116A lag bei Installation nicht in Papierform bei; nur 3 von 4 Zertifikaten vorhanden | Minor | Zertifikat vom Hersteller angefordert und innerhalb von 5 Arbeitstagen nachgereicht; als ATT-IQ-02 abgelegt; kein Einfluss auf Installationsergebnis | **geschlossen** ([DATUM], Quality) |
| VER-OQ-01 | OQ / OQ-T06 | Erste Driftmessung überschritt das Kriterium (1,4×10⁻³ AU/h); Ursache: unzureichende Lampen-Aufwärmzeit (< 1 h) entgegen Protokollvoraussetzung | Minor | Ursachenanalyse dokumentiert; Wiederholung nach ≥ 1 h Äquilibrierung: Drift 0,3×10⁻³ AU/h → bestanden; Hinweis zur Aufwärmzeit in Betriebs-SOP aufgenommen | **geschlossen** ([DATUM], Quality) |

Keine Critical- oder Major-Abweichungen. Beide Minor-Abweichungen wurden vor Final Approval der jeweiligen Phase bewertet und geschlossen; das Qualifizierungsergebnis wird nicht beeinträchtigt.

## 4 Bewertung der Hoch-Risiken (RA-2026-001)

| RA-ID | Risiko | Verifizierung | Bewertung |
|---|---|---|---|
| RA-04 | Carryover | OQ-T04: ≤ 0,05 % nachgewiesen | Restrisiko akzeptabel |
| RA-08 | Audit-Trail-Integrität | OQ-T09: vollständig, nicht deaktivierbar | Restrisiko akzeptabel |
| RA-09 | Unberechtigter Zugriff | OQ-T10: Challenge-Test ohne Umgehung | Restrisiko akzeptabel |
| RA-10 | Datenverlust | OQ-T11/T12 + IQ-T14: Wiederanlauf und Restore verifiziert | Restrisiko akzeptabel |

## 5 Auflagen für den Routinebetrieb

1. Systemeignungstest (SST) vor jeder Analysensequenz gemäß Methoden-SOP (URS-010).
2. Jährliche präventive Wartung und Requalifizierung (OQ-Kernprüfpunkte OQ-T01, OQ-T03, OQ-T05, OQ-T06, OQ-T07) gemäß Wartungsplan (IQ-T18).
3. Periodischer Audit-Trail-Review gemäß Standort-SOP; Änderungen am System nur über Change Control.
4. Backup-Verifizierung gemäß IT-Betriebskonzept (OQ-T12 als Referenztest).

## 6 Freigabeempfehlung

Alle Qualifizierungsphasen wurden erfolgreich abgeschlossen, alle Abweichungen geschlossen, die Nachverfolgbarkeit ist vollständig nachgewiesen. Das HPLC-System Agilent 1260 Infinity II inkl. CDS wird zur **Freigabe für den GMP-Routinebetrieb im QC-Labor** empfohlen.

| Rolle | Approved by | Signature | Position | Date |
|---|---|---|---|---|
| Author | [NAME] | | | [DATUM] |
| Document Owner | [NAME] | | | [DATUM] |
| Quality | [NAME] | | | [DATUM] |

## 7 Anlagenverzeichnis

| Nr. | Dokument-ID / Attachment | Titel |
|---|---|---|
| 1 | VP-2026-001 | Qualifizierungsplan |
| 2 | URS-2026-001 | User Requirements Specification |
| 3 | RA-2026-001 | Risikoanalyse (FMEA, ICH Q9(R1)) |
| 4 | DQ-2026-001 | Design Qualification |
| 5 | IQ-2026-001 | Installation Qualification (inkl. ATT-IQ-01 bis ATT-IQ-05) |
| 6 | OQ-2026-001 | Operational Qualification (inkl. ATT-OQ-01 bis ATT-OQ-05) |
| 7 | PQ-2026-001 | Performance Qualification (inkl. ATT-PQ-01 bis ATT-PQ-05) |
| 8 | TM-2026-001 | Traceability-Matrix |
| 9 | VER-IQ-01, VER-OQ-01 | Geschlossene Validation Exception Reports |

---

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | QualiPilot | Ersterstellung (Demo) |

*Generiert von QualiPilot — a Kordix AI product · Demo-Dokument*
