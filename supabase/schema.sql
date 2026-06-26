-- ============================================================
-- NORA — Kordix AI BizDev Agent
-- Datenbankschema für Supabase (PROJ-1)
--
-- Ausführen in: Supabase Dashboard → SQL Editor → New Query
-- Dieses Skript ist idempotent — es kann gefahrlos mehrfach
-- ausgeführt werden (DROP POLICY IF EXISTS + IF NOT EXISTS).
-- ============================================================

-- ─── suggestions ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suggestions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  report_date DATE NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('marketing', 'product', 'operations')),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  insight     TEXT,
  source      TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ
);

ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Vorschläge lesen" ON suggestions;
CREATE POLICY "Eingeloggte Nutzer können Vorschläge lesen"
  ON suggestions FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Vorschläge anlegen" ON suggestions;
CREATE POLICY "Eingeloggte Nutzer können Vorschläge anlegen"
  ON suggestions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Vorschläge aktualisieren" ON suggestions;
CREATE POLICY "Eingeloggte Nutzer können Vorschläge aktualisieren"
  ON suggestions FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_suggestions_report_date ON suggestions(report_date DESC);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_category ON suggestions(category);

-- ─── implementations ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS implementations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  suggestion_id    UUID NOT NULL REFERENCES suggestions(id) ON DELETE CASCADE,
  monday_task_id   TEXT,
  monday_task_url  TEXT,
  notion_page_id   TEXT,
  notion_page_url  TEXT,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'failed')),
  error_message    TEXT
);

ALTER TABLE implementations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Umsetzungen lesen" ON implementations;
CREATE POLICY "Eingeloggte Nutzer können Umsetzungen lesen"
  ON implementations FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Umsetzungen anlegen" ON implementations;
CREATE POLICY "Eingeloggte Nutzer können Umsetzungen anlegen"
  ON implementations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Umsetzungen aktualisieren" ON implementations;
CREATE POLICY "Eingeloggte Nutzer können Umsetzungen aktualisieren"
  ON implementations FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_implementations_suggestion_id ON implementations(suggestion_id);
CREATE INDEX IF NOT EXISTS idx_implementations_status ON implementations(status);

-- ─── daily_reports ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_reports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  report_date       DATE NOT NULL UNIQUE,
  suggestions_count INT NOT NULL DEFAULT 0,
  email_sent_at     TIMESTAMPTZ,
  email_status      TEXT NOT NULL DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'failed'))
);

ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Reports lesen" ON daily_reports;
CREATE POLICY "Eingeloggte Nutzer können Reports lesen"
  ON daily_reports FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Reports anlegen" ON daily_reports;
CREATE POLICY "Eingeloggte Nutzer können Reports anlegen"
  ON daily_reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Reports aktualisieren" ON daily_reports;
CREATE POLICY "Eingeloggte Nutzer können Reports aktualisieren"
  ON daily_reports FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_daily_reports_report_date ON daily_reports(report_date DESC);

-- ─── PROJ-2: Generierungs-Status ────────────────────────────
-- Separate Spalte für den Status des Vorschlags-Generierungslaufs.
-- (email_status bleibt für das spätere E-Mail-Report-Feature reserviert.)
ALTER TABLE daily_reports
  ADD COLUMN IF NOT EXISTS generation_status TEXT NOT NULL DEFAULT 'pending'
  CHECK (generation_status IN ('pending', 'sent', 'failed'));

-- ─── PROJ-6: implemented-Status für suggestions ────────────
-- Erweitert die CHECK-Constraint um den neuen 'implemented'-Status.
-- Idempotent: DROP IF EXISTS + ADD CONSTRAINT.
ALTER TABLE suggestions DROP CONSTRAINT IF EXISTS suggestions_status_check;
ALTER TABLE suggestions ADD CONSTRAINT suggestions_status_check
  CHECK (status IN ('pending', 'approved', 'rejected', 'implemented'));

-- ─── PROJ-9 / PROJ-10: zusätzliche Kategorien für suggestions ─────
-- Erweitert die category-CHECK-Constraint um 'digital_product' (PROJ-9, Produkt-Chance)
-- und 'design' (PROJ-10, Design & Brand). Idempotent: DROP IF EXISTS + ADD.
ALTER TABLE suggestions DROP CONSTRAINT IF EXISTS suggestions_category_check;
ALTER TABLE suggestions ADD CONSTRAINT suggestions_category_check
  CHECK (category IN ('marketing', 'product', 'operations', 'digital_product', 'design'));

-- ─── PROJ-4: app_config ─────────────────────────────────────
-- Key-Value-Store für Laufzeitkonfiguration (z.B. monday_board_id).
CREATE TABLE IF NOT EXISTS app_config (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Config lesen" ON app_config;
CREATE POLICY "Eingeloggte Nutzer können Config lesen"
  ON app_config FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Config schreiben" ON app_config;
CREATE POLICY "Eingeloggte Nutzer können Config schreiben"
  ON app_config FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Config aktualisieren" ON app_config;
CREATE POLICY "Eingeloggte Nutzer können Config aktualisieren"
  ON app_config FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- COMPANY OS — Phase 0 Foundation (additive, idempotent)
-- Tables: orgs, modules, data_sources, events, kpi_snapshots
-- RLS-Muster identisch zu NORA: eingeloggt = Zugriff.
-- Schreibende Cron-/Agent-Jobs nutzen den Service-Role-Key.
-- ============================================================

-- ─── orgs (Mandant; heute 1 Zeile) ──────────────────────────
CREATE TABLE IF NOT EXISTS orgs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Orgs lesen" ON orgs;
CREATE POLICY "Eingeloggte Nutzer können Orgs lesen"
  ON orgs FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Orgs schreiben" ON orgs;
CREATE POLICY "Eingeloggte Nutzer können Orgs schreiben"
  ON orgs FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─── modules (steuert IA-Rendering: slot | live | hidden) ───
CREATE TABLE IF NOT EXISTS modules (
  key         TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'slot' CHECK (status IN ('slot','live','hidden')),
  sort_order  INT NOT NULL DEFAULT 0
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Module lesen" ON modules;
CREATE POLICY "Eingeloggte Nutzer können Module lesen"
  ON modules FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Module schreiben" ON modules;
CREATE POLICY "Eingeloggte Nutzer können Module schreiben"
  ON modules FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─── data_sources (Connector-Verbindungen; Empty-Slot-Doktrin) ─
CREATE TABLE IF NOT EXISTS data_sources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  module_key  TEXT NOT NULL REFERENCES modules(key),
  provider    TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'disconnected'
              CHECK (status IN ('disconnected','connected','error')),
  last_sync   TIMESTAMPTZ,
  meta        JSONB NOT NULL DEFAULT '{}'::jsonb
);
-- Secrets/Tokens NICHT hier → Supabase Vault.

ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Quellen lesen" ON data_sources;
CREATE POLICY "Eingeloggte Nutzer können Quellen lesen"
  ON data_sources FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Quellen schreiben" ON data_sources;
CREATE POLICY "Eingeloggte Nutzer können Quellen schreiben"
  ON data_sources FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_data_sources_module ON data_sources(module_key);

-- ─── events (append-only Activity-Stream / Audit-Trail) ─────
CREATE TABLE IF NOT EXISTS events (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id      UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  ts          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  module_key  TEXT,
  actor       TEXT NOT NULL,
  verb        TEXT NOT NULL,
  entity      TEXT,
  summary     TEXT NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Events lesen" ON events;
CREATE POLICY "Eingeloggte Nutzer können Events lesen"
  ON events FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können Events schreiben" ON events;
CREATE POLICY "Eingeloggte Nutzer können Events schreiben"
  ON events FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts DESC);
CREATE INDEX IF NOT EXISTS idx_events_module ON events(module_key, ts DESC);

-- ─── kpi_snapshots (BI-Kern; Dashboard liest nur Postgres) ──
CREATE TABLE IF NOT EXISTS kpi_snapshots (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id      UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  metric      TEXT NOT NULL,
  value       NUMERIC NOT NULL,
  unit        TEXT,
  captured_at DATE NOT NULL,
  source      TEXT NOT NULL,
  meta        JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (org_id, metric, captured_at)
);

ALTER TABLE kpi_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Eingeloggte Nutzer können KPIs lesen" ON kpi_snapshots;
CREATE POLICY "Eingeloggte Nutzer können KPIs lesen"
  ON kpi_snapshots FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Eingeloggte Nutzer können KPIs schreiben" ON kpi_snapshots;
CREATE POLICY "Eingeloggte Nutzer können KPIs schreiben"
  ON kpi_snapshots FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_kpi_metric_date ON kpi_snapshots(metric, captured_at DESC);

-- ─── Seed: eine Org + Module (idempotent) ───────────────────
INSERT INTO orgs (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Kordix AI')
ON CONFLICT (id) DO NOTHING;

INSERT INTO modules (key, label, status, sort_order) VALUES
  ('home',      'CEO Home',            'live',   0),
  ('projects',  'Projects',            'slot',  10),
  ('agents',    'AI Agents',           'live',  20),
  ('crm',       'CRM',                 'slot',  30),
  ('finance',   'Finance',             'slot',  40),
  ('marketing', 'Marketing',           'slot',  50),
  ('products',  'Products',            'slot',  60),
  ('knowledge', 'Knowledge',           'slot',  70),
  ('documents', 'Documents',           'slot',  80),
  ('analytics', 'Executive Analytics', 'slot',  90),
  ('copilot',   'Copilot',             'slot', 100)
ON CONFLICT (key) DO NOTHING;
