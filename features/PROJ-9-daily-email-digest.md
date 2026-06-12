# PROJ-9: Daily Email-Digest

## Status: Architected
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
| Decision | Rationale | Date |
|----------|-----------|------|
| Neues Modul `src/lib/email.ts` statt direkte Integration in `route.ts` | Separation of concerns; leichter testbar; Resend-Abhängigkeit isoliert | 2026-06-12 |
| Resend SDK (`resend` npm-Package) | Offizielles SDK, typisiert, kein SMTP-Setup, 100 Mails/Tag kostenlos | 2026-06-12 |
| Integration nach Supabase-Insert, vor dem Return | Mail kommt nur bei echtem Erfolg; schlägt die Insert fehl, wird keine Mail gesendet | 2026-06-12 |
| Empfänger via `NORA_EMAIL_RECIPIENT` Env-Var | Flexibler als hardcoded; kein Code-Change bei Adressänderung | 2026-06-12 |
| Kein Retry bei Resend-Fehler | Cron läuft täglich; beim nächsten Lauf kommt die nächste Mail — Retry-Logik unnötige Komplexität | 2026-06-12 |

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Datenfluss

```
Vercel Cron (täglich 6 Uhr UTC = 8 Uhr Wien)
  ↓
GET /api/generate-suggestions            [bestehend — PROJ-2]
  ↓  already_generated? → return skipped (keine Mail)
  ↓  fetchLiveContext()                  [bestehend — PROJ-7]
  ↓  generateSuggestions() via Claude    [bestehend — PROJ-2]
  ↓  Supabase INSERT ✓
  ↓  sendDailyDigest(count)              [NEU — best-effort, eigenes try/catch]
      └── RESEND_API_KEY fehlt? → still überspringen
      └── Resend wirft Fehler? → still loggen, nicht propagieren
  ↓  return { success: true, count }
```

### Neue / geänderte Dateien

| Datei | Änderung |
|-------|----------|
| `src/lib/email.ts` | **Neu** — `sendDailyDigest(count: number): Promise<void>` — baut Mail-Inhalt, sendet via Resend SDK |
| `src/app/api/generate-suggestions/route.ts` | **Kleine Erweiterung** — `sendDailyDigest(rows.length)` nach erfolgreichem Supabase-Insert, eingewickelt in try/catch |
| `.env.local.example` | **Erweitert** — neue Env-Vars dokumentiert |

### E-Mail Inhalt

```
Betreff: NORA: X neue BizDev-Vorschläge warten

Hallo Stefan,

NORA hat heute X neue BizDev-Vorschläge generiert.

[Dashboard öffnen →]  →  https://ai-coding-starter-kit-psi.vercel.app/dashboard
```

Einfaches HTML, kein Branding für MVP.

### Neue Env-Vars

| Variable | Pflicht | Beschreibung |
|----------|---------|--------------|
| `RESEND_API_KEY` | Ja (sonst kein Versand) | Resend API-Schlüssel |
| `RESEND_FROM_EMAIL` | Nein | Absender (Default: `onboarding@resend.dev` für Tests) |
| `NORA_EMAIL_RECIPIENT` | Nein | Empfänger (Default: `billichstefan@gmail.com`) |

### Neues Package

| Package | Version | Zweck |
|---------|---------|-------|
| `resend` | latest | Offizielles Resend SDK — typisiert, kein SMTP |

**Keine neuen Datenbank-Tabellen. Kein neues UI. Kein neuer Cron-Job.**

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
