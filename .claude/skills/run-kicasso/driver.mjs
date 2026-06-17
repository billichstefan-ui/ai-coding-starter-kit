#!/usr/bin/env node
// Drives the running KIcasso dev server with headless Chromium and screenshots routes.
//
// Why a custom driver (and not chromium-cli): chromium-cli is not available in this
// environment, and Playwright's own browser download (cdn.playwright.dev) is blocked by
// the network egress allowlist. So we point playwright-core (already a dependency) at the
// Chromium binary baked into the container image under /opt/pw-browsers.
//
// Usage:  node .claude/skills/run-kicasso/driver.mjs [route ...]
//   defaults to /login. Each route is navigated, screenshotted, and its final URL +
//   console errors are reported. Final URL reveals auth redirects (e.g. /dashboard -> /login).
// Env:    BASE_URL (default http://localhost:3000), SHOT_DIR (default /tmp/kicasso-shots),
//         PW_CHROME (override Chromium path).
import { chromium } from 'playwright-core'
import { mkdirSync, existsSync, readdirSync } from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const OUT = process.env.SHOT_DIR || '/tmp/kicasso-shots'
const routes = process.argv.slice(2)
if (routes.length === 0) routes.push('/login')

function findChrome() {
  if (process.env.PW_CHROME && existsSync(process.env.PW_CHROME)) return process.env.PW_CHROME
  const root = '/opt/pw-browsers'
  if (existsSync(root)) {
    for (const dir of readdirSync(root)) {
      if (dir.startsWith('chromium-') && !dir.includes('headless')) {
        const p = `${root}/${dir}/chrome-linux/chrome`
        if (existsSync(p)) return p
      }
    }
  }
  throw new Error('No Chromium under /opt/pw-browsers — set PW_CHROME to a chrome binary')
}

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({
  executablePath: findChrome(),
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()

let failed = false
for (const route of routes) {
  const errors = []
  const onConsole = (m) => { if (m.type() === 'error') errors.push(m.text()) }
  const onPageError = (e) => errors.push('pageerror: ' + e.message)
  page.on('console', onConsole)
  page.on('pageerror', onPageError)
  const slug = route.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'root'
  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 })
    const file = `${OUT}/${slug}.png`
    await page.screenshot({ path: file, fullPage: true })
    console.log(`OK  ${route} -> ${page.url()}  [${file}]  console-errors: ${errors.length ? JSON.stringify(errors) : 'none'}`)
  } catch (e) {
    console.log(`ERR ${route}: ${e.message}`)
    failed = true
  } finally {
    page.off('console', onConsole)
    page.off('pageerror', onPageError)
  }
}

await browser.close()
process.exit(failed ? 1 : 0)
