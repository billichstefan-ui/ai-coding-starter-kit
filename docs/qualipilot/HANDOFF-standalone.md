# QualiPilot — Hand-off: Port in ein eigenständiges Repo (`Kordix-AI/Qualipilot`)

> **Zweck dieses Dokuments.** Das QualiPilot-MVP wurde als Sub-App im Repo
> `billichstefan-ui/ai-coding-starter-kit` gebaut (Branch
> `claude/qualipilot-mvp-local-ai-v3lso9`). Es soll in das dedizierte Produkt-Repo
> `Kordix-AI/Qualipilot` überführt werden. Weil Claude-Code-Sessions **nicht
> cross-org** lesen können, führe diese Anleitung in einer **neuen Session aus,
> die auf `Kordix-AI/Qualipilot` läuft**.

## 0. Quelle (alles hier verlinkt zum verbatim Kopieren)

Branch-Tree:
`https://github.com/billichstefan-ui/ai-coding-starter-kit/tree/claude/qualipilot-mvp-local-ai-v3lso9`

Einzeldatei-Muster (Pfad anhängen):
`https://github.com/billichstefan-ui/ai-coding-starter-kit/blob/claude/qualipilot-mvp-local-ai-v3lso9/<PFAD>`

Der Code ist getestet: `next build` grün, `tsc` 0 Fehler. **Bevorzugt 1:1 kopieren**
(nicht neu erfinden) — nur die unter §4 genannten Anpassungen vornehmen.

## 1. Erst prüfen, was schon da ist
`Kordix-AI/Qualipilot` hat bereits Commits/PRs. **Zuerst den Ist-Zustand ansehen**
(package.json, `src/app`, vorhandene Supabase-/Auth-Konfig). Dann entscheiden:
- Repo ist leer/Starter → sauber scaffolden (§3) und QualiPilot-Dateien einsetzen (§4).
- Repo hat schon eine Next.js-App → QualiPilot-Ordner **einfügen**, Konfig **mergen**
  (nicht blind überschreiben), Versionskonflikte in package.json auflösen.

## 2. Ziel-Stack (identisch zum Original)
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · shadcn/ui ·
lucide-react · Supabase (SSR + Service-Role) · Zod · next-themes (Dark default).

## 3. Standalone-Scaffold (falls Repo leer)

Diese **geteilten Basis-Dateien** aus dem Branch verbatim übernehmen:

| Datei | Zweck |
|---|---|
| `package.json` (nur `dependencies`/`devDependencies` übernehmen) | Deps. `@anthropic-ai/sdk`, monday/notion-bezogene Skripte sind für QualiPilot **nicht** nötig — optional entfernen. |
| `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `components.json` | Build-/Path-/shadcn-Konfig (`@/*` → `src/*`). |
| `tailwind.config.ts` | Tailwind + shadcn-Tokens. |
| `src/app/globals.css` | **Wichtig:** enthält die shadcn-`.dark`-Tokens **und** die `--kx-*` Brand-Tokens (Neon `#0078FF`/`#38E5FF`, Gradient). QualiPilots Optik hängt daran. |
| `src/components/theme-provider.tsx` | next-themes Provider. |
| `src/components/ui/` (**kompletten Ordner**, 35 Dateien) | shadcn-Primitives. Der ganze Ordner ist am einfachsten (garantiert keine fehlende Abhängigkeit). |
| `src/lib/utils.ts` | `cn()`. |
| `src/lib/supabase.ts`, `src/lib/supabase-server.ts` | Browser- + Server-/Service-Role-Clients. QualiPilot importiert `@/lib/supabase-server`. |
| `src/middleware.ts` | Auth-Guard — im Standalone **vereinfachen**, siehe §4.2. |

**Root-Layout** `src/app/layout.tsx` neu anlegen (Sora-Font, Dark-Default, Toaster) —
Inhalt aus dem Original-Root-Layout des Branches übernehmen (Sora, `ThemeProvider
attribute="class" defaultTheme="dark" enableSystem={false}`, `<Toaster richColors
theme="dark" />`, `<html lang="de">` mit `--kx-bg`/`--kx-text` Body-Style).

## 4. QualiPilot-Dateien übernehmen

### 4.1 Manifest (alle aus dem Branch kopieren, Struktur beibehalten)

**DB / Doku / Tracking**
- `supabase/qualipilot_schema.sql`  ← im Ziel-Supabase im SQL-Editor ausführen
- `docs/qualipilot/README.md`, `docs/qualipilot/HANDOFF-standalone.md` (dieses Dok, optional)
- `features/PROJ-11-qualipilot-mvp-local-ai.md` (optional)

**Bibliothek** `src/lib/qualipilot/`
- `types.ts`, `constants.ts`, `db.ts`, `audit.ts`, `fmea.ts`, `format.ts`
- `ai/types.ts`, `ai/openai-compatible.ts`, `ai/ollama.ts`, `ai/disabled.ts`, `ai/factory.ts`, `ai/prompts.ts`

**Komponenten** `src/components/qualipilot/`
- `AppSidebar.tsx`, `Topbar.tsx`, `PageHeader.tsx`, `StatCard.tsx`, `EmptyState.tsx`,
  `ReviewRequiredBanner.tsx`, `badges.tsx`, `nav.ts`

**Routen** `src/app/qualipilot/`
- `page.tsx` (Redirect), `(app)/layout.tsx`
- `(auth)/`: `layout.tsx`, `actions.ts`, `login/page.tsx`, `register/page.tsx`
- `(app)/dashboard/page.tsx`
- `(app)/projects/`: `page.tsx`, `[id]/page.tsx`, `new/page.tsx`, `actions.ts`
- `(app)/documents/`: `page.tsx`, `[id]/page.tsx`, `actions.ts`
- `(app)/ai-generator/`: `page.tsx`, `AiGeneratorPanel.tsx`
- `(app)/risk-assessment/`: `page.tsx`, `NewRiskForm.tsx`, `actions.ts`
- `(app)/traceability/page.tsx`
- `(app)/audit-trail/page.tsx`
- `(app)/settings/`: `SettingsNav.tsx`, `actions.ts`, `ai-providers/{page.tsx,AiProvidersManager.tsx}`, `organization/{page.tsx,OrgForm.tsx}`, `users/page.tsx`
- `api/ai/`: `test/route.ts`, `generate/route.ts`

Alle internen Imports nutzen `@/lib/qualipilot/*`, `@/components/qualipilot/*`,
`@/components/ui/*`, `@/lib/supabase-server` — bleiben unverändert gültig, wenn die
Ordnerstruktur erhalten bleibt.

### 4.2 Anpassungen im Standalone

**A) URL-Prefix — zwei Optionen:**

- **Option „einfach" (empfohlen für den ersten grünen Build):** Struktur **1:1
  lassen**. QualiPilot läuft dann unter `/qualipilot/*` auch im eigenen Repo.
  Null Refactor, sofort lauffähig. URLs später flatten.

- **Option „sauber" (flache URLs, `/dashboard` statt `/qualipilot/dashboard`):**
  1. In `src/lib/qualipilot/constants.ts`: `export const QP_BASE = ''`.
  2. Ordner hochziehen: `src/app/qualipilot/(app)` → `src/app/(app)`,
     `…/qualipilot/(auth)` → `src/app/(auth)`, `…/qualipilot/api` → `src/app/api`,
     `…/qualipilot/page.tsx` entfernen (Root-Redirect nicht mehr nötig).
  3. Alle **hartkodierten** `'/qualipilot/…'`-Strings ersetzen durch `'/…'`
     (v. a. in `*/actions.ts` bei `revalidatePath(...)` und `redirect(...)`,
     sowie evtl. in einzelnen `page.tsx`/Panels). Grep: `rg "/qualipilot/"`.
  4. Root-`layout.tsx` rendert dann direkt die App-Shell-Struktur.

**B) Middleware** (`src/middleware.ts`): Der Original-Guard kennt zwei Produkte
(`/login` **und** `/qualipilot/login`). Im Standalone brauchst du nur eins:
- Public-Pfade = `['/login','/register']` (bzw. `['/qualipilot/login','/qualipilot/register']`
  in Option „einfach"), sonst → Login-Redirect. Eingeloggte auf der Login-Seite →
  Dashboard. Den `/api`-Ausschluss im `matcher` beibehalten.

**C) `db.ts` / Auth:** unverändert. `requireQpContext()` leitet ohne Session zum
Login und ohne Profil zur Registrierung (Onboarding legt Org + Admin-Profil via
Service-Role an). Kein Company-OS mehr → die frühere „Onboarding für bestehende
OS-Nutzer"-Semantik ist im Standalone einfach der Normalfall.

## 5. Environment-Variablen (im Ziel-Repo / Vercel setzen)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...      # Pflicht für Registrierung/Onboarding
```
Lokale KI optional (oder pro Org in der App unter Einstellungen → KI-Provider):
```
# OpenAI-kompatibel (LM Studio / LocalAI / llama-cpp-python)
AI_PROVIDER=openai-compatible
AI_BASE_URL=http://localhost:1234/v1
AI_API_KEY=local-not-required
AI_MODEL=local-model-name
AI_TEMPERATURE=0.2
AI_MAX_TOKENS=4000
# ODER Ollama
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

## 6. Verifizieren (in der neuen Session)
```
npm install
npx tsc --noEmit         # muss 0 Fehler zeigen
npm run build            # muss grün sein
npm run dev              # → /qualipilot (Option „einfach") bzw. / (Option „sauber")
```
Danach Smoke-Test: Registrieren → Projekt → AI Draft (mit lokalem KI-Server) →
Dokument freigeben → Audit Trail.

## 7. GMP-Invarianten (beim Port NICHT verwässern)
- KI-Ausgaben immer `review_required = true`, nie automatisch `approved`.
- Approved-Dokumente werden nicht überschrieben → neue Version (`qp_document_versions`).
- Audit-Trail append-only (kein UPDATE/DELETE via RLS).
- FMEA: `RPN = S×O×D`; Klassen 1–30/31–80/81–150/>150; Critical/High brauchen Maßnahme.
- RLS org-scoped (`qp_user_org_id`); Provider-Secrets admin-only (`qp_is_admin`).
- Offene Härtung (SQL-TODOs): Secret-Verschlüsselung via Supabase Vault,
  Trigger-erzwungenes Append-Only für `qp_ai_generations`.

## 8. Prompt für die neue Session (zum Einfügen)
> „Dies ist das Repo `Kordix-AI/Qualipilot`. Sieh dir zuerst den aktuellen Stand an.
> Dann portiere das QualiPilot-MVP hierher gemäß der Hand-off-Spec (Dateimanifest,
> Standalone-Scaffold, Anpassungen). Quelle der Dateien ist der Branch
> `claude/qualipilot-mvp-local-ai-v3lso9` in `billichstefan-ui/ai-coding-starter-kit`
> (im Browser einsehbar). Nutze Option ‚einfach' für den ersten grünen Build, dann
> zeig mir das Ergebnis, bevor wir URLs flatten. Wahre alle GMP-Invarianten."
