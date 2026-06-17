---
name: run-kicasso
description: >-
  Run, start, launch, build, screenshot, or smoke-test the KIcasso BizDev Agent —
  the Next.js 16 web app in this repo. Boots the dev server with dummy Supabase env
  and drives headless Chromium (via driver.mjs) to screenshot /login and other routes.
  Use when asked to run the app, see it in a browser, or verify UI changes visually.
---

# Run KIcasso (BizDev Agent)

KIcasso is a **Next.js 16 (App Router, Turbopack) web app** with Supabase auth.
A human runs `npm run dev` and opens a browser — useless in a headless container.
The agent path boots the dev server and drives it with **headless Chromium via the
committed `driver.mjs`** (`playwright-core` → a pre-baked Chromium binary).

> Why a custom driver? `chromium-cli` is **not** available here, and Playwright's
> browser download (`cdn.playwright.dev`) is **blocked by the network egress
> allowlist**. `driver.mjs` sidesteps both by pointing `playwright-core` at the
> Chromium already baked into the image under `/opt/pw-browsers`.

All paths below are relative to the repo root (`<unit>/`). The driver lives at
`.claude/skills/run-kicasso/driver.mjs`.

## Prerequisites

- **Node 22** and repo deps installed (`npm install` if `node_modules/` is missing).
  `playwright-core` ships transitively via `@playwright/test` (a devDependency).
- **A Chromium binary.** This container already has one at
  `/opt/pw-browsers/chromium-*/chrome-linux/chrome` — `driver.mjs` auto-discovers it.
  No `apt-get` was needed; the image ships the required shared libs.
  Do **not** run `npx playwright install` — the download is egress-blocked (see Gotchas).
  On a host without `/opt/pw-browsers`, set `PW_CHROME=/path/to/chrome`.

## Run (agent path) — primary

1. **Start the dev server** with dummy Supabase env (the app refuses to boot without
   `NEXT_PUBLIC_SUPABASE_*`; dummy values render the UI but do not authenticate), then
   poll the port — do not `sleep`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co \
   NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-anon-key-not-real \
   npm run dev &
   timeout 60 bash -c 'until curl -sf -o /dev/null http://localhost:3000/login; do sleep 1; done'
   ```

2. **Drive + screenshot.** Pass any routes (defaults to `/login`):

   ```bash
   node .claude/skills/run-kicasso/driver.mjs /login /dashboard
   ```

   Output (verified this session):

   ```
   OK  /login -> http://localhost:3000/login      [/tmp/kicasso-shots/login.png]      console-errors: none
   OK  /dashboard -> http://localhost:3000/login   [/tmp/kicasso-shots/dashboard.png]  console-errors: none
   ```

   Screenshots land in `/tmp/kicasso-shots/<route>.png` (1280×900 @2×). The printed
   **final URL** reveals auth redirects, and console errors are reported per route.
   **Look at the screenshot** — `/login` shows the mascot (via `next/image`), the neon
   `KIcasso` wordmark, the "NORA ist bereit" badge, and the email/password form.

3. **Stop the server:**

   ```bash
   pkill -f "next dev"
   ```

### Reaching the authenticated dashboard

`/dashboard` (and every route except `/login`) is gated by `src/middleware.ts`. With
dummy env there is no session, so it **307-redirects to `/login`** — that is why the
driver reports `/dashboard -> .../login`. To screenshot the real dashboard you need
**real** `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` exported before
`npm run dev`, plus a login step (add `fill` on `input[type=email]` / `input[type=password]`
and `click` "Anmelden" to `driver.mjs` before navigating to `/dashboard`).

## Run (human path)

`npm run dev`, then open <http://localhost:3000>. Requires a real browser window —
pointless in a headless container; use the agent path above.

## Test

- `npm test` — Vitest unit/integration.
- `npm run test:e2e` — Playwright E2E. Note its browser download is egress-blocked here;
  it must be pointed at `/opt/pw-browsers` (same constraint as the driver).

## Gotchas (battle scars from this container)

- **`npx playwright install` fails:** `403 ... Host not in allowlist: cdn.playwright.dev`.
  Never install browsers here — use the pre-baked `/opt/pw-browsers` binary (the driver
  finds it; override with `PW_CHROME`).
- **`chromium-cli` is not installed** — hence the custom `driver.mjs`.
- **Run the driver from inside the repo.** Node resolves `playwright-core` by walking up
  to the repo's `node_modules`; a copy run from `/tmp` dies with
  `ERR_MODULE_NOT_FOUND: playwright-core`.
- **Chromium needs `--no-sandbox`** (running as root) or it exits immediately. The driver
  sets it.
- **App won't boot without `NEXT_PUBLIC_SUPABASE_*`** — `src/lib/supabase.ts` throws on
  missing vars. Dummy values are enough to render `/login`; they do not authenticate.
- **Pass env inline, don't write `.env.local`.** Reading dotenv files is permission-blocked
  in this harness and `.env.local` is gitignored.
- **The small "N" bottom-left** in screenshots is the Next.js dev indicator (dev-only),
  not part of the UI.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `ERR_MODULE_NOT_FOUND: playwright-core` | Run the driver from the repo root, not `/tmp`. |
| `Host not in allowlist: cdn.playwright.dev` | Don't install browsers; use `/opt/pw-browsers` (set `PW_CHROME` if needed). |
| Chromium exits instantly / "No usable sandbox" | Ensure `--no-sandbox` (the driver sets it). |
| `EADDRINUSE` on port 3000 | `pkill -f "next dev"` before relaunching. |
| `/login` 500s or redirects in a loop | Missing `NEXT_PUBLIC_SUPABASE_*` — set the dummy vars from step 1. |
