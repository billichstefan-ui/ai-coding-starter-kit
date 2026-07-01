# Design Qualification (DQ) — HPLC-System Agilent 1260 Infinity II

| Feld | Wert |
|---|---|
| Dokument-ID | DQ-2026-001 |
| Revision | R01 |
| Status | Demo / Entwurf |
| Author | QualiPilot |
| Datum | [DATUM] |
| Betreiber | Musterpharma GmbH, QC-Labor |
| Referenzen | VP-2026-001; URS-2026-001; RA-2026-001; EU GMP Annex 15 §3.2 |

---

## 1 Introduction

Die Design Qualification dokumentiert den Nachweis, dass das vorgesehene System (Agilent 1260 Infinity II mit CDS) die Nutzeranforderungen der URS-2026-001 per Design erfüllt und der Lieferant für den GMP-Einsatz geeignet ist. Die DQ wird vor Bestellung/Installation abgeschlossen (EU GMP Annex 15, Abschnitt 3.2).

## 2 Scope

- Abgleich URS ↔ Herstellerspezifikation (Datenblätter G7111B, G7129A, G7116A, G7115A; CDS-Funktionsspezifikation)
- Lieferantenbewertung Agilent Technologies (Hardware + CDS)
- Bestätigung der Prüfbarkeit aller Anforderungen in IQ/OQ/PQ

## 3 Abgleich URS ↔ Herstellerspezifikation (Auszug)

| URS-ID | Anforderung (Kurzform) | Herstellerspezifikation | Bewertung |
|---|---|---|---|
| URS-001 | Quaternäre Pumpe, 4 Kanäle | G7111B: quaternäre Niederdruck-Gradientenpumpe, Kanäle A–D | erfüllt |
| URS-002 | Fluss 0,2–5,0 mL/min | G7111B: 0,001–10 mL/min (Spezifikationsbereich 0,2–5,0 mL/min) | erfüllt |
| URS-003 | ≥100 Vials, 0,1–100 µL | G7129A: 132 × 2-mL-Vials; Injektionsvolumen 0,1–100 µL | erfüllt |
| URS-004 | Säulenofen +5…+80 °C, 30 cm | G7116A: 10 °C unter Umgebung bis +85 °C; bis 30 cm Säulenlänge | erfüllt |
| URS-005 | DAD 190–640 nm, Spektren | G7115A: 190–640 nm, 1024-Element-Diodenarray | erfüllt |
| URS-006 | Vollständige CDS-Steuerung/Auswertung | CDS: zertifizierte Gerätetreiber 1260 Infinity II, Integration/Quantifizierung/Reporting | erfüllt |
| URS-007 | Nadelwäsche gegen Carryover | G7129A: integrierte Nadelaußenwäsche | erfüllt |
| URS-011–016 | Leistungsspezifikationen | Herstellerangaben ≤ URS-Grenzwerte (z. B. Flusspräzision ≤0,07 % RSD, WL-Genauigkeit ±1 nm) | erfüllt |
| URS-017–022 | Audit Trail, Access Control, e-Signatur, Datenintegrität | CDS-Funktionsspezifikation: technische Kontrollen für 21 CFR Part 11 / EU Annex 11 vorhanden (konfigurationsabhängig → Verifizierung in IQ/OQ) | erfüllt (mit OQ-Verifizierung) |
| URS-023–026 | GAMP Kat. 4, Workstation, Netzwerk, Wiederanlauf | CDS-Systemvoraussetzungen und Recovery-Verhalten spezifiziert | erfüllt |
| URS-027–029 | PM-Plan, Rückführbarkeit, EMF | Agilent PM-Programm, Support-Zusage >10 Jahre, Early Maintenance Feedback | erfüllt |

> Der vollständige zeilenweise Abgleich aller 29 URS-Anforderungen ist in der Traceability-Matrix TM-2026-001 hinterlegt. Ergebnis: **29/29 Anforderungen per Design abgedeckt, keine Gaps.**

## 4 Lieferantenbewertung

| Kriterium | Befund |
|---|---|
| Qualitätsmanagementsystem | ISO 9001-zertifiziert (Zertifikat liegt vor) |
| Marktstellung / Erfahrung | Etablierter Hersteller von HPLC-Systemen für den regulierten Markt |
| GxP-Unterstützung | Qualifizierungsdienstleistungen, Konformitätserklärungen, CDS mit Part-11-Funktionsumfang |
| Support & Ersatzteile | Servicezusage und Ersatzteilverfügbarkeit ≥ 10 Jahre (URS-027) |
| Bewertungsmethode | Postal Audit / Fragebogen gemäß Standort-SOP; kein Vor-Ort-Audit erforderlich (Kategorie-3/4-System, Standardprodukt) |
| **Gesamtergebnis** | **Lieferant geeignet** |

## 5 DQ-Prüfpunkte

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| DQ-T01 | URS-Abgleich: jede URS-Anforderung gegen Herstellerspezifikation geprüft | 29/29 Anforderungen abgedeckt, keine offenen Gaps | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-001–029 |
| DQ-T02 | Lieferantenbewertung Agilent abgeschlossen und dokumentiert | Ergebnis „geeignet", Bewertung durch Quality freigegeben | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-023, URS-027 |
| DQ-T03 | GAMP-5-Kategorisierung des Systems dokumentiert | Hardware Kat. 3, CDS Kat. 4; Kategorisierung von Quality bestätigt | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-023, RA-12 |
| DQ-T04 | Compliance-Fähigkeit CDS: Audit Trail, Access Control, e-Signatur in Funktionsspezifikation bestätigt | Alle Funktionen lt. Herstellerdokumentation vorhanden; Verifizierungstests in OQ eingeplant (OQ-T09/T10) | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-017–019, RA-08, RA-09 |
| DQ-T05 | Installations- und Umgebungsanforderungen (Platz, Strom, Temperatur, Abluft) definiert und mit Aufstellort abgeglichen | Site-Preparation-Checkliste vollständig, Aufstellort geeignet | ☐ Pass ☐ Fail | [NAME] / [DATUM] | RA-11 |
| DQ-T06 | Wartungs- und Kalibrierkonzept (PM-Plan, Requalifizierungsintervalle) liegt vor | PM-Plan und Intervallfestlegung dokumentiert und von Document Owner akzeptiert | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-027–029, RA-14 |

## 6 Ergebnis und Freigabe zur Beschaffung

Bei Bestehen aller Prüfpunkte DQ-T01 bis DQ-T06 ist das Design als geeignet bewertet; die Beschaffung und anschließende IQ (IQ-2026-001) werden freigegeben.

| Rolle | Approved by | Signature | Position | Date |
|---|---|---|---|---|
| Author | [NAME] | | | [DATUM] |
| Document Owner | [NAME] | | | [DATUM] |
| Quality | [NAME] | | | [DATUM] |

---

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | QualiPilot | Ersterstellung (Demo) |

*Generiert von QualiPilot — a Kordix AI product · Demo-Dokument*
