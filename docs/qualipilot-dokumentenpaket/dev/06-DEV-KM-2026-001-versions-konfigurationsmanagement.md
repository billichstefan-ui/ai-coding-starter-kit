# Versions- & Konfigurationsmanagement — QualiPilot

| Feld | Wert |
|---|---|
| Dokument-ID | DEV-KM-2026-001 |
| Revision | R01 |
| Status | Entwurf |
| Autor | Kordix AI |
| Datum | [DATUM] |
| Geltungsbereich | QualiPilot |

## 1. Zweck

Dieses Dokument regelt Versionskontrolle, Konfigurationsmanagement, Branch-Modell, Releases und die Führung gesteuerter Parameter für QualiPilot. Ziel: Jeder Systemzustand ist eindeutig identifizierbar, reproduzierbar und in seiner Entstehung nachvollziehbar — Grundlage für Change Control (DEV-CC-2026-001) und für die Nachvollziehbarkeit der KI-gestützten Entwicklung (DEV-SOP-AI-2026-001 Kap. 5).

## 2. Git als Single Source of Truth

- Sämtliche Konfigurationselemente (Kap. 5) werden in einem gehosteten Git-Repository geführt. Was nicht im Repository (oder im referenzierten Secrets-Store, DEV-SEC-2026-001 Kap. 2) liegt, ist nicht Teil des definierten Systems.
- Die Git-Historie ist unveränderlich zu halten: kein Rewriting veröffentlichter Historie auf `main`, keine Force-Pushes auf geschützte Branches.
- Zugriff auf das Repository ist personalisiert und authentifiziert (DEV-SEC-2026-001 Kap. 2).

### 2.1 Repository-Gliederung (logisch)

- Anwendungscode: Frontend; KI-Service unter `services/ai/app/qualipilot` (u. a. `export.py`) mit co-located Unit-Tests.
- E2E-Tests in separatem Testverzeichnis (DEV-TS-2026-001 Kap. 3).
- Vorlagen, Prompts und Kontextdateien (`CLAUDE.md`, Feature-Specs, Feature-Index) als eigenständig geführte Konfigurationselemente.
- CI-/Infrastruktur-Konfiguration und Werkzeug-Konfiguration (Linter, Typprüfung).

## 3. Branch-Modell

| Branch | Zweck | Regeln |
|---|---|---|
| `main` | Integrationsstand; Basis aller Releases | Geschützt; Änderungen nur per reviewtem Merge; CI muss grün sein; keine Direkt-Commits |
| Feature-Branches | Entwicklung je Feature/Fix (`feat/QP-x-…`, `fix/QP-x-…`) | Von `main` abgezweigt; kurzlebig; eine Aufgabe pro Branch |

Ablauf: Feature-Branch → Implementierung gemäß DEV-SOP-AI-2026-001 → vollständiges Review → grüne CI → Merge nach `main`. Deployments nach Produktion erfolgen ausschließlich aus getaggten Ständen von `main` (Kap. 4, DEV-CC-2026-001).

## 4. Commits, Releases und Tagging

### 4.1 Commit-Konvention

- Format: `type(FEATURE-ID): description`; `type` ∈ {feat, fix, refactor, test, docs, deploy, chore}; Feature-IDs sequenziell.
- KI-gestützte Commits tragen zusätzlich die Session-Referenz im Commit-Body (DEV-SOP-AI-2026-001 Kap. 4.6).
- Atomare Commits: eine logische Änderung pro Commit.

### 4.2 Releases (Semver)

- Releases werden als annotierte Git-Tags nach **Semantic Versioning** (`MAJOR.MINOR.PATCH`) erzeugt.
  - **MAJOR:** inkompatible Änderungen oder Änderungen mit hohem GxP-Impact (u. a. LLM-Modellwechsel, Vorlagen-Revisionen mit inhaltlicher Auswirkung) — vgl. DEV-CC-2026-001 Kap. 3/6.
  - **MINOR:** neue Funktionalität, abwärtskompatibel.
  - **PATCH:** Fehlerbehebungen ohne Funktionsänderung.
- Jedes Release erhält Release Notes mit enthaltenen Feature-IDs/Fixes und Verweis auf den Change-Record.
- Der produktive Stand ist jederzeit einem Tag zuordenbar (Deployment-Verifizierung, DEV-CC-2026-001 Kap. 8 / CSV-IQ-2026-001).

## 5. Konfigurationselemente unter Versionskontrolle

| Konfigurationselement | Beispiele | Bemerkung |
|---|---|---|
| Quellcode | Frontend, KI-Service inkl. `services/ai/app/qualipilot` (u. a. `export.py`) | inkl. co-located Unit-Tests |
| Dokumentvorlagen | Standard-IQ-Vorlage **IQ001 R01** (16 Test Sections), künftige Vorlagen | Revisionsführung im Namen (R01, R02, …); Änderung = neue Revision, reviewpflichtig (ADR-004, DEV-SAD-2026-001) |
| Prompts und Kontextdateien | Prompt-Texte/Prompt-Assembly-Bausteine, `CLAUDE.md`, Feature-Specs, Feature-Index | Grundlage der Session-Nachvollziehbarkeit (DEV-SOP-AI-2026-001 Kap. 5) |
| Test-Artefakte | Testdaten, Mock-LLM-Antworten, Golden-Master-Referenzen, Regressions-Testset | Änderungen reviewpflichtig (DEV-TS-2026-001) |
| Infrastruktur-/Pipeline-Konfiguration | CI-Definitionen, Deploy-Konfiguration, Umgebungsdefinitionen | Änderungen unterliegen Change Control |
| Werkzeug-Konfiguration | Linter-/Formatter-/Typprüfer-Konfiguration | DEV-CS-2026-001 |
| Entwicklungsdokumentation | Dieses DEV-Paket (DEV-SDP/SAD/SOP-AI/CS/TS/KM/CC/SEC-2026-001) | Revisionsstände über Change History je Dokument |

**Nicht** im Repository: Secrets (API-Keys, Zugangsdaten) — diese liegen ausschließlich im Secrets-Management (DEV-SEC-2026-001 Kap. 2).

## 6. Umgebungen

| Umgebung | Zweck | Daten | Deploy-Quelle |
|---|---|---|---|
| Dev | Entwicklung, Tests, CI | Ausschließlich synthetische Testdaten (DEV-TS-2026-001 Kap. 6) | Feature-Branches / `main` |
| Prod | Produktivbetrieb Pilotkunden | Kundendaten (Klassifizierung DEV-SEC-2026-001 Kap. 3) | Ausschließlich getaggte Releases von `main`, nach Freigabe gemäß DEV-CC-2026-001 |

Umgebungsspezifische Parameter werden über Umgebungskonfiguration injiziert; die Konfigurationsstruktur ist versioniert, die Secret-Werte nicht (Kap. 5).

## 7. Gesteuerte Parameter (konfigurationsgeführte Items)

Bestimmte Laufzeitparameter beeinflussen unmittelbar den Inhalt generierter GMP-Dokumente und werden daher als **konfigurationsgeführte Items mit Änderungshistorie** behandelt (ADR-005, DEV-SAD-2026-001):

| Parameter | Beschreibung | Änderungsklasse (DEV-CC-2026-001) |
|---|---|---|
| LLM-Modellversion | Exakt gepinnte Version des Anthropic-Claude-Modells der Produkt-Anbindung | Major Change (Regressions-Testset verpflichtend) |
| max_tokens | Obergrenze der Antwortlänge je Generierungsschritt | Minor/Major je GxP-Impact-Bewertung |
| Weitere Generierungsparameter | Sonstige LLM-Aufrufparameter, Schwellwerte der Prüfschicht | Je GxP-Impact-Bewertung |
| Aktive Vorlagen-Revision | z. B. IQ001 R01 | Major bei inhaltlicher Änderung |

Regeln:

1. Werte liegen in versionierten Konfigurationsdateien; jede Änderung ist ein regulärer, reviewter Commit mit Change-Record — nie eine manuelle Ad-hoc-Änderung in Prod.
2. Die je Dokument verwendeten Werte werden als Generierungs-Metadaten persistiert (ADR-006), sodass retrospektiv für jedes erzeugte Dokument Modellversion, Parameter und Vorlagen-Revision feststellbar sind.
3. Die Änderungshistorie dieser Parameter ist damit vollständig aus Git-Historie + Change-Records rekonstruierbar.

## 7.1 Nachvollziehbarkeits-Beispiel

Für ein am [Datum] erzeugtes IQ-Dokument lässt sich retrospektiv rekonstruieren:

1. **Dokument-Metadaten** (persistiert): Modellversion, max_tokens, Vorlagen-Revision (z. B. IQ001 R01), Zeitstempel, Prüfschicht-Ergebnis.
2. **Systemstand:** Zeitstempel → produktives Release-Tag (Deploy-Records, DEV-CC-2026-001) → exakter Repository-Stand inkl. Prompts und Vorlagen.
3. **Entstehung des Standes:** Git-Historie → Commits mit Feature-IDs und Session-Referenzen → Feature-Specs, Review-Nachweise, CI-Protokolle.

Diese Kette ist der zentrale Audit-Nachweis dafür, dass jedes generierte Dokument einem vollständig definierten, geprüften Systemzustand zuzuordnen ist.

## 7.2 Baselines

- Jedes Release-Tag bildet eine **Baseline**: die Gesamtheit aller Konfigurationselemente (Kap. 5) und gesteuerten Parameter (Kap. 7) zu diesem Stand.
- Die für die CSV-Validierung herangezogene Systemversion wird als Baseline im Validierungsbericht referenziert (CSV-VB-2026-001); Änderungen nach dieser Baseline unterliegen der Bewertung gemäß DEV-CC-2026-001, ob der validierte Zustand berührt ist.
- Baselines werden nicht verändert; Korrekturen erzeugen eine neue Version.

## 8. Abgrenzung: Entwicklungswerkzeug Claude Code

Die Version des Entwicklungswerkzeugs Claude Code ist **kein** Konfigurationselement des Produkts; Updates werden als bewertete Änderung des Entwicklungsprozesses dokumentiert (DEV-SOP-AI-2026-001 Kap. 8). Die LLM-Modellversion des **Produkts** (Kap. 7) ist davon strikt getrennt.

## 9. Referenzen

DEV-SDP-2026-001, DEV-SAD-2026-001, DEV-SOP-AI-2026-001, DEV-CS-2026-001, DEV-TS-2026-001, DEV-CC-2026-001, DEV-SEC-2026-001; CSV-IQ-2026-001, CSV-TM-2026-001.

## Change History

| Revision | Datum | Autor | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung |

*Kordix AI · QualiPilot Software-Entwicklungspaket*
