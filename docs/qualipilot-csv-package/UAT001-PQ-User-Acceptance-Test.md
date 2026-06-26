# ✅ PQ / UAT-Protokoll — QualiPilot v1.0 (UAT001 R01)

> **Systemstandard:** Performance Qualification / User Acceptance Test für QualiPilot v1.0 (Kordix AI). Verifiziert, dass das System unter produktionsnahen Bedingungen den Benutzeranforderungen entspricht. Grundlage: GAMP 5, EU GMP Annex 11, URS-001 R01.

---

## Deckblatt

| Feld | Wert |
|---|---|
| Dokument-ID | UAT001 |
| Revision | R01 |
| Status | Draft |
| System | QualiPilot v1.0 (Kordix AI) |
| GAMP-5-Kategorie | Cat 4 (Next.js + Supabase) / Cat 5 (KI-Logik + Traceability Engine) |
| Author | Stefan Billich |
| Datum | 2026-06-24 |
| Referenz-OQ | OQ001 R01 |

**Pre-Approval**

| Funktion | Approved by | Signature | Datum |
|---|---|---|---|
| Author | Stefan Billich | | |
| Document Owner | Stefan Billich | | |
| Quality | Stefan Billich | | |

---

## 1. Introduction

Dieses PQ/UAT-Protokoll verifiziert, dass QualiPilot v1.0 unter produktionsnahen Bedingungen vollständige, GMP-konforme Qualifizierungsdokumente generiert, welche den Benutzeranforderungen (URS-001 R01) entsprechen. Die OQ (OQ001 R01) muss vor diesem Test erfolgreich abgeschlossen sein.

## 2. Scope

**In Scope:** End-to-End IQ-Generierung · End-to-End OQ-Generierung · Rückführbarkeit (Traceability) · GMP-Dokumentenlayout · Performanz unter Last · Regulatorische Abdeckung (Annex 11 + 21 CFR Part 11).

**Out of Scope:** Infrastruktur (→ Vercel IQ); Einzel-Funktionen (→ OQ001 R01).

## 3. Roles and Responsibilities

| Funktion | Name | Verantwortung |
|---|---|---|
| Preparer / Tester | Stefan Billich | Testdurchführung als End-User |
| Reviewer | Stefan Billich | Fachliche Prüfung der Ergebnisse |
| Quality | Stefan Billich | Freigabe |

## 4. Test Environment & Prerequisites

- **URL:** Produktions-URL QualiPilot (Vercel Deployment)
- **Browser:** Chrome (aktuell) + Firefox (aktuell)
- **Testdaten:** Generische GMP-Equipment-Profile (HPLC, Autoklav, Waage, Bioreaktorsystem)
- **Vorbedingung:** OQ001 R01 alle 10 Tests Pass ✓; IQ001 R01 abgeschlossen ✓; Produktionsumgebung aktiv ✓

## 7. Acceptance Criteria

Alle 7 UAT-Testfälle bestanden. Keine offenen Critical- oder High-Deviations. Generierte Dokumente entsprechen fachlichen GMP-Standards.

---

## Test Sections

### UAT-01: End-to-End IQ-Generierung (HPLC-System)

| Feld | Inhalt |
|---|---|
| Test-ID | UAT-01 |
| Anforderung | System generiert vollständiges, GMP-konformes IQ-Protokoll für ein HPLC-System in < 60 s (URS-R04, URS-R05) |
| Vorbedingung | Eingeloggt als Stefan Billich; Produktionsumgebung aktiv |
| Testschritt 1 | DQ-Vorstufe — Equipment Type: „HPLC-System", Manufacturer: „Generic", Intended Use: „Analytische Chromatographie", GMP Area: „QK-Labor", Qualification Type: „IQ" |
| Testschritt 2 | „Analysieren" → GAMP-5-Klassifizierung, URS-Anforderungen und Qualifizierungsstrategie erscheinen |
| Testschritt 3 | „IQ generieren" → Generierungszeit messen |
| Testschritt 4 | IQ-Dokument öffnen — Deckblatt, Sections 1–10, 16 Test Sections, Traceability prüfen |
| Testschritt 5 | Fachliche Prüfung: Testfälle inhaltlich korrekt für HPLC (Kalibrierung, Dokumentation, Spezifikationen) |
| Akzeptanzkriterium | IQ vollständig gemäß IQ001 R01; < 60 s; Inhalte fachlich korrekt; Regulatory References vorhanden (Annex 11, GAMP 5, ICH Q9) |
| Referenz | URS-R01, URS-R04, URS-R05; EU GMP Annex 15 §10 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Generierungszeit (s) | |
| Getestet von / Datum | |

### UAT-02: End-to-End OQ-Generierung (Autoklav)

| Feld | Inhalt |
|---|---|
| Test-ID | UAT-02 |
| Anforderung | System generiert vollständiges OQ-Protokoll mit gerätespezifischen Testfällen in < 60 s (URS-R04) |
| Testschritt 1 | Equipment Type: „Autoklav", Intended Use: „Sterilisation von Laborgeräten", GMP Area: „Produktion", Qualification Type: „OQ" |
| Testschritt 2 | „OQ generieren" → Generierungszeit messen |
| Testschritt 3 | OQ-Dokument prüfen: Testfälle für Temperaturverteilung, Druckprüfung, Haltezeit, Alarm-Tests vorhanden |
| Testschritt 4 | Akzeptanzkriterien prüfen: geräte- und anwendungsspezifisch (z. B. 121°C ± 2°C für 15 min) |
| Akzeptanzkriterium | OQ vollständig; Testfälle gerätespezifisch korrekt; < 60 s; Regulatory References vorhanden |
| Referenz | URS-R04, URS-R05; EU GMP Annex 11 §10 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Generierungszeit (s) | |
| Getestet von / Datum | |

### UAT-03: Traceability-Verifikation

| Feld | Inhalt |
|---|---|
| Test-ID | UAT-03 |
| Anforderung | Jeder Testfall im generierten Dokument ist auf URS-Anforderungen und Regulatory References rückführbar (URS-R06) |
| Testschritt 1 | Generiertes IQ-Dokument aus UAT-01 öffnen |
| Testschritt 2 | Traceability-Matrix (Test Section 16) prüfen — alle Testfälle mit URS-ID verknüpft |
| Testschritt 3 | Stichprobe: 3 Testfälle → zugehörige Regulatory Reference im Dokument verifizieren |
| Akzeptanzkriterium | Mindestens 90% der Testfälle haben eine dokumentierte URS-Referenz; alle Regulatory References korrekt |
| Referenz | URS-R06; GAMP 5 §7.5; EU GMP Annex 11 §4 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Getestet von / Datum | |

### UAT-04: GMP-konformes Dokumentenlayout

| Feld | Inhalt |
|---|---|
| Test-ID | UAT-04 |
| Anforderung | Alle generierten Dokumente folgen GMP-Dokumentenstandards (Deckblatt, Revisionsverlauf, Signaturfelder) (URS-R07) |
| Testschritt 1 | Drei verschiedene Dokumente (IQ, OQ, PQ) öffnen |
| Testschritt 2 | Jedes prüfen auf: Dokumenten-ID, Revision, Status, Deckblatt-Tabelle, Pre-Approval, Final-Approval, Change History |
| Testschritt 3 | PDF-Export jedes Dokuments → Layout in PDF korrekt |
| Akzeptanzkriterium | Alle 7 Layout-Elemente in jedem Dokument vorhanden; PDF-Layout korrekt und druckbar |
| Referenz | URS-R07; EU GMP Annex 11 §8; 21 CFR Part 11 §11.50 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Getestet von / Datum | |

### UAT-05: Performanz unter Last (< 60 Sekunden)

| Feld | Inhalt |
|---|---|
| Test-ID | UAT-05 |
| Anforderung | System generiert vollständiges Qualifizierungsdokument in maximal 60 Sekunden (URS-R09) |
| Testschritt 1 | 5 verschiedene Equipment-Profile nacheinander verarbeiten |
| Testschritt 2 | Generierungszeit für jedes Dokument messen und protokollieren |
| Testschritt 3 | Durchschnitt und Maximum berechnen |
| Akzeptanzkriterium | Alle 5 Generierungen < 60 s; Durchschnitt < 45 s |
| Referenz | URS-R09 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Zeiten (s) | V1: _ / V2: _ / V3: _ / V4: _ / V5: _ — Ø: _ |
| Getestet von / Datum | |

### UAT-06: Multi-Tenant-Datenisolation (Produktionsprüfung)

| Feld | Inhalt |
|---|---|
| Test-ID | UAT-06 |
| Anforderung | Daten verschiedener Kunden/Benutzer sind vollständig isoliert — kein Cross-Tenant-Zugriff (URS-R11) |
| Testschritt 1 | Zwei Testaccounts erstellen (User A, User B) |
| Testschritt 2 | Als User A: Dokument mit spezifischem Inhalt (Marker-Text) erstellen |
| Testschritt 3 | Als User B einloggen → Dokument von User A nicht sichtbar, nicht abrufbar |
| Testschritt 4 | Suche nach Marker-Text als User B → keine Ergebnisse |
| Akzeptanzkriterium | Vollständige Datenisolation; kein Cross-Tenant-Datenleck; Suche ergibt keine fremden Dokumente |
| Referenz | URS-R11; EU GMP Annex 11 §12; DSGVO Art. 32 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Getestet von / Datum | |

### UAT-07: Regulatorische Abdeckung (Annex 11 + 21 CFR Part 11)

| Feld | Inhalt |
|---|---|
| Test-ID | UAT-07 |
| Anforderung | Generierte Dokumente referenzieren alle anwendbaren Regularien korrekt (URS-R03) |
| Testschritt 1 | IQ-Dokument für europäischen GMP-Kontext generieren → Annex 11, Annex 15, GAMP 5 in Referenzen prüfen |
| Testschritt 2 | OQ-Dokument für US FDA-Kontext generieren → 21 CFR Part 11, 21 CFR Part 211 in Referenzen prüfen |
| Testschritt 3 | Alle Testfälle auf spezifische Regulatory References prüfen (nicht nur generische Verweise) |
| Akzeptanzkriterium | Mind. 3 verschiedene Regulatory References pro Dokument; Verweise auf Kapitel-/Paragraphen-Ebene (z. B. Annex 11 §9) |
| Referenz | URS-R03; EU GMP Annex 11; 21 CFR Part 11 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Getestet von / Datum | |

---

## Final Approval

| Funktion | Approved by | Signature | Position | Datum |
|---|---|---|---|---|
| Author | Stefan Billich | | CEO / QP | |
| Document Owner | Stefan Billich | | CEO / QP | |
| Quality | Stefan Billich | | CEO / QP | |

## Change History

| Rev | Datum | Beschreibung | Author |
|---|---|---|---|
| R01 | 2026-06-24 | Erstfassung | Stefan Billich |

---
*Generiert von QualiPilot — a Kordix AI product.*
