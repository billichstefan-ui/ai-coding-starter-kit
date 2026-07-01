# Traceability-Matrix — HPLC-System Agilent 1260 Infinity II

| Feld | Wert |
|---|---|
| Dokument-ID | TM-2026-001 |
| Revision | R01 |
| Status | Demo / Entwurf |
| Author | QualiPilot |
| Datum | [DATUM] |
| Betreiber | Musterpharma GmbH, QC-Labor |
| Referenzen | URS-2026-001; RA-2026-001; DQ-2026-001; IQ-2026-001; OQ-2026-001; PQ-2026-001 |

---

## 1 Introduction

Diese Matrix weist die lückenlose Nachverfolgbarkeit jeder Nutzeranforderung (URS-2026-001) über die Risikoanalyse (RA-2026-001) bis zu den verifizierenden Prüfpunkten in DQ/IQ/OQ/PQ nach. Jede Anforderung ist durch mindestens einen Prüfpunkt abgedeckt (DQ-T01 = dokumentierter Spezifikationsabgleich). Status: **offen** (Test nicht durchgeführt) / **bestanden** / **nicht bestanden**.

## 2 Matrix

| URS-ID | Kritikalität | Risiko (RA) | DQ | IQ | OQ | PQ | Status |
|---|---|---|---|---|---|---|---|
| URS-001 | kritisch | RA-02 | DQ-T01 | IQ-T04 | OQ-T02 | — | offen |
| URS-002 | kritisch | RA-01 | DQ-T01 | IQ-T04 | OQ-T01 | — | offen |
| URS-003 | hoch | RA-03 | DQ-T01 | IQ-T04 | OQ-T03, OQ-T08 | PQ-T02 | offen |
| URS-004 | hoch | RA-07 | DQ-T01 | IQ-T04 | OQ-T07 | — | offen |
| URS-005 | kritisch | RA-05 | DQ-T01 | IQ-T04 | OQ-T05 | — | offen |
| URS-006 | kritisch | RA-13 | DQ-T01 | IQ-T09 | — | PQ-T05, PQ-T06 | offen |
| URS-007 | hoch | RA-04 | DQ-T01 | — | OQ-T04 | — | offen |
| URS-008 | mittel | RA-06 (indirekt) | DQ-T01 | IQ-T04 | OQ-T06 (indirekt) | — | offen |
| URS-009 | hoch | RA-11 | DQ-T01 | IQ-T07 | — | — | offen |
| URS-010 | hoch | RA-13 | DQ-T01 | — | — | PQ-T01 | offen |
| URS-011 | kritisch | RA-01 | DQ-T01 | — | OQ-T01 | PQ-T01 | offen |
| URS-012 | kritisch | RA-02 | DQ-T01 | — | OQ-T02 | — | offen |
| URS-013 | kritisch | RA-03 | DQ-T01 | — | OQ-T03, OQ-T08 | PQ-T02, PQ-T03 | offen |
| URS-014 | kritisch | RA-05 | DQ-T01 | — | OQ-T05 | — | offen |
| URS-015 | hoch | RA-06 | DQ-T01 | — | OQ-T06 | — | offen |
| URS-016 | hoch | RA-07 | DQ-T01 | — | OQ-T07 | — | offen |
| URS-017 | kritisch | RA-08 | DQ-T04 | IQ-T11 | OQ-T09 | — | offen |
| URS-018 | kritisch | RA-09 | DQ-T04 | IQ-T11 | OQ-T10 | — | offen |
| URS-019 | kritisch | RA-09 | DQ-T04 | — | OQ-T10 | — | offen |
| URS-020 | kritisch | RA-10 | DQ-T01 | — | OQ-T12 | — | offen |
| URS-021 | hoch | RA-08 | DQ-T04 | — | OQ-T09 | — | offen |
| URS-022 | kritisch | RA-08 | DQ-T04 | — | OQ-T09 | PQ-T06 | offen |
| URS-023 | hoch | RA-12 | DQ-T02, DQ-T03 | IQ-T11, IQ-T12 | — | — | offen |
| URS-024 | mittel | RA-11, RA-12 | DQ-T05 | IQ-T10 | — | — | offen |
| URS-025 | mittel | RA-10 | DQ-T01 | IQ-T14 | OQ-T12 | — | offen |
| URS-026 | hoch | RA-10 | DQ-T01 | IQ-T14 | OQ-T11 | — | offen |
| URS-027 | mittel | RA-01 (indirekt) | DQ-T06 | IQ-T18 | — | — | offen |
| URS-028 | hoch | RA-14 | DQ-T06 | IQ-T17 | — | — | offen |
| URS-029 | mittel | RA-01 (indirekt) | DQ-T06 | IQ-T18 | — | — | offen |

> Prüfpunkte ohne direkten URS-Bezug (z. B. IQ-T01–T03, IQ-T05, IQ-T06, IQ-T08, IQ-T13, IQ-T15, IQ-T16) sind risikogetrieben (RA-11, RA-12, RA-14) und im jeweiligen Protokoll referenziert.

## 3 Kurzstatistik

| Kennzahl | Wert |
|---|---|
| URS-Anforderungen gesamt | 29 |
| Anforderungen mit mindestens einem Prüfpunkt | 29 (**100 % Abdeckung**) |
| Risiken (RA-01 bis RA-14) | 14, davon 4 Klasse „hoch" — alle mit dediziertem Challenge-Test |
| DQ-Prüfpunkte | 6 (DQ-T01–T06) |
| IQ-Prüfpunkte | 18 (IQ-T01–T18) |
| OQ-Prüfpunkte | 12 (OQ-T01–T12) |
| PQ-Prüfpunkte | 6 (PQ-T01–T06) |
| Prüfpunkte gesamt | 42 |

Kritische Anforderungen (12) sind sämtlich durch quantitative bzw. verhaltensbasierte Tests in OQ und/oder PQ abgedeckt — keine kritische Anforderung wird ausschließlich per Dokumentenprüfung verifiziert.

---

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | QualiPilot | Ersterstellung (Demo) |

*Generiert von QualiPilot — a Kordix AI product · Demo-Dokument*
