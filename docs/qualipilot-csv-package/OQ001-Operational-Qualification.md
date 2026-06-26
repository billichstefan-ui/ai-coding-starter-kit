# 🔬 OQ-Protokoll — QualiPilot v1.0 (OQ001 R01)

> **Systemstandard:** Operational Qualification für QualiPilot v1.0 (Kordix AI). Verifiziert den korrekten Systembetrieb im installierten Umfeld. Grundlage: GAMP 5, EU GMP Annex 11, SDS v1.0.

---

## Deckblatt

| Feld | Wert |
|---|---|
| Dokument-ID | OQ001 |
| Revision | R01 |
| Status | Draft |
| System | QualiPilot v1.0 (Kordix AI) |
| GAMP-5-Kategorie | Cat 4 (Next.js + Supabase) / Cat 5 (KI-Logik + Traceability Engine) |
| Author | Stefan Billich |
| Datum | 2026-06-24 |
| Referenz-SDS | SDS v1.0 |

**Pre-Approval**

| Funktion | Approved by | Signature | Datum |
|---|---|---|---|
| Author | Stefan Billich | | |
| Document Owner | Stefan Billich | | |
| Quality | Stefan Billich | | |

---

## 1. Introduction

QualiPilot ist eine KI-gestützte Webplattform (Kordix AI) zur automatisierten Erstellung von GMP-konformen Qualifizierungsdokumenten. Dieses OQ-Protokoll verifiziert, dass QualiPilot v1.0 im installierten Betriebsumfeld korrekt funktioniert. Grundlage: GAMP 5 (5. Aufl.), EU GMP Annex 11, 21 CFR Part 11, SDS v1.0.

## 2. Scope

**In Scope:** Benutzerauthentifizierung · Equipment-Profil-Eingabe · GAMP-5-Klassifizierung · KI-Dokumentengenerierung · Datenspeicherung · Audit Trail · Export · Fehlerbehandlung.

**Out of Scope:** Inhaltsvalidierung der KI-Ausgaben (→ PQ/UAT); Netzwerkinfrastruktur (→ Vercel IQ).

## 3. Roles and Responsibilities

| Funktion | Name | Verantwortung |
|---|---|---|
| Preparer | Stefan Billich | Testdurchführung, Dokumentation |
| Reviewer | Stefan Billich | Fachliche Prüfung |
| Quality | Stefan Billich | Freigabe |

## 4. Qualification Description

**4.1 System:** QualiPilot v1.0 — Next.js 16, Supabase, Claude AI, Vercel. GAMP-5: Cat 4 (Next.js + Supabase), Cat 5 (KI-Generierungslogik + Traceability Engine). Ref: SDS-01.

**4.2 Methode:** Funktionaler Test jedes Systemmoduls mit definierten Testfällen. Tests sequenziell, Ergebnisse als Pass/Fail + Datum + Initialen.

**4.3 Justification:** OQ für GAMP 5 Cat 4 und Cat 5 verpflichtend (GAMP 5 Appendix M9).

**7. Acceptance Criteria:** Alle 10 OQ-Tests bestanden, keine offenen Critical/High Deviations.

**9. External References:** EU GMP Annex 11 (2011) · GAMP 5 (5. Aufl.) · ICH Q9 · 21 CFR Part 11.

---

## Test Sections

### OQ-01: Benutzerauthentifizierung

| Feld | Inhalt |
|---|---|
| Test-ID | OQ-01 |
| Anforderung | Nur autorisierte Benutzer können auf das System zugreifen (Annex 11 §12) |
| Testschritt 1 | URL aufrufen → Login-Seite erscheint |
| Testschritt 2 | Korrekte Credentials → Zugriff gewährt, Dashboard erscheint |
| Testschritt 3 | Falsche Credentials → Zugriff verweigert, Fehlermeldung |
| Testschritt 4 | Logout → Session beendet, Redirect zu Login |
| Akzeptanzkriterium | Nur autorisierte Benutzer zugelassen; Logout beendet Session vollständig |
| Referenz | Annex 11 §12; 21 CFR Part 11 §11.10(d) |
| Ergebnis | ☐ Pass  ☐ Fail |
| Getestet von / Datum | |

### OQ-02: Equipment-Profil Dateneingabe (5 Felder)

| Feld | Inhalt |
|---|---|
| Test-ID | OQ-02 |
| Anforderung | System akzeptiert alle 5 Pflichtfelder (SDS-03, URS-R01) |
| Testschritt 1 | DQ-Vorstufe aufrufen → Eingabemaske mit 5 Feldern erscheint |
| Testschritt 2 | Alle 5 Felder ausfüllen (Equipment Type, Manufacturer, Intended Use, GMP Area, Qualification Type) |
| Testschritt 3 | Analysieren klicken → keine Fehler |
| Testschritt 4 | Formular ohne Pflichtfeld → Validierungsfehler erscheint |
| Akzeptanzkriterium | Alle 5 Felder akzeptiert; fehlende Pflichtfelder lösen Fehler aus |
| Referenz | URS-R01; EU GMP Annex 15 §3.4 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Getestet von / Datum | |

### OQ-03: GAMP-5-Klassifizierung (automatisch)

| Feld | Inhalt |
|---|---|
| Test-ID | OQ-03 |
| Anforderung | System leitet GAMP-5-Kategorie automatisch ab (SDS-18, IQ-24) |
| Testschritt 1 | Equipment-Profil für Software-System eingeben |
| Testschritt 2 | Analyse starten → GAMP-5-Kategorie erscheint (Cat 4 oder Cat 5) |
| Testschritt 3 | Begründung prüfen — Verweis auf GAMP 5 Table 4 |
| Akzeptanzkriterium | Klassifizierung korrekt; Begründung mit Referenz vorhanden |
| Referenz | GAMP 5 Table 4; SDS-18 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Getestet von / Datum | |

### OQ-04: IQ-Dokument-Generierung

| Feld | Inhalt |
|---|---|
| Test-ID | OQ-04 |
| Anforderung | System generiert vollständiges IQ-Protokoll nach Vorlage IQ001 R01 in < 60 s (SDS-07) |
| Testschritt 1 | Equipment-Profil eingeben |
| Testschritt 2 | IQ generieren → Generierung startet |
| Testschritt 3 | Generierungszeit messen |
| Testschritt 4 | Dokument prüfen: alle 10 Abschnitte + 16 Test Sections vorhanden |
| Akzeptanzkriterium | IQ vollständig gemäß IQ001 R01; < 60 s; fachlich korrekt |
| Referenz | SDS-07; URS-R04; EU GMP Annex 15 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Generierungszeit (s) | |
| Getestet von / Datum | |

### OQ-05: OQ-Dokument-Generierung

| Feld | Inhalt |
|---|---|
| Test-ID | OQ-05 |
| Anforderung | System generiert vollständiges OQ-Protokoll mit Testfällen in < 60 s (SDS-08) |
| Testschritt 1 | Equipment-Profil wiederverwenden |
| Testschritt 2 | OQ generieren → Generierung startet |
| Testschritt 3 | Generierungszeit messen |
| Testschritt 4 | Testfälle, Akzeptanzkriterien, Regulatory References prüfen |
| Akzeptanzkriterium | OQ vollständig; < 60 s; rückführbare Testfälle vorhanden |
| Referenz | SDS-08; URS-R04; EU GMP Annex 11 §10 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Generierungszeit (s) | |
| Getestet von / Datum | |

### OQ-06: Dokumentenspeicherung & Abruf

| Feld | Inhalt |
|---|---|
| Test-ID | OQ-06 |
| Anforderung | Generierte Dokumente persistent gespeichert und abrufbar (Annex 11 §8) |
| Testschritt 1 | Dokument generieren → Speichern |
| Testschritt 2 | Ausloggen → wieder einloggen |
| Testschritt 3 | Dokumentenliste → gespeichertes Dokument erscheint |
| Testschritt 4 | Dokument öffnen → Inhalt vollständig und unverändert |
| Akzeptanzkriterium | Dokument nach Re-Login vollständig und unverändert abrufbar |
| Referenz | EU GMP Annex 11 §8; ALCOA+ (Enduring, Available) |
| Ergebnis | ☐ Pass  ☐ Fail |
| Getestet von / Datum | |

### OQ-07: Audit Trail (ALCOA+)

| Feld | Inhalt |
|---|---|
| Test-ID | OQ-07 |
| Anforderung | Alle Aktionen mit Zeitstempel, User-ID, Aktionstyp protokolliert (Annex 11 §9) |
| Testschritt 1 | Als Testuser einloggen und Dokument generieren |
| Testschritt 2 | Audit-Log aufrufen → Eintrag für Generierungsaktion vorhanden |
| Testschritt 3 | Zeitstempel (UTC), User-ID, Aktionstyp prüfen |
| Testschritt 4 | Dokument bearbeiten → weiterer Eintrag, nicht löschbar |
| Akzeptanzkriterium | Jede Aktion im Audit-Log mit UTC-Zeitstempel, User-ID, Typ |
| Referenz | EU GMP Annex 11 §9; 21 CFR Part 11 §11.10(e); ALCOA+ |
| Ergebnis | ☐ Pass  ☐ Fail |
| Getestet von / Datum | |

### OQ-08: Rollenbasierte Zugriffskontrolle (RBAC)

| Feld | Inhalt |
|---|---|
| Test-ID | OQ-08 |
| Anforderung | Multi-Tenant-Isolation: Benutzer sehen nur eigene Dokumente (SDS-12) |
| Testschritt 1 | Als User A einloggen → Dokument A generieren |
| Testschritt 2 | Als User B einloggen → Dokument A nicht sichtbar |
| Testschritt 3 | Direktzugriff auf URL von Dokument A als User B → HTTP 403 |
| Akzeptanzkriterium | Strikte Datenisolation; kein Cross-User-Datenzugriff möglich |
| Referenz | EU GMP Annex 11 §12; 21 CFR Part 11 §11.10(d) |
| Ergebnis | ☐ Pass  ☐ Fail |
| Getestet von / Datum | |

### OQ-09: PDF-Export

| Feld | Inhalt |
|---|---|
| Test-ID | OQ-09 |
| Anforderung | System exportiert Dokumente als GMP-konformes PDF (SDS-09, URS-R08) |
| Testschritt 1 | Bestehendes Dokument öffnen → Export klicken |
| Testschritt 2 | Format PDF → Download startet |
| Testschritt 3 | PDF öffnen → Inhalt vollständig, GMP-Layout korrekt |
| Akzeptanzkriterium | PDF vollständig, lesbar, GMP-Layout korrekt (Deckblatt, Signaturfelder) |
| Referenz | URS-R08; EU GMP Annex 11 §17 |
| Ergebnis | ☐ Pass  ☐ Fail |
| Getestet von / Datum | |

### OQ-10: Fehlerbehandlung (AI-Timeout)

| Feld | Inhalt |
|---|---|
| Test-ID | OQ-10 |
| Anforderung | System behandelt AI-Fehler gracefully ohne Datenverlust (SDS-15, URS-R10) |
| Testschritt 1 | AI-Generierung starten |
| Testschritt 2 | Netzwerkverbindung unterbrechen oder Timeout simulieren |
| Testschritt 3 | Fehlermeldung prüfen: klar, kein Stack-Trace sichtbar |
| Testschritt 4 | Erneuter Versuch → Generierung startet normal |
| Akzeptanzkriterium | Fehlermeldung (kein Stack-Trace); kein Datenverlust; Retry möglich |
| Referenz | URS-R10; EU GMP Annex 11 §16 |
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
