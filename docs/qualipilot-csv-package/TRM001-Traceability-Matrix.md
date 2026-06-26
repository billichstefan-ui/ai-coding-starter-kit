# 🔗 Traceability-Matrix — QualiPilot v1.0 (TRM001 R01)

> **Systemstandard:** Vollständige Rückführbarkeit aller QualiPilot-Anforderungen auf Testfälle und regulatorische Referenzen. Grundlage: GAMP 5 §7.5, EU GMP Annex 11 §4, SDS v1.0.

---

## Deckblatt

| Feld | Wert |
|---|---|
| Dokument-ID | TRM001 |
| Revision | R01 |
| Status | Draft |
| System | QualiPilot v1.0 (Kordix AI) |
| Author | Stefan Billich |
| Datum | 2026-06-24 |
| Bezug | IQ001 R01 · OQ001 R01 · UAT001 R01 |

## Zweck

Diese Traceability-Matrix stellt die vollständige Rückführbarkeit zwischen den Benutzeranforderungen (URS), den Testfällen aus IQ/OQ/PQ sowie den regulatorischen Referenzen sicher. Jede Anforderung muss durch mindestens einen Testfall verifiziert werden.

---

## URS — User Requirements

| URS-ID | Anforderung | Kategorie | Priorität |
|---|---|---|---|
| URS-R01 | User kann Equipment-Profil über 5 standardisierte Felder eingeben | Funktional | P0 |
| URS-R02 | System klassifiziert GAMP-5-Kategorie automatisch aus Equipment-Profil | Funktional | P0 |
| URS-R03 | System referenziert alle anwendbaren Regularien automatisch | Regulatorisch | P0 |
| URS-R04 | System generiert vollständige IQ/OQ/PQ-Dokumente in < 60 Sekunden | Performance | P0 |
| URS-R05 | Generierte Dokumente folgen Industriestandard-Vorlagen (IQ001 R01) | Qualität | P0 |
| URS-R06 | Vollständige Traceability von URS → Testfälle → Regulatory References | Regulatorisch | P0 |
| URS-R07 | GMP-konformes Dokumentenlayout (Deckblatt, Revisionsverlauf, Signaturfelder) | Qualität | P0 |
| URS-R08 | Export nach PDF/Word für physische Unterzeichnung | Funktional | P1 |
| URS-R09 | System-Verfügbarkeit ≥ 99,9 % (Vercel SLA) | Performance | P1 |
| URS-R10 | Graceful Error Handling bei AI-Timeout/Netzwerkfehlern | Robustheit | P1 |
| URS-R11 | Multi-Tenant-Isolation — jeder Benutzer sieht nur eigene Daten | Sicherheit | P0 |
| URS-R12 | Vollständiger Audit Trail (ALCOA+) für alle Dokumentenänderungen | Regulatorisch | P0 |

---

## Traceability-Matrix: URS → Testfälle

| URS-ID | IQ-Testfälle | OQ-Testfälle | UAT-Testfälle | Status |
|---|---|---|---|---|
| URS-R01 | IQ-01 bis IQ-05 | OQ-02 | UAT-01, UAT-02 | ☐ Verifiziert |
| URS-R02 | IQ-24 | OQ-03 | UAT-01 | ☐ Verifiziert |
| URS-R03 | IQ-10 bis IQ-15 | OQ-04, OQ-05 | UAT-07 | ☐ Verifiziert |
| URS-R04 | IQ-04 | OQ-04, OQ-05 | UAT-01, UAT-02, UAT-05 | ☐ Verifiziert |
| URS-R05 | IQ-01 | OQ-04, OQ-05 | UAT-01, UAT-04 | ☐ Verifiziert |
| URS-R06 | IQ-16 | — | UAT-03 | ☐ Verifiziert |
| URS-R07 | IQ-01, IQ-15 | — | UAT-04 | ☐ Verifiziert |
| URS-R08 | — | OQ-09 | UAT-04 | ☐ Verifiziert |
| URS-R09 | IQ-09 | — | UAT-05 | ☐ Verifiziert |
| URS-R10 | — | OQ-10 | — | ☐ Verifiziert |
| URS-R11 | IQ-12 | OQ-08 | UAT-06 | ☐ Verifiziert |
| URS-R12 | IQ-13 | OQ-07 | — | ☐ Verifiziert |

---

## Traceability-Matrix: URS → Regulatory References

| URS-ID | Primäre Regulierung | Spezifischer Abschnitt | Sekundäre Referenz |
|---|---|---|---|
| URS-R01 | EU GMP Annex 15 | §3.4 — Anforderungsdefinition | GAMP 5 §7.3 |
| URS-R02 | GAMP 5 | Table 4 — Software Categories | ICH Q9 |
| URS-R03 | EU GMP Annex 11 | §4 — Risikobasierter Ansatz | 21 CFR Part 11 |
| URS-R04 | EU GMP Annex 11 | §10 — Accuracy Checks | GAMP 5 Appendix M9 |
| URS-R05 | EU GMP Annex 15 | §10.4 — Protokollformat | GAMP 5 §7.5 |
| URS-R06 | EU GMP Annex 11 | §4 — Traceability | GAMP 5 §7.5 |
| URS-R07 | EU GMP Annex 11 | §8 — Datenspeicherung | 21 CFR Part 11 §11.50 |
| URS-R08 | EU GMP Annex 11 | §17 — Ausdrucke | 21 CFR Part 11 §11.70 |
| URS-R09 | EU GMP Annex 11 | §16 — Business Continuity | GAMP 5 §7.2 |
| URS-R10 | EU GMP Annex 11 | §16 — Disaster Recovery | GAMP 5 §7.2 |
| URS-R11 | EU GMP Annex 11 | §12 — Zugriffskontrolle | 21 CFR Part 11 §11.10(d) |
| URS-R12 | EU GMP Annex 11 | §9 — Audit Trail | 21 CFR Part 11 §11.10(e) |

---

## Abdeckungsanalyse

| Kategorie | Anforderungen gesamt | Verifiziert | Abdeckung |
|---|---|---|---|
| Funktional | 4 (R01, R02, R04, R08) | ☐ / 4 | |
| Regulatorisch | 4 (R03, R06, R07, R12) | ☐ / 4 | |
| Performance | 2 (R04, R09) | ☐ / 2 | |
| Sicherheit | 1 (R11) | ☐ / 1 | |
| Robustheit | 1 (R10) | ☐ / 1 | |
| **Gesamt** | **12** | **☐ / 12** | **Ziel: 100%** |

> **Akzeptanzkriterium:** 100% der URS-Anforderungen müssen durch mindestens einen Testfall verifiziert sein.

---

## Genehmigung

| Funktion | Approved by | Signature | Datum |
|---|---|---|---|
| Author | Stefan Billich | | |
| Quality | Stefan Billich | | |

## Change History

| Rev | Datum | Beschreibung | Author |
|---|---|---|---|
| R01 | 2026-06-24 | Erstfassung | Stefan Billich |

---
*Generiert von QualiPilot — a Kordix AI product.*
