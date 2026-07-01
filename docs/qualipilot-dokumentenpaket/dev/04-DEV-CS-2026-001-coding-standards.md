# Coding Standards & Review-Richtlinie — QualiPilot

| Feld | Wert |
|---|---|
| Dokument-ID | DEV-CS-2026-001 |
| Revision | R01 |
| Status | Entwurf |
| Autor | Kordix AI |
| Datum | [DATUM] |
| Geltungsbereich | QualiPilot |

## 1. Zweck

Dieses Dokument definiert verbindliche Coding Standards und Review-Kriterien für QualiPilot. Es gilt für allen Code — unabhängig davon, ob er manuell oder KI-gestützt mit Claude Code (DEV-SOP-AI-2026-001) erstellt wurde. KI-generierter Code genießt keine Ausnahmen.

## 2. Python-Standards (KI-Service, `services/ai/app/qualipilot`)

### 2.1 Typisierung

- Vollständige Typannotationen für alle öffentlichen Funktionen, Methoden und Modulschnittstellen.
- Statische Typprüfung ist CI-Pflichtlauf; Typfehler blockieren den Merge.
- `Any` nur mit begründendem Kommentar; keine Typunterdrückungen ohne dokumentierten Grund.

### 2.2 Linting und Formatierung

- Einheitlicher, automatisierter Formatter und Linter (projektweit konfiguriert, Konfiguration versioniert gemäß DEV-KM-2026-001).
- Linter-Läufe sind CI-Pflicht; Regelabweichungen nur per dokumentierter Inline-Ausnahme mit Begründung.

### 2.3 Docstrings

- Jedes Modul, jede öffentliche Klasse und Funktion erhält einen Docstring: Zweck, Parameter, Rückgaben, ausgelöste Exceptions.
- GxP-kritische Funktionen (Prüfschicht, Vorlagen-Engine, `export.py`, Traceability-Generator) dokumentieren zusätzlich das erwartete Verhalten im Fehlerfall.

## 3. Frontend-Standards (TypeScript)

- **TypeScript strict mode** verpflichtend; kein `any` ohne begründeten Kommentar, keine `@ts-ignore` ohne Begründung.
- Linting als CI-Pflichtlauf; einheitliche Formatierung automatisiert.
- Komponenten klein und zweckgebunden; UI-Zustand explizit typisiert; keine Geschäftslogik der Dokumentgenerierung im Frontend (diese liegt ausschließlich im KI-Service, DEV-SAD-2026-001).

## 4. Namens- und Strukturkonventionen

- **Feature-basierte Struktur:** Code wird nach Fachlichkeit organisiert; eine Einheit (Modul/Komponente) hat genau eine Verantwortung (Single Responsibility) — analog zur Regel „eine Feature-Spec pro Feature".
- Sprechende, konsistente Namen; keine Abkürzungen, die fachliches Vorwissen erfordern, ohne Glossar-Kommentar.
- Unit-Tests co-located neben dem Quellcode (`modul.py` / `test_modul.py` bzw. `Komponente.tsx` / `Komponente.test.tsx`); E2E-Tests separat (DEV-TS-2026-001 Kap. 3).
- Versionierte Vorlagen tragen ID und Revision im Namen (z. B. IQ001 R01); Änderungen erzeugen eine neue Revision, keine stille Überschreibung (DEV-KM-2026-001 Kap. 5).

## 5. Fehlerbehandlung und Logging (GxP-kritisch)

Grundsatz: **Keine stillen Fehler in der Dokumentgenerierung.** Ein GMP-Qualifizierungsdokument, das aufgrund eines verschluckten Fehlers unvollständig oder inhaltlich falsch erzeugt wird, ist das schwerwiegendste Fehlerszenario des Produkts (vgl. CSV-RA-2026-001).

Verbindliche Regeln:

1. **Sichtbares Scheitern:** Fehler in Prompt-Assembly, LLM-Aufruf, Prüfschicht, Vorlagen-Engine, Traceability-Generierung oder Export führen zum Abbruch des Generierungsvorgangs mit eindeutiger Fehlermeldung an den Anwender — niemals zu einem teilweise generierten Dokument ohne Kennzeichnung.
2. **Kein pauschales Exception-Schlucken:** `except`-Blöcke ohne spezifische Behandlung und ohne Logging sind untersagt. Jede gefangene Exception wird behandelt, geloggt oder erneut ausgelöst.
3. **Prüfschicht-Befunde sind blockierend oder sichtbar:** Von der Prüfschicht beanstandete Inhalte (z. B. unvollständige Akzeptanzkriterien) werden zurückgewiesen oder im Dokumententwurf unübersehbar markiert — nie kommentarlos übernommen.
4. **Strukturiertes Logging:** Jeder Generierungsvorgang protokolliert Metadaten (Zeitstempel, Vorlagen-Revision, LLM-Modellversion, Prüfschicht-Ergebnis) gemäß ADR-006 (DEV-SAD-2026-001). Logs enthalten **keine** Secrets und keine unnötigen personenbezogenen Daten (DEV-SEC-2026-001).
5. **Fehlermeldungen sind handlungsleitend:** Anwender erhalten verständliche Fehlermeldungen; technische Details gehen ins Log.

## 5.1 Beispiel: verbotenes vs. gefordertes Fehlerverhalten

Verboten (stilles Scheitern — Dokument würde ohne Akzeptanzkriterien erzeugt):

```python
try:
    criteria = validate_acceptance_criteria(llm_output)
except Exception:
    criteria = []  # VERBOTEN: Fehler wird verschluckt
```

Gefordert (sichtbares Scheitern mit protokolliertem Kontext):

```python
try:
    criteria = validate_acceptance_criteria(llm_output)
except ValidationError as exc:
    logger.error("Prüfschicht-Fehler", extra=generation_metadata)
    raise GenerationFailedError(
        "Akzeptanzkriterien konnten nicht validiert werden"
    ) from exc
```

## 6. Abhängigkeiten (Dependencies)

- Neue Abhängigkeiten nur bei klarem Bedarf; Standardbibliothek und vorhandene Abhängigkeiten haben Vorrang.
- Vor Aufnahme: Herkunft, Pflegezustand und bekannte Schwachstellen prüfen (DEV-SEC-2026-001 Kap. 6). Dies gilt ausdrücklich für von Claude Code vorgeschlagene Pakete — Paketnamen werden gegen die offizielle Registry verifiziert (Schutz vor halluzinierten/typosquatteten Paketen).
- Abhängigkeiten werden mit fixierten Versionen geführt (Lockfiles versioniert, DEV-KM-2026-001 Kap. 5); Updates sind reguläre, reviewte Changes.

## 7. Kommentare und Dokumentation im Code

- Kommentare erklären das **Warum**, nicht das Was; auskommentierter Code wird gelöscht (Git-Historie genügt).
- Fachliche Regeln (z. B. Prüfschicht-Validierungsregeln) verweisen im Docstring auf ihre Quelle (Feature-Spec/Anforderung), um die Traceability zu CSV-TM-2026-001 zu stützen.
- `TODO`-Marker nur mit Issue-Referenz; unreferenzierte TODOs sind Review-Befund.

## 8. Review-Checkliste

Jedes Review (Selbst-Review und KI-gestütztes Zweit-Review gemäß DEV-SOP-AI-2026-001 Kap. 4.4) prüft mindestens die vier Dimensionen; die vollständige operative Checkliste ist Anhang A der DEV-SOP-AI-2026-001:

| Dimension | Leitfragen |
|---|---|
| Korrektheit | Erfüllt der Code die Spec und Akzeptanzkriterien? Randfälle? Existieren alle referenzierten APIs? |
| Sicherheit | Secrets? Eingabevalidierung? Auth-Logik? Neue Abhängigkeiten geprüft? |
| GxP-Impact | Sind Prüfschicht, Vorlagen-Treue, Export, Traceability oder e-Signatur-Rendering betroffen? Regressions-Testset nötig (DEV-TS-2026-001 Kap. 5)? Change-Klassifizierung (DEV-CC-2026-001)? |
| Testabdeckung | Sind neue Pfade getestet? Prüfen die Tests Verhalten statt Implementierung? CI grün ohne Ausnahmen? |

## 9. Definition of Done

Eine Änderung gilt erst als „Done", wenn **alle** folgenden Kriterien erfüllt sind:

1. Feature-Spec bzw. Issue vollständig umgesetzt; Akzeptanzkriterien erfüllt.
2. Coding Standards eingehalten (Kap. 2–4); Linting und Typprüfung fehlerfrei.
3. Fehlerbehandlung gemäß Kap. 5 — kein stilles Scheitern möglich.
4. Unit-Tests co-located vorhanden und grün; bei GxP-kritischen Änderungen Regressions-Testset bestanden.
5. Vollständiges menschliches Review dokumentiert (DEV-SOP-AI-2026-001 Anhang A).
6. Commits nach Konvention `type(FEATURE-ID): description` inkl. Session-Referenz bei KI-gestützten Änderungen.
7. CI vollständig grün; keine deaktivierten Checks.
8. Feature-Status im Index aktualisiert (Statusmodell gemäß DEV-SDP-2026-001 Kap. 4.1); Doku-Änderungen (Specs, ADRs) nachgezogen.

Erst nach „Done" ist die Deploy-Freigabe gemäß DEV-CC-2026-001 möglich.

## 10. Referenzen

DEV-SDP-2026-001, DEV-SAD-2026-001, DEV-SOP-AI-2026-001, DEV-TS-2026-001, DEV-KM-2026-001, DEV-CC-2026-001, DEV-SEC-2026-001; CSV-RA-2026-001.

## Change History

| Revision | Datum | Autor | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung |

*Kordix AI · QualiPilot Software-Entwicklungspaket*
