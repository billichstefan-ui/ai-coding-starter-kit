# SOP — KI-gestützte Softwareentwicklung mit Claude Code

| Feld | Wert |
|---|---|
| Dokument-ID | DEV-SOP-AI-2026-001 |
| Revision | R01 |
| Status | Entwurf |
| Autor | Kordix AI |
| Datum | [DATUM] |
| Geltungsbereich | QualiPilot |

## 1. Zweck

Diese SOP regelt den professionellen, nachvollziehbaren Einsatz von **Claude Code** (Anthropics agentisches Coding-Werkzeug) in der Entwicklung von QualiPilot. Sie stellt sicher, dass KI-generierte Codeänderungen denselben Qualitäts-, Review- und Nachvollziehbarkeitsanforderungen genügen wie konventionell erstellter Code — und dass die Verantwortung für jede Änderung eindeutig bei einem Menschen liegt.

## 2. Geltungsbereich

Die SOP gilt für:

- alle Codeänderungen am QualiPilot-System (Frontend, KI-Service `services/ai/app/qualipilot`, Infrastruktur-Konfiguration), die mit Claude Code erstellt, geändert oder überarbeitet werden;
- Änderungen an versionierten Vorlagen (z. B. IQ001 R01), Prompts und Kontextdateien;
- KI-gestützte Code-Reviews und Analysen.

Sie gilt nicht für die Nutzung des LLM **innerhalb** des QualiPilot-Produkts (Laufzeitverhalten); dieses ist in DEV-SAD-2026-001 und DEV-TS-2026-001 geregelt.

## 2.1 Begriffe

| Begriff | Bedeutung |
|---|---|
| Claude Code | Agentisches Coding-Werkzeug von Anthropic; führt auf Anweisung Codeänderungen, Analysen und Tests im Repository aus |
| Session | Abgegrenzter Arbeitsdurchlauf mit Claude Code, identifizierbar über eine Session-Referenz (ID/Link) |
| Kontextdateien | Versionierte Dateien, die Claude Code als Anweisungs- und Wissensbasis dienen (`CLAUDE.md`, Feature-Specs, Standards) |
| Session-Referenz | Kennzeichnung im Commit (Co-Author-Zeile und/oder Session-ID/-Link), die die erzeugende Session identifiziert |
| GxP-kritische Komponenten | Prüfschicht, Vorlagen-Engine, `export.py`, Traceability-Generator, e-Signatur-Rendering (vgl. DEV-SAD-2026-001 Kap. 3.2) |
| Review-Nachweis | Dokumentierte Bestätigung der Checkliste (Anhang A) für einen konkreten Diff |

## 2.2 Session-Typen

| Session-Typ | Zweck | Ergebnis | Besonderheiten |
|---|---|---|---|
| Implementierungs-Session | Umsetzung einer Feature-Spec / eines Fixes | Codeänderung auf Feature-Branch | Vollständiger Ablauf Kap. 4 |
| Review-Session | KI-gestütztes Zweit-Review eines Diffs | Befundliste, dokumentiert | Getrennt von der Implementierungs-Session (zeitliche Trennung, DEV-SDP-2026-001 Kap. 6.2) |
| Analyse-Session | Recherche, Fehleranalyse, Architektur-Exploration | Erkenntnisse, ggf. Doku-Update | Keine Codeänderung ohne Wechsel in den Implementierungsablauf |

## 3. Grundsätze

1. **Die KI generiert, der Mensch verantwortet.** Claude Code ist ein Werkzeug. Verantwortlich für jede Änderung ist ausschließlich der menschliche Entwickler (derzeit: Stefan Billich), der sie freigibt.
2. **Vollständiges menschliches Review vor Merge.** Jede von Claude Code erzeugte Änderung wird vor dem Merge in `main` vollständig menschlich gelesen und verstanden. Es wird kein Code übernommen, den der Verantwortliche nicht erklären kann.
3. **Keine ungeprüften Auto-Merges.** Automatische Merges ohne menschliche Prüfung sind untersagt — unabhängig davon, ob CI-Checks bestanden wurden. CI ersetzt kein Review.
4. **Kontrollierter Kontext.** Claude-Code-Sessions arbeiten mit definiertem, versioniertem Kontext (Kontextdatei `CLAUDE.md`, Feature-Specs, Coding Standards). Der Kontext ist Teil der Konfiguration (DEV-KM-2026-001 Kap. 5).
5. **Nachvollziehbarkeit.** Jede Änderung ist über Commit, Feature-ID und Session-Referenz rückverfolgbar (Kap. 5).
6. **GxP-Bewusstsein.** Änderungen an GxP-kritischen Komponenten (Prüfschicht, Vorlagen-Engine, `export.py`, Traceability-Generator, e-Signatur-Rendering) erfordern erhöhte Review-Tiefe und das Regressions-Testset (DEV-TS-2026-001 Kap. 5).

## 4. Arbeitsablauf

### 4.1 Schritt 1 — Aufgabendefinition (Feature-Spec)

- Ausgangspunkt jeder Entwicklung ist eine Feature-Spec: eine Datei pro Feature (Single Responsibility), sequenzielle Feature-ID, geführt im versionierten Feature-Index mit Statusmodell Roadmap → Planned → Architected → In Progress → In Review → Approved → Deployed.
- Die Spec enthält mindestens: Zielbeschreibung, Akzeptanzkriterien, GxP-Impact-Einschätzung (Vorbewertung gemäß DEV-CC-2026-001 Kap. 3), betroffene Komponenten.
- Bugfixes ohne Feature-Charakter werden als Issue/Change-Record mit Referenz auf die betroffene Feature-ID dokumentiert.

### 4.2 Schritt 2 — Claude-Code-Session mit definiertem Kontext

- Die Session wird mit dem versionierten Projektkontext gestartet (`CLAUDE.md`, relevante Feature-Spec, ggf. Architektur-/Standards-Dokumente).
- Der Arbeitsauftrag an Claude Code referenziert die Feature-ID und beschreibt die Aufgabe präzise; relevante Akzeptanzkriterien werden in den Auftrag aufgenommen.
- Es wird auf einem **Feature-Branch** gearbeitet, niemals direkt auf `main` (DEV-KM-2026-001 Kap. 3).
- Verbote gemäß Kap. 6 (insbesondere: keine Secrets, keine echten Kundendaten im Prompt) sind vor Sessionstart zu beachten.

**Kontexthygiene:**

- Der Kontext enthält nur das für die Aufgabe Erforderliche; veraltete oder widersprüchliche Anweisungen in Kontextdateien werden vor der Session bereinigt (als versionierte Änderung).
- Änderungen an `CLAUDE.md` oder anderen Kontextdateien, die das Verhalten von Claude Code projektweit steuern, werden wie Codeänderungen behandelt: eigener Commit, Review, nachvollziehbare Begründung.
- Bei langen Sessions mit Kontextverlust (Kompaktierung) wird der relevante Dateistand erneut eingelesen, bevor weitergearbeitet wird; Annahmen aus dem Gedächtnis der Session ersetzen keine Dateiprüfung.

### 4.3 Schritt 3 — Generierte Änderung

- Claude Code erstellt die Änderung inklusive der gemäß DEV-CS-2026-001 geforderten Begleitartefakte (Typannotationen, Docstrings, co-located Unit-Tests).
- Der Entwickler begrenzt den Umfang: Eine Session bearbeitet eine abgegrenzte Aufgabe. Umfangreiche, schwer reviewbare „Sammeländerungen" sind zu vermeiden; nötigenfalls wird die Aufgabe aufgeteilt.
- Von Claude Code vorgeschlagene, nicht beauftragte Zusatzänderungen (z. B. „Drive-by-Refactorings") werden entweder verworfen oder als eigene Aufgabe mit eigener Referenz eingeplant.

### 4.4 Schritt 4 — Selbst-Review (Pflicht)

- Der Entwickler prüft den vollständigen Diff gegen die **Review-Checkliste in Anhang A** — Zeile für Zeile, nicht stichprobenartig.
- Bei GxP-kritischen Komponenten (Kap. 3, Grundsatz 6) wird zusätzlich ein **KI-gestütztes Zweit-Review** durchgeführt: eine separate Claude-Code-Session erhält den Diff und die Checkliste mit dem expliziten Auftrag, Fehler, Sicherheitsprobleme und GxP-Risiken zu finden. Befunde werden bewertet und dokumentiert. Dieses Zweit-Review ist kompensierende Kontrolle für die fehlende personelle Funktionstrennung (DEV-SDP-2026-001 Kap. 6.2), ersetzt aber nicht das menschliche Review.
- Nicht verstandener oder nicht begründbarer Code wird nicht übernommen, sondern nachgefragt, vereinfacht oder neu erstellt.

### 4.5 Schritt 5 — Tests

- Unit-Tests liegen co-located neben dem Quellcode; E2E-Tests separat (DEV-TS-2026-001 Kap. 3).
- Für jede Änderung gilt: bestehende Tests bestehen, neue/geänderte Funktionalität ist durch Tests abgedeckt (Definition of Done, DEV-CS-2026-001 Kap. 9).
- Bei Änderungen an Prompt-Assembly, Prüfschicht, Vorlagen oder LLM-Parametern wird das **Regressions-Testset** (inkl. Golden-Master-Vergleiche, DEV-TS-2026-001 Kap. 5) ausgeführt.

### 4.6 Schritt 6 — Commit mit Konvention und Session-Nachvollziehbarkeit

- Commit-Format: `type(FEATURE-ID): description` mit `type` ∈ {feat, fix, refactor, test, docs, deploy, chore}. Beispiel: `feat(QP-23): Prüfschicht um Regelvalidierung für Akzeptanzkriterien erweitert`.
- Commits KI-gestützter Änderungen enthalten im Commit-Body eine **Session-Referenz** (Kennzeichnung der Claude-Code-Session, z. B. Co-Author-Zeile und/oder Session-Link/-ID), sodass nachvollziehbar ist, dass und in welcher Session die Änderung KI-gestützt entstand.
- Commits sind atomar: eine logische Änderung pro Commit.

### 4.7 Schritt 7 — CI

- Der Push auf den Feature-Branch löst die CI-Pflichtläufe aus (Lint, Typprüfung, Unit-/Integrationstests; Umfang gemäß DEV-TS-2026-001 Kap. 7).
- Rote CI blockiert den Merge. CI-Befunde werden behoben, nicht umgangen; das Deaktivieren von Checks oder Tests zur „Grünschaltung" ist untersagt und wäre selbst eine reviewpflichtige Änderung.

### 4.8 Schritt 8 — Merge und Deploy-Freigabe

- Merge nach `main` erst nach: vollständigem Review (Schritt 4), bestandenen Tests (Schritt 5) und grüner CI (Schritt 7).
- Deployment nach Produktion erfolgt ausschließlich über den Change-Control-Prozess mit expliziter menschlicher Freigabe (DEV-CC-2026-001). Jeder Workflow-Übergang (Spec → Architektur → Implementierung → Review/QA → Deploy) ist eine Human-in-the-loop-Freigabe.

## 5. Nachvollziehbarkeit

| Artefakt | Nachweis |
|---|---|
| Was wurde geändert | Git-Diff, atomare Commits |
| Warum | Feature-ID im Commit → Feature-Spec mit Akzeptanzkriterien |
| Womit | Session-Referenz im Commit-Body (Claude-Code-Session) |
| Mit welchem Kontext | Versionierte Kontextdateien (`CLAUDE.md`, Feature-Specs, Standards) im selben Repository-Stand |
| Geprüft durch wen | Review-Nachweis (Checkliste Anhang A), Freigabe im Change-Record |
| Getestet wie | CI-Protokolle, Testberichte, Regressions-Testset-Ergebnisse |

Prompt- und Kontextdateien (`CLAUDE.md`, Feature-Specs, Skill-/Workflow-Definitionen) stehen unter Versionskontrolle (DEV-KM-2026-001 Kap. 5). Damit ist für jeden Commit rekonstruierbar, mit welchem Anweisungskontext Claude Code gearbeitet hat.

## 6. Verbotene Praktiken

Folgende Handlungen sind untersagt:

1. **Secrets in Prompts:** API-Keys, Passwörter, Tokens, private Schlüssel oder Produktions-Zugangsdaten dürfen weder in Prompts noch in Kontextdateien eingegeben werden (siehe DEV-SEC-2026-001 Kap. 2).
2. **Echte Kundendaten in Sessions:** Entwicklungs- und Test-Sessions verwenden ausschließlich synthetische bzw. anonymisierte Daten (DEV-TS-2026-001 Kap. 6).
3. **Ungeprüfte Übernahme sicherheitsrelevanten Codes:** Code, der Authentifizierung, Autorisierung, Kryptografie, Session-Handling, Datei-/Netzwerkzugriffe oder e-Signatur-Rendering betrifft, darf nie ohne vollständiges menschliches Verständnis und Review übernommen werden.
4. **Auto-Merge / Direkt-Push auf `main`:** Kein Merge ohne die Schritte 4–7; keine Direkt-Commits auf `main`.
5. **Umgehung der CI** (Skips, auskommentierte Tests, Force-Pushes zur Verschleierung).
6. **KI-generierte Änderungen ohne Session-Referenz committen** (verhindert die Nachvollziehbarkeit nach Kap. 5).

## 7. Umgang mit KI-Fehlern

Wird ein Fehler entdeckt, der auf eine KI-generierte Änderung zurückgeht (in Review, CI, QA oder Produktion):

1. **Dokumentation:** Der Fehler wird als Issue/Change-Record erfasst — mit Beschreibung, betroffenem Commit (inkl. Session-Referenz), Ursachenkategorie (z. B. fachliche Fehlannahme, halluzinierte API, unvollständige Umsetzung der Spec) und Bewertung, warum das Review ihn nicht erkannt hat.
2. **Korrektur:** Behebung nach dieser SOP (regulärer Ablauf Kap. 4); bei Produktionsrelevanz greift DEV-CC-2026-001 (ggf. Emergency Change, Rollback).
3. **Regression-Test ergänzen:** Für jeden solchen Fehler wird ein Test ergänzt, der den Fehler reproduziert hätte, und dauerhaft in die Suite bzw. das Regressions-Testset aufgenommen.
4. **Prozesslernen:** Bei Mustern (wiederkehrende Fehlerkategorien) werden Review-Checkliste (Anhang A), Kontextdateien oder Coding Standards angepasst — als versionierte, dokumentierte Änderung.

## 8. Tool-Updates von Claude Code

Claude Code ist ein extern gepflegtes Werkzeug mit laufenden Updates (CLI-Versionen, zugrunde liegende Modelle). Es ist ein Entwicklungswerkzeug, kein Bestandteil des ausgelieferten Systems; dennoch werden Updates als **bewertete Änderung** behandelt:

- Wesentliche Tool-/Modellwechsel im Entwicklungsworkflow werden kurz dokumentiert (Datum, Version, Anlass, Auffälligkeiten).
- Die Wirksamkeit der Kontrollen ist update-unabhängig ausgelegt: Da jede Änderung ohnehin vollständig menschlich reviewt und automatisiert getestet wird, ändert ein Tool-Update nichts an den Freigabekriterien.
- Bei beobachteten Verhaltensänderungen (z. B. veränderte Codequalität, neue Fehlerkategorien) wird die Review-Checkliste überprüft und ggf. angepasst (Kap. 7 Nr. 4).
- Hinweis: Die Modellversion des **Produkts** (QualiPilot-LLM-Anbindung) ist hiervon getrennt geregelt und unterliegt Change Control als Major Change (DEV-CC-2026-001 Kap. 6).

## 9. Rollen, Verantwortung und Qualifikation

Alle Rollen dieser SOP werden derzeit von Stefan Billich wahrgenommen (Solo-Gründer); die kompensierenden Kontrollen sind in DEV-SDP-2026-001 Kap. 6.2 beschrieben. Die fachliche Zweitprüfung generierter GMP-Inhalte erfolgt in der Pilotphase zusätzlich durch die QA der Pilotkunden (CSV-UAT-2026-001).

**Qualifikationsanforderungen an Anwender dieser SOP:**

- Nachgewiesene Kenntnis dieser SOP sowie von DEV-CS-2026-001 und DEV-TS-2026-001 (dokumentierte Kenntnisnahme je Revision).
- Fachliche Kompetenz, KI-generierten Code der jeweiligen Sprache eigenständig zu beurteilen; Grundverständnis der GxP-Anforderungen an das Produkt.
- Künftige Mitarbeiter werden vor eigenständiger Nutzung von Claude Code in dieser SOP geschult; die Schulung wird dokumentiert.

## 9.1 Grenzen des KI-Einsatzes

Claude Code wird nicht eingesetzt für:

- eigenständige fachliche Entscheidungen über GMP-Inhalte (Vorlageninhalte, Prüfschicht-Fachregeln) — diese trifft der GMP-qualifizierte Verantwortliche;
- Freigabeentscheidungen jeder Art (Merge, Deploy, Release) — Freigaben sind ausschließlich menschlich;
- Änderungen an Produktionsdaten oder Produktionskonfiguration außerhalb des Change-Control-Prozesses (DEV-CC-2026-001).

## 10. Referenzen

DEV-SDP-2026-001, DEV-SAD-2026-001, DEV-CS-2026-001, DEV-TS-2026-001, DEV-KM-2026-001, DEV-CC-2026-001, DEV-SEC-2026-001; CSV-VP-2026-001, CSV-RA-2026-001, CSV-UAT-2026-001, CSV-LB-2026-001.

## Anhang A — Review-Checkliste für KI-generierte Änderungen

Für jeden Diff vor Merge zu prüfen und im Review-Nachweis zu bestätigen:

### A.1 Korrektheit

- [ ] Die Änderung setzt die Feature-Spec/Aufgabe vollständig um; Akzeptanzkriterien nachvollziehbar erfüllt.
- [ ] Keine unbeauftragten Änderungen im Diff (oder: bewusst akzeptiert und dokumentiert).
- [ ] Alle referenzierten Funktionen, Module und APIs existieren tatsächlich (keine Halluzinationen).
- [ ] Randfälle und Fehlerpfade behandelt; keine stillen Fehler (DEV-CS-2026-001 Kap. 5).
- [ ] Logik von mir verstanden — ich könnte jede Zeile begründen.

### A.2 Sicherheit

- [ ] Keine Secrets, Tokens oder Zugangsdaten im Code oder in Konfigurationsdateien.
- [ ] Eingaben validiert; keine Injection-Risiken (inkl. Prompt-Injection über Nutzereingaben in die Prompt-Assembly).
- [ ] Auth-/Berechtigungslogik unverändert oder bewusst und korrekt geändert.
- [ ] Neue Abhängigkeiten geprüft (Notwendigkeit, Herkunft, bekannte Schwachstellen — DEV-SEC-2026-001 Kap. 6).

### A.3 GxP-Impact

- [ ] Betroffene GxP-kritische Komponenten identifiziert (Prüfschicht, Vorlagen-Engine, export.py, Traceability-Generator, e-Signatur-Rendering)?
- [ ] Falls ja: Regressions-Testset ausgeführt und bestanden; Change-Klassifizierung nach DEV-CC-2026-001 geprüft.
- [ ] Dokumentstruktur/Vorlagen-Treue unverändert oder Änderung beabsichtigt, dokumentiert und getestet (Golden Master, DEV-TS-2026-001 Kap. 5).
- [ ] Generierungs-Metadaten und Audit-Trail-Verhalten unbeeinträchtigt.

### A.4 Testabdeckung und Konventionen

- [ ] Neue/geänderte Logik durch co-located Unit-Tests abgedeckt; Tests prüfen Verhalten, nicht Implementierungsdetails.
- [ ] CI vollständig grün; keine übersprungenen oder deaktivierten Tests.
- [ ] Coding Standards eingehalten (Typisierung, Linting, Docstrings — DEV-CS-2026-001).
- [ ] Commit-Konvention `type(FEATURE-ID): description` und Session-Referenz vorhanden.

## Anhang B — Beispiel eines konformen Commits

```
feat(QP-23): Prüfschicht um Regelvalidierung für Akzeptanzkriterien erweitert

- Neue Regel: Akzeptanzkriterien müssen messbar formuliert sein
  (Ablehnung generischer Formulierungen ohne Sollwert/Toleranz)
- Negativ-/Positivtests co-located ergänzt (test_acceptance_rules.py)
- Regressions-Testset unverändert bestanden

Co-Authored-By: Claude Code <noreply@anthropic.com>
Claude-Session: <Session-ID/-Link>
```

Der Commit erfüllt: Konvention `type(FEATURE-ID): description`, atomarer Umfang, Session-Referenz, Testnachweis im Body.

## Anhang C — Kurzreferenz des Ablaufs

| Schritt | Tätigkeit | Nachweis |
|---|---|---|
| 1 | Feature-Spec / Issue mit Feature-ID | Spec-Datei, Feature-Index |
| 2 | Session mit definiertem Kontext auf Feature-Branch | Session-Referenz |
| 3 | Änderung generieren, Umfang begrenzen | Diff |
| 4 | Menschliches Review (Anhang A); bei GxP-kritisch: KI-Zweit-Review | Review-Nachweis |
| 5 | Tests (Unit/Integration; ggf. Regressions-Testset) | Testberichte |
| 6 | Commit mit Konvention + Session-Referenz | Git-Historie |
| 7 | CI grün | CI-Protokoll |
| 8 | Merge; Deploy nur per Change-Control-Freigabe | Change-Record |

## Change History

| Revision | Datum | Autor | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung |

*Kordix AI · QualiPilot Software-Entwicklungspaket*
