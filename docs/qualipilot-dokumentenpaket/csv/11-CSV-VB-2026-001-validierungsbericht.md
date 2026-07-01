# Validierungsbericht — QualiPilot v1.0 (MVP)

| Feld | Wert |
|---|---|
| **Dokument-ID** | CSV-VB-2026-001 |
| **Revision** | R01 |
| **Status** | Entwurf / Demo |
| **Author** | Kordix AI |
| **Datum** | [DATUM] |
| **System** | QualiPilot v1.0 [MVP] |
| **Referenzen** | Gesamtes Paket CSV-VP/URS/FS/RA/LB/IQ/OQ/UAT/P11/TM-2026-001 |

> **Demo-Hinweis:** Dieser Bericht zeigt exemplarisch zusammengefasste Ergebnisse einer Herstellervalidierung. Die Prüfprotokolle (CSV-IQ/OQ/UAT-2026-001) bleiben als ausfüllbare Vorlagen Bestandteil des Pakets; Ergebnisdaten dieses Berichts sind als Muster der Ergebnisdarstellung zu verstehen.

## 1. Zusammenfassung

Die Validierung von QualiPilot v1.0 (MVP) wurde gemäß Validierungsplan CSV-VP-2026-001 (GAMP 5 Kat. 5, V-Modell, risikobasiert nach ICH Q9(R1)) durchgeführt. Alle 35 Nutzeranforderungen sind zu 100 % auf Tests bzw. prozedurale Nachweise rückgeführt (CSV-TM-2026-001). Zwei Anforderungen (U-017 Autorisierung/Projekt-Scoping, U-018 SoD) sind planmäßig *deferred* und mit verifizierten organisatorischen Übergangsmaßnahmen belegt.

**Empfehlung:** Freigabe von QualiPilot v1.0 als **„validiert für den Pilotbetrieb unter Auflagen"** (Abschnitt 5).

## 2. Ergebnisse je Phase

| Phase | Umfang | Ergebnis (Muster) | Abweichungen |
|---|---|---|---|
| IQ (CSV-IQ-2026-001) | 10 Prüfpunkte (CIQ-T01–T10) | 10 Pass / 0 Fail | 0 |
| OQ (CSV-OQ-2026-001) | 17 Testfälle (COQ-T01–T17); COQ-T16 Teil B deferred | 17 Pass / 0 offen (nach Retest, siehe ABW-001/002) | 2 (geschlossen) |
| UAT (CSV-UAT-2026-001) | 8 Szenarien (CUAT-T01–T08); Schwellen A1–A5 | 8 Pass; A1 erreicht: 93 % der Prüfpunkte ohne fachliche Korrektur (Schwelle ≥ 90 %); A2: 0 unentdeckte kritische Fehler | 0 |
| Part 11 / Annex 11 (CSV-P11-2026-001) | 31 Positionen + ALCOA+ | 18 erfüllt, 8 teilweise, 4 geplant, 1 n. a. — keine Freigabe-Blocker unter Auflagen | — |
| Lieferantenbewertung (CSV-LB-2026-001) | 3 Lieferanten/Subservices | Alle akzeptiert (teils mit Kontrollen/Auflagen) | — |

## 3. Abweichungen (geschlossen)

| ID | Test | Befund | Root Cause | Korrektur | Retest |
|---|---|---|---|---|---|
| ABW-001 | COQ-T06 | Bei Grenzwert-Testprofil TD-03 wurde das generierte Dokument nach Test Section 14 abgeschnitten; Export gab das trunkierte Dokument ohne Fehler aus | `max_tokens`-Konfiguration unter dem für die Maximaldokumentgröße erforderlichen Wert; Vollständigkeitskontrolle im Export prüfte nur Abschnitts-Existenz, nicht Abschnitts-Abschluss | `max_tokens` gemäß *[Anlage: Systemkonfiguration]* angehoben; Export-Vollständigkeitskontrolle in `export.py` um End-Marker-Prüfung je Section erweitert; Änderung via DEV-CC-2026-001 | COQ-T06 und CIQ-T04 wiederholt: **Pass** |
| ABW-002 | COQ-T10 | Nummerierung der Test Section 12 wich von Vorlage IQ001 R01 ab (LLM-generierte Zwischenüberschrift überschrieb Vorlagenslot) | Inhaltsslot der Vorlagen-Engine erlaubte Überschriften-Text im Slot-Inhalt | Slot-Sanitizing in der Vorlagen-Engine (Struktur-Elemente im LLM-Inhalt werden verworfen); Regressions-Testset (COQ-T17) um Prüfregel erweitert | COQ-T10 und COQ-T01 wiederholt: **Pass** |

Keine offenen Abweichungen der Kritikalität *Hoch* zum Berichtszeitpunkt.

## 4. Offene Punkte mit Bedingungen

| ID | Offener Punkt | Risiko | Bedingung für den Betrieb (Auflage) | Ziel |
|---|---|---|---|---|
| **OP-01** | Autorisierung / Projekt-Scoping (Mehrmandantenfähigkeit) nicht implementiert (U-017, P1) | R-07 | Betrieb ausschließlich als **dedizierte Instanz pro Pilotkunde** (verifiziert CIQ-T02); keine mandantenübergreifende Nutzung einer Instanz | Implementierung P1, danach Nachqualifizierung (COQ-T16 Teil B) und Revision dieses Berichts |
| **OP-02** | Technische Funktionstrennung SoD nicht implementiert (U-018, P2) | R-08 | **Organisatorisches Vier-Augen-Prinzip** im kundenseitigen Review-/Freigabeprozess verpflichtend (verifiziert CUAT-T08); Signatur-/Freigabevollzug außerhalb des Systems (siehe CSV-P11-2026-001) | Implementierung P2 inkl. e-Signatur-Workflow, danach Nachqualifizierung |

**Generelle Betriebsauflage (KI):** Alle QualiPilot-Ausgaben sind ENTWÜRFE; die fachliche Prüfung und Freigabe durch eine qualifizierte Person (Human-in-the-loop) ist nicht delegierbare Betriebsbedingung (U-010, R-01).

## 5. Freigabeempfehlung

QualiPilot v1.0 (MVP) wird als **validiert für den Pilotbetrieb unter Auflagen** empfohlen:

1. Dedizierte Instanz pro Pilotkunde (OP-01)
2. Organisatorisches Vier-Augen-Prinzip, Freigabevollzug im kundenseitigen Prozess (OP-02)
3. Verpflichtender Human-in-the-loop-Review aller generierten Dokumente
4. LLM-Modellversionswechsel nur über Change Control mit bestandenem Regressions-Testset (COQ-T17, DEV-CC-2026-001)

| Rolle | Name | Datum | Unterschrift |
|---|---|---|---|
| Author (Kordix AI) | [NAME] | [DATUM] | ______________ |
| Document Owner (Kordix AI) | [NAME] | [DATUM] | ______________ |
| Quality (Kordix AI) | [NAME] | [DATUM] | ______________ |

## 6. Gültigkeit und Re-Validierungsauslöser

Der validierte Zustand gilt für QualiPilot v1.0 in der in *[Anlage: Systemkonfiguration]* dokumentierten Konfiguration. Re-Validierung (ganz oder teilweise, risikobasiert) bei: LLM-Modellversionswechsel (mind. Regressions-Testset), Vorlagenänderung (IQ001-Revision), Implementierung U-017/U-018, sicherheitsrelevanten Änderungen, Major-Release.

## 7. Periodische Review-Planung

| Aktivität | Frequenz | Verantwortlich |
|---|---|---|
| Periodischer System-Review (Abweichungen, Änderungen, Audit-Trail-Stichprobe, FMEA-Re-Bewertung) | Jährlich, erstmals 12 Monate nach Freigabe | Quality (Kordix AI) |
| Lieferanten-Re-Bewertung (Anthropic, Cloud-Provider) | Jährlich + anlassbezogen | Quality (Kordix AI) |
| Überprüfung Wirksamkeit der Übergangsmaßnahmen OP-01/OP-02 | Quartalsweise bis zur Implementierung | Quality (Kordix AI) + Pilotkunde QA |
| UAT-Qualitätskennzahl (Anteil ohne fachliche Korrektur, Schwelle ≥ 90 %) | Laufendes Monitoring im Pilotbetrieb | Author + Pilotkunde |

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung (Entwurf/Demo) |

*Kordix AI · QualiPilot CSV-Validierungspaket · Demo-Dokument*
