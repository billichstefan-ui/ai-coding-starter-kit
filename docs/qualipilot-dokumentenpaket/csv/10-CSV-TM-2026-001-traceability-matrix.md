# Traceability-Matrix — QualiPilot v1.0 (MVP)

| Feld | Wert |
|---|---|
| **Dokument-ID** | CSV-TM-2026-001 |
| **Revision** | R01 |
| **Status** | Entwurf / Demo |
| **Author** | Kordix AI |
| **Datum** | [DATUM] |
| **System** | QualiPilot v1.0 [MVP] |
| **Referenzen** | CSV-URS-2026-001, CSV-FS-2026-001, CSV-RA-2026-001, CSV-IQ/OQ/UAT-2026-001 |

## 1. Zweck

Lückenlose Rückverfolgung jeder Nutzeranforderung (U-ID) über Funktion (F-ID) und Risiko (R-ID) zu den Verifizierungstests (CIQ/COQ/CUAT). Statuslegende: **verifizierbar** (Testfall in R01 enthalten) · **deferred** (Anforderung geplant; Test wird bei Implementierung ergänzt) · **prozedural** (Nachweis über Prozess/Dokument statt Systemtest).

## 2. Matrix

| U-ID | Anforderung (Kurz) | F-ID | Risiko | Testfälle | Status |
|---|---|---|---|---|---|
| U-001 | Equipment-Profil-Eingabe, Pflichtfelder | F-001 | R-13 | COQ-T11, CUAT-T07 | verifizierbar |
| U-002 | DQ-Vorstufe-Ableitung | F-002 | R-01, R-02 | COQ-T05 | verifizierbar |
| U-003 | URS-Ableitung | F-002 | R-01, R-02 | COQ-T05 | verifizierbar |
| U-004 | IQ-Protokollgenerierung (IQ001 R01) | F-003 | R-01, R-06 | COQ-T01, CUAT-T02 | verifizierbar |
| U-005 | OQ-Protokollgenerierung | F-003 | R-01 | COQ-T02 | verifizierbar |
| U-006 | PQ-Protokollgenerierung | F-003 | R-01 | COQ-T03 | verifizierbar |
| U-007 | CSV-Begleitdokumente | F-003 | R-01 | COQ-T02/T03 (analog), CUAT-T03 | verifizierbar |
| U-008 | Temperaturmapping-Prüfplan aus 10 Raumparametern | F-001, F-003 | R-01, R-13 | COQ-T04, CUAT-T01 | verifizierbar |
| U-009 | Prüfschicht validiert Akzeptanzkriterien | F-004 | R-01, R-05 | COQ-T07, COQ-T08, CUAT-T03 | verifizierbar |
| U-010 | ENTWURF-Kennzeichnung / Human-in-the-loop | F-003 | R-01, R-10 | COQ-T12, CUAT-T01 | verifizierbar |
| U-011 | Vorlagenverwaltung, IQ001 R01 installiert | F-006 | R-06 | CIQ-T05, COQ-T10, CUAT-T05 | verifizierbar |
| U-012 | Vorlagen-Treue (16 Test Sections) | F-006 | R-06 | COQ-T01, COQ-T10, CUAT-T02 | verifizierbar |
| U-013 | Traceability-Matrix je Dokument | F-005 | R-02 | COQ-T09, CUAT-T04 | verifizierbar |
| U-014 | Prüfpunkte als ausfüllbare Test-Tabellen | F-003, F-006 | R-06 | COQ-T01 | verifizierbar |
| U-015 | Vollständiger Export ohne Trunkierung | F-007 | R-04 | COQ-T06 | verifizierbar |
| U-016 | Individuelle authentifizierte Konten | F-009 | R-07 | CIQ-T07, COQ-T16 (Teil A) | verifizierbar |
| U-017 | Autorisierung / Projekt-Scoping (Mehrmandantenfähigkeit) | F-009 | R-07 | COQ-T16 (Teil B) — nach Implementierung; Übergangsmaßnahme verifiziert via CIQ-T02, CUAT-T08 | **deferred (OP-01)** |
| U-018 | Funktionstrennung SoD | F-009 | R-08 | COQ-T16 (Teil B) — nach Implementierung; Übergangsmaßnahme verifiziert via CUAT-T08 | **deferred (OP-02)** |
| U-019 | TLS-Transportverschlüsselung | F-012 | R-12 | CIQ-T07 | verifizierbar |
| U-020 | Secrets-Management | F-012 | R-12 | CIQ-T06 | verifizierbar |
| U-021 | Audit Trail | F-010 | R-09 | CIQ-T09, COQ-T15 | verifizierbar |
| U-022 | ALCOA+-konforme Datenhaltung | F-010, F-012 | R-09, R-15 | COQ-T15, CIQ-T08 + Assessment CSV-P11-2026-001 §4 | verifizierbar + prozedural |
| U-023 | e-Signatur-Rendering (Part 11) | F-008 | R-10 | COQ-T13 | verifizierbar |
| U-024 | Generierungs-Metadaten | F-010 | R-09, R-03 | COQ-T15 | verifizierbar |
| U-025 | Backups / Wiederherstellbarkeit | F-012 | R-15 | CIQ-T08 | verifizierbar |
| U-026 | Gepinnte LLM-Modellversion | F-011 | R-03 | CIQ-T03 | verifizierbar |
| U-027 | Modellwechsel nur via Change Control + Regressionstestset | F-011 | R-03 | COQ-T17 + DEV-CC-2026-001 | verifizierbar + prozedural |
| U-028 | Definiertes LLM-Ausfallverhalten | F-011 | R-11 | COQ-T14 | verifizierbar |
| U-029 | Keine Trainingsnutzung der Kundendaten | F-011 | R-12 | CSV-LB-2026-001 (Vertragsprüfung) | prozedural |
| U-030 | Generierungszeit ≤ 120 s (Ziel ~60 s) | F-003, F-012 | — | COQ-T04, CUAT-T06 | verifizierbar |
| U-031 | Verfügbarkeit ≥ 99 % Geschäftszeiten | F-012 | R-11 | Monitoring-Nachweis (*[Anlage: Systemkonfiguration]*) | prozedural |
| U-032 | max_tokens / Ausgabekapazität ohne Trunkierung | F-007 | R-04 | CIQ-T04, COQ-T06 | verifizierbar |
| U-033 | Umgebungstrennung Dev/Prod | F-012 | R-14 | CIQ-T02 | verifizierbar |
| U-034 | Eindeutige Versionsidentifikation | F-012 | R-14 | CIQ-T01, CIQ-T10 | verifizierbar |
| U-035 | Incident-/Support-Prozess | F-012 | — | Prozessdokumentation (Kordix AI) | prozedural |

## 3. Rückrichtung: Risiken ohne direkte U-Verankerung

Alle 15 Risiken aus CSV-RA-2026-001 sind über obige Matrix mindestens einem U/F-Paar und mindestens einem Testfall bzw. einer prozeduralen Kontrolle zugeordnet. Kein Testfall (CIQ-T01–T10, COQ-T01–T17, CUAT-T01–T08) ist ohne Anforderungsbezug (kein „Orphan Test").

## 4. Kurzstatistik

| Kennzahl | Wert |
|---|---|
| Anforderungen gesamt | 35 |
| Abdeckung (Testfall oder prozeduraler Nachweis) | **35 / 35 = 100 %** |
| Davon rein prozedural nachgewiesen | 3 (U-029, U-031, U-035) |
| **Deferred (geplant, Test nach Implementierung)** | **2 (U-017, U-018)** — Übergangsmaßnahmen in R01 verifiziert (CIQ-T02, CUAT-T08) |
| Funktionen | 12 (F-001–F-012) |
| Risiken | 15 (R-01–R-15), davon 6 KI-spezifisch |
| Testfälle | IQ: 10 (CIQ-T01–T10) · OQ: 17 (COQ-T01–T17) · UAT: 8 (CUAT-T01–T08) = **35** |

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung (Entwurf/Demo) |

*Kordix AI · QualiPilot CSV-Validierungspaket · Demo-Dokument*
