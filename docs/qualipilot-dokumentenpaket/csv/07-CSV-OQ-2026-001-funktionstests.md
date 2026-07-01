# Funktionstests (OQ) — QualiPilot v1.0 (MVP)

| Feld | Wert |
|---|---|
| **Dokument-ID** | CSV-OQ-2026-001 |
| **Revision** | R01 |
| **Status** | Entwurf / Demo |
| **Author** | Kordix AI |
| **Datum** | [DATUM] |
| **System** | QualiPilot v1.0 [MVP] |
| **Referenzen** | CSV-FS-2026-001, CSV-RA-2026-001, CSV-IQ-2026-001, CSV-TM-2026-001 |

## 1. Zweck und Voraussetzungen

Die OQ verifiziert die Funktionen der Funktionsspezifikation (CSV-FS-2026-001) gegen definierte Akzeptanzkriterien. Testumfang risikobasiert abgeleitet aus CSV-RA-2026-001.

**Voraussetzungen:**
- IQ (CSV-IQ-2026-001) abgeschlossen und freigegeben
- Referenz-Testdaten verfügbar: **Referenz-Equipment-Profil „Agilent 1260 HPLC"** (vollständig ausgefülltes Profil, hinterlegt als Testdatensatz TD-01) sowie **Referenz-Raumprofil Temperaturmapping** (10 Raumparameter, TD-02); Soll-Ergebnisdefinitionen in DEV-TS-2026-001
- Durchführung in der Prod-äquivalenten Umgebung (dedizierte Instanz), nicht mit Echtdaten des Kunden

**Ergebniskonvention:** Pass/Fail je Prüfpunkt; Fail → Abweichung ABW-xxx mit Root Cause, Korrektur, Retest. Zusammenfassung nur im Validierungsbericht (CSV-VB-2026-001).

> **Hinweis zu nicht-deterministischen Ausgaben:** LLM-generierte Inhalte variieren zwischen Läufen. Akzeptanzkriterien sind daher struktur- und regelbasiert formuliert (Vollständigkeit, Vorlagen-Treue, Rückführbarkeit, Prüfschicht-Verhalten), nicht als Wortlaut-Vergleich. Fachliche Inhaltsqualität wird zusätzlich im UAT bewertet (CSV-UAT-2026-001).

## 2. Testfälle

### 2.1 Generierungstests

| Test ID | Prüfpunkt | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| COQ-T01 | IQ-Protokoll-Generierung: aus Referenzprofil „Agilent 1260 HPLC" (TD-01) ein IQ-Protokoll generieren | Dokument vollständig (keine Trunkierung, kein leerer Abschnitt); Struktur exakt IQ001 R01 mit **allen 16 Test Sections** in korrekter Reihenfolge/Benennung; Prüfpunkte als ausfüllbare Test-Tabellen; Profildaten (Hersteller, Modell) korrekt übernommen | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-003, F-006; U-004, U-012, U-014; R-01, R-06 |
| COQ-T02 | OQ-Protokoll-Generierung: aus TD-01 ein OQ-Protokoll generieren | Dokument vollständig; enthält funktionsbezogene, prüffähige Testpunkte mit messbaren Akzeptanzkriterien; Prüfschicht-Freigabe protokolliert | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-003; U-005 |
| COQ-T03 | PQ-Protokoll-Generierung: aus TD-01 ein PQ-Protokoll generieren | Dokument vollständig; nutzungs-/prozessbezogene Testpunkte vorhanden und prüffähig | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-003; U-006 |
| COQ-T04 | Temperaturmapping-Assistent: aus Referenz-Raumprofil (TD-02, 10 Raumparameter) Prüfplan generieren; Generierungszeit messen | Vollständiger, GMP-konformer Prüfplan-Entwurf; alle 10 Raumparameter im Plan adressiert; Generierungszeit ≤ 120 s | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-001, F-003; U-008, U-030 |
| COQ-T05 | DQ-Vorstufe / URS-Ableitung: aus TD-01 DQ-Vorstufe und URS-Entwurf ableiten | Jede abgeleitete Anforderung referenziert auslösendes Profilfeld/Regel; keine Anforderung ohne Quelle; Ausgabe als ENTWURF gekennzeichnet | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-002; U-002, U-003; R-02 |
| COQ-T06 | Vollständigkeit/Trunkierung: Generierung eines Dokuments an der spezifizierten Maximalgröße (Grenzwert-Testprofil TD-03); Export durchführen | Export vollständig ODER definierter Fehler; **kein stilles Abschneiden**; Soll-/Ist-Abschnittsabgleich des Exports greift nachweislich | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-007; U-015, U-032; R-04 |

### 2.2 Prüfschicht-Tests

| Test ID | Prüfpunkt | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| COQ-T07 | Negativ: präpariertes Testset mit fachlich falschen Akzeptanzkriterien (TD-04, u. a. falsche Einheit, Grenzwert außerhalb Profilspezifikation, nicht prüfbare Aussage, Widerspruch zum Profil) durch die Prüfschicht führen | Alle eingeschleusten falschen Kriterien werden abgelehnt/markiert; jede Entscheidung mit Regel-Referenz protokolliert | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-004; U-009; R-01, R-05 |
| COQ-T08 | Positiv: Testset mit korrekten, teils **qualitativen, aber prüffähigen** Kriterien (TD-05, z. B. „Typenschild vorhanden und lesbar") durch die Prüfschicht führen | Alle korrekten Kriterien werden akzeptiert; keine Falsch-Ablehnung qualitativer prüffähiger Kriterien | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-004; U-009; R-05 |

### 2.3 Traceability und Vorlagen-Treue

| Test ID | Prüfpunkt | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| COQ-T09 | Traceability-Matrix: zum IQ-Protokoll aus COQ-T01 die Traceability-Matrix generieren; alle Prüfpunkte stichprobenfrei (100 %) auf Quellenangabe prüfen | Jede fachliche Aussage/jeder Prüfpunkt hat auflösbare Quelle (Profilfeld, Vorlagenabschnitt, Regelwerk); Aussagen ohne Quelle sind als „unbelegt" markiert (Provokation via TD-04) | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-005; U-013; R-02 |
| COQ-T10 | Vorlagen-Treue: generiertes IQ-Protokoll (COQ-T01) abschnittsweise gegen Original-Vorlage IQ001 R01 abgleichen | Alle 16 Test Sections vorhanden, korrekte Reihenfolge, Benennung und Nummerierung; keine erfundenen/zusätzlichen Sections; Kopf-/Fußstruktur vorlagenkonform | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-006; U-011, U-012; R-06 |

### 2.4 Negativ- und Fehlerverhaltenstests

| Test ID | Prüfpunkt | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| COQ-T11 | Unvollständiges Profil: Generierung mit Profil starten, bei dem Pflichtfelder fehlen bzw. widersprüchlich sind (TD-06, 3 Varianten) | Generierung startet nicht; feldbezogene, verständliche Fehlermeldung; kein Teil-/Lückendokument wird erzeugt | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-001; U-001; R-13 |
| COQ-T12 | Entwurfskennzeichnung: alle in COQ-T01–T05 erzeugten Dokumente auf ENTWURF-Kennzeichnung und Human-in-the-loop-Hinweis prüfen | Jedes Dokument trägt unübersehbare ENTWURF-Kennzeichnung und Hinweis auf verpflichtende Prüfung/Freigabe durch qualifizierte Person | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-003; U-010; R-01, R-10 |
| COQ-T13 | e-Signatur-Rendering: Signaturblöcke im generierten Dokument prüfen | Signaturblöcke enthalten Name (Platzhalter), Rolle, Datum, Bedeutung der Signatur; Kennzeichnung als „zur Signatur vorgesehen" (kein Anschein vollzogener Signatur) | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-008; U-023; R-10 |
| COQ-T14 | LLM-Ausfall-Verhalten: LLM-Endpunkt testweise blockieren bzw. Timeout provozieren (Testkonfiguration Dev-äquivalent), Generierung starten | Definierter Fehler mit klarer Nutzermeldung; **kein** unvollständiges Dokument gespeichert/exportiert; Ereignis im Audit Trail; Wiederholung nach Freigabe des Endpunkts erfolgreich | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-011; U-028; R-11 |

### 2.5 Audit Trail, Zugriff, Regression

| Test ID | Prüfpunkt | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| COQ-T15 | Audit Trail & Metadaten: für einen kompletten Generierungslauf (COQ-T01) Audit-Trail-Einträge und Generierungs-Metadaten prüfen | Ereigniskette vollständig (Profil → Generierung → Prüfschicht → Export) mit Nutzer/Zeitstempel; Metadaten enthalten Systemversion, LLM-Modellversion, Vorlage IQ001 R01, Profilreferenz; Einträge nicht änderbar | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-010; U-021, U-024; R-09 |
| COQ-T16 | Zugriffstest: Login mit gültigem Konto, Login-Versuch mit ungültigen Credentials, Zugriff auf Funktions-URL ohne Session. **Teil B (Autorisierung/Projekt-Scoping und SoD): „nach Implementierung" — wird bei Umsetzung von U-017/U-018 ergänzt und nachgetestet (deferred)** | Teil A: gültiger Login erfolgreich; ungültige Versuche abgewiesen und protokolliert; kein Funktionszugriff ohne Session. Teil B: n. a. in R01 (deferred, OP-01/OP-02) | ☐ Pass ☐ Fail (Teil A) | [NAME] / [DATUM] | F-009; U-016 (U-017, U-018 deferred); R-07, R-08 |
| COQ-T17 | Regressions-Testset (Modellwechsel-Prozedur): Regressionslauf gemäß DEV-TS-2026-001 mit Referenzprofilen TD-01/TD-02 ausführen und Ergebnisprüfung gegen Soll-Kriterien dokumentieren | Regressions-Testset ist ausführbar, deckt COQ-T01/T04/T07-Kriterien ab und liefert dokumentiertes Pass/Fail-Ergebnis; Prozedur für Modellwechsel in DEV-CC-2026-001 verankert | ☐ Pass ☐ Fail | [NAME] / [DATUM] | F-011; U-027; R-03 |

## 3. Testdurchführungsanweisungen (Prüfschritte)

Die folgenden Schritte sind je Testfall in der angegebenen Reihenfolge durchzuführen; jede Beobachtung ist im Prüfprotokoll festzuhalten. Screenshots/Exporte sind als objektive Evidenz mit Testfall-ID abzulegen (*Evidenz-Ordner gemäß Anlage: Systemkonfiguration*).

**COQ-T01 (IQ-Generierung Agilent 1260 HPLC):**
1. Anmeldung mit Testkonto; Referenzprofil TD-01 „Agilent 1260 HPLC" öffnen und Feldinhalte gegen Testdatendefinition prüfen.
2. Generierung „IQ-Protokoll, Vorlage IQ001 R01" starten; Laufzeit und Prüfschicht-Ergebnis notieren.
3. Dokument öffnen: alle 16 Test Sections gegen Vorlagen-Inhaltsverzeichnis abhaken (Checkliste im Evidenzblatt).
4. Stichprobe Datenübernahme: Hersteller, Modell, Seriennummern-Platzhalter in Section „Gerätedaten" prüfen.
5. Ausfüllbarkeit der Test-Tabellen prüfen (Ergebnisfelder, Durchführender/Datum, Referenzspalte vorhanden).

**COQ-T02 / COQ-T03 (OQ-/PQ-Generierung):**
1. Aus TD-01 OQ- bzw. PQ-Protokoll generieren.
2. Je 5 zufällig gewählte Testpunkte auf Prüffähigkeit bewerten (messbares bzw. eindeutig verifizierbares Akzeptanzkriterium, definierter Sollwert/Sollzustand, Einheit korrekt).
3. Prüfschicht-Protokoll zum Lauf einsehen und Freigabeentscheidung dokumentieren.

**COQ-T04 (Temperaturmapping):**
1. Referenz-Raumprofil TD-02 erfassen (alle 10 Raumparameter); Zeitmessung ab Klick „Generieren" bis Anzeige des Entwurfs.
2. Prüfplan auf Adressierung aller 10 Parameter durchgehen (Parameter-Checkliste im Evidenzblatt).
3. Zeitwert protokollieren; Kriterium ≤ 120 s bewerten.

**COQ-T05 (DQ-Vorstufe/URS):**
1. DQ-Vorstufe und URS-Entwurf aus TD-01 ableiten.
2. Für jede abgeleitete Anforderung Quellreferenz (Profilfeld/Regel) prüfen; fehlende Referenzen als Befund dokumentieren.
3. ENTWURF-Kennzeichnung verifizieren.

**COQ-T06 (Trunkierung/Grenzwert):**
1. Grenzwert-Testprofil TD-03 laden (spezifizierte Maximaldokumentgröße).
2. Generierung + Export durchführen; Export gegen Soll-Abschnittsliste abgleichen.
3. Verifizieren: Ausgabe ist vollständig ODER es erscheint ein definierter Fehler; ein stilles, abgeschnittenes Dokument ist ein Fail.

**COQ-T07 / COQ-T08 (Prüfschicht negativ/positiv):**
1. Testsets TD-04 (fachlich falsche Kriterien) und TD-05 (korrekte, teils qualitative Kriterien) über die Prüfschicht-Testschnittstelle einspielen.
2. Je Kriterium Entscheidung (akzeptiert/abgelehnt/markiert) und Regel-Referenz protokollieren.
3. Auswertung: T07 verlangt 100 % Ablehnung/Markierung der falschen Kriterien; T08 verlangt 0 Falsch-Ablehnungen.

**COQ-T09 (Traceability):**
1. Traceability-Matrix zum Dokument aus COQ-T01 generieren.
2. 100 %-Durchsicht: jede Aussage/jeder Prüfpunkt besitzt Quellangabe; Quellen von 10 Aussagen aktiv bis zum Ursprung auflösen.
3. Provokation: TD-04-Lauf wiederholen und verifizieren, dass unbelegte Aussagen als „unbelegt" markiert sind.

**COQ-T10 (Vorlagen-Treue):**
1. Original IQ001 R01 neben generiertem Protokoll öffnen.
2. Abschnittsweise vergleichen: Anzahl (16), Reihenfolge, Benennung, Nummerierung, Kopf-/Fußstruktur.
3. Jede Abweichung als Befund mit Section-Nummer dokumentieren.

**COQ-T11 (Negativtest Profil):**
1. Drei TD-06-Varianten nacheinander eingeben (fehlendes Pflichtfeld, widersprüchlicher Temperaturbereich, ungültige Einheit).
2. Je Variante prüfen: Generierung startet nicht, feldbezogene Meldung, kein Dokumentartefakt erzeugt.

**COQ-T12 / COQ-T13 (Kennzeichnung / Signatur-Rendering):**
1. Alle Dokumente aus COQ-T01–T05 auf ENTWURF-Kennzeichnung und HITL-Hinweis prüfen (jede Seite/Kopfbereich).
2. Signaturblöcke prüfen: Name (Platzhalter), Rolle, Datum, Bedeutung der Signatur; Kennzeichnung „zur Signatur vorgesehen".

**COQ-T14 (LLM-Ausfall):**
1. In der Testkonfiguration LLM-Endpunkt blockieren (Vorgehen: *[Anlage: Systemkonfiguration]*).
2. Generierung starten; Fehlermeldung, Nicht-Persistenz eines Teildokuments und Audit-Trail-Eintrag verifizieren.
3. Endpunkt freigeben, Generierung wiederholen, Erfolg dokumentieren.

**COQ-T15 (Audit Trail/Metadaten):**
1. Vollständigen Lauf aus COQ-T01 im Audit Trail nachvollziehen (Profil → Generierung → Prüfschicht → Export).
2. Metadaten prüfen: Systemversion, LLM-Modellversion (Abgleich mit CIQ-T03), Vorlage IQ001 R01, Profilreferenz.
3. Manipulationsversuch: Editier-/Löschversuch eines Eintrags — muss verwehrt werden.

**COQ-T16 (Zugriff, Teil A):**
1. Login gültig / Login mit falschem Passwort (3 Versuche) / Aufruf einer Funktions-URL ohne Session.
2. Ergebnis und Protokollierung der Fehlversuche dokumentieren. Teil B (Autorisierung/SoD) entfällt in R01 — deferred, siehe OP-01/OP-02.

**COQ-T17 (Regressions-Testset):**
1. Regressionslauf gemäß DEV-TS-2026-001 mit TD-01/TD-02 starten.
2. Automatisierte Soll-Kriterien-Prüfung (Struktur, Vollständigkeit, Prüfschicht-Verhalten) auswerten; Bericht ablegen.
3. Verankerung der Prozedur im Change-Control-Ablauf (DEV-CC-2026-001) verifizieren (Dokumentenprüfung).

## 4. Abschluss

| Feld | Eintrag |
|---|---|
| Anzahl Testfälle | 17 (davon 1 teilweise deferred: COQ-T16 Teil B) |
| Davon Pass / Fail | ___ / ___ |
| Abweichungen (ABW-xxx) | ___ |
| OQ abgeschlossen — UAT freigegeben | ☐ Ja ☐ Nein |
| Durchgeführt von (Author) | [NAME] / [DATUM] |
| Geprüft (Quality) | [NAME] / [DATUM] |

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung (Entwurf/Demo) |

*Kordix AI · QualiPilot CSV-Validierungspaket · Demo-Dokument*
