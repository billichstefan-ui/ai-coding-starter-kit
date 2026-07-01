# Installation Qualification (IQ) — HPLC-System Agilent 1260 Infinity II

## Deckblatt

| Feld | Wert |
|---|---|
| Dokument-ID | IQ-2026-001 |
| Vorlage | QualiPilot-Standard-Vorlage IQ001 R01 |
| Revision | R01 |
| Status | Demo / Entwurf |
| Author | QualiPilot |
| Datum | [DATUM] |
| Betreiber | Musterpharma GmbH, QC-Labor |
| System | Agilent 1260 Infinity II (G7111B, G7129A, G7116A, G7115A) mit CDS |

### Pre-Approval

*Mit der Unterschrift wird das Protokoll zur Ausführung freigegeben (vor Testbeginn).*

| Rolle | Approved by | Signature | Position | Date |
|---|---|---|---|---|
| Author | [NAME] | | | [DATUM] |
| Document Owner | [NAME] | | | [DATUM] |
| Quality | [NAME] | | | [DATUM] |

### Final Approval

*Mit der Unterschrift werden die Ergebnisse dieses Protokolls genehmigt (nach Testabschluss).*

| Rolle | Approved by | Signature | Position | Date |
|---|---|---|---|---|
| Author | [NAME] | | | [DATUM] |
| Document Owner | [NAME] | | | [DATUM] |
| Quality | [NAME] | | | [DATUM] |

---

## 1 Introduction

Dieses Protokoll dokumentiert die Installation Qualification des HPLC-Systems Agilent 1260 Infinity II mit Chromatographie-Datensystem (CDS) im QC-Labor der Musterpharma GmbH. Die IQ weist nach, dass das System vollständig, unbeschädigt und gemäß Herstellerspezifikation und genehmigtem Design (DQ-2026-001) installiert wurde. Grundlage: EU GMP Annex 15, GAMP 5 (2nd Ed.), Qualifizierungsplan VP-2026-001.

## 2 Scope

Eingeschlossen: alle vier Gerätemodule inkl. Fluidik und Verkabelung, CDS-Workstation (Hardware und Software), Anbindung an Laborversorgung (Strom/USV, Abluft, Lösungsmittel-/Abfallmanagement) sowie Prüfung der Kalibrier- und Wartungsvoraussetzungen. Ausgeschlossen: Funktions- und Leistungstests (OQ-2026-001, PQ-2026-001), Methodenvalidierung.

## 3 Roles and Responsibilities

| Rolle | Verantwortung in diesem Protokoll |
|---|---|
| Author | Erstellung des Protokolls, Koordination und Dokumentation der Prüfungen |
| Document Owner | Fachliche Freigabe, Bereitstellung von Systeminformationen, Bewertung von Befunden |
| Quality | Pre-/Final Approval, Bewertung von Abweichungen (Section 13) |
| Lieferant/Servicetechniker | Physische Installation, Herstellerdokumentation, Unterstützung bei Prüfungen |
| IT | Bereitstellung Workstation, Netzwerkanbindung, Benutzerkontenanlage |

## 4 Qualification Description

### 4.1 Equipment/System Description

| Modul | Typ | Modell-Nr. | Serien-Nr. |
|---|---|---|---|
| Quaternäre Pumpe | Quaternary Pump | G7111B | [SERIENNR.] |
| Autosampler | Vialsampler | G7129A | [SERIENNR.] |
| Säulenthermostat | Multicolumn Thermostat | G7116A | [SERIENNR.] |
| Detektor | Diode Array Detector WR | G7115A | [SERIENNR.] |
| CDS-Workstation | PC + Chromatographie-Datensystem (GAMP-5-Kat. 4) | [MODELL] | [SERIENNR.] |

Aufstellort: Musterpharma GmbH, QC-Labor, Raum [RAUM-NR.].

### 4.2 Qualification Method

Die Prüfung erfolgt anhand vordefinierter Prüfpunkte (Test Sections 2–12) mit dokumentierten Akzeptanzkriterien. Jeder Prüfpunkt wird durch geschultes Personal ausgeführt, mit Pass/Fail bewertet und mit Datum/Kürzel gezeichnet. Nachweise (Zertifikate, Screenshots, Lieferscheine) werden als Attachments (Section 16) beigefügt.

### 4.3 Justifications

- Umfang und Tiefe der Prüfpunkte sind risikobasiert aus RA-2026-001 abgeleitet (insb. RA-10, RA-11, RA-12, RA-14).
- Herstellerseitige Installationsprotokolle werden genutzt und referenziert, sofern sie den Anforderungen dieses Protokolls genügen (GAMP 5: Leverage Supplier Documentation).
- Nicht zutreffende Test Sections werden mit „N/A" und Begründung geschlossen, nicht entfernt.

### 4.4 Test Section Details

Die Prüfpunkte sind den Test Sections 2–12 zugeordnet (siehe unten). Test-ID-Systematik: IQ-T01 bis IQ-T18. Jede Tabelle enthält: Test ID · Prüfpunkt/Anforderung · Akzeptanzkriterium · Ergebnis · Durchgeführt von/Datum · Referenz (URS-/RA-ID).

## 5 Qualification Instructions

### 5.1 Data Collection

Ergebnisse werden unmittelbar, dauerhaft und nachvollziehbar im Protokoll dokumentiert (Kugelschreiber bzw. validiertes elektronisches System). Korrekturen: einfache Durchstreichung, Kürzel, Datum, Begründung. Rohdatennachweise erhalten eine Attachment-Nr. und werden in Section 16 gelistet.

### 5.2 Interim Progression

Nach Abschluss aller Test Sections und Bewertung aller Abweichungen kann der Fortschritt zur OQ über Section 14 (Handover/Progression Approval) freigegeben werden, sofern keine offenen Critical/Major-Abweichungen bestehen.

### 5.3 Final Disposition

Das Protokoll wird über Section 15 (Final Approval) geschlossen. Ergebnisstatus: „Bestanden", „Bestanden mit Auflagen" (dokumentierte Maßnahmen) oder „Nicht bestanden".

## 6 Deviations and Deficiencies

Jede Abweichung von Akzeptanzkriterien oder Protokollanweisungen wird als Validation Exception Report (VER) in Test Section 13 erfasst: fortlaufende Nr. (VER-IQ-01ff.), Beschreibung, Bewertung (Minor/Major/Critical), Maßnahme, Abschluss durch Quality. Offene Critical/Major-VERs blockieren die Progression (Section 14).

## 7 Protocol Approval Requirements

- **Pre-Approval** durch Author, Document Owner und Quality vor Beginn der Testdurchführung.
- **Final Approval** durch dieselben Rollen nach Abschluss aller Test Sections und Schließung aller VERs.
- Änderungen am genehmigten Protokoll nur über dokumentierte Protokolländerung mit erneuter Genehmigung.

## 8 Internal References

| Dokument-ID | Titel |
|---|---|
| VP-2026-001 | Qualifizierungsplan |
| URS-2026-001 | User Requirements Specification |
| RA-2026-001 | Risikoanalyse (FMEA) |
| DQ-2026-001 | Design Qualification |
| TM-2026-001 | Traceability-Matrix |
| SOP-QS-004 | Abweichungsmanagement (Standort-SOP, fiktiv) |

## 9 External References

| Referenz | Titel |
|---|---|
| EU GMP Annex 15 | Qualification and Validation |
| GAMP 5 (2nd Ed.) | A Risk-Based Approach to Compliant GxP Computerized Systems |
| 21 CFR Part 11 / EU Annex 11 | Electronic Records; Electronic Signatures / Computerised Systems |
| 21 CFR Part 211 | cGMP for Finished Pharmaceuticals |
| Agilent Site Preparation Guide 1260 Infinity II | Installationsvoraussetzungen des Herstellers |

## 10 Terms/Abbreviations

| Begriff | Bedeutung |
|---|---|
| CDS | Chromatographie-Datensystem |
| DAD | Dioden-Array-Detektor |
| IQ/OQ/PQ | Installation/Operational/Performance Qualification |
| PM | Preventive Maintenance |
| URS | User Requirements Specification |
| USV | Unterbrechungsfreie Stromversorgung |
| VER | Validation Exception Report |

---

## Test Section 1 — Signature Register [Mandatory]

*Alle Personen, die in diesem Protokoll Prüfungen ausführen oder prüfen, registrieren hier Unterschrift und Kürzel.*

| Name | Kürzel | Signature | Position/Firma | Date |
|---|---|---|---|---|
| [NAME] | | | | [DATUM] |
| [NAME] | | | | [DATUM] |
| [NAME] | | | | [DATUM] |

## Test Section 2 — Drawings

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| IQ-T01 | Aufstellungsplan und Fluidik-/Verrohrungsschema liegen vor und entsprechen der tatsächlichen Installation | Zeichnungen vorhanden, als „as built" verifiziert, Attachment-Nr. vergeben | ☐ Pass ☐ Fail | [NAME] / [DATUM] | RA-11 |

## Test Section 3 — Documentation

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| IQ-T02 | Herstellerdokumentation vollständig (Benutzerhandbücher aller Module, CDS-Dokumentation, Site Preparation Guide) | Alle Dokumente vorhanden, Versionsstand erfasst | ☐ Pass ☐ Fail | [NAME] / [DATUM] | RA-11 |
| IQ-T03 | Konformitätserklärungen und Werkszertifikate (Declaration of Conformity) je Modul vorhanden | Zertifikate für G7111B, G7129A, G7116A, G7115A vorhanden, Seriennummern stimmen überein | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-028, RA-14 |

## Test Section 4 — Architectural and Functional Components

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| IQ-T04 | Identität und Unversehrtheit aller Module: Modell- und Seriennummern gegen Lieferschein/Bestellung geprüft, keine Transportschäden | 4/4 Module korrekt und unbeschädigt; Seriennummern in 4.1 dokumentiert | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-001–005, RA-11 |
| IQ-T05 | Aufstellort und Umgebungsbedingungen: Raumtemperatur 15–30 °C, ausreichende Stellfläche/Belüftung gemäß Site Preparation Guide | Bedingungen innerhalb Herstellervorgaben, dokumentiert | ☐ Pass ☐ Fail | [NAME] / [DATUM] | RA-11 |

## Test Section 5 — Mechanical Components

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| IQ-T06 | Fluidische Verbindungen (Kapillaren, Lösungsmittelleitungen, Abfallleitung) gemäß Fluidikschema installiert | Verbindungsführung entspricht Schema (IQ-T01), korrekte Kapillar-Innendurchmesser | ☐ Pass ☐ Fail | [NAME] / [DATUM] | RA-11 |
| IQ-T07 | Dichtheitsprüfung des Fluidikpfads bei Betriebsdruck (Spülung mit Wasser/Methanol) | Keine sichtbaren Leckagen; Leckerkennungssystem funktionsbereit | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-009, RA-11 |

## Test Section 6 — Electrical and Instrumentation Components

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| IQ-T08 | Spannungsversorgung: Netzspannung/Frequenz am Aufstellort innerhalb Herstellerspezifikation (100–240 V, 50/60 Hz) | Gemessene Werte innerhalb Spezifikation, dokumentiert | ☐ Pass ☐ Fail | [NAME] / [DATUM] | RA-11 |
| IQ-T09 | Modulverkabelung: Netzkabel, CAN-Bus-/LAN-Verbindungen gemäß Herstellervorgabe angeschlossen; alle Module werden vom CDS erkannt | Alle Module im CDS-Gerätestatus „online" | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-006, RA-11 |

## Test Section 7 — Computer Hardware Components

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| IQ-T10 | CDS-Workstation entspricht den freigegebenen Mindestanforderungen (CPU, RAM, Festplatte, OS-Version); Inventarnummer erfasst | Ist-Konfiguration ≥ Sollkonfiguration; dokumentiert | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-024, RA-12 |

## Test Section 8 — Computer Software Components

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| IQ-T11 | CDS-Software: installierte Version/Build entspricht der freigegebenen Version; Grundkonfiguration (Benutzerrollen, Audit Trail aktiviert, Datenablagepfad) gemäß Konfigurationsspezifikation | Version identisch mit Freigabe; Konfigurations-Checkliste vollständig bestätigt | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-017, URS-018, URS-023, RA-08, RA-09, RA-12 |
| IQ-T12 | Firmware-Versionen aller vier Module erfasst und mit CDS-Version kompatibel (Hersteller-Kompatibilitätsmatrix) | Alle Firmware-Versionen dokumentiert und als kompatibel bestätigt | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-023, RA-12 |
| IQ-T13 | Softwarelizenz(en) vorhanden, registriert und dem System zugeordnet | Lizenznachweis als Attachment abgelegt | ☐ Pass ☐ Fail | [NAME] / [DATUM] | RA-12 |

## Test Section 9 — Plant Services

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| IQ-T14 | Stromversorgung über USV bzw. abgesicherten Stromkreis; Netzwerkdose/Serverpfad für Datenablage verfügbar | USV funktionsbereit (Testlauf), Netzwerkanbindung aktiv | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-025, URS-026, RA-10 |
| IQ-T15 | Lösungsmittel- und Abfallmanagement: Lösungsmittelflaschen-Aufnahme, Abfallbehälter mit ausreichendem Volumen, Abluft am Arbeitsplatz gemäß Laboranforderung | Einrichtung vollständig und normgerecht | ☐ Pass ☐ Fail | [NAME] / [DATUM] | RA-11 |

## Test Section 10 — Product Contact Chemicals

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| IQ-T16 | Materialkompatibilität der medienberührten Teile (Edelstahl, PEEK, PTFE, Quarz) mit den vorgesehenen Eluenten (Wasser, Acetonitril, Methanol, Phosphatpuffer pH 2–8) | Herstellerangaben bestätigen Kompatibilität; keine unzulässigen Medien vorgesehen | ☐ Pass ☐ Fail | [NAME] / [DATUM] | RA-11 |

## Test Section 11 — Instrument Calibration

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| IQ-T17 | Für die OQ/PQ eingesetzte Messmittel (Analysenwaage, Referenzthermometer, Stoppuhr/Waage für Flussmessung) und Referenzsubstanzen sind rückführbar kalibriert/zertifiziert und innerhalb der Gültigkeit | Kalibrierzertifikate vorhanden, gültig, rückführbar (Attachment) | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-028, RA-14 |

## Test Section 12 — Preventive Maintenance

| Test ID | Prüfpunkt / Anforderung | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| IQ-T18 | System im Wartungsprogramm des Standorts angelegt: PM-Plan (jährlich), Requalifizierungsintervall, Early-Maintenance-Feedback-Zähler aktiviert | Eintrag im Wartungssystem vorhanden; EMF-Zähler konfiguriert | ☐ Pass ☐ Fail | [NAME] / [DATUM] | URS-027, URS-029 |

## Test Section 13 — Validation Exception Reports [Mandatory]

*Erfassung aller Abweichungen während der IQ-Durchführung. „Keine" eintragen, falls keine Abweichungen auftraten.*

| VER-Nr. | Bezug (Test ID) | Beschreibung | Klassifizierung | Maßnahme | Geschlossen von / Datum |
|---|---|---|---|---|---|
| VER-IQ-__ | | | ☐ Minor ☐ Major ☐ Critical | | [NAME] / [DATUM] |

## Test Section 14 — Handover/Progression Approval [Mandatory]

*Freigabe zum Übergang in die OQ. Voraussetzung: alle Test Sections abgeschlossen, keine offenen Critical/Major-VERs.*

| Rolle | Approved by | Signature | Position | Date |
|---|---|---|---|---|
| Author | [NAME] | | | [DATUM] |
| Document Owner | [NAME] | | | [DATUM] |
| Quality | [NAME] | | | [DATUM] |

## Test Section 15 — Final Approval [Mandatory]

*Abschließende Genehmigung der IQ-Ergebnisse.*

> **Hinweis:** Die Genehmigung kann per handschriftlicher Unterschrift oder per **elektronischer Signatur gemäß 21 CFR Part 11 / EU Annex 11** erfolgen. Elektronische Signaturen müssen zweikomponentig sein und die Bedeutung der Signatur (Approval) dauerhaft mit dem Datensatz verknüpfen.

| Rolle | Approved by | Signature | Position | Date |
|---|---|---|---|---|
| Author | [NAME] | | | [DATUM] |
| Document Owner | [NAME] | | | [DATUM] |
| Quality | [NAME] | | | [DATUM] |

## Test Section 16 — Attachments [Mandatory]

| Attachment-Nr. | Beschreibung |
|---|---|
| ATT-IQ-01 | Lieferscheine und Bestellabgleich |
| ATT-IQ-02 | Konformitätserklärungen/Werkszertifikate (4 Module) |
| ATT-IQ-03 | Software-/Firmware-Versionsnachweise (Screenshots) |
| ATT-IQ-04 | Kalibrierzertifikate der eingesetzten Messmittel |
| ATT-IQ-05 | **Verweis: Traceability-Matrix TM-2026-001** (Zuordnung URS ↔ RA ↔ IQ-Prüfpunkte) |

---

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | QualiPilot | Ersterstellung nach QualiPilot-Standard-Vorlage IQ001 R01 (Demo) |

*Generiert von QualiPilot — a Kordix AI product · Demo-Dokument*
