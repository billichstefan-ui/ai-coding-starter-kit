# User Requirements Specification (URS) — HPLC-System Agilent 1260 Infinity II

| Feld | Wert |
|---|---|
| Dokument-ID | URS-2026-001 |
| Revision | R01 |
| Status | Demo / Entwurf |
| Author | QualiPilot |
| Datum | [DATUM] |
| Betreiber | Musterpharma GmbH, QC-Labor |
| Referenzen | VP-2026-001; EU GMP Annex 15; GAMP 5 (2nd Ed.); 21 CFR Part 11 / EU Annex 11 |

---

## 1 Introduction

Diese User Requirements Specification definiert die Anforderungen des QC-Labors der Musterpharma GmbH an ein HPLC-System mit Chromatographie-Datensystem (CDS) für die quantitative Analytik von Wirkstoffen, Fertigprodukten und Stabilitätsmustern im GMP-Umfeld. Vorgesehenes System: Agilent 1260 Infinity II (G7111B, G7129A, G7116A, G7115A) mit CDS (GAMP-5-Kategorie 4).

## 2 Scope

Die URS umfasst funktionale Anforderungen, Leistungsanforderungen, Compliance-/Datenintegritätsanforderungen, IT-/Softwareanforderungen sowie Anforderungen an Wartung und Kalibrierung. Analytische Methoden sind nicht Bestandteil dieser URS.

## 3 Kritikalitätsdefinition

| Kritikalität | Definition |
|---|---|
| **kritisch** | Direkter Einfluss auf Produktqualität, Patientensicherheit oder Datenintegrität; Nichterfüllung = K.-o.-Kriterium |
| **hoch** | Wesentlicher Einfluss auf Ergebnisqualität oder GMP-Konformität |
| **mittel** | Einfluss auf Effizienz, Bedienbarkeit oder Betriebssicherheit; Workarounds möglich |

## 4 Anforderungen

### 4.1 Funktionale Anforderungen

| URS-ID | Anforderung | Kritikalität |
|---|---|---|
| URS-001 | Das System muss eine quaternäre Niederdruck-Gradientenpumpe mit vier unabhängig wählbaren Lösungsmittelkanälen (A–D) bereitstellen. | kritisch |
| URS-002 | Die Flussrate muss im Bereich 0,2–5,0 mL/min einstellbar sein (Arbeitsbereich des Labors: 0,5–2,0 mL/min). | kritisch |
| URS-003 | Der Autosampler muss mindestens 100 Vial-Positionen (2-mL-Vials) bieten und Injektionsvolumina von 0,1–100 µL ermöglichen. | hoch |
| URS-004 | Der Säulenthermostat muss Säulentemperaturen im Bereich +5 °C bis +80 °C regeln können und mindestens eine Säule mit 30 cm Länge aufnehmen. | hoch |
| URS-005 | Der Detektor muss ein Dioden-Array-Detektor (DAD) mit einem Wellenlängenbereich von mindestens 190–640 nm sein und Spektrenaufnahme ermöglichen. | kritisch |
| URS-006 | Das CDS muss die vollständige Steuerung aller Module, die Datenaufnahme und die Auswertung (Integration, Quantifizierung, Reporting) ermöglichen. | kritisch |
| URS-007 | Der Autosampler muss über eine Nadelwaschfunktion zur Minimierung von Verschleppung (Carryover) verfügen. | hoch |
| URS-008 | Die Pumpe muss über eine integrierte Lösungsmittelentgasung (Degasser) verfügen. | mittel |
| URS-009 | Alle Module müssen über eine Leckerkennung mit automatischer Abschaltung des Flusses verfügen. | hoch |
| URS-010 | Das CDS muss Systemeignungstests (SST) mit automatischer Bewertung gegen definierte Grenzwerte (z. B. Tailing, Bodenzahl, RSD) unterstützen. | hoch |

### 4.2 Leistungsanforderungen

| URS-ID | Anforderung | Kritikalität |
|---|---|---|
| URS-011 | Die Flussgenauigkeit muss ±1 % vom Sollwert betragen (bei 1,0 mL/min, isokratisch). | kritisch |
| URS-012 | Die Gradientenzusammensetzung muss auf ±1 % absolut genau sein (Stufengradient, Kanalpaarweise geprüft). | kritisch |
| URS-013 | Die Injektionspräzision muss eine RSD ≤ 0,5 % der Peakflächen erreichen (6 Injektionen, 5 µL). | kritisch |
| URS-014 | Die Wellenlängengenauigkeit des DAD muss ±1 nm betragen. | kritisch |
| URS-015 | Detektorrauschen ≤ ±1×10⁻⁵ AU (Peak-to-Peak, 254 nm) und Drift ≤ 1×10⁻³ AU/h nach Äquilibrierung. | hoch |
| URS-016 | Die Temperaturgenauigkeit des Säulenthermostaten muss ±0,8 °C und die Stabilität ±0,1 °C betragen (bei 40 °C). | hoch |

### 4.3 Compliance / Datenintegrität

| URS-ID | Anforderung | Kritikalität |
|---|---|---|
| URS-017 | Das CDS muss einen manipulationssicheren, vollständigen Audit Trail führen (wer, was, wann, warum), der durch Anwender nicht deaktivierbar oder veränderbar ist (21 CFR Part 11 / EU Annex 11). | kritisch |
| URS-018 | Das CDS muss individuelle Benutzerkonten mit rollenbasiertem Berechtigungskonzept (mind. Administrator, Labormanager, Analyst) erzwingen; keine Sammelkonten. | kritisch |
| URS-019 | Das CDS muss elektronische Signaturen konform zu 21 CFR Part 11 unterstützen (zweikomponentig, mit Bedeutung der Signatur, dauerhaft mit dem Datensatz verknüpft). | kritisch |
| URS-020 | Alle elektronischen Rohdaten müssen regelmäßig gesichert werden; Backup und Restore müssen verifizierbar sein. | kritisch |
| URS-021 | Alle Zeitstempel müssen aus einer synchronisierten, für Anwender nicht änderbaren Systemzeit stammen. | hoch |
| URS-022 | Rohdaten (Chromatogramme, Metadaten, Injektionsdaten) müssen unveränderlich gespeichert werden; Löschen/Überschreiben durch Analystenrollen muss technisch unterbunden sein. Neuintegrationen müssen versioniert nachvollziehbar sein. | kritisch |

### 4.4 IT / Software

| URS-ID | Anforderung | Kritikalität |
|---|---|---|
| URS-023 | Das CDS ist als GAMP-5-Kategorie-4-System zu behandeln; der Softwarelieferant muss anhand einer Lieferantenbewertung als geeignet eingestuft sein. | hoch |
| URS-024 | Das CDS muss auf einer vom Betreiber freigegebenen Workstation-Konfiguration (Betriebssystem, Hardware-Mindestanforderungen) lauffähig sein. | mittel |
| URS-025 | Das System muss die Ablage der Messdaten auf einem gesicherten Netzwerkspeicher/Server unterstützen. | mittel |
| URS-026 | Nach Stromausfall muss das System ohne Verlust bereits gespeicherter Daten wieder anlaufen; eine laufende Sequenz muss definiert abbrechen und der Zustand nachvollziehbar sein. | hoch |

### 4.5 Wartung / Kalibrierung

| URS-ID | Anforderung | Kritikalität |
|---|---|---|
| URS-027 | Für das System müssen ein präventiver Wartungsplan (PM) des Herstellers sowie Ersatzteil- und Serviceverfügbarkeit für mind. 10 Jahre bestehen. | mittel |
| URS-028 | Alle qualifizierungsrelevanten Messmittel (Waage, Thermometer, Messkolben etc.) und Referenzstandards müssen rückführbar kalibriert bzw. zertifiziert sein. | hoch |
| URS-029 | Das System soll verschleißbezogene Zähler (z. B. Injektionszähler, Pumpenkolbenhübe, Lampenbrenndauer) zur Wartungsplanung bereitstellen (Early Maintenance Feedback). | mittel |

## 5 Zusammenfassung

| Kategorie | Anzahl | davon kritisch |
|---|---|---|
| Funktional (URS-001–010) | 10 | 3 |
| Leistung (URS-011–016) | 6 | 4 |
| Compliance/Datenintegrität (URS-017–022) | 6 | 5 |
| IT/Software (URS-023–026) | 4 | 0 |
| Wartung/Kalibrierung (URS-027–029) | 3 | 0 |
| **Gesamt** | **29** | **12** |

Jede Anforderung wird über die Traceability-Matrix TM-2026-001 einem Risiko (RA-2026-001) und mindestens einem Prüfpunkt in DQ/IQ/OQ/PQ zugeordnet.

---

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | QualiPilot | Ersterstellung (Demo) |

*Generiert von QualiPilot — a Kordix AI product · Demo-Dokument*
