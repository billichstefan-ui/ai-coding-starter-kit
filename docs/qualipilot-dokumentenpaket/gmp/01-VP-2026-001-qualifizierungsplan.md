# Qualifizierungsplan (Validation Plan) — HPLC-System Agilent 1260 Infinity II

| Feld | Wert |
|---|---|
| Dokument-ID | VP-2026-001 |
| Revision | R01 |
| Status | Demo / Entwurf |
| Author | QualiPilot |
| Datum | [DATUM] |
| Betreiber | Musterpharma GmbH, QC-Labor |
| System | Agilent 1260 Infinity II HPLC mit Chromatographie-Datensystem (CDS) |

---

## 1 Introduction

Dieser Qualifizierungsplan beschreibt die Strategie zur Qualifizierung des HPLC-Systems **Agilent 1260 Infinity II** (Quaternäre Pumpe G7111B, Vialsampler G7129A, Säulenthermostat G7116A, Dioden-Array-Detektor G7115A) inklusive des zugehörigen Chromatographie-Datensystems (CDS) im QC-Labor der Musterpharma GmbH.

Das System dient der quantitativen und qualitativen Analyse von Wirkstoffen, Fertigprodukten und Stabilitätsmustern im GMP-regulierten Umfeld. Das CDS wird gemäß GAMP 5 (2nd Ed.) als **Kategorie 4** (konfigurierte Software) eingestuft; die HPLC-Hardware als Kategorie 3 (Standardgerät, nicht konfiguriert modifiziert).

## 2 Scope

**Eingeschlossen:**
- Alle vier Hardware-Module des HPLC-Systems inkl. Verkabelung, Fluidik und Aufstellumgebung
- CDS-Workstation (Hardware + Software) inkl. Benutzer- und Berechtigungskonzept, Audit Trail, Backup/Restore
- Schnittstelle CDS ↔ HPLC-Module (Gerätesteuerung, Datenaufnahme)

**Ausgeschlossen:**
- Analytische Methodenvalidierung (separates Validierungsprogramm nach ICH Q2)
- Netzwerk-Infrastrukturqualifizierung des Standorts (bereits qualifiziert, Ref. Standort-IT-QP)
- Qualifizierung von HPLC-Säulen (verbrauchsmaterialbezogen, über Systemeignungstests abgedeckt)

## 3 Regulatorische Grundlagen

| Referenz | Titel |
|---|---|
| EU GMP Leitfaden Annex 15 | Qualification and Validation |
| GAMP 5 (2nd Ed.) | A Risk-Based Approach to Compliant GxP Computerized Systems |
| ICH Q9(R1) | Quality Risk Management |
| 21 CFR Part 211 | Current Good Manufacturing Practice for Finished Pharmaceuticals |
| 21 CFR Part 11 / EU GMP Annex 11 | Electronic Records; Electronic Signatures / Computerised Systems |
| USP <1058> | Analytical Instrument Qualification (orientierend) |

## 4 Qualifizierungsstrategie (V-Modell)

Die Qualifizierung folgt dem V-Modell: Anforderungen werden auf der linken Seite spezifiziert und auf der rechten Seite verifiziert. Die Risikoanalyse (ICH Q9(R1), FMEA) steuert Tiefe und Umfang der Tests.

| Spezifikation (links) | ↔ | Verifizierung (rechts) |
|---|---|---|
| Nutzeranforderungen (URS-2026-001) | ↔ | Performance Qualification (PQ-2026-001) |
| Funktionale/Herstellerspezifikation | ↔ | Operational Qualification (OQ-2026-001) |
| Design / Konfiguration | ↔ | Installation Qualification (IQ-2026-001) |

Die **Design Qualification (DQ-2026-001)** verifiziert vor Beschaffung/Installation, dass die Herstellerspezifikation die URS abdeckt und der Lieferant geeignet ist. Die **Traceability-Matrix (TM-2026-001)** weist die lückenlose Abdeckung jeder Anforderung nach.

## 5 Dokumentenübersicht des Pakets

| Nr. | Dokument-ID | Titel | Phase |
|---|---|---|---|
| 1 | VP-2026-001 | Qualifizierungsplan | Planung |
| 2 | URS-2026-001 | User Requirements Specification (URS-001 bis URS-029) | Spezifikation |
| 3 | RA-2026-001 | Risikoanalyse nach ICH Q9(R1) / FMEA (RA-01 bis RA-14) | Risikomanagement |
| 4 | DQ-2026-001 | Design Qualification (DQ-T01 bis DQ-T06) | DQ |
| 5 | IQ-2026-001 | Installation Qualification (IQ-T01 bis IQ-T18) | IQ |
| 6 | OQ-2026-001 | Operational Qualification (OQ-T01 bis OQ-T12) | OQ |
| 7 | PQ-2026-001 | Performance Qualification (PQ-T01 bis PQ-T06) | PQ |
| 8 | TM-2026-001 | Traceability-Matrix | Nachverfolgbarkeit |
| 9 | QAB-2026-001 | Qualifizierungs-Abschlussbericht | Abschluss |

## 6 Roles and Responsibilities

| Rolle | Verantwortung |
|---|---|
| Author | Erstellung der Qualifizierungsdokumente, Durchführung/Koordination der Tests |
| Document Owner | Fachliche Verantwortung für System und Dokumenteninhalt (System Owner, QC-Labor) |
| Quality | Prüfung und Freigabe aller Qualifizierungsdokumente, Bewertung von Abweichungen |
| Lieferant (Agilent) | Bereitstellung Spezifikationen, Installation, herstellerseitige Testunterstützung |
| IT | Bereitstellung und Betrieb der qualifizierten Workstation-/Netzwerkumgebung |

Alle Genehmigungen erfolgen zweistufig: **Pre-Approval** (vor Testbeginn) und **Final Approval** (nach Testabschluss) durch Author, Document Owner und Quality.

## 7 Akzeptanzkriterien-Philosophie

- Jeder Prüfpunkt besitzt ein **vorab definiertes, objektiv messbares Akzeptanzkriterium** (Pre-Approval vor Testausführung).
- Kriterien werden **risikobasiert** abgeleitet: kritische URS-Anforderungen (Produktqualität, Datenintegrität) erhalten enge, quantitative Kriterien; mittlere Anforderungen ggf. attributive Kriterien (vorhanden/nicht vorhanden).
- Quantitative Kriterien orientieren sich an Herstellerspezifikation und beabsichtigtem Einsatz (z. B. Flussgenauigkeit ±1 %, Wellenlängengenauigkeit ±1 nm) — nie enger als die Messmethode auflösen kann.
- **Abweichungen** (Fail) werden dokumentiert, bewertet (Minor/Major/Critical) und vor Final Approval geschlossen oder mit begründeter Maßnahme (CAPA) versehen.
- Eine Phase wird erst nach **Handover/Progression Approval** der Vorphase gestartet (IQ → OQ → PQ); begründete parallele Aktivitäten sind im jeweiligen Protokoll zu dokumentieren.

## 8 Abweichungsmanagement

Abweichungen werden im jeweiligen Protokoll (Section „Validation Exception Reports") sowie im Abschlussbericht QAB-2026-001 geführt. Klassifizierung: **Critical** (Stopp, Quality-Entscheid), **Major** (Bewertung vor Phasenfortschritt), **Minor** (Dokumentation + Korrektur, kein Stopp).

## 9 Aufrechterhaltung des qualifizierten Zustands

Nach Freigabe: Kalibrier- und Wartungsprogramm (siehe URS-027/028, IQ Test Sections 11/12), Änderungen nur über Change Control, periodische Review gemäß Standort-SOP.

---

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | QualiPilot | Ersterstellung (Demo) |

*Generiert von QualiPilot — a Kordix AI product · Demo-Dokument*
