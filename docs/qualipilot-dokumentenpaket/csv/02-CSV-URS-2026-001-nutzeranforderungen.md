# Nutzeranforderungsspezifikation (URS) — QualiPilot v1.0 (MVP)

| Feld | Wert |
|---|---|
| **Dokument-ID** | CSV-URS-2026-001 |
| **Revision** | R01 |
| **Status** | Entwurf / Demo |
| **Author** | Kordix AI |
| **Datum** | [DATUM] |
| **System** | QualiPilot v1.0 [MVP] |
| **Referenzen** | CSV-VP-2026-001, CSV-FS-2026-001, CSV-RA-2026-001, CSV-TM-2026-001 |

## 1. Zweck

Dieses Dokument spezifiziert die Nutzeranforderungen an QualiPilot als zu validierendes computerisiertes System (GAMP 5, Kategorie 5). Jede Anforderung erhält eine eindeutige ID (U-xxx), eine Kritikalität (Hoch/Mittel/Niedrig) und ein GxP-Relevanz-Flag. Anforderungen mit Umsetzungsstatus **Geplant** sind bewusst enthalten und werden in Risikoanalyse (CSV-RA-2026-001) und Traceability-Matrix (CSV-TM-2026-001) als *deferred* geführt.

**Kritikalitätsdefinition:** *Hoch* = direkter Einfluss auf GMP-Dokumentenqualität, Datenintegrität oder Patientensicherheit beim Kunden; *Mittel* = indirekter Einfluss oder Effizienz mit Qualitätsbezug; *Niedrig* = Komfort/Betrieb ohne Qualitätsbezug.

## 2. Anforderungen

### 2.1 Funktional / Dokumentgenerierung

| ID | Anforderung | Kritikalität | GxP | Status |
|---|---|---|---|---|
| U-001 | Das System muss die strukturierte Eingabe eines Equipment-Profils ermöglichen (u. a. Gerätetyp, Hersteller, Modell, Einsatzbereich; für Temperaturmapping: 10 definierte Raumparameter). Pflichtfelder müssen als solche erzwungen werden. | Hoch | Ja | Implementiert |
| U-002 | Das System muss aus dem Equipment-Profil eine DQ-Vorstufe ableiten (Anforderungen an das Equipment aus Profildaten, als geprüfbarer Entwurf). | Hoch | Ja | Implementiert |
| U-003 | Das System muss aus dem Equipment-Profil einen URS-Entwurf für das Equipment ableiten können. | Hoch | Ja | Implementiert |
| U-004 | Das System muss IQ-Protokolle auf Basis der hinterlegten Vorlage generieren (Standard-Vorlage IQ001 R01 mit 16 Test Sections, vollständig und strukturkonform). | Hoch | Ja | Implementiert |
| U-005 | Das System muss OQ-Protokolle mit funktionsbezogenen, prüffähigen Testpunkten generieren. | Hoch | Ja | Implementiert |
| U-006 | Das System muss PQ-Protokolle mit nutzungs-/prozessbezogenen Testpunkten generieren. | Hoch | Ja | Implementiert |
| U-007 | Das System muss CSV-Begleitdokumente generieren können (Validierungsplan, UAT-Plan, Bericht) als Entwürfe. | Mittel | Ja | Implementiert |
| U-008 | Der Temperaturmapping-Assistent muss aus 10 Raumparametern einen vollständigen, GMP-konformen Prüfplan-Entwurf erzeugen. | Hoch | Ja | Implementiert |
| U-009 | Eine Prüfschicht muss generierte Akzeptanzkriterien automatisch validieren: fachlich/formal falsche Kriterien müssen abgelehnt bzw. markiert, korrekte (auch qualitative) Kriterien akzeptiert werden. | Hoch | Ja | Implementiert |
| U-010 | Jedes generierte Dokument muss unübersehbar als **ENTWURF** gekennzeichnet sein und auf den verpflichtenden Human-in-the-loop-Review (Prüfung/Freigabe durch qualifizierte Person) hinweisen. | Hoch | Ja | Implementiert |

### 2.2 Vorlagen & Rückführbarkeit

| ID | Anforderung | Kritikalität | GxP | Status |
|---|---|---|---|---|
| U-011 | Das System muss Kundenvorlagen als Generierungsgrundlage verwalten; die Standard-IQ-Vorlage IQ001 R01 muss versioniert installiert und referenzierbar sein. | Hoch | Ja | Implementiert |
| U-012 | Generierte Dokumente müssen der jeweiligen Vorlage strukturell exakt folgen (bei IQ001 R01: alle 16 Test Sections in korrekter Reihenfolge und Benennung; keine ausgelassenen oder erfundenen Sections). | Hoch | Ja | Implementiert |
| U-013 | Das System muss eine Traceability-Matrix erzeugen, in der jede generierte fachliche Aussage/jeder Prüfpunkt auf seine Quelle (Equipment-Profil-Feld, Vorlagenabschnitt, Regelwerk) rückführbar ist. | Hoch | Ja | Implementiert |
| U-014 | Prüfpunkte müssen als ausfüllbare Test-Tabellen gerendert werden (Prüfpunkt, Akzeptanzkriterium, Ergebnisfeld Pass/Fail, Durchführender/Datum, Referenz). | Mittel | Ja | Implementiert |
| U-015 | Der Export muss das vollständige Dokument ausgeben — ohne Trunkierung, ohne fehlende Abschnitte, in einem beim Kunden weiterverarbeitbaren Format. | Hoch | Ja | Implementiert |

### 2.3 Benutzer & Sicherheit

| ID | Anforderung | Kritikalität | GxP | Status |
|---|---|---|---|---|
| U-016 | Der Zugang zum System muss über individuelle, authentifizierte Benutzerkonten erfolgen (keine Shared Accounts). | Hoch | Ja | Implementiert |
| U-017 | Das System muss Autorisierung mit Projekt-Scoping bereitstellen (Mehrmandantenfähigkeit: Nutzer sehen nur Daten ihres Mandanten/Projekts). | Hoch | Ja | **Geplant (P1)** — Übergangsmaßnahme: dedizierte Instanz pro Pilotkunde (siehe R-07) |
| U-018 | Das System muss Funktionstrennung (Segregation of Duties) unterstützen: Ersteller ≠ Prüfer/Freigeber, rollenbasiert erzwungen. | Hoch | Ja | **Geplant (P2)** — Übergangsmaßnahme: organisatorisches Vier-Augen-Prinzip (siehe R-08) |
| U-019 | Sämtliche Datenübertragung muss transportverschlüsselt erfolgen (TLS). | Hoch | Ja | Implementiert |
| U-020 | Zugangsdaten und API-Schlüssel (u. a. LLM-API) müssen in einem Secrets-Management gehalten werden — nicht im Quellcode, nicht in Logs (Referenz: DEV-SEC-2026-001). | Hoch | Ja | Implementiert |

### 2.4 Datenintegrität & Audit Trail

| ID | Anforderung | Kritikalität | GxP | Status |
|---|---|---|---|---|
| U-021 | Das System muss einen Audit Trail generierungsrelevanter Ereignisse führen (wer, wann, welche Aktion, welches Dokument), unveränderlich und auswertbar. | Hoch | Ja | Implementiert (Basis) |
| U-022 | Datenhaltung und Aufzeichnungen müssen ALCOA+ genügen (zuordenbar, lesbar, zeitgleich, original, korrekt; vollständig, konsistent, dauerhaft, verfügbar). | Hoch | Ja | Implementiert (Bewertung: CSV-P11-2026-001) |
| U-023 | Das System muss elektronisches Signatur-Rendering nach 21 CFR Part 11 bereitstellen (Signaturblöcke mit Name/Rolle/Datum/Bedeutung der Signatur im Dokumentlayout). | Hoch | Ja | Implementiert (Rendering; vollständiger e-Signatur-Workflow geplant, siehe CSV-P11-2026-001) |
| U-024 | Zu jedem generierten Dokument müssen Generierungs-Metadaten aufgezeichnet werden: Zeitstempel, Systemversion, LLM-Modellversion, verwendete Vorlage/Version, Eingabeprofil-Referenz. | Hoch | Ja | Implementiert |
| U-025 | Es müssen regelmäßige Datensicherungen mit dokumentierter Wiederherstellbarkeit erfolgen. | Mittel | Ja | Implementiert (*[Anlage: Systemkonfiguration]*) |

### 2.5 Schnittstellen / LLM

| ID | Anforderung | Kritikalität | GxP | Status |
|---|---|---|---|---|
| U-026 | Die LLM-Anbindung (Anthropic Claude API) muss auf eine definierte, konfigurativ festgelegte Modellversion erfolgen (Pinning; keine unkontrollierte „latest"-Nutzung). | Hoch | Ja | Implementiert |
| U-027 | Ein Wechsel der LLM-Modellversion darf ausschließlich über Change Control erfolgen und muss vor Produktivsetzung ein definiertes Regressions-Testset bestehen (Referenz: DEV-CC-2026-001, DEV-TS-2026-001). | Hoch | Ja | Implementiert (prozedural) |
| U-028 | Bei LLM-Ausfall, Timeout oder unvollständiger Antwort muss das System definiert fehlschlagen: klare Fehlermeldung, kein stillschweigend unvollständiges Dokument. | Hoch | Ja | Implementiert |
| U-029 | Eingegebene Kundendaten dürfen vom LLM-Anbieter nicht zum Modelltraining verwendet werden (vertragliche Zusicherung; Bewertung: CSV-LB-2026-001). | Hoch | Ja | Implementiert (vertraglich) |

### 2.6 Performance & Verfügbarkeit

| ID | Anforderung | Kritikalität | GxP | Status |
|---|---|---|---|---|
| U-030 | Die Generierung eines Temperaturmapping-Prüfplans (10 Raumparameter) soll in der Regel ≤ 120 s abgeschlossen sein (Zielwert ~60 s). | Mittel | Nein | Implementiert |
| U-031 | Das System soll im Pilotbetrieb eine Verfügbarkeit von ≥ 99 % zu Geschäftszeiten erreichen; geplante Wartungen werden angekündigt. | Mittel | Nein | Implementiert (Monitoring, *[Anlage: Systemkonfiguration]*) |
| U-032 | Die Ausgabekapazität (u. a. `max_tokens`-Konfiguration) muss so bemessen und verifiziert sein, dass Dokumente der spezifizierten Maximalgröße vollständig und ohne Trunkierung erzeugt werden. | Hoch | Ja | Implementiert |

### 2.7 Betrieb & Support

| ID | Anforderung | Kritikalität | GxP | Status |
|---|---|---|---|---|
| U-033 | Entwicklungs- und Produktivumgebung müssen strikt getrennt sein (Dev/Prod); Tests finden nicht in Prod statt. | Hoch | Ja | Implementiert |
| U-034 | Die installierte Softwareversion muss eindeutig identifizierbar sein (Release-/Build-Kennung, Referenz: DEV-KM-2026-001). | Hoch | Ja | Implementiert |
| U-035 | Es muss ein Incident-/Support-Prozess mit definierten Meldewegen und Reaktionszielen für Pilotkunden bestehen. | Mittel | Nein | Implementiert (prozedural) |

## 3. Zusammenfassung

- **35 Anforderungen** gesamt: 29 × Kritikalität *Hoch*, 6 × *Mittel*, 0 × *Niedrig*; **32 GxP-relevant**
- **2 Anforderungen geplant/deferred:** U-017 (Autorisierung/Projekt-Scoping, P1), U-018 (SoD, P2) — beide mit organisatorischen Übergangsmaßnahmen, geführt in CSV-RA-2026-001 (R-07, R-08) und CSV-VB-2026-001 (OP-01, OP-02)
- Vollständiges Mapping auf Funktionen und Testfälle: CSV-TM-2026-001

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung (Entwurf/Demo) |

*Kordix AI · QualiPilot CSV-Validierungspaket · Demo-Dokument*
