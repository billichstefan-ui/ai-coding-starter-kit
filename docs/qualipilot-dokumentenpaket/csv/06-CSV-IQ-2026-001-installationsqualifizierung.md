# Installationsqualifizierung (IQ) — QualiPilot v1.0 (MVP)

| Feld | Wert |
|---|---|
| **Dokument-ID** | CSV-IQ-2026-001 |
| **Revision** | R01 |
| **Status** | Entwurf / Demo |
| **Author** | Kordix AI |
| **Datum** | [DATUM] |
| **System** | QualiPilot v1.0 [MVP] |
| **Referenzen** | CSV-VP-2026-001, CSV-FS-2026-001, DEV-CC-2026-001, DEV-KM-2026-001, *[Anlage: Systemkonfiguration]* |

## 1. Zweck und Voraussetzungen

Die IQ verifiziert, dass QualiPilot in der Zielumgebung (Prod, dedizierte Instanz des Pilotkunden) korrekt und in der spezifizierten Konfiguration installiert ist. Sie ist Voraussetzung für die OQ (CSV-OQ-2026-001).

**Voraussetzungen vor Testbeginn:**
- Freigegebenes Release gemäß DEV-CC-2026-001 (Deployment-Protokoll liegt vor)
- Soll-Konfiguration dokumentiert in *[Anlage: Systemkonfiguration]*
- Zugang für Tester mit individuellem Konto eingerichtet

**Ergebniskonvention:** Jeder Prüfpunkt wird mit Pass/Fail bewertet; jedes Fail erzeugt eine Abweichung (ABW-xxx) gemäß CSV-VP-2026-001, Abschnitt 8. Zusammenfassung ausschließlich im Validierungsbericht (CSV-VB-2026-001).

## 2. Prüfpunkte

| Test ID | Prüfpunkt | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| CIQ-T01 | Softwareversion: Release-/Build-Kennung im System (Admin-/Info-Ansicht) ablesen und mit freigegebenem Release vergleichen | Angezeigte Version == freigegebene Version laut Deployment-Protokoll (DEV-KM-2026-001) | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-034, R-14 |
| CIQ-T02 | Umgebungstrennung: Prod-Instanz identifizieren; verifizieren, dass es sich um die dedizierte Instanz des Pilotkunden handelt und Dev-Umgebung getrennt erreichbar/gekennzeichnet ist | Dev und Prod physisch/logisch getrennt; Prod ist kundendedizierte Instanz (Übergangsmaßnahme zu R-07/OP-01 wirksam) | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-033, U-017, R-07 |
| CIQ-T03 | LLM-Konfiguration: konfigurierte Anthropic-Claude-Modellversion auslesen und mit Soll-Wert vergleichen | Modellversion exakt wie in *[Anlage: Systemkonfiguration]* spezifiziert (gepinnte Version, kein „latest") | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-026, R-03 |
| CIQ-T04 | `max_tokens`-Konfiguration: konfigurierten Wert der Ausgabekapazität auslesen und gegen die spezifizierte maximale Dokumentgröße prüfen | `max_tokens` == Soll-Wert laut *[Anlage: Systemkonfiguration]*; Wert deckt spezifizierte Maximaldokumentgröße ab | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-032, R-04 |
| CIQ-T05 | Vorlagen-Installation: installierte Standard-IQ-Vorlage prüfen (ID, Revision, Abschnittszahl) | Vorlage IQ001 R01 installiert; 16 Test Sections vollständig; Revisionskennung sichtbar | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-011, R-06 |
| CIQ-T06 | Secrets-Konfiguration: verifizieren, dass API-Schlüssel (LLM, Infrastruktur) im Secrets-Management liegen; Stichprobe Quellcode-Repository und Anwendungslogs auf Schlüssel-Leakage | Keine Secrets im Code oder in Logs; Secrets nur im Secrets-Store (DEV-SEC-2026-001) | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-020, R-12 |
| CIQ-T07 | Zugriffs-/Transportsicherheit: TLS-Erzwingung des Web-Frontends und der LLM-Verbindung prüfen; Login nur mit gültigem individuellem Konto möglich | Alle Verbindungen TLS-verschlüsselt; unauthentifizierter Zugriff auf Anwendungsfunktionen nicht möglich | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-016, U-019 |
| CIQ-T08 | Backup-Konfiguration: Backup-Job konfiguriert und aktiv; Wiederherstellungstest eines Testdatensatzes durchführen | Backup gemäß *[Anlage: Systemkonfiguration]* aktiv; Testdatensatz erfolgreich wiederhergestellt | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-025, R-15 |
| CIQ-T09 | Audit-Trail-Aktivierung: Audit Trail eingeschaltet; Testereignis (Login + Profilanlage) erzeugen und Eintrag mit Nutzer/Zeitstempel verifizieren | Beide Ereignisse mit korrektem Nutzer und Zeitstempel im Audit Trail; Eintrag nicht editierbar | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-021, R-09 |
| CIQ-T10 | Konfigurationsdokumentation: Vollständigkeit der *[Anlage: Systemkonfiguration]* gegen Ist-System stichprobenhaft prüfen (mind. 5 Parameter) | Alle geprüften Parameter stimmen mit Anlage überein; Anlage versioniert und freigegeben | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-034, R-14 |

## 3. Abschluss

| Feld | Eintrag |
|---|---|
| Anzahl Prüfpunkte | 10 |
| Davon Pass / Fail | ___ / ___ |
| Abweichungen (ABW-xxx) | ___ |
| IQ abgeschlossen — OQ freigegeben | ☐ Ja ☐ Nein |
| Durchgeführt von (Author) | [NAME] / [DATUM] |
| Geprüft (Quality) | [NAME] / [DATUM] |

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung (Entwurf/Demo) |

*Kordix AI · QualiPilot CSV-Validierungspaket · Demo-Dokument*
