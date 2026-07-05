# PROJ-11 — QualiPilot MVP (Local AI powered GMP Qualification Platform)

- **Status:** In Progress
- **Created:** 2026-07-05
- **Owner:** Stefan Billich
- **Branch:** `claude/qualipilot-mvp-local-ai-v3lso9`

## Kontext

QualiPilot ist ein **eigenständiges Kordix-Produkt** (im Portfolio als P0
geführt): eine GMP-orientierte Plattform für Qualifizierungs-/Validierungs-
dokumente mit **lokaler KI-Unterstützung**. Es wird als isolierte Sub-App im
bestehenden Repo unter `/qualipilot` aufgebaut (eigene Shell, eigenes Login,
eigene `qp_*`-Tabellen), damit es Company OS / NORA nicht berührt und später
extrahierbar bleibt.

Ausführliche Doku: `docs/qualipilot/README.md`.

## Scope (MVP)

Kernbereiche: Dashboard · Projektverwaltung · Dokumentenverwaltung ·
AI Draft Generator · Risk Assessment/FMEA · Traceability Matrix ·
Audit-Trail-Grundstruktur · KI-Provider-Einstellungen · Review-Required-Workflow.

### AI Provider Layer
Einheitliches `AIProvider`-Interface; Provider: `OpenAICompatibleProvider`
(LM Studio/LocalAI/…), `OllamaProvider`, `DisabledProvider`. Konfiguration per
Org (DB) oder ENV; Fallback ohne Server → „Local AI unavailable", App bleibt nutzbar.
`testConnection()` prüft Erreichbarkeit/Modell/Chat/Embedding.

### GMP-Grundsätze (Akzeptanzkriterien)
- KI-Ausgaben sind immer Entwürfe (`review_required = true`), nie auto-`approved`.
- Approved-Dokumente werden nicht überschrieben → neue Version.
- Audit-Trail append-only (kein UPDATE/DELETE via RLS).
- FMEA: `RPN = S×O×D`; Klassen Low/Medium/High/Critical; Critical/High brauchen Maßnahme.
- RLS org-scoped; Provider-Secrets admin-only.

### RAG
Nur vorbereitet: `qp_rag_sources`, `qp_rag_chunks` (`vector(768)`),
`generateEmbedding` in den Providern. Kein Chunking/Index/Suche im MVP.

## Implementierung (Ist-Stand)

**Fundament:**
- `supabase/qualipilot_schema.sql` — alle `qp_*`-Tabellen, RLS
  (`qp_user_org_id()`/`qp_is_admin()`), Trigger, pgvector-Vorbereitung.
- `src/lib/qualipilot/` — `types`, `constants`, `db` (`requireQpContext`),
  `audit`, `fmea`, `format`.
- `src/lib/qualipilot/ai/` — `types` (Interface), `openai-compatible`, `ollama`,
  `disabled`, `factory`, `prompts`.
- API-Routen: `api/ai/test`, `api/ai/generate`.

**Shell / Auth:**
- `(app)/layout.tsx` (Sidebar + Topbar + Auth-Gate), `(auth)/` Login/Register +
  Server-Actions (Org+Profil-Bootstrap via Service-Role), Middleware um
  QualiPilot-Public-Routen erweitert.
- Komponenten: `AppSidebar`, `Topbar`, `PageHeader`, `StatCard`, `EmptyState`,
  `ReviewRequiredBanner`, Badges (Status/Risk/Test/Coverage).

**Module:** Dashboard, Projekte (Liste/Detail/Neu), Dokumente (Liste/Detail +
Versionshistorie + Freigabe), AI Draft Generator, Risk/FMEA (Liste + Formular
mit Live-RPN), Traceability-Matrix, Audit-Trail, Einstellungen
(KI-Provider/Organisation/Nutzer).

## Deviations / offene Punkte
- DB-Isolation via `qp_`-Prefix statt eigenem Postgres-Schema (Robustheit ohne
  Dashboard-Setup). Migration auf dediziertes Schema später trivial.
- Provider-API-Key im MVP als Klartext in `api_key_encrypted` (TODO: Supabase Vault).
- Append-Only-Semantik für `qp_ai_generations` als RLS-TODO (Trigger folgt).
- Nutzerverwaltung schreibgeschützt (Einladungen später).

## Nächste Schritte
`/qa` gegen die GMP-Akzeptanzkriterien, danach `/deploy` (Vercel + Supabase-Migration).
