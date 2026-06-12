import { Resend } from 'resend'

const DASHBOARD_URL = 'https://ai-coding-starter-kit-psi.vercel.app/dashboard'

function buildHtml(count: number): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="font-family:sans-serif;background:#f4f4f5;padding:32px;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;">
    <p style="font-size:16px;color:#111;margin:0 0 8px;">Hallo Stefan,</p>
    <p style="font-size:16px;color:#374151;margin:0 0 24px;">
      NORA hat heute <strong>${count} neue BizDev-Vorschlag${count === 1 ? '' : 'schläge'}</strong> generiert.
    </p>
    <a href="${DASHBOARD_URL}"
       style="display:inline-block;background:#0078FF;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:15px;font-weight:600;">
      Dashboard öffnen →
    </a>
  </div>
</body>
</html>`
}

export async function sendDailyDigest(count: number): Promise<void> {
  if (count <= 0) return

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
  const to = process.env.NORA_EMAIL_RECIPIENT ?? 'billichstefan@gmail.com'

  const resend = new Resend(apiKey)

  await resend.emails.send({
    from,
    to,
    subject: `NORA: ${count} neue BizDev-Vorschlag${count === 1 ? '' : 'schläge'} warten`,
    html: buildHtml(count),
  })
}
