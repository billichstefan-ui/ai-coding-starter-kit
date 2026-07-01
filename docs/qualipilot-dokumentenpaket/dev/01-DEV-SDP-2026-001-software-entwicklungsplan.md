# Software-Entwicklungsplan (SDP) — QualiPilot

| Feld | Wert |
|---|---|
| Dokument-ID | DEV-SDP-2026-001 |
| Revision | R01 |
| Status | Entwurf |
| Autor | Kordix AI |
| Datum | [DATUM] |
| Geltungsbereich | QualiPilot |

## 1. Zweck und Geltungsbereich

Dieser Software-Entwicklungsplan beschreibt das Lifecycle-Modell, die Phasen-Gates, Deliverables, Rollen und Kontrollen für die Entwicklung von **QualiPilot**, einer KI-Plattform der Kordix AI zur Generierung von GMP-Qualifizierungsdokumenten (IQ/OQ/PQ, DQ-Vorstufe, CSV-Dokumente).

Er gilt für sämtliche Entwicklungsaktivitäten am QualiPilot-System, einschließlich des Web-Frontends, des Python-KI-Service (Modul `services/ai/app/qualipilot`), der Vorlagen-Engine, der Prüfschicht und der Deployment-Infrastruktur. Er dient zugleich als Entwicklungs- und Lieferantennachweis für das korrespondierende CSV-Validierungspaket (insbesondere CSV-VP-2026-001, CSV-LB-2026-001).

## 2. Referenzen

| Dokument-ID | Titel |
|---|---|
| DEV-SAD-2026-001 | Software-Architektur QualiPilot |
| DEV-SOP-AI-2026-001 | SOP KI-gestützte Softwareentwicklung mit Claude Code |
| DEV-CS-2026-001 | Coding Standards & Review-Richtlinie |
| DEV-TS-2026-001 | Teststrategie |
| DEV-KM-2026-001 | Versions- & Konfigurationsmanagement |
| DEV-CC-2026-001 | Change Control & Deployment |
| DEV-SEC-2026-001 | Security & Datenschutz |
| CSV-VP-2026-001 | Validierungsplan QualiPilot |
| CSV-URS-2026-001 | User Requirements Specification |
| CSV-RA-2026-001 | Risikoanalyse |
| CSV-TM-2026-001 | Traceability-Matrix |
| GAMP 5 (2nd Edition) | A Risk-Based Approach to Compliant GxP Computerized Systems |

## 3. Systemeinordnung nach GAMP 5

QualiPilot ist eine kundenspezifisch entwickelte Anwendung und wird als **GAMP 5 Kategorie 5 (Custom Application)** eingestuft. Daraus folgt:

- Vollständiger Lebenszyklus-Ansatz: Spezifikation → Design → Implementierung → Verifizierung → Freigabe.
- Lieferanten-/Entwicklungsnachweise (dieses DEV-Paket) sind Bestandteil der Validierungsdokumentation des Betreibers bzw. Pilotkunden.
- Risikobasierte Verifikationstiefe gemäß CSV-RA-2026-001: Funktionen mit direktem Einfluss auf den Inhalt generierter GMP-Dokumente (Vorlagen-Engine, Prüfschicht, Export, Traceability-Generator, e-Signatur-Rendering) erhalten die höchste Testtiefe.
- Der KI-gestützte Entwicklungsprozess selbst ist als kontrollierter Prozess dokumentiert (DEV-SOP-AI-2026-001), da er ein wesentliches Merkmal des Herstellers Kordix AI ist.

## 4. Lifecycle-Modell

QualiPilot wird **iterativ-inkrementell** entwickelt. Jedes Feature durchläuft einen definierten Lebenszyklus mit Phasen-Gates; ein Gate gilt erst als passiert, wenn der Verantwortliche (siehe Kap. 6) die Deliverables geprüft und freigegeben hat (Human-in-the-loop).

### 4.1 Phasen und Gates

| Phase | Statusmodell | Gate-Kriterium (Übergang) |
|---|---|---|
| 1. Spezifikation | Roadmap → Planned | Feature-Spec vollständig (User Story, Akzeptanzkriterien, GxP-Impact), vom Verantwortlichen freigegeben |
| 2. Architektur | Planned → Architected | Technisches Design dokumentiert, konsistent mit DEV-SAD-2026-001, Risiken bewertet |
| 3. Implementierung | Architected → In Progress | Umsetzung gemäß DEV-SOP-AI-2026-001 und DEV-CS-2026-001; Unit-Tests co-located erstellt |
| 4. Review/QA | In Progress → In Review → Approved | Vollständiges menschliches Review jeder Änderung; Tests gegen Akzeptanzkriterien bestanden; keine offenen kritischen/hohen Befunde |
| 5. Deploy | Approved → Deployed | CI-Checks grün, Change-Control-Freigabe gemäß DEV-CC-2026-001, Verifizierung in Produktion |

Das Statusmodell **Roadmap → Planned → Architected → In Progress → In Review → Approved → Deployed** wird im versionierten Feature-Index geführt und ist für jedes Feature nachvollziehbar.

### 4.2 Deliverables je Phase

| Phase | Deliverables |
|---|---|
| Spezifikation | Feature-Spec (eine Datei pro Feature, Single Responsibility, sequenzielle Feature-ID), Eintrag im Feature-Index |
| Architektur | Architektur-Abschnitt in der Feature-Spec bzw. Aktualisierung DEV-SAD-2026-001, ggf. neuer ADR-Eintrag |
| Implementierung | Quellcode, co-located Unit-Tests, aktualisierte Prompts/Kontextdateien, Commits nach Konvention `type(FEATURE-ID): description` |
| Review/QA | Review-Nachweis (ausgefüllte Checkliste gemäß DEV-SOP-AI-2026-001 Anhang A), Testergebnisse, ggf. Bug-Fix-Commits |
| Deploy | CI-Protokoll, Release-Tag (Semver, DEV-KM-2026-001), Change-Record, Deployment-Verifizierung (Bezug CSV-IQ-2026-001) |

## 5. Entwicklungsmethodik: KI-gestützt mit Claude Code

Die Implementierung erfolgt KI-gestützt mit **Claude Code** (Anthropic) als agentischem Coding-Werkzeug. Der Grundsatz lautet: **Die KI generiert, der Mensch verantwortet.** Jede von Claude Code erzeugte Änderung wird vor dem Merge vollständig menschlich geprüft; ungeprüfte Auto-Merges sind untersagt. Der vollständige, verbindliche Arbeitsablauf ist in DEV-SOP-AI-2026-001 geregelt und wird hier nicht dupliziert.

## 6. Rollen und Verantwortlichkeiten

### 6.1 Realität der Organisation

Kordix AI wird von **Stefan Billich** als Solo-Gründer betrieben (Hintergrund: GMP Qualification Specialist). Eine Person nimmt daher mehrere formale Rollen wahr. Dies wird nicht verschleiert, sondern offen dokumentiert und durch kompensierende Kontrollen adressiert.

| Formale Rolle | Wahrgenommen durch | Aufgaben |
|---|---|---|
| Product Owner | Stefan Billich | Anforderungen, Priorisierung, Feature-Specs |
| Software-Architekt | Stefan Billich | Technisches Design, ADRs |
| Entwickler (KI-gestützt) | Stefan Billich mit Claude Code | Implementierung gemäß DEV-SOP-AI-2026-001 |
| Reviewer / QA | Stefan Billich | Code-Review, Tests, Freigaben |
| Release Manager | Stefan Billich | Deploy-Freigabe, Change Control |
| Fachlicher Prüfer (GMP-Inhalte) | Stefan Billich + Pilotkunden-QA | Fachliche Korrektheit generierter Qualifizierungsdokumente |

### 6.2 Kompensierende Kontrollen (fehlende Segregation of Duties)

Da eine personelle Funktionstrennung (Segregation of Duties, SoD) derzeit nicht möglich ist, gelten folgende kompensierende Kontrollen:

1. **KI-gestützte Reviews:** Jede Änderung wird zusätzlich zum menschlichen Review einem strukturierten, KI-gestützten Review (separate Claude-Code-Session mit Review-Auftrag gegen die Checkliste in DEV-SOP-AI-2026-001) unterzogen. Die KI ersetzt keinen menschlichen Reviewer, erhöht aber die Fehlerentdeckungswahrscheinlichkeit.
2. **Automatisierte Testpflicht:** Kein Merge ohne bestandene CI-Checks (Lint, Typprüfung, Unit-/Integrationstests, Regressions-Testset gemäß DEV-TS-2026-001). Die Testpflicht ist technisch erzwungen, nicht nur organisatorisch.
3. **Vier-Augen-Prinzip über Pilotkunden:** Die fachliche Korrektheit generierter Dokumente (z. B. IQ-Protokolle) wird in der Pilotphase durch die QA der Pilotkunden im Rahmen des UAT (CSV-UAT-2026-001) und des laufenden Betriebs unabhängig geprüft. Rückmeldungen fließen als Change Requests ein.
4. **Zeitliche Trennung:** Implementierung und Review derselben Änderung erfolgen als getrennte, dokumentierte Arbeitsschritte (getrennte Sessions, Review-Checkliste), nicht in einem Durchgang.
5. **Vollständige Nachvollziehbarkeit:** Git-Historie, Feature-IDs, Session-Referenzen und Change-Records erlauben eine lückenlose retrospektive Prüfung durch Dritte (Auditoren, Pilotkunden-QA).

Eine personelle SoD (zweiter Reviewer, getrennter Release Manager) ist als Erweiterung geplant, sobald die Organisation wächst; siehe DEV-SAD-2026-001 Kap. 7.

## 7. Qualitätsmaßnahmen (Übersicht)

| Maßnahme | Regelung |
|---|---|
| Coding Standards, Definition of Done | DEV-CS-2026-001 |
| Teststrategie inkl. LLM-spezifischer Tests | DEV-TS-2026-001 |
| Versions-/Konfigurationsmanagement | DEV-KM-2026-001 |
| Change Control, Deployment, Rollback | DEV-CC-2026-001 |
| Security, Datenschutz, Incident Response | DEV-SEC-2026-001 |
| KI-Nutzung im Entwicklungsprozess | DEV-SOP-AI-2026-001 |

## 8. Werkzeuge

| Werkzeug | Zweck | Kontrolle |
|---|---|---|
| Claude Code (Anthropic) | KI-gestützte Implementierung, Reviews | DEV-SOP-AI-2026-001; Tool-Updates als bewertete Änderung |
| Git (gehostetes Repository) | Single Source of Truth, Versionierung | DEV-KM-2026-001 |
| CI-Pipeline | Automatisierte Pflichtläufe vor Merge/Deploy | DEV-TS-2026-001, DEV-CC-2026-001 |
| Cloud-Plattform | Hosting Dev/Prod | DEV-CC-2026-001, DEV-SEC-2026-001; Verifizierung CSV-IQ-2026-001 |

## 9. Abgrenzung zum CSV-Validierungspaket

Dieses DEV-Paket beschreibt, **wie** QualiPilot entwickelt wird (Herstellerperspektive, Lieferantennachweis). Das CSV-Paket (CSV-VP-2026-001 ff.) beschreibt, **dass und wie** das System für den GxP-Einsatz validiert ist (Betreiber-/Systemperspektive: URS, FS, Risikoanalyse, IQ/OQ/UAT, Part-11-Bewertung, Traceability, Validierungsbericht). Beide Pakete verweisen aufeinander; die Traceability-Matrix CSV-TM-2026-001 verknüpft Anforderungen mit Tests, dieses DEV-Paket liefert die prozessuale Grundlage der Testerzeugung.

## Change History

| Revision | Datum | Autor | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung |

*Kordix AI · QualiPilot Software-Entwicklungspaket*
