# Validierungsplan — QualiPilot v1.0 (MVP)

| Feld | Wert |
|---|---|
| **Dokument-ID** | CSV-VP-2026-001 |
| **Revision** | R01 |
| **Status** | Entwurf / Demo |
| **Author** | Kordix AI |
| **Datum** | [DATUM] |
| **System** | QualiPilot v1.0 [MVP] |
| **Document Owner** | Kordix AI — Quality |

## 1. Zweck und Geltungsbereich

Dieser Validierungsplan definiert Strategie, Umfang, Verantwortlichkeiten und Akzeptanzphilosophie für die Computer System Validation (CSV) des Systems **QualiPilot v1.0 (MVP)** nach GAMP 5 (2nd Edition), EU GMP Annex 11, 21 CFR Part 11, ICH Q9(R1) und EU GMP Annex 15.

Das Paket ist **Hersteller-Dokumentation der Kordix AI**. Es dient Pilotkunden als Grundlage und Beschleuniger ihrer eigenen, risikobasierten Systemqualifizierung; es ersetzt nicht die kundenseitige Bewertung im eigenen Qualitätssystem.

**Im Geltungsbereich:** QualiPilot-Webanwendung, KI-Service (Python-Modul `services/ai/app/qualipilot`, u. a. `export.py` / `_build_iq_protocol`), Prüfschicht, Vorlagen-Engine, Export, LLM-Anbindung (Anthropic Claude API), Cloud-Deployment (Dev/Prod).

**Außerhalb des Geltungsbereichs:** Qualifizierung der vom Kunden mit QualiPilot geprüften Equipments selbst; Infrastruktur-Qualifizierung des Cloud-Providers (siehe CSV-LB-2026-001); der kundenseitige Freigabeprozess der generierten Dokumente.

## 2. Systembeschreibung

QualiPilot ist ein KI-gestütztes System zur Generierung von GMP-Qualifizierungsdokumenten:

- **IQ/OQ/PQ-Protokolle** auf Basis von Kundenvorlagen (Standard-IQ-Vorlage **IQ001 R01** mit 16 Test Sections)
- **DQ-Vorstufe**: Ableitung von Anforderungen aus einem strukturierten Equipment-Profil
- **URS-Ableitung** sowie **CSV-Dokumente** (Validierungsplan, UAT, Bericht)
- **MVP-Use-Case:** Temperaturmapping-Assistent — 10 Raumparameter werden in ~60 Sekunden in einen GMP-konformen Prüfplan überführt (statt ~3 Stunden manuell)

Kernprinzipien: rückführbare Prüfpunkte als Test-Tabellen, **Traceability-Matrix** (jede Aussage rückführbar auf ihre Quelle), elektronisches **Signatur-Rendering** nach 21 CFR Part 11, sowie eine **Prüfschicht**, die generierte Akzeptanzkriterien automatisch validiert. QualiPilot erzeugt ausschließlich **ENTWÜRFE**; fachliche Prüfung und Freigabe verbleiben verpflichtend beim qualifizierten Menschen (Human-in-the-loop). Technische Details der Konfiguration: *[Anlage: Systemkonfiguration]*.

## 3. GAMP-5-Kategorisierung

**Kategorie 5 — Custom Application (Eigenentwicklung).**

Begründung: QualiPilot ist eine vollständig durch Kordix AI entwickelte Individualsoftware mit anwendungsspezifischer Geschäftslogik (Dokumentgenerierung, Prüfschicht, Traceability). Die eingebundene LLM-API (Anthropic Claude) ist eine konfigurierte externe Komponente, deren nicht-deterministisches Verhalten die Kategorie-5-Einstufung und den vollen Lifecycle-Ansatz zusätzlich untermauert. Konsequenz: vollständiger Spezifikations- und Verifizierungszyklus (URS → FS → IQ/OQ/UAT), Lieferantenbewertung der Subservices, funktionale Risikoanalyse.

## 4. Lifecycle-Ansatz (V-Modell)

| Spezifikation | Verifizierung |
|---|---|
| Nutzeranforderungen (CSV-URS-2026-001) | UAT/PQ (CSV-UAT-2026-001) |
| Funktionsspezifikation (CSV-FS-2026-001) | Funktionstests OQ (CSV-OQ-2026-001) |
| Design/Konfiguration (*[Anlage: Systemkonfiguration]*, DEV-SAD-2026-001) | Installationsqualifizierung IQ (CSV-IQ-2026-001) |

Die Entwicklung erfolgt nach dem dokumentierten Software-Entwicklungspaket der Kordix AI (DEV-SDP-2026-001, DEV-CS-2026-001, DEV-TS-2026-001, DEV-KM-2026-001, DEV-CC-2026-001, DEV-SEC-2026-001, DEV-SOP-AI-2026-001); dieses gilt als Entwicklungs-/Lieferantennachweis im Sinne von GAMP 5.

## 5. Risikobasierte Strategie

Nach ICH Q9(R1) und GAMP 5 wird der Testumfang aus der funktionalen Risikoanalyse (CSV-RA-2026-001, FMEA) abgeleitet:

- **Hohe RPZ / GxP-kritisch:** dedizierte, dokumentierte Testfälle in OQ und UAT (z. B. Halluzinationsrisiko, Trunkierung, Vorlagen-Treue, Traceability)
- **Mittlere RPZ:** Verifizierung über IQ-Prüfpunkte oder kombinierte OQ-Tests
- **KI-spezifische Risiken** (Halluzination, Nachvollziehbarkeit, Modell-Updates, Datenintegrität ALCOA+) werden verpflichtend behandelt; zentrale Kontrolle ist der Human-in-the-loop-Review, technisch flankiert durch Prüfschicht und Traceability-Matrix
- **Bekannte offene Punkte** (Autorisierung/Projekt-Scoping P1, Funktionstrennung/SoD P2) werden nicht kaschiert, sondern als Risiken mit organisatorischen Übergangsmaßnahmen geführt (dedizierte Instanz pro Pilotkunde, organisatorisches Vier-Augen-Prinzip)

## 6. Dokumentenübersicht des Pakets

| Dokument-ID | Titel |
|---|---|
| CSV-VP-2026-001 | Validierungsplan (dieses Dokument) |
| CSV-URS-2026-001 | Nutzeranforderungsspezifikation (URS) |
| CSV-FS-2026-001 | Funktionsspezifikation (FS) |
| CSV-RA-2026-001 | Funktionale Risikoanalyse (FMEA) |
| CSV-LB-2026-001 | Lieferanten- und Subservice-Bewertung |
| CSV-IQ-2026-001 | Installationsqualifizierung (IQ) |
| CSV-OQ-2026-001 | Funktionstests (OQ) |
| CSV-UAT-2026-001 | User Acceptance Testing (UAT/PQ) |
| CSV-P11-2026-001 | 21 CFR Part 11 / EU Annex 11 Assessment |
| CSV-TM-2026-001 | Traceability-Matrix |
| CSV-VB-2026-001 | Validierungsbericht |

**ID-Systematik:** Anforderungen U-001 ff., Funktionen F-001 ff., Risiken R-01 ff., Testfälle CIQ-Txx (IQ), COQ-Txx (OQ), CUAT-Txx (UAT), Abweichungen ABW-xxx, offene Punkte OP-xx.

## 7. Rollen und Verantwortlichkeiten

| Rolle | Verantwortung |
|---|---|
| **Author** (Kordix AI) | Erstellung der Validierungsdokumente, Testdurchführung Entwicklung |
| **Document Owner** (Kordix AI) | Pflege, Revisionsführung, Change Control der Dokumente |
| **Quality** (Kordix AI) | Prüfung und Freigabe aller Paketdokumente, Abweichungsmanagement |
| **Pilotkunde — Qualifizierungsingenieur** | Durchführung/Mitzeichnung UAT im Nutzungskontext |
| **Pilotkunde — QA** | Kundenseitige Bewertung und Freigabe im eigenen QMS |

> Hinweis Solo-Gründer-Kontext: Bis zur Implementierung technischer SoD werden Rollen organisatorisch getrennt wahrgenommen (Vier-Augen-Prinzip unter Einbindung des Pilotkunden); siehe CSV-RA-2026-001 (R-08) und CSV-VB-2026-001 (OP-02).

## 8. Akzeptanzphilosophie

1. Alle Testfälle mit Prüfpunkt-Tabellen (Pass/Fail) werden dokumentiert durchgeführt; Fails erzeugen Abweichungen (ABW-xxx) mit Root Cause, Korrektur und Retest.
2. Freigabekriterium: keine offene Abweichung mit Kritikalität *Hoch*; offene Punkte nur mit dokumentierten, wirksamen Übergangsmaßnahmen.
3. Für KI-generierte Inhalte gilt: Das System wird als **Entwurfsgenerator** validiert. Akzeptanzmaßstab ist nicht fehlerfreie Autonomie, sondern verlässliche, vollständige, rückführbare Entwürfe bei verpflichtendem Human-in-the-loop-Review (UAT-Schwelle: ≥ 90 % der Prüfpunkte ohne fachliche Korrektur übernehmbar, siehe CSV-UAT-2026-001).
4. Ergebnisstatus wird ausschließlich im Validierungsbericht (CSV-VB-2026-001) zusammengefasst.

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung (Entwurf/Demo) |

*Kordix AI · QualiPilot CSV-Validierungspaket · Demo-Dokument*
