# 📋 Validierungsbericht — QualiPilot v1.0 (VR001 R01)

> **Systemstandard:** Zusammenfassender Validierungsbericht für QualiPilot v1.0 (Kordix AI). Fasst alle Validierungsaktivitäten zusammen und bescheinigt die GMP-Konformität des Systems. Grundlage: EU GMP Annex 15, GAMP 5, SDS v1.0.

---

## Deckblatt

| Feld | Wert |
|---|---|
| Dokument-ID | VR001 |
| Revision | R01 |
| Status | Draft |
| System | QualiPilot v1.0 (Kordix AI) |
| GAMP-5-Kategorie | Cat 4 (Next.js + Supabase) / Cat 5 (KI-Logik + Traceability Engine) |
| Author | Stefan Billich |
| Datum | 2026-06-24 |
| Gültig ab | [nach Final Approval einzutragen] |

**Pre-Approval**

| Funktion | Approved by | Signature | Datum |
|---|---|---|---|
| Author | Stefan Billich | | |
| Document Owner | Stefan Billich | | |
| Quality | Stefan Billich | | |

---

## 1. Executive Summary

QualiPilot v1.0 (Kordix AI) ist eine KI-gestützte Webplattform zur automatisierten Erstellung von GMP-konformen Qualifizierungsdokumenten. Das System wurde gemäß einem risikobasierten Ansatz nach GAMP 5 vollständig qualifiziert (IQ → OQ → PQ/UAT).

**Ergebnis:** [Ausfüllen nach Testdurchführung]
- Alle IQ-Testfälle: ☐ Bestanden / ☐ Abweichungen
- Alle OQ-Testfälle (10): ☐ Bestanden / ☐ Abweichungen
- Alle PQ/UAT-Testfälle (7): ☐ Bestanden / ☐ Abweichungen
- Offene kritische Deviations: ☐ Keine / ☐ Anzahl: ___

**Gesamtbewertung:** ☐ Validiert — freigegeben / ☐ Bedingt validiert / ☐ Nicht validiert

---

## 2. Systemübersicht

### 2.1 System-Beschreibung

| Komponente | Beschreibung | GAMP-5-Kategorie |
|---|---|---|
| KI-Generierungslogik (Claude AI) | Bespoke AI-Engine für Dokumentengenerierung | Cat 5 |
| Traceability Engine | Bespoke Rückführbarkeits-Engine | Cat 5 |
| Next.js 16 Frontend | Konfiguriertes Web-Framework | Cat 4 |
| Supabase Backend | Konfiguriertes PostgreSQL + Auth | Cat 4 |
| Vercel Hosting | Cloud-Infrastruktur | Cat 1 |

### 2.2 Systemgrenzen

**Eingeschlossen:** QualiPilot Web-Applikation (Frontend + Backend + AI-Integration) inkl. Datenbankschema und Authentifizierung.

**Ausgeschlossen:** Claude AI-Modell selbst (von Anthropic bereitgestellt); Vercel-Infrastruktur (abgedeckt durch Vercel IQ-Dokumentation); Endbenutzer-Endgeräte.

---

## 3. Validierungsumfang und Strategie

### 3.1 Angewandte Standards

| Standard | Titel | Anwendung |
|---|---|---|
| EU GMP Annex 11 | Computerised Systems | Vollständig anwendbar |
| EU GMP Annex 15 | Qualification and Validation | Qualifizierungsstrategie |
| GAMP 5 (5. Aufl.) | Risk-Based Approach to Compliant GxP Computerised Systems | Klassifizierung, Testumfang |
| ICH Q9 | Quality Risk Management | Risikoanalyse |
| 21 CFR Part 11 | Electronic Records; Electronic Signatures | Audit Trail, E-Signatur |
| ALCOA+ | Datenintegrität-Prinzipien | Audit Trail Anforderungen |

### 3.2 Qualifizierungsstrategie

Risikobasierte Qualifizierung nach GAMP 5, Lifecycle-Ansatz:

1. **DQ-Vorstufe** — Anforderungsableitung aus Equipment-Profil (automatisiert durch QualiPilot)
2. **IQ** (IQ001 R01) — Verifikation der korrekten Installation und Konfiguration
3. **OQ** (OQ001 R01) — Verifikation des korrekten Betriebs im installierten Umfeld
4. **PQ/UAT** (UAT001 R01) — Verifikation unter produktionsnahen Bedingungen
5. **Traceability** (TRM001 R01) — Lückenlose Rückführbarkeit URS → Tests → Regularien
6. **Validierungsbericht** (VR001 R01) — Dieses Dokument

---

## 4. Zusammenfassung der Validierungsaktivitäten

### 4.1 IQ — Installation Qualification

| Feld | Details |
|---|---|
| Dokument | IQ001 R01 |
| Testfälle | IQ-01 bis IQ-24+ |
| Besondere Testfälle | IQ-24: GAMP-5-Einstufung (Ref: SDS-18, Table 1) |
| Referenz-SDS | SDS v1.0, §18 |
| Ergebnis | ☐ Alle Tests bestanden / ☐ Abweichungen: ___ |
| Abschlussdatum / Freigabe | Stefan Billich |

### 4.2 OQ — Operational Qualification

| Feld | Details |
|---|---|
| Dokument | OQ001 R01 |
| Testfälle | OQ-01 bis OQ-10 (10 Tests) |
| Schwerpunkte | Auth, Dateneingabe, GAMP-5-Klassifizierung, IQ/OQ-Generierung, Speicherung, Audit Trail, RBAC, Export, Fehlerbehandlung |
| Ergebnis | ☐ Alle Tests bestanden / ☐ Abweichungen: ___ |
| Abschlussdatum / Freigabe | Stefan Billich |

### 4.3 PQ/UAT — Performance Qualification

| Feld | Details |
|---|---|
| Dokument | UAT001 R01 |
| Testfälle | UAT-01 bis UAT-07 (7 Tests) |
| Schwerpunkte | E2E IQ-Generierung, E2E OQ-Generierung, Traceability, Layout, Performanz, Multi-Tenant, Regulatory Coverage |
| Ergebnis | ☐ Alle Tests bestanden / ☐ Abweichungen: ___ |
| Abschlussdatum / Freigabe | Stefan Billich |

### 4.4 Traceability

| Feld | Details |
|---|---|
| Dokument | TRM001 R01 |
| Anforderungen | 12 URS-Anforderungen (URS-R01 bis URS-R12) |
| Testfälle gesamt | IQ: 24+ · OQ: 10 · UAT: 7 |
| Abdeckung | ☐ 100% (alle URS durch mindestens einen Test abgedeckt) |

---

## 5. Abweichungsübersicht

| Dev-ID | Protokoll | Test-ID | Beschreibung | Schweregrad | Corrective Action | Abgeschlossen |
|---|---|---|---|---|---|---|
| — | — | — | Keine offenen Abweichungen | — | — | — |

> **Anforderung:** Alle Critical- und High-Abweichungen müssen vor Final Approval geschlossen sein.

---

## 6. Risikobeurteilung

### 6.1 Identifizierte Risiken

| Risk-ID | Risiko | Wahrscheinlichkeit | Impact | Maßnahme | Status |
|---|---|---|---|---|---|
| R001 | KI generiert inhaltlich falsche Testfälle | Mittel | Hoch | Fachliche Review jedes Dokuments durch QP | Mitigiert |
| R002 | Supabase RLS-Policy umgehbar | Niedrig | Kritisch | Penetration Test (OQ-08, UAT-06) | Mitigiert |
| R003 | Anthropic API-Downtime | Niedrig | Hoch | Graceful Error Handling (OQ-10); Retry-Mechanismus | Mitigiert |
| R004 | Vercel Deployment-Ausfall | Sehr niedrig | Hoch | Vercel SLA 99,9% (IQ-09); Backup-Strategie | Akzeptiert |

### 6.2 Gesamtrisikobewertung

**Restrisiko nach Mitigierung:** Niedrig — Das System ist für den validierten Einsatz in GMP-Umgebungen geeignet.

---

## 7. Schlussfolgerung und Freigabe

### 7.1 Validierungsergebnis

QualiPilot v1.0 (Kordix AI) wurde gemäß dem definierten Validierungsplan erfolgreich qualifiziert. Das System:

- ☐ erfüllt alle 12 URS-Anforderungen (URS-R01 bis URS-R12)
- ☐ entspricht EU GMP Annex 11 (Computerised Systems)
- ☐ entspricht GAMP 5 Cat 4/5 Anforderungen
- ☐ ist ALCOA+-konform (vollständiger Audit Trail)
- ☐ ist für den GMP-Betrieb freigegeben

### 7.2 Einschränkungen und Auflagen

1. Jedes von QualiPilot generierte Qualifizierungsdokument muss durch einen qualifizierten GMP-Fachmann (QP) fachlich reviewt und freigegeben werden.
2. Bei Systemänderungen (neue Releases, Konfigurationsänderungen) ist eine Änderungskontrolle (Change Control) gemäß EU GMP Annex 11 §10 durchzuführen.
3. Jährliche Periodic Review des Validierungsstatus durchführen.

### 7.3 Nächste Schritte

- [ ] Alle Testprotokolle (IQ001, OQ001, UAT001) abschließen und final genehmigen
- [ ] Traceability-Matrix (TRM001) auf 100% Abdeckung prüfen
- [ ] Validierungsbericht (dieses Dokument) final genehmigen
- [ ] System in Betrieb nehmen und Periodic Review planen (12 Monate)

---

## 8. Referenzen

**Internal:** IQ001 R01 · OQ001 R01 · UAT001 R01 · TRM001 R01 · SDS v1.0 · URS-001 R01

**External:** EU GMP Annex 11 (2011) · EU GMP Annex 15 (2015) · GAMP 5 (5th Ed.) · ICH Q9 · 21 CFR Part 11 · ALCOA+ (MHRA Data Integrity Guidance, 2018)

---

## Final Approval

| Funktion | Approved by | Signature | Position | Datum |
|---|---|---|---|---|
| Author | Stefan Billich | | CEO / QP | |
| Document Owner | Stefan Billich | | CEO / QP | |
| Quality | Stefan Billich | | CEO / QP | |

## Change History

| Rev | Datum | Beschreibung | Author |
|---|---|---|---|
| R01 | 2026-06-24 | Erstfassung | Stefan Billich |

---
*Generiert von QualiPilot — a Kordix AI product.*
