# User Acceptance Testing (UAT/PQ) — QualiPilot v1.0 (MVP)

| Feld | Wert |
|---|---|
| **Dokument-ID** | CSV-UAT-2026-001 |
| **Revision** | R01 |
| **Status** | Entwurf / Demo |
| **Author** | Kordix AI |
| **Datum** | [DATUM] |
| **System** | QualiPilot v1.0 [MVP] |
| **Referenzen** | CSV-URS-2026-001, CSV-OQ-2026-001, CSV-RA-2026-001, CSV-TM-2026-001 |

## 1. Zweck, Rollen, Voraussetzungen

Das UAT (PQ-Charakter) verifiziert QualiPilot im realen Nutzungskontext aus Sicht des **Qualifizierungsingenieurs** beim Pilotkunden: Erzeugt das System Entwürfe, die nach fachlichem Review effizient und sicher in den GMP-Prozess des Kunden übernommen werden können?

**Rollen:** Tester = Qualifizierungsingenieur (Pilotkunde); Begleitung = Kordix AI (Author); Bewertung/Mitzeichnung = Pilotkunde QA. Damit ist das UAT zugleich Wirksamkeitsnachweis des organisatorischen Vier-Augen-Prinzips (Übergangsmaßnahme zu R-08/OP-02).

**Voraussetzungen:** IQ und OQ abgeschlossen; reale (nicht produktiv-kritische) Kundenszenarien definiert; Kundenvorlage bzw. Standard IQ001 R01 abgestimmt.

## 2. Akzeptanzschwellen

| Nr. | Kriterium | Schwelle |
|---|---|---|
| A1 | Fachliche Übernehmbarkeit: Anteil generierter Prüfpunkte, die ohne fachliche Korrektur übernehmbar sind (über alle UAT-Dokumente, bewertet je Prüfpunkt) | **≥ 90 %** |
| A2 | Kritische Fehler: fachlich falsche Aussagen, die vom Reviewer als „hätte im GMP-Dokument Schaden angerichtet" eingestuft werden und von Prüfschicht/Traceability **nicht** sichtbar gemacht wurden | **0** |
| A3 | Vollständigkeit: Anteil UAT-Dokumente ohne fehlende Abschnitte/Trunkierung | 100 % |
| A4 | Effizienz: Zeit von Profileingabe bis review-fertigem Entwurf (Temperaturmapping-Szenario) | ≤ 15 min gesamt (Generierung ~60 s) |
| A5 | Review-Tauglichkeit: Reviewer bestätigt, dass Traceability-Matrix den fachlichen Review messbar unterstützt | Bewertung ≥ 3 von 4 (Bewertungsbogen) |

## 3. Testszenarien

| Test ID | Szenario | Akzeptanzkriterium | Ergebnis | Durchgeführt von / Datum | Ref. |
|---|---|---|---|---|---|
| CUAT-T01 | **End-to-End Temperaturmapping:** Qualifizierungsingenieur erfasst reales Raumszenario (10 Raumparameter) → Entwurf generieren → fachlicher Review → mind. 1 Korrektur einarbeiten → Freigabe im kundenseitigen Prozess (Vier-Augen) | Durchgängiger Workflow ohne Blocker; Entwurf review-fähig; Korrekturschleife praktikabel; Schwellen A3/A4 erfüllt | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-008, U-010; R-01 |
| CUAT-T02 | **End-to-End IQ-Protokoll:** Profil „Agilent 1260 HPLC" → IQ-Entwurf (IQ001 R01) → fachlicher Review durch Qualifizierungsingenieur → Korrektur → Freigabe | Alle 16 Test Sections fachlich sinnvoll gefüllt; Workflow durchgängig; A3 erfüllt | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-004, U-012; R-01, R-06 |
| CUAT-T03 | **Fachliche Qualität:** Reviewer bewertet jeden Prüfpunkt der Dokumente aus CUAT-T01/T02 (übernehmbar / korrekturbedürftig / falsch) auf dem Bewertungsbogen | Schwelle A1 (≥ 90 % ohne fachliche Korrektur) und A2 (0 unentdeckte kritische Fehler) erfüllt | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-009, U-010; R-01, R-05 |
| CUAT-T04 | **Traceability im Review:** Reviewer nutzt die Traceability-Matrix aktiv, prüft 10 zufällig gewählte Aussagen bis zur Quelle | Alle 10 Quellen auflösbar und fachlich korrekt zugeordnet; Bewertung A5 ≥ 3/4 | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-013; R-02 |
| CUAT-T05 | **Vorlagen-Akzeptanz:** Kunden-QA vergleicht generiertes Dokument mit eigener Vorlagenerwartung (IQ001 R01) | Kunden-QA bestätigt Vorlagenkonformität und Eignung für den eigenen Dokumentenprozess | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-011, U-012; R-06 |
| CUAT-T06 | **Effizienznachweis:** Zeitmessung CUAT-T01 gegen Referenzaufwand manueller Erstellung (~3 h) | Nachweis deutlicher Ersparnis; A4 erfüllt; Ergebnis dokumentiert | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-030 |
| CUAT-T07 | **Fehlbedienung aus Nutzersicht:** Ingenieur lässt bewusst Pflichtangaben weg bzw. gibt widersprüchliche Raumparameter ein | Systemverhalten verständlich; keine irreführenden Teil-Ergebnisse; Nutzer kann Fehler selbständig beheben | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-001; R-13 |
| CUAT-T08 | **Organisatorische Kontrollen:** Durchspielen des kundenseitigen Freigabeprozesses: Ersteller ≠ Freigeber (organisatorisches Vier-Augen-Prinzip), Nutzung der dedizierten Instanz | Übergangsmaßnahmen zu OP-01/OP-02 sind im Kundenprozess dokumentiert, verstanden und wurden eingehalten | ☐ Pass ☐ Fail | [NAME] / [DATUM] | U-017, U-018; R-07, R-08 |

## 4. Bewertungsbogen (je UAT-Dokument)

| Feld | Eintrag |
|---|---|
| Dokument / Szenario | ______________________ |
| Anzahl Prüfpunkte gesamt | ___ |
| Übernehmbar ohne Korrektur | ___ ( ___ %) — Schwelle A1: ≥ 90 % |
| Korrekturbedürftig (fachlich) | ___ |
| Fachlich falsch — durch Prüfschicht/Traceability sichtbar | ___ |
| Fachlich falsch — **nicht** sichtbar gemacht (A2!) | ___ — Schwelle: 0 |
| Vollständigkeit (A3) | ☐ vollständig ☐ unvollständig |
| Zeit Profil → review-fertiger Entwurf (A4) | ___ min |
| Traceability-Unterstützung (A5, 1–4) | ☐ 1 ☐ 2 ☐ 3 ☐ 4 |
| Freitext-Befunde | ______________________ |
| Reviewer (Qualifizierungsingenieur) | [NAME] / [DATUM] |
| Mitzeichnung Kunden-QA | [NAME] / [DATUM] |

## 5. Abschluss

| Feld | Eintrag |
|---|---|
| Anzahl Szenarien | 8 |
| Davon Pass / Fail | ___ / ___ |
| Akzeptanzschwellen A1–A5 erfüllt | ☐ Ja ☐ Nein |
| Abweichungen (ABW-xxx) | ___ |
| Durchgeführt von (Pilotkunde) | [NAME] / [DATUM] |
| Geprüft (Quality, Kordix AI) | [NAME] / [DATUM] |

## Change History

| Revision | Datum | Author | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung (Entwurf/Demo) |

*Kordix AI · QualiPilot CSV-Validierungspaket · Demo-Dokument*
