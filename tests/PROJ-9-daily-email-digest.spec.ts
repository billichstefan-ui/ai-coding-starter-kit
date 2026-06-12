import { test, expect } from '@playwright/test'

/**
 * E2E-Tests für PROJ-9: Daily Email-Digest
 *
 * PROJ-9 ist ein reines Backend-Feature ohne UI-Änderungen.
 * Die vollständige Logik (Resend-Versand, best-effort, Doppellauf-Schutz,
 * Env-Var-Guards) wird von 9 Unit-Tests in:
 *   - src/lib/email.test.ts (7 Tests)
 *   - src/app/api/generate-suggestions/route.test.ts (2 neue Tests)
 * abgedeckt.
 *
 * Tests die RESEND_API_KEY + Supabase + Claude erfordern, sind mit
 * test.skip markiert, bis Credentials verfügbar sind.
 *
 * Route-Schutz-Tests laufen ohne Credentials.
 */

test.describe('PROJ-9: Route-Schutz (keine Credentials nötig)', () => {
  test('gibt 401 zurück für nicht autorisierte Anfragen an /api/generate-suggestions', async ({ request }) => {
    const res = await request.post('/api/generate-suggestions')
    expect(res.status()).toBe(401)
  })

  test('gibt 401 zurück für GET ohne Cron-Secret', async ({ request }) => {
    const res = await request.get('/api/generate-suggestions')
    expect(res.status()).toBe(401)
  })
})

test.describe('PROJ-9: E-Mail-Digest (Credential-abhängig — skipped)', () => {
  test.skip('AC-1: Generierung erfolgreich → E-Mail an billichstefan@gmail.com gesendet', async () => {
    // Requires: RESEND_API_KEY, SUPABASE credentials, ANTHROPIC_API_KEY, CRON_SECRET
    // Test: POST /api/generate-suggestions with valid CRON_SECRET,
    //       verify Resend delivery to billichstefan@gmail.com
  })

  test.skip('AC-2: E-Mail enthält Anzahl der Vorschläge und Dashboard-Link', async () => {
    // Requires: Same as AC-1 + email inbox access
    // Test: Check email subject contains count, body contains Dashboard-Link
  })

  test.skip('AC-3: already_generated → keine zweite Mail', async () => {
    // Requires: SUPABASE with existing daily_report for today
    // Test: POST twice, verify sendDailyDigest called only once
  })

  test.skip('AC-5: Fehlender RESEND_API_KEY → Generierung trotzdem erfolgreich', async () => {
    // Requires: SUPABASE + ANTHROPIC credentials, RESEND_API_KEY deliberately missing
    // Test: POST /api/generate-suggestions, verify 200 success despite no email key
  })
})
