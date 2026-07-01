# Change Control & Deployment — QualiPilot

| Feld | Wert |
|---|---|
| Dokument-ID | DEV-CC-2026-001 |
| Revision | R01 |
| Status | Entwurf |
| Autor | Kordix AI |
| Datum | [DATUM] |
| Geltungsbereich | QualiPilot |

## 1. Zweck

Dieses Dokument regelt die kontrollierte Änderung und Auslieferung von QualiPilot: Änderungsklassifizierung mit GxP-Impact-Bewertung, Change-Workflow, CI/CD-Pipeline, Rollback sowie den Sonderfall LLM-Modellwechsel. Es stellt sicher, dass kein produktiver Systemzustand ohne dokumentierte Bewertung, Verifizierung und menschliche Freigabe entsteht.

## 2. Geltungsbereich

Alle Änderungen an produktiv wirksamen Konfigurationselementen gemäß DEV-KM-2026-001 Kap. 5 und 7: Code, Vorlagen (z. B. IQ001), Prompts, Infrastruktur-Konfiguration, gesteuerte Parameter (LLM-Modellversion, max_tokens). Änderungen an der Entwicklungsdokumentation folgen der Revisionsführung der Dokumente; Updates des Entwicklungswerkzeugs Claude Code regelt DEV-SOP-AI-2026-001 Kap. 8.

## 3. Änderungsklassifizierung

Jede Änderung wird vor Implementierung klassifiziert; maßgeblich ist die **GxP-Impact-Bewertung**: Kann die Änderung Inhalt, Struktur, Integrität oder Nachvollziehbarkeit generierter GMP-Dokumente beeinflussen (Bezug CSV-RA-2026-001)?

| Klasse | Definition | Beispiele | Anforderungen |
|---|---|---|---|
| Standard | Kein GxP-Impact, kein Funktionsverhalten geändert | Doku-Tippfehler, interne Refactorings ohne Verhaltensänderung, Dev-Tooling | Regulärer Workflow (Kap. 4), Standard-CI |
| Minor | Funktionsänderung ohne Einfluss auf GxP-kritische Komponenten | UI-Verbesserungen, neue nicht-kritische Features | Workflow + E2E-Tests; dokumentierte Freigabe |
| Major | Einfluss auf GxP-kritische Komponenten oder gesteuerte Parameter | Änderungen an Prüfschicht, Vorlagen-Engine, `export.py`, Traceability-Generator, e-Signatur-Rendering; Vorlagen-Revision; LLM-Modellwechsel; Prompt-Änderungen mit Inhaltswirkung | Workflow + Regressions-Testset (DEV-TS-2026-001 Kap. 5) + erhöhte Review-Tiefe + ggf. Information der Pilotkunden; Prüfung, ob Revalidierungsumfang im CSV-Paket betroffen ist (CSV-VP-2026-001) |
| Emergency | Sofortmaßnahme bei kritischem Produktionsfehler oder Sicherheitsvorfall | Hotfix einer fehlerhaften Dokumentgenerierung, Schließen einer aktiv ausgenutzten Schwachstelle | Verkürzter Ablauf zulässig, aber: menschliches Review bleibt Pflicht; vollständige Nachdokumentation und nachgeholte Tests innerhalb definierter Frist; Ursachenanalyse (DEV-SOP-AI-2026-001 Kap. 7, DEV-SEC-2026-001 Kap. 7) |

Die Klassifizierung wird im Change-Record dokumentiert und im Review bestätigt (Checkliste A.3, DEV-SOP-AI-2026-001).

## 4. Change-Workflow

1. **Antrag:** Feature-Spec (neue Funktionalität) oder Issue/Change-Record (Fix, Parameteränderung) mit Feature-ID-Referenz; Statusmodell gemäß DEV-SDP-2026-001 Kap. 4.1.
2. **Bewertung:** Klassifizierung nach Kap. 3, GxP-Impact-Bewertung, Festlegung des Test-/Verifizierungsumfangs.
3. **Implementierung:** Auf Feature-Branch, KI-gestützt gemäß DEV-SOP-AI-2026-001; Standards gemäß DEV-CS-2026-001.
4. **Test:** Pflichtläufe gemäß DEV-TS-2026-001 (Unit/Integration/E2E; bei Major: Regressions-Testset, Golden-Master-Vergleiche).
5. **Freigabe:** Dokumentierte menschliche Freigabe (Review-Nachweis + Deploy-Entscheidung); Human-in-the-loop an jedem Übergang, kein Auto-Deploy.
6. **Deploy:** Ausrollen des getaggten Release (Semver, DEV-KM-2026-001 Kap. 4) über die Pipeline nach Prod.
7. **Verifizierung in Prod:** Kap. 8; Ergebnis wird im Change-Record dokumentiert, Status → Deployed.

### 4.1 Inhalt eines Change-Records

Jeder Change-Record dokumentiert mindestens:

| Feld | Inhalt |
|---|---|
| Referenz | Feature-ID bzw. Issue-Nummer, Link zur Spec |
| Beschreibung | Was wird geändert und warum |
| Klassifizierung | Standard / Minor / Major / Emergency inkl. GxP-Impact-Begründung |
| Betroffene Elemente | Komponenten, Vorlagen, Parameter (DEV-KM-2026-001 Kap. 5/7) |
| Verifizierung | Durchgeführte Tests mit Ergebnis (inkl. Regressions-Testset bei Major) |
| Review | Review-Nachweis (DEV-SOP-AI-2026-001 Anhang A), Reviewer, Datum |
| Freigabe | Deploy-Entscheidung, Freigebender, Datum |
| Deployment | Release-Tag, Zeitpunkt, Ergebnis der Prod-Verifizierung (Kap. 8) |

Change-Records werden versioniert geführt (Issue-Tracking bzw. Repository) und sind für Auditoren und Pilotkunden-QA einsehbar.

### 4.2 Rollen

Bewertung, Implementierung, Freigabe und Verifizierung werden derzeit vom Solo-Gründer wahrgenommen; die zeitliche Trennung der Schritte, das KI-gestützte Zweit-Review und das Pilotkunden-Vier-Augen-Prinzip wirken als kompensierende Kontrollen (DEV-SDP-2026-001 Kap. 6.2). Eine personelle Trennung von Implementierung und Freigabe ist bei Teamwachstum vorgesehen.

## 5. CI/CD-Pipeline

| Stufe | Inhalt | Gate |
|---|---|---|
| Build & statische Prüfung | Build, Linting, Typprüfung (Python, TypeScript strict) | Automatisch blockierend |
| Test | Unit- und Integrationstests (Mock-LLM); bei Merge-Request zusätzlich E2E und Golden Master | Automatisch blockierend |
| Merge nach `main` | Vollständiges menschliches Review dokumentiert | Manuell (Mensch) |
| Release | Tag + Release Notes; bei LLM-relevanten Änderungen Regressions-Testset | Automatisch + manuell |
| Deploy Prod | Ausrollen des Tags | Manuelle Freigabe (Change-Record) |
| Post-Deploy | Verifizierung (Kap. 8) | Manuell dokumentiert |

Die Pipeline-Definition ist versioniertes Konfigurationselement (DEV-KM-2026-001 Kap. 5); Änderungen an der Pipeline selbst unterliegen diesem Change-Control-Prozess.

## 6. Sonderfall: LLM-Modellwechsel

Ein Wechsel der produktiven LLM-Modellversion (Anthropic Claude API) wird **immer als Major Change** behandelt — auch wenn der Anbieter ihn als kompatibel deklariert:

1. Änderung der gepinnten Modellversion als reviewter Commit (konfigurationsgeführtes Item, DEV-KM-2026-001 Kap. 7).
2. Vollständiger Lauf des **Regressions-Testsets** (DEV-TS-2026-001 Kap. 5) inkl. Mehrfachläufen und dokumentierter fachlicher Stichprobenbewertung; Vergleich gegen den Referenzlauf der bisherigen Modellversion.
3. **Dokumentierte Freigabe** auf Basis der Regressionsergebnisse; bei Qualitätsrückschritt wird der Wechsel nicht ausgerollt.
4. Persistierte Generierungs-Metadaten stellen sicher, dass für jedes Dokument die verwendete Modellversion nachvollziehbar bleibt (ADR-006, DEV-SAD-2026-001).
5. Information der Pilotkunden über den Wechsel; Prüfung, ob ergänzende Abnahmetests im CSV-Rahmen erforderlich sind (CSV-OQ-2026-001 / CSV-VP-2026-001).

Gleiches Verfahren gilt sinngemäß für wesentliche Prompt-Änderungen mit Inhaltswirkung.

## 7. Rollback-Verfahren

- Jedes Deployment ist einem Semver-Tag zuordenbar; Rollback = kontrolliertes Redeploy des letzten als gut verifizierten Tags über dieselbe Pipeline.
- Rollback-Entscheidung und -Durchführung werden als Emergency/Major Change dokumentiert (Anlass, Zeitpunkt, Zielversion, Verifizierung).
- Datenbank-/Datenhaltungsänderungen werden so gestaltet, dass ein Anwendungs-Rollback um mindestens eine Version möglich bleibt (rückwärtskompatible Migrationen); wo dies nicht möglich ist, wird ein dokumentierter Recovery-Plan vor dem Deploy erstellt (Backup-Bezug: DEV-SEC-2026-001 Kap. 8).
- Nach jedem Rollback: Ursachenanalyse und Regression-Test-Ergänzung (DEV-SOP-AI-2026-001 Kap. 7).

## 8. Deployment-Verifizierung

Nach jedem Prod-Deployment wird verifiziert und im Change-Record dokumentiert:

1. Ausgerollte Version entspricht dem freigegebenen Tag (Versionsanzeige/Metadaten).
2. Kernfunktion verfügbar: Testgenerierung mit synthetischem Profil durchläuft die Pipeline (Prompt → LLM → Prüfschicht → Export) fehlerfrei; keine echten Kundendaten für den Smoke-Test.
3. Konfigurationsgeführte Parameter (Modellversion, max_tokens, Vorlagen-Revision) entsprechen dem Sollstand.
4. Keine neuen Fehler in Logs/Monitoring im definierten Beobachtungszeitraum.

Diese Verifizierung korrespondiert mit der Installation Qualification des CSV-Pakets (**CSV-IQ-2026-001**); bei Erstinstallationen und Major Changes wird geprüft, ob eine formale IQ-Wiederholung bzw. -Ergänzung erforderlich ist.

## 9. Periodische Bewertung

- Change-Records werden periodisch (mindestens jährlich, zusätzlich zur Vorbereitung von Kundenaudits) übergreifend ausgewertet: Anteil Major/Emergency Changes, wiederkehrende Fehlerursachen, Rollback-Häufigkeit, Auffälligkeiten bei KI-generierten Änderungen (Ursachenkategorien gemäß DEV-SOP-AI-2026-001 Kap. 7).
- Erkenntnisse fließen als dokumentierte Anpassungen in SOP, Checklisten und Teststrategie ein.
- Die Auswertung ist Bestandteil des Lieferantennachweises gegenüber Pilotkunden (CSV-LB-2026-001).

## 10. Referenzen

DEV-SDP-2026-001, DEV-SAD-2026-001, DEV-SOP-AI-2026-001, DEV-CS-2026-001, DEV-TS-2026-001, DEV-KM-2026-001, DEV-SEC-2026-001; CSV-VP-2026-001, CSV-RA-2026-001, CSV-IQ-2026-001, CSV-OQ-2026-001, CSV-LB-2026-001, CSV-VB-2026-001.

## Change History

| Revision | Datum | Autor | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung |

*Kordix AI · QualiPilot Software-Entwicklungspaket*
