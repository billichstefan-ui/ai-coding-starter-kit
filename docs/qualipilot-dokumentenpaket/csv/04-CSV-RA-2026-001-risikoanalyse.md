# Funktionale Risikoanalyse (FMEA) — QualiPilot v1.0 (MVP)

| Feld | Wert |
|---|---|
| **Dokument-ID** | CSV-RA-2026-001 |
| **Revision** | R01 |
| **Status** | Entwurf / Demo |
| **Author** | Kordix AI |
| **Datum** | [DATUM] |
| **System** | QualiPilot v1.0 [MVP] |
| **Methodik** | ICH Q9(R1), GAMP 5 (2nd Ed.) — funktionale FMEA |
| **Referenzen** | CSV-URS-2026-001, CSV-FS-2026-001, CSV-TM-2026-001 |

## 1. Methodik

Bewertung je Risiko nach FMEA mit drei Faktoren auf Skala 1–5:

| Faktor | 1 | 3 | 5 |
|---|---|---|---|
| **S** — Schwere (Auswirkung auf GMP-Dokumentqualität/Datenintegrität beim Kunden) | vernachlässigbar | Nacharbeit erforderlich, Fehler wird sicher vor GMP-Nutzung entdeckt | falsches GMP-Dokument könnte unerkannt in Kundenprozess gelangen |
| **W** — Wahrscheinlichkeit des Auftretens | sehr selten | gelegentlich | häufig/systematisch |
| **E** — Entdeckungswahrscheinlichkeit (invertiert) | Fehler wird praktisch sicher entdeckt | Entdeckung wahrscheinlich, nicht garantiert | Fehler bleibt wahrscheinlich unentdeckt |

**RPZ = S × W × E** (max. 125). Klassifizierung: **Hoch ≥ 27**, **Mittel 12–26**, **Niedrig < 12**. Die Bewertung erfolgt **nach** Berücksichtigung bestehender Kontrollen („Rest-RPZ mit Mitigation" separat ausgewiesen). Grundannahme des Systemdesigns: QualiPilot erzeugt ENTWÜRFE; der verpflichtende Human-in-the-loop-Review (U-010) ist die übergreifende Kontrolle und senkt E systemweit — er wird dennoch nicht als alleinige Mitigation akzeptiert.

## 2. Risikoregister

> S/W/E/RPZ = Bewertung ohne spezifische Mitigation (nur Basiskontrollen); mS/mW/mE/mRPZ = mit implementierten/geplanten Mitigationen.

### 2.1 KI-spezifische Risiken

| ID | Risiko / Fehlermodus | Bezug (U/F) | S | W | E | RPZ | Mitigation / Kontrollen | mS | mW | mE | mRPZ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **R-01** | **Halluzination / fachlich falsche Generierung:** LLM erzeugt inhaltlich falsche Prüfpunkte, Grenzwerte oder Akzeptanzkriterien, die plausibel wirken | U-004–U-010, F-003 | 5 | 3 | 3 | **45 (Hoch)** | Prüfschicht validiert Akzeptanzkriterien automatisch (F-004); verpflichtender Human-in-the-loop-Review, Ausgabe nur als ENTWURF (U-010); Traceability-Matrix macht unbelegte Aussagen sichtbar (F-005); Tests COQ-T07, COQ-T12; UAT-Schwelle CUAT-T03 | 5 | 2 | 1 | 10 (Niedrig) |
| **R-02** | **Fehlende Nachvollziehbarkeit:** generierte Aussagen sind nicht auf Quelle (Profil, Vorlage, Regelwerk) rückführbar; Review wird ineffektiv | U-013, F-005 | 4 | 3 | 3 | **36 (Hoch)** | Traceability-Matrix-Generator, „unbelegt"-Markierung mit Prüfschicht-Beanstandung; Tests COQ-T09, CUAT-T04 | 4 | 1 | 1 | 4 (Niedrig) |
| **R-03** | **Unkontrollierte LLM-Modell-Updates:** Anbieterseitiger Modellwechsel verändert Generierungsverhalten (Drift) unbemerkt | U-026, U-027, F-011 | 4 | 3 | 4 | **48 (Hoch)** | Modellversion konfigurativ gepinnt (CIQ-T03); Wechsel nur via Change Control (DEV-CC-2026-001) mit Regressions-Testset (COQ-T17, DEV-TS-2026-001); Lieferantenbewertung Modellversionierung (CSV-LB-2026-001) | 4 | 1 | 2 | 8 (Niedrig) |
| **R-04** | **Trunkierung / unvollständige Ausgabe:** `max_tokens`-Limit oder Übertragungsfehler führt zu abgeschnittenem Dokument, das vollständig wirkt | U-015, U-032, F-003, F-007 | 4 | 3 | 3 | **36 (Hoch)** | Vollständigkeitskontrolle im Export (Soll-/Ist-Abschnittsabgleich, F-007); `max_tokens`-Verifizierung CIQ-T04; Test COQ-T06; Fehler statt stillem Abschneiden | 4 | 1 | 1 | 4 (Niedrig) |
| **R-05** | **Prüfschicht-Fehlfunktion:** Prüfschicht akzeptiert falsche Kriterien (falsch-negativ) oder blockiert korrekte qualitative Kriterien (falsch-positiv) | U-009, F-004 | 4 | 2 | 3 | **24 (Mittel)** | Dedizierte Positiv-/Negativtests COQ-T07 + COQ-T08; Regelwerk versioniert (DEV-KM-2026-001); Human-in-the-loop als zweite Barriere | 4 | 1 | 2 | 8 (Niedrig) |
| **R-12** | **Datenabfluss über LLM-API:** Kundendaten werden vom Anbieter gespeichert/zum Training genutzt oder unverschlüsselt übertragen | U-019, U-029, F-011 | 4 | 2 | 4 | **32 (Hoch)** | Vertragliche No-Training-Zusicherung (CSV-LB-2026-001); TLS (CIQ-T07); Datenminimierung im Prompt-Design (DEV-SOP-AI-2026-001, DEV-SEC-2026-001) | 4 | 1 | 3 | 12 (Mittel) |

### 2.2 Anwendungs- und Prozessrisiken

| ID | Risiko / Fehlermodus | Bezug (U/F) | S | W | E | RPZ | Mitigation / Kontrollen | mS | mW | mE | mRPZ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **R-06** | **Vorlagenabweichung:** generiertes IQ-Protokoll weicht strukturell von IQ001 R01 ab (fehlende/erfundene Test Sections, falsche Reihenfolge) | U-011, U-012, F-006 | 4 | 2 | 2 | **16 (Mittel)** | Vorlagen-Engine erzwingt Struktur (LLM füllt nur Inhaltsslots); Tests COQ-T01, COQ-T10; Vorlagen unter Change Control | 4 | 1 | 1 | 4 (Niedrig) |
| **R-07** | **Fehlende Mandantentrennung (OFFENER PUNKT, P1):** ohne Projekt-Scoping könnten Nutzer auf Daten anderer Projekte/Kunden zugreifen | U-017, F-009 | 4 | 3 | 3 | **36 (Hoch)** | **Übergangsmaßnahme:** dedizierte Instanz pro Pilotkunde (physische Trennung auf Deployment-Ebene, verifiziert in CIQ-T02); Implementierung Autorisierung/Scoping als P1 geplant; geführt als OP-01 (CSV-VB-2026-001) | 4 | 1 | 2 | 8 (Niedrig, unter Auflage) |
| **R-08** | **Fehlende Funktionstrennung SoD (OFFENER PUNKT, P2):** Ersteller könnte eigenes Dokument prüfen/freigeben; technisch nicht verhindert | U-018, F-009 | 4 | 3 | 3 | **36 (Hoch)** | **Übergangsmaßnahme:** organisatorisches Vier-Augen-Prinzip im kundenseitigen Freigabeprozess (dokumentiert, UAT CUAT-T08); technische SoD als P2 geplant; geführt als OP-02 (CSV-VB-2026-001) | 4 | 2 | 2 | 16 (Mittel, unter Auflage) |
| **R-09** | **Audit-Trail-Lücken:** generierungsrelevante Ereignisse oder Metadaten (Modellversion, Vorlagenrevision) werden nicht/unvollständig aufgezeichnet | U-021, U-024, F-010 | 4 | 2 | 3 | **24 (Mittel)** | Audit Trail + Metadatenpflicht je Generierung (F-010); Tests CIQ-T09, COQ-T15; ALCOA+-Assessment CSV-P11-2026-001 | 4 | 1 | 2 | 8 (Niedrig) |
| **R-10** | **Fehlinterpretation e-Signatur-Rendering:** gerenderte Signaturblöcke werden als vollzogene elektronische Signatur missverstanden | U-023, F-008 | 3 | 2 | 3 | **18 (Mittel)** | Klare Kennzeichnung als Signatur-*Vorlage* + ENTWURF-Status (U-010); ehrliche Abgrenzung in CSV-P11-2026-001; Test COQ-T13; Kundeninformation in Nutzungsdokumentation | 3 | 1 | 2 | 6 (Niedrig) |
| **R-11** | **LLM-Ausfall/Timeout:** API nicht erreichbar oder Antwort unvollständig → Teildokument oder Systemhänger | U-028, U-031, F-011 | 3 | 3 | 2 | **18 (Mittel)** | Definiertes Fehlerverhalten (kein Teildokument, klare Meldung, Retry); Test COQ-T14; Verfügbarkeitsbewertung Anbieter CSV-LB-2026-001 | 3 | 2 | 1 | 6 (Niedrig) |
| **R-13** | **Fehlerhafte Eingabevalidierung:** unvollständiges/widersprüchliches Equipment-Profil führt zu lückenhaftem Prüfplan | U-001, F-001 | 3 | 3 | 2 | **18 (Mittel)** | Pflichtfeld-/Plausibilitätsprüfung vor Generierung; Negativtest COQ-T11, UAT CUAT-T07 | 3 | 1 | 1 | 3 (Niedrig) |
| **R-14** | **Deployment-/Konfigurationsfehler:** falsche Version, falsche Modell-/`max_tokens`-Konfiguration oder Vorlagenstand in Prod | U-033, U-034, F-012 | 4 | 2 | 3 | **24 (Mittel)** | Kontrollierter Deployment-Prozess (DEV-CC-2026-001); IQ verifiziert Version, Konfiguration, Vorlage (CIQ-T01–T05); Umgebungstrennung | 4 | 1 | 1 | 4 (Niedrig) |
| **R-15** | **Datenverlust:** Verlust von Profilen, generierten Dokumenten oder Audit Trail durch Ausfall ohne funktionierendes Backup | U-025, U-022, F-012 | 4 | 2 | 3 | **24 (Mittel)** | Regelmäßige Backups mit dokumentiertem Wiederherstellungstest (CIQ-T08); Cloud-Provider-Bewertung CSV-LB-2026-001 | 4 | 1 | 2 | 8 (Niedrig) |

## 3. Detailbetrachtung der hohen Risiken (vor Mitigation)

**R-01 — Halluzination.** Der kritischste Fehlermodus des Systems: Ein LLM kann Prüfpunkte, Grenzwerte oder Normbezüge erzeugen, die syntaktisch einwandfrei und fachlich plausibel wirken, aber falsch sind. Gerade die hohe Oberflächenqualität senkt die Entdeckungswahrscheinlichkeit bei oberflächlichem Review. Die Verteidigung ist deshalb dreistufig: (1) die deterministische Prüfschicht fängt regelverletzende Kriterien maschinell ab, (2) die Traceability-Matrix zwingt jede Aussage an eine Quelle — eine Halluzination hat keine auflösbare Quelle und wird als „unbelegt" sichtbar, (3) der Human-in-the-loop-Review durch eine qualifizierte Person ist verpflichtende Betriebsbedingung, nicht Option. Das Restrisiko wird zusätzlich im UAT quantitativ überwacht (Schwellen A1/A2, CSV-UAT-2026-001).

**R-02 — Nachvollziehbarkeit.** Ohne Rückführbarkeit degeneriert der Human-Review zur Plausibilitätsschau. Die Traceability-Matrix ist daher nicht Komfortfunktion, sondern Risikokontrolle: Sie macht den Review effizient (Prüfen statt Nachrecherchieren) und wirksam (unbelegte Aussagen springen ins Auge). Ihre eigene Korrektheit wird in COQ-T09 zu 100 % (nicht stichprobenhaft) geprüft.

**R-03 — Modell-Drift.** Anbieterseitige Modell-Updates können das Generierungsverhalten still verändern — der klassische „unkontrollierte Change" im Sinne von Annex 11 Ziff. 10, nur außerhalb der eigenen Systemgrenze. Kontrollkette: konfigurativ gepinnte Modellversion (kein „latest"), IQ-Verifizierung des Pins (CIQ-T03), Deprecation-Monitoring beim Anbieter (CSV-LB-2026-001), Wechsel ausschließlich via Change Control mit bestandenem Regressions-Testset (COQ-T17). Ein Modellwechsel ist damit formal ein revalidierungspflichtiges Ereignis (CSV-VB-2026-001, Abschnitt 6).

**R-04 — Trunkierung.** Ein an der `max_tokens`-Grenze abgeschnittenes Dokument ist gefährlicher als ein fehlendes, weil es vollständig wirken kann. Die Kontrolle setzt doppelt an: Kapazitätsauslegung wird in der IQ gegen die spezifizierte Maximaldokumentgröße verifiziert (CIQ-T04), und der Export verweigert die Ausgabe bei Soll-/Ist-Abweichung der Abschnitte (Fail-closed-Prinzip, COQ-T06 mit Grenzwert-Testprofil).

**R-07 / R-08 — Offene Punkte Mandantentrennung und SoD.** Beide sind bewusst nicht wegdiskutiert, sondern als Designlücken des MVP mit hoher Vorab-RPZ bewertet. Die Übergangsmaßnahmen verlagern die Kontrolle von der technischen auf die organisatorisch-infrastrukturelle Ebene: R-07 wird durch dedizierte Instanzen pro Pilotkunde faktisch eliminiert (keine gemeinsame Datenhaltung existiert), R-08 durch das dokumentierte Vier-Augen-Prinzip im kundenseitigen Freigabeprozess reduziert, aber nicht eliminiert — daher verbleibt R-08 nach Mitigation in Klasse *Mittel* und wird quartalsweise auf Wirksamkeit geprüft (CSV-VB-2026-001, Abschnitt 7). Beide Punkte sind Freigabe-Auflagen, keine bloßen Empfehlungen.

**R-12 — Datenabfluss LLM-API.** Kundendaten (Equipment-Profile, ggf. Standortinformationen) verlassen die Systemgrenze Richtung LLM-Anbieter. Kontrollen: vertragliche No-Training-Zusicherung, TLS, Datenminimierung im Prompt-Design (DEV-SOP-AI-2026-001). Restrisiko *Mittel* wird akzeptiert und jährlich mit der Lieferanten-Re-Bewertung neu beurteilt; Pilotkunden werden über den Datenfluss transparent informiert (Nutzungsdokumentation).

## 4. Auswertung

| Klasse (vor Mitigation) | Anzahl | Risiken |
|---|---|---|
| Hoch (RPZ ≥ 27) | 7 | R-01, R-02, R-03, R-04, R-07, R-08, R-12 |
| Mittel (12–26) | 8 | R-05, R-06, R-09, R-10, R-11, R-13, R-14, R-15 |
| **Gesamt** | **15** | davon **6 KI-spezifisch** (R-01–R-05, R-12) |

Nach Mitigation verbleiben **keine hohen Restrisiken**. R-07 und R-08 erreichen ihre reduzierte Klasse **nur unter Auflage** der organisatorischen Übergangsmaßnahmen (dedizierte Instanz, Vier-Augen-Prinzip); sie bleiben als offene Punkte OP-01/OP-02 im Validierungsbericht bestehen, bis U-017/U-018 implementiert und nachqualifiziert sind.

## 5. Abgeleitete Teststrategie

| Risikoklasse | Teststrategie |
|---|---|
| Hoch (vor Mitigation) | Dedizierte OQ-Testfälle mit Positiv- **und** Negativszenarien; zusätzlich UAT-Absicherung im Nutzungskontext; Wirksamkeitsnachweis der Übergangsmaßnahmen (R-07: CIQ-T02; R-08: CUAT-T08) |
| Mittel | Mindestens ein dedizierter Testfall (IQ oder OQ); Negativtest, wo Fehlermodus provozierbar |
| Niedrig | Abdeckung über kombinierte Tests / prozedurale Kontrollen |

Konkretes Mapping Risiko → Testfall: Spalte „Mitigation" oben sowie CSV-TM-2026-001. Re-Bewertung dieser FMEA: bei jedem Modellversionswechsel (R-03), bei Implementierung von U-017/U-018 sowie im periodischen Review (CSV-VB-2026-001, Abschnitt 7).

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung (Entwurf/Demo) |

*Kordix AI · QualiPilot CSV-Validierungspaket · Demo-Dokument*
