# Software-Architektur (SAD) — QualiPilot

| Feld | Wert |
|---|---|
| Dokument-ID | DEV-SAD-2026-001 |
| Revision | R01 |
| Status | Entwurf |
| Autor | Kordix AI |
| Datum | [DATUM] |
| Geltungsbereich | QualiPilot |

## 1. Zweck

Dieses Dokument beschreibt die Software-Architektur von QualiPilot: Systemkontext, Komponenten, Datenflüsse und die zentralen Architekturentscheidungen (ADRs). Es dient als Design-Referenz für die Entwicklung (DEV-SDP-2026-001) und als technischer Nachweis für die funktionale Spezifikation des CSV-Pakets (CSV-FS-2026-001).

Unbekannte oder bewusst offen gehaltene Implementierungsdetails sind generisch beschrieben; verbindlich sind die dokumentierten Komponenten, Schnittstellen und Entscheidungen.

## 2. Systemkontext

QualiPilot ist eine cloud-betriebene Webanwendung. Externe Akteure und Systeme:

| Akteur / System | Rolle |
|---|---|
| Anwender (Qualification Specialist, QA des Kunden) | Erfasst Equipment-Profile, startet Dokumentgenerierung, prüft und signiert Dokumente |
| Anthropic Claude API (LLM-Anbieter) | Generiert Dokumentinhalts-Entwürfe auf Basis der von QualiPilot assemblierten Prompts |
| Cloud-Plattform | Hosting von Frontend, KI-Service und Datenhaltung (Dev- und Prod-Umgebung, DEV-KM-2026-001 Kap. 6) |
| Kordix AI (Betreiber/Hersteller) | Entwicklung, Betrieb, Support, Change Control |

Datenflüsse zum LLM-Anbieter unterliegen den Regelungen in DEV-SEC-2026-001 Kap. 4 (Auftragsverarbeitung, kein Training mit Kundendaten als vertraglicher/konfigurativer Grundsatz).

## 3. Komponentenübersicht

```
Anwender ──▶ Web-Frontend ──▶ KI-Service (Python, services/ai/app/qualipilot)
                                  ├── Prompt-Assembly
                                  ├── LLM-Anbindung (Anthropic Claude API)
                                  ├── Prüfschicht (Validierung generierter Inhalte)
                                  ├── Vorlagen-Engine (z. B. IQ001 R01)
                                  ├── Traceability-Matrix-Generator
                                  └── export.py (Dokument-Export, e-Signatur-Rendering)
                              Datenhaltung (Equipment-Profile, Dokumente, Audit-Trail)
```

### 3.1 Web-Frontend

Browserbasierte Oberfläche für Erfassung von Equipment-Profilen, Steuerung der Generierung, Review generierter Dokumente und Export. TypeScript-basiert (Standards: DEV-CS-2026-001 Kap. 3).

### 3.2 KI-Service (Python)

Kernkomponente im Modul `services/ai/app/qualipilot`. Verantwortlich für die gesamte Generierungs-Pipeline:

| Teilkomponente | Funktion | GxP-Kritikalität |
|---|---|---|
| Prompt-Assembly | Baut aus Equipment-Profil, Vorlage und Kontext den strukturierten Prompt an die Claude API | Hoch |
| LLM-Anbindung | Aufruf der Anthropic Claude API mit gesteuerten Parametern (Modellversion, max_tokens; konfigurationsgeführt gemäß DEV-KM-2026-001 Kap. 7) | Hoch |
| Prüfschicht | Automatische Validierung generierter Inhalte, insbesondere der Akzeptanzkriterien (Struktur, Vollständigkeit, Plausibilitätsregeln); nicht bestandene Inhalte werden markiert bzw. zurückgewiesen | Sehr hoch |
| Vorlagen-Engine | Deterministische Dokumentstruktur aus versionierten Vorlagen; Standard-IQ-Vorlage **IQ001 R01** mit 16 Test Sections | Sehr hoch |
| Traceability-Matrix-Generator | Erzeugt die Verknüpfung Anforderung ↔ Testabschnitt im generierten Dokument | Hoch |
| `export.py` | Rendert das finale Dokument inkl. e-Signatur-Blöcken nach 21 CFR Part 11 (Bezug CSV-P11-2026-001) | Sehr hoch |

### 3.3 Datenhaltung

Persistenz von Equipment-Profilen, generierten Dokumenten, Generierungs-Metadaten (verwendete Modellversion, Vorlagen-Revision, Zeitstempel) und Audit-Trail-Einträgen. Konkrete Technologie generisch gehalten; Anforderungen (Integrität, Backup, Zugriffskontrolle) in DEV-SEC-2026-001.

### 3.4 e-Signatur-Rendering

Das Rendering elektronischer Signaturmanifestationen (Name, Datum/Zeit, Bedeutung der Signatur) erfolgt deterministisch in `export.py` gemäß 21 CFR Part 11; die regulatorische Bewertung ist in CSV-P11-2026-001 dokumentiert. Das LLM ist an der Signatur-Darstellung nicht beteiligt (siehe ADR-002).

## 4. Datenfluss der Dokumentgenerierung

1. **Equipment-Profil:** Anwender erfasst/wählt ein Equipment-Profil im Frontend.
2. **Prompt-Assembly:** Der KI-Service assembliert einen strukturierten Prompt aus Profil, versionierter Vorlage (z. B. IQ001 R01) und Systemkontext.
3. **LLM-Generierung:** Aufruf der Anthropic Claude API mit konfigurationsgeführten Parametern; das LLM liefert Inhalts-Entwürfe (z. B. Testschritte, Akzeptanzkriterien).
4. **Prüfschicht:** Generierte Inhalte werden automatisch validiert (Schema-/Strukturprüfung, Regelprüfung der Akzeptanzkriterien). Fehler führen zu sichtbarem Scheitern oder Kennzeichnung — niemals zu stiller Übernahme (DEV-CS-2026-001 Kap. 5).
5. **Dokumentaufbau:** Die Vorlagen-Engine fügt validierte Inhalte in die deterministische Dokumentstruktur ein; der Traceability-Matrix-Generator erzeugt die Zuordnung.
6. **Export:** `export.py` rendert das finale Dokument inkl. e-Signatur-Blöcken; Metadaten (Modellversion, Vorlagen-Revision) werden protokolliert.
7. **Menschliche Prüfung:** Der Anwender prüft das Dokument fachlich vor Verwendung — QualiPilot erzeugt Entwürfe, keine freigegebenen GMP-Dokumente.

## 5. Architekturentscheidungen (ADR-Kurzliste)

| ADR | Entscheidung | Begründung | Status |
|---|---|---|---|
| ADR-001 | LLM generiert Inhalts-Entwürfe; deterministischer Code baut die Dokumentstruktur (Vorlagen-Engine, export.py) | Reproduzierbare, testbare Dokumentstruktur; LLM-Nichtdeterminismus wird auf Inhaltsvorschläge begrenzt | Angenommen |
| ADR-002 | e-Signatur-Rendering und Traceability-Erzeugung ausschließlich deterministisch, ohne LLM-Beteiligung | Part-11-relevante Elemente müssen exakt und verifizierbar sein | Angenommen |
| ADR-003 | Prüfschicht als eigenständige Komponente zwischen LLM und Dokumentaufbau | Zentrale, unabhängig testbare Qualitätskontrolle aller LLM-Outputs (DEV-TS-2026-001 Kap. 4) | Angenommen |
| ADR-004 | Vorlagen (z. B. IQ001 R01) als versionierte Konfigurationselemente im Repository | Änderungen an Vorlagen unterliegen Change Control wie Code (DEV-KM-2026-001, DEV-CC-2026-001) | Angenommen |
| ADR-005 | LLM-Parameter (Modellversion, max_tokens) als konfigurationsgeführte Items, nicht hartkodiert verstreut | Modellwechsel als kontrollierter Major Change durchführbar (DEV-CC-2026-001 Kap. 6) | Angenommen |
| ADR-006 | Generierungs-Metadaten (Modellversion, Vorlagen-Revision, Zeitstempel) werden mit jedem Dokument persistiert | Retrospektive Nachvollziehbarkeit jedes erzeugten Dokuments für Audits | Angenommen |

## 6. Qualitätsattribute (Auswahl)

| Attribut | Umsetzung |
|---|---|
| Nachvollziehbarkeit | Generierungs-Metadaten (ADR-006), Audit-Trail, versionierte Vorlagen und Prompts |
| Integrität | Prüfschicht, deterministische Struktur, sichtbares Scheitern bei Generierungsfehlern |
| Testbarkeit | Trennung LLM/Deterministik (ADR-001), gemockte LLM-Antworten in Tests (DEV-TS-2026-001) |
| Sicherheit | Zugriffskontrolle, Secrets-Management, Datenklassifizierung (DEV-SEC-2026-001) |

## 6.1 Deployment-Sicht

- Frontend und KI-Service werden als getrennt deploybare Einheiten auf der Cloud-Plattform betrieben; Umgebungen Dev und Prod sind strikt getrennt (DEV-KM-2026-001 Kap. 6).
- Der produktive Stand entspricht jederzeit einem getaggten Release; Deployments und Rollbacks erfolgen ausschließlich über die Pipeline (DEV-CC-2026-001 Kap. 5/7).
- Die Erstinstallations- und Umgebungsverifizierung ist Gegenstand der Installation Qualification (CSV-IQ-2026-001); die laufende Deployment-Verifizierung regelt DEV-CC-2026-001 Kap. 8.

## 7. Erweiterungspunkte (geplant)

Die folgenden Fähigkeiten sind **geplant und derzeit nicht implementiert**; die Architektur hält die Erweiterungspunkte offen:

- **Mehrmandantenfähigkeit:** Strikte mandantenbezogene Datentrennung in Datenhaltung und Zugriffsmodell; derzeit Betrieb je Pilotkunde in getrennter Konfiguration.
- **Segregation of Duties (SoD) in der Anwendung:** Getrennte Rollen für Ersteller, Prüfer und Freigeber generierter Dokumente inkl. rollenbasierter Signaturberechtigungen; derzeit kompensiert durch organisatorische Prüfprozesse beim Kunden (siehe DEV-SDP-2026-001 Kap. 6.2, CSV-P11-2026-001).
- **Erweiterte Vorlagenbibliothek:** Weitere Dokumenttypen (OQ/PQ-Vorlagen) nach dem Muster von IQ001 R01.

## 8. Referenzen

DEV-SDP-2026-001, DEV-SOP-AI-2026-001, DEV-CS-2026-001, DEV-TS-2026-001, DEV-KM-2026-001, DEV-CC-2026-001, DEV-SEC-2026-001; CSV-FS-2026-001, CSV-RA-2026-001, CSV-P11-2026-001, CSV-TM-2026-001.

## Change History

| Revision | Datum | Autor | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung |

*Kordix AI · QualiPilot Software-Entwicklungspaket*
