# Lieferanten- und Subservice-Bewertung — QualiPilot v1.0 (MVP)

| Feld | Wert |
|---|---|
| **Dokument-ID** | CSV-LB-2026-001 |
| **Revision** | R01 |
| **Status** | Entwurf / Demo |
| **Author** | Kordix AI |
| **Datum** | [DATUM] |
| **System** | QualiPilot v1.0 [MVP] |
| **Referenzen** | CSV-VP-2026-001, CSV-RA-2026-001, DEV-Paket (siehe Abschnitt 2) |

## 1. Zweck und Ansatz

Bewertung des Entwicklers und der kritischen Subservices von QualiPilot gemäß GAMP 5 und EU GMP Annex 11 (Ziff. 3, Lieferanten und Dienstleister). Bewertungsmethode: dokumentenbasiertes Assessment (Entwicklungsnachweise, Anbieterdokumentation, Vertrags-/AGB-Prüfung); für den Pilotbetrieb angemessen und risikoproportional. Kunden-Audits beim Hersteller sind auf Anfrage möglich.

## 2. Kordix AI — Entwickler (GAMP-5-Kategorie-5-Lieferant)

Kordix AI ist Hersteller und Entwickler von QualiPilot (Solo-Gründer, fachlicher Hintergrund GMP Qualification Specialist). Der Entwicklungsprozess ist durch ein dokumentiertes Software-Entwicklungspaket nachgewiesen:

| Nachweis | Dokument-ID | Bewertungsergebnis |
|---|---|---|
| Software-Entwicklungsplan | DEV-SDP-2026-001 | Vorhanden, Lifecycle definiert |
| Software-Architektur | DEV-SAD-2026-001 | Vorhanden, deckt FS-Bezug ab |
| SOP KI-gestützte Entwicklung | DEV-SOP-AI-2026-001 | Vorhanden — regelt KI-Einsatz in Entwicklung und Prompt-Versionierung |
| Coding Standards | DEV-CS-2026-001 | Vorhanden |
| Teststrategie (inkl. Regressions-Testset) | DEV-TS-2026-001 | Vorhanden — Grundlage für COQ-T17 |
| Versionsmanagement | DEV-KM-2026-001 | Vorhanden — Release-Identifikation (CIQ-T01) |
| Change Control / Deployment | DEV-CC-2026-001 | Vorhanden — Grundlage für Modell-/Vorlagenänderungen |
| Security | DEV-SEC-2026-001 | Vorhanden — Secrets, TLS, Datenminimierung |

**Bewertung:** Entwicklungsprozess dokumentiert und angemessen. **Bekannte Schwachstelle:** Solo-Entwicklung ohne personelle Trennung Entwicklung/Test/Freigabe — kompensiert durch dokumentierte Prozesse, automatisierte Testsuite (DEV-TS-2026-001) und Einbindung des Pilotkunden im UAT (siehe R-08/OP-02).

## 3. Anthropic (Claude API) — kritischer Subservice

Das LLM ist funktionskritisch für die Dokumentgenerierung (F-011). Bewertungsschwerpunkte:

| Kriterium | Befund | Risiko-Bezug |
|---|---|---|
| API-Vertrag / Nutzungsbedingungen | Kommerzielle API-Nutzung; vertragliche Zusicherung, dass API-Daten nicht zum Modelltraining verwendet werden | R-12, U-029 |
| Modellversionierung | Modelle mit versionierten Snapshot-IDs ansprechbar; QualiPilot pinnt die Modellversion konfigurativ (CIQ-T03); Deprecation-Ankündigungen des Anbieters werden über Change Control verarbeitet | R-03, U-026, U-027 |
| Verfügbarkeit / SLA | Öffentlicher Status-/Verfügbarkeitsnachweis des Anbieters; kein dediziertes SLA im Pilot-Tarif → Restrisiko akzeptiert, kompensiert durch definiertes Ausfallverhalten (COQ-T14) | R-11, U-028, U-031 |
| Datensicherheit | TLS-Transport, dokumentierte Sicherheitszertifizierungen des Anbieters (Details: Anbieterdokumentation, *[Anlage: Systemkonfiguration]*) | R-12, U-019 |
| Qualifizierbarkeit | LLM ist nicht deterministisch → wird nicht als „qualifizierte Komponente", sondern als kontrollierter Subservice behandelt; Verlässlichkeit wird auf QualiPilot-Ebene durch Prüfschicht, Traceability und Regressions-Testset abgesichert | R-01–R-05 |

**Bewertung:** Geeignet als Subservice **unter den Kontrollen** Modell-Pinning, Change Control mit Regressions-Testset, No-Training-Zusicherung und definiertem Fehlerverhalten.

## 4. Cloud-/Hosting-Provider (generisch)

QualiPilot wird bei einem etablierten Cloud-Provider betrieben (Details: *[Anlage: Systemkonfiguration]*).

| Kriterium | Befund |
|---|---|
| Zertifizierungen | Marktübliche Zertifizierungen (u. a. ISO 27001 oder gleichwertig) laut Anbieterdokumentation |
| Umgebungstrennung | Getrennte Dev-/Prod-Umgebungen, verifiziert in CIQ-T02 |
| Backup/Restore | Provider-Mechanismen + eigene Backup-Strategie, verifiziert in CIQ-T08 (R-15) |
| Standort/Datenresidenz | Gemäß Kundenvereinbarung; im Pilotvertrag festgelegt |

**Bewertung:** Geeignet; Standard-Infrastruktur-Subservice (GAMP-5-Einordnung der Infrastruktur: Kategorie 1 beim Provider), Verantwortung für Konfiguration verbleibt bei Kordix AI.

## 5. Bewertungsmatrix und Maßnahmen

| Lieferant/Subservice | Kritikalität | Ergebnis | Maßnahmen |
|---|---|---|---|
| Kordix AI (Entwicklung) | Hoch | **Akzeptiert mit Auflage** | Vier-Augen-Prinzip organisatorisch bis SoD-Implementierung (OP-02); DEV-Paket aktuell halten |
| Anthropic (Claude API) | Hoch | **Akzeptiert mit Kontrollen** | Modell-Pinning (CIQ-T03); Regressions-Testset bei jedem Modellwechsel (COQ-T17); jährliche Re-Bewertung der Vertragsbedingungen; Monitoring von Deprecation-Ankündigungen |
| Cloud-/Hosting-Provider | Mittel | **Akzeptiert** | Jährliche Prüfung der Zertifikatslage; Backup-/Restore-Test periodisch wiederholen |

**Re-Bewertung:** jährlich im periodischen Review (CSV-VB-2026-001, Abschnitt 7) sowie anlassbezogen (Vertragsänderung, Sicherheitsvorfall, Modell-Deprecation).

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung (Entwurf/Demo) |

*Kordix AI · QualiPilot CSV-Validierungspaket · Demo-Dokument*
