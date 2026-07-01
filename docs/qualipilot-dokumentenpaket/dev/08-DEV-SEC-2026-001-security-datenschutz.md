# Security & Datenschutz — QualiPilot

| Feld | Wert |
|---|---|
| Dokument-ID | DEV-SEC-2026-001 |
| Revision | R01 |
| Status | Entwurf |
| Autor | Kordix AI |
| Datum | [DATUM] |
| Geltungsbereich | QualiPilot |

## 1. Zweck

Dieses Dokument beschreibt die Sicherheits- und Datenschutzgrundsätze für Entwicklung und Betrieb von QualiPilot: Zugriffskontrolle, Secrets-Management, Datenklassifizierung, Datenflüsse zum LLM-Anbieter, DSGVO-Grundsätze, Schwachstellen-Management, Incident Response sowie Backup/Recovery. Es ergänzt die Part-11-Bewertung des CSV-Pakets (CSV-P11-2026-001) und die Risikoanalyse (CSV-RA-2026-001).

## 2. Zugriffskontrolle und Secrets-Management

- **Personalisierte Zugänge:** Zugriffe auf Repository, Cloud-Plattform, CI und Produktionsumgebung erfolgen über personalisierte, authentifizierte Konten; Multi-Faktor-Authentifizierung ist für alle administrativen Zugänge aktiviert. Derzeit existiert ein administrativer Nutzer (Solo-Gründer, DEV-SDP-2026-001 Kap. 6); die Zugriffe sind dennoch protokolliert und auditierbar.
- **Least Privilege:** Dienste erhalten nur die minimal notwendigen Berechtigungen; produktive Anwendungszugriffe der Kunden sind rollenbasiert auf ihre Daten beschränkt.
- **Keine Secrets im Code:** API-Keys (u. a. Anthropic Claude API), Zugangsdaten und Schlüssel liegen ausschließlich im Secrets-Management der Cloud-Plattform bzw. der CI-Umgebung — nie im Repository, nie in Vorlagen, nie in Logs.
- **Keine Secrets in Prompts:** In Claude-Code-Sessions und in Kontextdateien dürfen keine Secrets eingegeben werden (verbindliche Regel, DEV-SOP-AI-2026-001 Kap. 6). Der automatisierte Schutz wird durch Repository-Hygiene (Ignorier-Regeln für Umgebungsdateien) unterstützt.
- **Key-Rotation:** Bei Verdacht auf Kompromittierung werden betroffene Schlüssel unverzüglich rotiert (Incident-Prozess Kap. 7); planmäßige Rotation in definierten Intervallen.

### 2.1 Protokollierung von Zugriffen

- Administrative Zugriffe auf Cloud-Plattform, Repository und Produktionsumgebung werden durch die jeweiligen Plattformen protokolliert; die Protokolle sind Bestandteil der Audit-Nachvollziehbarkeit.
- Anwendungsseitige Zugriffe (Login, Dokumenterstellung, Signaturaktionen) werden im Audit-Trail von QualiPilot erfasst (DEV-SAD-2026-001 Kap. 3.3; regulatorische Bewertung in CSV-P11-2026-001).
- Protokolle enthalten keine Secrets und werden gemäß Datenklassifizierung (Kap. 3) behandelt.

## 3. Datenklassifizierung

| Klasse | Beispiele | Schutzbedarf | Behandlung |
|---|---|---|---|
| Kundendaten (vertraulich) | Equipment-Profile, generierte Qualifizierungsdokumente, Firmen-/Anlagendaten, Signatur-Metadaten | Hoch | Nur in Prod; verschlüsselt bei Übertragung und Speicherung; kein Einsatz in Dev/Test oder Claude-Code-Sessions (DEV-TS-2026-001 Kap. 6) |
| Personenbezogene Daten | Nutzerkonten, Namen in Signaturblöcken, Audit-Trail-Einträge | Hoch (DSGVO) | Datenminimierung (Kap. 5); Zugriff nur zweckgebunden |
| Betriebs-/Telemetriedaten | Technische Logs, Fehler- und Performance-Metriken | Mittel | Ohne Kundeninhalte und ohne Secrets (DEV-CS-2026-001 Kap. 5); definierte Aufbewahrungsfristen |
| Öffentlich/intern | Produktdokumentation, synthetische Testdaten, öffentliche Gerätespezifikationen | Niedrig | Reguläre Versionskontrolle |

## 4. Datenflüsse zum LLM-Anbieter

Zur Dokumentgenerierung übermittelt der KI-Service assemblierte Prompts (Equipment-Profildaten, Vorlagenkontext) an die Anthropic Claude API (DEV-SAD-2026-001 Kap. 4). Es gelten folgende Grundsätze:

1. **Auftragsverarbeitung:** Die Verarbeitung durch den LLM-Anbieter erfolgt auf Grundlage vertraglicher Regelungen (Auftragsverarbeitungsvertrag/Data Processing Agreement mit dem Anbieter) [vertragliche Details je Pilotkunde zu konkretisieren].
2. **Kein Training mit Kundendaten:** Es ist vertraglicher und konfigurativer Grundsatz, dass über die API übermittelte Kundendaten nicht zum Training der Modelle des Anbieters verwendet werden; Kordix AI stützt sich hierbei auf die vertraglichen Zusicherungen und Datennutzungsbedingungen des Anbieters für API-Nutzung und überprüft diese bei Vertrags- und Bedingungsänderungen.
3. **Datenminimierung im Prompt:** Die Prompt-Assembly übermittelt nur die für die Generierung erforderlichen Profil- und Vorlagendaten; personenbezogene Daten werden nicht in Prompts aufgenommen, soweit fachlich nicht erforderlich.
4. **Transparenz gegenüber Kunden:** Pilotkunden werden über den Datenfluss zum LLM-Anbieter, dessen Zweck und die vertraglichen Schutzmaßnahmen informiert (Bestandteil der Pilotvereinbarung).
5. **Verschlüsselte Übertragung:** Alle API-Aufrufe erfolgen transportverschlüsselt.

## 5. DSGVO-Grundsätze

- **Datenminimierung:** Es werden nur die für Qualifizierungsdokumente erforderlichen Daten erhoben und verarbeitet; keine Sammlung „auf Vorrat".
- **Zweckbindung:** Kundendaten werden ausschließlich zur Erbringung der QualiPilot-Funktionalität verarbeitet — nicht für Produktanalysen mit Personenbezug, nicht für Modelltraining (Kap. 4).
- **Auftragsverarbeitung (AVV):** Mit Pilotkunden wird ein AVV geschlossen, der Kordix AI als Auftragsverarbeiter und die Unterauftragsverhältnisse (Cloud-Plattform, LLM-Anbieter) transparent regelt [je Pilotkunde zu konkretisieren].
- **EU-Datenresidenz:** Speicherung und Verarbeitung in EU-Regionen der Cloud-Plattform ist Zielarchitektur; der erreichbare Umfang (insbesondere für LLM-API-Verarbeitung) ist anbieterabhängig und wird gegenüber Kunden transparent ausgewiesen [zu konkretisieren].
- **Betroffenenrechte und Löschung:** Lösch- und Auskunftsersuchen werden über definierte Kundenprozesse bedient; Aufbewahrungsfristen berücksichtigen GxP-Dokumentationspflichten der Kunden (Vorrang dokumentierter Aufbewahrung für signierte Dokumente beim Kunden).

## 5.1 Sicherheitsrelevante Bedrohungsszenarien (Auswahl)

| Szenario | Beschreibung | Maßnahmen |
|---|---|---|
| Prompt Injection über Nutzereingaben | Manipulative Inhalte in Equipment-Profilen versuchen, das LLM-Verhalten zu steuern | Strukturierte Prompt-Assembly (Trennung Anweisung/Daten), Prüfschicht validiert Outputs unabhängig vom LLM, deterministischer Dokumentaufbau (ADR-001/003) |
| Supply-Chain-Angriff | Kompromittierte oder halluzinierte Abhängigkeiten | Dependency-Review vor Aufnahme, Lockfiles, Scanning (Kap. 6; DEV-CS-2026-001 Kap. 6) |
| Kompromittierter API-Key | Missbrauch des Claude-API- oder Cloud-Zugangs | Secrets-Management, Rotation, Nutzungs-Monitoring (Kap. 2) |
| Datenabfluss über Entwicklungswerkzeuge | Kundendaten/Secrets gelangen in Claude-Code-Sessions | Verbote in DEV-SOP-AI-2026-001 Kap. 6; ausschließlich synthetische Dev-/Testdaten |
| Manipulation generierter Dokumente | Unbemerkte inhaltliche Veränderung nach Generierung | Persistierte Generierungs-Metadaten, Audit-Trail, e-Signatur-Mechanismen (CSV-P11-2026-001) |

## 5.2 Sicherheit im Entwicklungsprozess

- Sicherheitsrelevante Änderungen (Auth, Krypto, Session-Handling, e-Signatur-Rendering) unterliegen dem verschärften Review gemäß DEV-SOP-AI-2026-001 Kap. 6 Nr. 3 und werden nie ungeprüft aus KI-Vorschlägen übernommen.
- Die Review-Checkliste enthält eine eigene Sicherheitsdimension (DEV-SOP-AI-2026-001 Anhang A.2); Befunde sind Merge-Blocker.
- CI-Umgebungen verwenden eigene, minimal berechtigte Secrets; Produktions-Secrets sind der CI nicht zugänglich, soweit nicht für das Deployment erforderlich.

## 6. Schwachstellen-Management

- **Dependency-Updates:** Abhängigkeiten (Python, TypeScript) werden regelmäßig aktualisiert; automatisierte Hinweise auf verwundbare Abhängigkeiten (Security Advisories, Dependency-Scanning) werden zeitnah bewertet.
- **Priorisierung:** Kritische/hohe Schwachstellen mit Exponierung werden unverzüglich behandelt (ggf. Emergency Change, DEV-CC-2026-001 Kap. 3); übrige im regulären Update-Zyklus.
- **Neue Abhängigkeiten** durchlaufen die Review-Prüfung (Notwendigkeit, Herkunft, bekannte Schwachstellen — DEV-SOP-AI-2026-001 Anhang A.2); dies gilt ausdrücklich auch für von Claude Code vorgeschlagene Pakete (Schutz vor halluzinierten oder typosquatteten Paketnamen).
- Update-Commits folgen der Konvention (`chore(…)`/`fix(…)`) und den regulären CI-Pflichtläufen.

## 7. Incident Response

1. **Erkennung:** Monitoring/Logs, Fehlerberichte von Anwendern, Advisories.
2. **Bewertung:** Einstufung nach Auswirkung (Vertraulichkeit, Integrität — insbesondere: Können generierte GMP-Dokumente inhaltlich betroffen sein? —, Verfügbarkeit, Personenbezug).
3. **Eindämmung und Behebung:** Sofortmaßnahmen (Key-Rotation, Rollback gemäß DEV-CC-2026-001 Kap. 7, Abschaltung betroffener Funktionen); Behebung als dokumentierter Change.
4. **Meldewege:** Bei Vorfällen mit Auswirkung auf Kundendaten oder generierte Dokumente werden die betroffenen **Pilotkunden unverzüglich informiert** (Ansprechpartner gemäß Pilotvereinbarung), damit deren QA die Auswirkung auf bereits erzeugte Dokumente bewerten kann. Bei meldepflichtigen Datenschutzverletzungen erfolgt die Meldung an die Aufsichtsbehörde innerhalb der DSGVO-Fristen (Art. 33: grundsätzlich 72 Stunden) und, soweit erforderlich, die Benachrichtigung Betroffener (Art. 34).
5. **Nachbereitung:** Ursachenanalyse, Regression-Tests (DEV-SOP-AI-2026-001 Kap. 7), ggf. Anpassung dieses Dokuments und der Kontrollen; Vorfall-Dokumentation wird aufbewahrt und ist auditierbar.

## 8. Backup und Recovery

| Gegenstand | Sicherung | Wiederherstellung |
|---|---|---|
| Produktive Datenhaltung (Equipment-Profile, Dokumente, Audit-Trail, Generierungs-Metadaten) | Regelmäßige Backups in definierten Intervallen; Aufbewahrung nach definiertem Schema | Recovery aus Backup-Stand; Integritätsprüfung nach Wiederherstellung |
| Code, Vorlagen, Prompts, Konfiguration | Gehostetes Git-Repository (DEV-KM-2026-001 Kap. 2) | Redeploy eines getaggten Release |
| Secrets | Secrets-Management der Cloud-Plattform | Neuausstellung/Rotation statt Restore, wo möglich |

Ergänzende Grundsätze:

- **Recovery-Tests:** Die Wiederherstellbarkeit aus Backups wird periodisch stichprobenhaft verifiziert und dokumentiert.
- **Zusammenspiel mit Rollback:** Anwendungs-Rollback (DEV-CC-2026-001 Kap. 7) und Daten-Recovery sind getrennte, kombinierbare Verfahren; bei Emergency Changes wird vor dem Eingriff der Backup-Stand geprüft.
- **GxP-Bezug:** Signierte, an Kunden ausgelieferte Dokumente liegen zusätzlich in der dokumentierten Aufbewahrung des Kunden; QualiPilot-Backups ersetzen nicht die GMP-Archivierungspflichten des Kunden.

## 9. Periodische Überprüfung

- Dieses Dokument und die Wirksamkeit der beschriebenen Kontrollen werden mindestens jährlich sowie anlassbezogen (Incident, wesentliche Architektur- oder Anbieteränderung, neue regulatorische Anforderungen) überprüft; Ergebnisse werden in der Change History dokumentiert.
- Zu prüfende Punkte umfassen mindestens: Aktualität der Datenklassifizierung, Gültigkeit der vertraglichen Zusicherungen des LLM-Anbieters (Kap. 4), Stand der EU-Datenresidenz-Ziele (Kap. 5), offene Schwachstellen (Kap. 6), Ergebnisse der Recovery-Tests (Kap. 8).
- Pilotkunden-QA kann die Überprüfungsergebnisse im Rahmen der Lieferantenbewertung einsehen (CSV-LB-2026-001).

## 10. Referenzen

DEV-SDP-2026-001, DEV-SAD-2026-001, DEV-SOP-AI-2026-001, DEV-CS-2026-001, DEV-TS-2026-001, DEV-KM-2026-001, DEV-CC-2026-001; CSV-RA-2026-001, CSV-P11-2026-001, CSV-VP-2026-001, CSV-LB-2026-001.

## Change History

| Revision | Datum | Autor | Änderung |
|---|---|---|---|
| R01 | [DATUM] | Kordix AI | Ersterstellung |

*Kordix AI · QualiPilot Software-Entwicklungspaket*
