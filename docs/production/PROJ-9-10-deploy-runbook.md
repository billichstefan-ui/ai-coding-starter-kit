# Deploy-Runbook — PROJ-9 (Produkt-Chance) & PROJ-10 (Design & Brand)

> Status beider Features: **Approved** (Code gemergt, `tsc` exit 0, 123/123 Unit-Tests grün, Production-Build erfolgreich).
> Es fehlen nur noch zwei **credential-gebundene** Schritte, die in der CI-/Remote-Umgebung nicht ausführbar sind und von Stefan ausgeführt werden müssen.

## Was bereits erledigt ist
- `design` in der Haupt-Generierung (`src/lib/anthropic.ts`), Brand-Kontext in `src/lib/nora-context.ts`.
- `digital_product` als separater best-effort Insert (`src/app/api/generate-suggestions/route.ts`).
- Dashboard-Configs (Badge/Farbe/Gruppierung) für beide Kategorien.
- Kombinierte Migration in `supabase/schema.sql` (idempotent).

## Schritt 1 — Supabase-Migration anwenden (PFLICHT)
Ohne diesen Schritt lehnt Postgres Inserts mit `category = 'design'` bzw. `'digital_product'` ab.

1. Supabase Dashboard → **SQL Editor** → New Query.
2. Inhalt von `supabase/schema.sql` einfügen und ausführen (das Skript ist idempotent — gefahrlos mehrfach ausführbar).
3. Verifizieren:
   ```sql
   SELECT conname, pg_get_constraintdef(oid)
   FROM pg_constraint
   WHERE conname = 'suggestions_category_check';
   ```
   Erwartet: CHECK enthält `'marketing', 'product', 'operations', 'digital_product', 'design'`.

**Wichtig:** Für `design` ist die Migration besonders kritisch, weil `design` Teil des **Kern-Batch-Inserts** ist — fehlt die Migration, scheitert der gesamte Tageslauf (anders als die Produkt-Chance, die als separater best-effort Insert isoliert ist).

## Schritt 2 — Vercel-Deploy
1. Erforderliche Env-Vars in Vercel prüfen (Production): `ANTHROPIC_API_KEY`, `CRON_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Supabase Service-Role-Key, Monday-/Notion-Tokens.
2. Branch `claude/upbeat-shannon-41c901` nach `main` mergen (per PR) **oder** in Vercel ein manuelles Deployment des Branches auslösen.
3. Cron läuft laut `vercel.json` täglich um 06:00 UTC auf `/api/generate-suggestions`.

## Schritt 3 — Smoke-Test (nach Deploy)
1. Dashboard öffnen → „Vorschläge generieren" auslösen (oder Cron abwarten).
2. Prüfen: erscheinen Vorschläge der Gruppe **„Design & Brand"** (Badge Deep Teal `#0E9594`) und ggf. eine **„Produkt-Chance"** (Periwinkle `#7B81FF`)?
3. Einen `design`-Vorschlag bestätigen → Monday-Task + Notion-Doku entstehen über die bestehende Pipeline.

## Nach erfolgreichem Deploy
- Status in `features/INDEX.md`, den Spec-Headern (PROJ-9, PROJ-10) und `docs/PRD.md` auf **Deployed** setzen.
- `## Deployment`-Sektion in beiden Specs mit Datum/Commit füllen.
