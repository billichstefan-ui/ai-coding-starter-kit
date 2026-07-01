# 21 CFR Part 11 / EU Annex 11 Compliance-Assessment — QualiPilot v1.0 (MVP)

| Feld | Wert |
|---|---|
| **Dokument-ID** | CSV-P11-2026-001 |
| **Revision** | R01 |
| **Status** | Entwurf / Demo |
| **Author** | Kordix AI |
| **Datum** | [DATUM] |
| **System** | QualiPilot v1.0 [MVP] |
| **Referenzen** | CSV-URS-2026-001, CSV-RA-2026-001, CSV-VB-2026-001, DEV-SEC-2026-001 |

## 1. Zweck und Einordnung

Bewertung von QualiPilot gegen 21 CFR Part 11 und EU GMP Annex 11. **Ehrliche Grundaussage vorab:** QualiPilot v1.0 stellt elektronisches **Signatur-Rendering** bereit (Signaturblöcke im Dokumentlayout); ein vollständiger elektronischer Signatur-Workflow (Signaturvollzug mit Authentifizierung, Manifestation, Verknüpfung) sowie technische SoD sind **geplant**. Im Pilotbetrieb erfolgt der Signatur-/Freigabevollzug im kundenseitigen (ggf. papierbasierten oder kundeneigenen e-Signatur-) Prozess. Statuslegende: **Erfüllt** / **Teilweise** / **Geplant** / **n. a.**

## 2. 21 CFR Part 11 — Anforderungskatalog

| § | Anforderung | Systemantwort QualiPilot | Status | Verweis |
|---|---|---|---|---|
| 11.10(a) | Validierung des Systems | Vorliegendes CSV-Paket (VP, URS, FS, RA, IQ, OQ, UAT, TM, VB) | Erfüllt | CSV-VP-2026-001 |
| 11.10(b) | Erzeugung genauer, vollständiger Kopien in lesbarer und elektronischer Form | Export vollständiger Dokumente mit Vollständigkeitskontrolle (kein stilles Abschneiden) | Erfüllt | F-007; COQ-T06 |
| 11.10(c) | Schutz der Aufzeichnungen über die Aufbewahrungsfrist | Cloud-Persistenz + Backups mit Restore-Test; Aufbewahrungsfristen kundenseitig zu definieren | Teilweise | CIQ-T08; U-025 |
| 11.10(d) | Systemzugang nur für autorisierte Personen | Individuelle authentifizierte Konten; **Autorisierung/Projekt-Scoping geplant (P1)** — Übergang: dedizierte Instanz pro Kunde | Teilweise | U-016, U-017; OP-01 |
| 11.10(e) | Audit Trail: sicher, computergeneriert, zeitgestempelt, Änderungen ohne Überschreiben | Audit Trail generierungsrelevanter Ereignisse, unveränderlich, zeitgestempelt; Abdeckungstiefe wächst mit Funktionsumfang | Teilweise | F-010; CIQ-T09, COQ-T15 |
| 11.10(f) | Erzwingung von Ablauf-/Ereignisreihenfolgen (Operational Checks) | Workflow erzwingt Profil → Generierung → Prüfschicht → Export; keine Übersprünge | Erfüllt | F-003, F-004 |
| 11.10(g) | Authority Checks (Funktion nur für Berechtigte) | Basis über Authentifizierung; rollenbasierte Feinsteuerung mit U-017/U-018 | Geplant | F-009; OP-01, OP-02 |
| 11.10(h) | Device Checks (Gültigkeit der Datenquelle) | Web-Frontend mit validierten Eingabemasken; keine unkontrollierten Datenquellen | Erfüllt | F-001; COQ-T11 |
| 11.10(i) | Qualifikation der Personen (Entwicklung, Betrieb, Nutzung) | Entwickler: GMP Qualification Specialist; Nutzerqualifikation kundenseitig; Human-in-the-loop verlangt qualifizierten Reviewer | Erfüllt (organisatorisch) | CSV-LB-2026-001; U-010 |
| 11.10(j) | Verbindliche Richtlinien zur Verantwortung bei e-Signaturen | Erst relevant mit e-Signatur-Workflow; im Pilot: kundenseitiger Freigabeprozess | Geplant | F-008; OP-02 |
| 11.10(k) | Dokumentationskontrolle (Systemdokumentation, Change Control) | DEV-Paket mit Versions- und Change-Management | Erfüllt | DEV-KM-2026-001, DEV-CC-2026-001 |
| 11.50 | Signierte Aufzeichnungen: Name, Datum/Zeit, Bedeutung der Signatur | Signatur-**Rendering** enthält Name/Rolle/Datum/Bedeutung als auszufüllende Blöcke; Signaturvollzug außerhalb des Systems | Teilweise | F-008; COQ-T13 |
| 11.70 | Verknüpfung Signatur ↔ Aufzeichnung (nicht übertragbar/entfernbar) | Erfordert e-Signatur-Workflow | Geplant | F-008; R-10 |
| 11.100–11.300 | e-Signatur-Komponenten, Eindeutigkeit, ID/Passwort-Kontrollen für Signaturvollzug | Kein Signaturvollzug im System v1.0; bei Implementierung nachzuweisen | Geplant / n. a. (v1.0) | F-008; OP-02 |

## 3. EU GMP Annex 11 — Anforderungskatalog

| Ziff. | Anforderung | Systemantwort QualiPilot | Status | Verweis |
|---|---|---|---|---|
| 1 | Risikomanagement über den Lebenszyklus | FMEA nach ICH Q9(R1), inkl. KI-spezifischer Risiken; Re-Bewertung definiert | Erfüllt | CSV-RA-2026-001 |
| 2 | Personal (Qualifikation, Verantwortlichkeiten) | Rollen definiert; Solo-Kontext ehrlich adressiert (Vier-Augen organisatorisch) | Erfüllt (mit Auflage) | CSV-VP-2026-001 §7; OP-02 |
| 3 | Lieferanten und Dienstleister | Bewertung Entwickler, LLM-Anbieter (Anthropic), Cloud-Provider | Erfüllt | CSV-LB-2026-001 |
| 4 | Validierung | Vollständiger Lifecycle Kat. 5 (V-Modell) | Erfüllt | CSV-VP-2026-001 |
| 5 | Daten (Schnittstellen, Korrektheit der Datenübernahme) | Profildaten → Dokument mit Traceability; Prüfschicht als Plausibilitätskontrolle | Erfüllt | COQ-T01, COQ-T09 |
| 6 | Accuracy Checks (kritische manuelle Eingaben) | Pflichtfeld-/Plausibilitätsprüfung des Equipment-Profils; kritische Ergebnisse zusätzlich Human-Review | Erfüllt | COQ-T11; U-010 |
| 7 | Datenspeicherung (Sicherheit, Backups, Wiederherstellung) | Backups mit dokumentiertem Restore-Test | Erfüllt | CIQ-T08 |
| 8 | Ausdrucke / klare Kopien | Vollständiger Export inkl. Metadaten | Erfüllt | COQ-T06 |
| 9 | Audit Trails (GMP-relevante Änderungen und Löschungen) | Vorhanden für generierungsrelevante Ereignisse; Review-Prozedur des Audit Trails kundenseitig festzulegen | Teilweise | F-010; COQ-T15 |
| 10 | Change- und Configuration-Management | DEV-CC-2026-001; umfasst ausdrücklich LLM-Modellversionswechsel mit Regressions-Testset | Erfüllt | COQ-T17; R-03 |
| 11 | Periodische Evaluierung | Periodischer Review geplant und terminiert | Erfüllt | CSV-VB-2026-001 §7 |
| 12 | Sicherheit (physisch/logisch, Zugriffskontrolle) | Authentifizierung, TLS, Secrets-Management; **Feingranulare Autorisierung geplant** | Teilweise | CIQ-T06, CIQ-T07; OP-01 |
| 13 | Incident Management | Support-/Incident-Prozess für Pilotkunden | Erfüllt | U-035 |
| 14 | Elektronische Signatur | Rendering vorhanden; Vollzug geplant (siehe Part-11-Bewertung) | Teilweise/Geplant | F-008; OP-02 |
| 15 | Chargenfreigabe | QualiPilot ist kein Freigabesystem für Chargen | n. a. | — |
| 16 | Business Continuity | Pilotbetrieb: definiertes Ausfallverhalten + manuelle Alternative (konventionelle Dokumenterstellung) dokumentiert | Erfüllt (risikoproportional) | COQ-T14 |
| 17 | Archivierung | Export + kundenseitige Archivierung; systemseitige Langzeitarchivierung geplant | Teilweise | U-025 |

## 4. ALCOA+-Datenintegritätsbewertung

| Prinzip | Bewertung für QualiPilot-Aufzeichnungen (Profile, Dokumente, Audit Trail, Metadaten) | Status |
|---|---|---|
| **A**ttributable | Ereignisse individuellen Konten zugeordnet (U-016, Audit Trail F-010) | Erfüllt |
| **L**egible | Dokumente und Audit Trail menschenlesbar; Export in weiterverarbeitbarem Format | Erfüllt |
| **C**ontemporaneous | Zeitstempel bei Ereigniserzeugung, systemgeneriert | Erfüllt |
| **O**riginal | Generierungs-Metadaten (Modellversion, Vorlage, Profilreferenz) sichern den Erzeugungskontext des Originals | Erfüllt |
| **A**ccurate | KI-Output per se nicht garantiert korrekt → Korrektheit über Prüfschicht + Traceability + verpflichtenden Human-Review hergestellt; **Accuracy ist ein Prozessergebnis, kein reines Systemattribut** | Erfüllt (mit HITL-Auflage) |
| **+ Complete** | Vollständigkeitskontrolle Export (R-04); Audit-Trail-Kette COQ-T15 | Erfüllt |
| **+ Consistent** | Erzwungene Workflow-Reihenfolge, konsistente Zeitstempel | Erfüllt |
| **+ Enduring** | Persistenz + Backup; Langzeitarchivierung teilweise kundenseitig | Teilweise |
| **+ Available** | Abruf über Systemlebensdauer; Export für kundenseitige Ablage | Erfüllt |

## 5. Gesamtergebnis

| Status | Anzahl (Part 11 + Annex 11, 31 Positionen) |
|---|---|
| Erfüllt | 18 |
| Teilweise | 8 |
| Geplant | 4 |
| n. a. | 1 |

**Fazit:** Kein Befund, der dem Pilotbetrieb unter den definierten Auflagen (OP-01: dedizierte Instanz; OP-02: organisatorisches Vier-Augen-Prinzip, Signaturvollzug im kundenseitigen Prozess) entgegensteht. Die Status „Teilweise/Geplant" konzentrieren sich auf Autorisierung, SoD und e-Signatur-Vollzug und sind in CSV-VB-2026-001 als offene Punkte mit Bedingungen geführt. Kundenseitig bleibt die Einordnung der QualiPilot-Ausgaben als *Entwürfe* (nicht als freigegebene GMP-Records) verpflichtend, bis der kundeneigene Freigabeprozess durchlaufen ist.

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung (Entwurf/Demo) |

*Kordix AI · QualiPilot CSV-Validierungspaket · Demo-Dokument*
