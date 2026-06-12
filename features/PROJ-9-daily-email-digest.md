# PROJ-9: Daily Email-Digest

## Status: Planned
**Created:** 2026-06-12
**Last Updated:** 2026-06-12

## Dependencies
- Requires: PROJ-2 (Daily Suggestion Engine) — E-Mail wird nach erfolgreicher Generierung ausgelöst
- Requires: PROJ-3 (Review & Approval Dashboard) — Dashboard-Link in der Mail

## Übersicht
Täglich um 8 Uhr Wien sendet NORA eine kurze Benachrichtigungs-E-Mail an Stefan, sobald neue BizDev-Vorschläge generiert wurden. Die Mail enthält die Anzahl der neuen Vorschläge und einen direkten Link zum Dashboard. Kein Inhalt, keine Vorschau — nur der Nudge.

## User Stories
- Als Stefan möchte ich täglich eine E-Mail erhalten wenn NORA neue Vorschläge generiert hat, damit ich nicht vergesse das Dashboard zu öffnen und BizDev-Arbeit nicht liegen bleibt.
- Als Stefan möchte ich, dass die Mail mich in unter 5 Sekunden zum Dashboard bringt, damit ich meinen < 2-Minuten-Review-Workflow einhalten kann.
- Als Stefan möchte ich, dass ein Fehler beim E-Mail-Versand die Vorschlagsgenerierung niemals blockiert, damit mein täglicher Workflow zuverlässig bleibt.

## Out of Scope
- **Vorschau der Vorschläge in der Mail** — kein Inhalt, nur Benachrichtigung + Link; Stefan entscheidet im Dashboard
- **Unsubscribe-Mechanismus / Opt-out-Link** — Single-User-System, kein Bedarf
- **Mehrere Empfänger** — nur Stefan, kein Multi-Tenant
- **Alert-Mails bei Generierungsfehler** — nur bei Erfolg; Fehler-Monitoring via Vercel/Supabase, nicht per Mail
- **Konfigurierbare Versandzeit** — immer direkt nach Generierung (6 Uhr UTC / 8 Uhr Wien)
- **Rich HTML-Template mit Logo/Branding** — einfaches HTML reicht für MVP; Branding kann später hinzugefügt werden

## Acceptance Criteria

**Format:** Angenommen [Vorbedingung] / Wenn [Aktion] / Dann [Ergebnis]

- [ ] Angenommen NORA hat heute erfolgreich Vorschläge generiert, wenn der Cron-Job erfolgreich abschließt, dann wird eine E-Mail an `billichstefan@gmail.com` mit Anzahl der Vorschläge und Dashboard-Link gesendet
- [ ] Angenommen die E-Mail wird versendet, wenn Stefan sie öffnet, dann sieht er die Anzahl der neuen Vorschläge und einen klickbaren "Dashboard öffnen"-Link
- [ ] Angenommen NORA hat heute bereits generiert (`already_generated`), wenn der Cron erneut läuft, dann wird keine zweite Mail gesendet
- [ ] Angenommen die Generierung schlägt fehl, wenn der Cron-Job mit Fehler endet, dann wird keine Mail gesendet
- [ ] Angenommen `RESEND_API_KEY` ist nicht gesetzt, wenn der Cron läuft, dann wird die Generierung trotzdem abgeschlossen — kein Fehler für Stefan sichtbar, kein Absturz
- [ ] Angenommen Resend nicht erreichbar (Timeout, 5xx), wenn der Versand fehlschlägt, dann läuft die Generierung weiterhin als Erfolg durch — E-Mail-Fehler wird still geloggt, nicht propagiert

## Edge Cases
- **Kein `RESEND_API_KEY`**: Mail-Versand wird übersprungen, Generierung läuft normal weiter
- **Resend Rate-Limit oder 5xx**: Stiller Fallback — kein Retry, kein Fehler propagiert (Cron darf nicht blockieren)
- **0 Vorschläge generiert** (unwahrscheinlich, aber möglich): Keine Mail — Mail nur wenn `count > 0`
- **Doppellauf-Schutz**: `already_generated`-Check in PROJ-2 verhindert Mehrfach-Generierung und damit Mehrfach-Mails
- **Zeitzone**: Mail kommt um 6 Uhr UTC (= 8 Uhr Wien Sommerzeit, 7 Uhr Winter) — akzeptiert, kein dynamisches Timezone-Handling nötig

## Technical Requirements
- Neues npm-Package: `resend`
- Neue Env-Var: `RESEND_API_KEY` (Resend API Key)
- From-Adresse: konfigurierbar via `RESEND_FROM_EMAIL` (Default: Resend Onboarding-Adresse für Entwicklung)
- Integration point: in `src/app/api/generate-suggestions/route.ts` nach erfolgreichem Supabase-Insert, best-effort (eigenes try/catch)
- Empfänger: `billichstefan@gmail.com` (hardcoded oder via Env-Var `NORA_EMAIL_RECIPIENT`)

## Open Questions
- [ ] Eigene Absender-Domain gewünscht (z.B. `nora@nexora.ai`)? Erfordert DNS-Setup in Resend. Kann auch nach dem MVP nachgerüstet werden.

## Decision Log

### Product Decisions
| Decision | Rationale | Date |
|----------|-----------|------|
| Nur Benachrichtigung + Link, keine Vorschau | Hält die Mail minimal; Stefan öffnet sowieso das Dashboard; Vorschau bringt keinen Mehrwert für < 2-Min-Workflow | 2026-06-12 |
| Resend statt Gmail/SMTP | Keine SMTP-Konfiguration, keine App-Passwörter, bessere Deliverability, kostenlos für 1 Mail/Tag | 2026-06-12 |
| Versand direkt nach Generierung, kein separater Cron | Kein zusätzlicher Cron-Job nötig; Mail kommt pünktlich mit dem täglichen Workflow um 8 Uhr Wien | 2026-06-12 |
| Fehler beim Mail-Versand darf Generierung nicht blockieren | PRD-Constraint: täglicher Workflow muss zuverlässig bleiben; E-Mail ist nice-to-have, nicht kritisch | 2026-06-12 |
| Kein Unsubscribe-Link | Single-User-System; kein CAN-SPAM/GDPR-Risiko für interne Tool-Mails an den eigenen Account | 2026-06-12 |

### Technical Decisions
<!-- Added by /architecture -->

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
