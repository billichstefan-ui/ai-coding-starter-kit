-- ============================================================
-- QualiPilot — Local AI powered GMP Qualification Platform
-- Supabase-Schema (Tabellen, RLS, pgvector-Vorbereitung)
--
-- Ausführen in: Supabase Dashboard → SQL Editor → New Query
-- Idempotent: mehrfaches Ausführen ist gefahrlos
-- (CREATE ... IF NOT EXISTS, DROP POLICY IF EXISTS, CREATE OR REPLACE).
--
-- Namenskonvention: alle QualiPilot-Tabellen sind mit `qp_` geprefixt und
-- liegen bewusst im `public`-Schema. Grund: keine Kollision mit den bereits
-- vorhandenen Company-OS-Tabellen `projects`/`documents`, und supabase-js
-- funktioniert ohne zusätzliche "Exposed schemas"-Konfiguration.
--
-- GMP-Grundsatz (verankert in Constraints/Triggern):
--   * KI-Ausgaben sind immer Draft + review_required = true.
--   * Approved-Dokumente werden nicht überschrieben, sondern versioniert.
--   * Der Audit-Trail ist append-only (kein UPDATE/DELETE via RLS).
-- ============================================================

-- pgvector für spätere RAG-Embeddings (nur vorbereiten).
CREATE EXTENSION IF NOT EXISTS vector;

-- ─────────────────────────────────────────────────────────────
-- RLS-Hilfsfunktionen
--   qp_user_org_id(): die organization_id des eingeloggten Nutzers.
--   qp_is_admin():    true, wenn der Nutzer die Rolle 'admin' hat.
-- SECURITY DEFINER + STABLE, damit RLS-Policies auf qp_profiles
-- zugreifen können, ohne rekursiv die eigene Policy auszulösen.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qp_organizations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qp_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES qp_organizations(id) ON DELETE SET NULL,
  full_name       TEXT,
  role            TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'reviewer', 'approver')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION qp_user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM qp_profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION qp_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM qp_profiles WHERE id = auth.uid() AND role = 'admin'
  )
$$;

-- Generischer updated_at-Trigger.
CREATE OR REPLACE FUNCTION qp_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ─── qp_organizations: RLS ──────────────────────────────────
ALTER TABLE qp_organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_org_select" ON qp_organizations;
CREATE POLICY "qp_org_select" ON qp_organizations FOR SELECT
  USING (id = qp_user_org_id());

DROP POLICY IF EXISTS "qp_org_update" ON qp_organizations;
CREATE POLICY "qp_org_update" ON qp_organizations FOR UPDATE
  USING (id = qp_user_org_id() AND qp_is_admin());

DROP TRIGGER IF EXISTS trg_qp_org_touch ON qp_organizations;
CREATE TRIGGER trg_qp_org_touch BEFORE UPDATE ON qp_organizations
  FOR EACH ROW EXECUTE FUNCTION qp_touch_updated_at();

-- ─── qp_profiles: RLS ───────────────────────────────────────
ALTER TABLE qp_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_profiles_select" ON qp_profiles;
CREATE POLICY "qp_profiles_select" ON qp_profiles FOR SELECT
  USING (organization_id = qp_user_org_id() OR id = auth.uid());

-- Nutzer darf das eigene Profil aktualisieren; Admins alle in der Org.
DROP POLICY IF EXISTS "qp_profiles_update" ON qp_profiles;
CREATE POLICY "qp_profiles_update" ON qp_profiles FOR UPDATE
  USING (id = auth.uid() OR (organization_id = qp_user_org_id() AND qp_is_admin()));

-- INSERT läuft beim Registrieren über den Service-Role-Key (bypassed RLS).
DROP TRIGGER IF EXISTS trg_qp_profiles_touch ON qp_profiles;
CREATE TRIGGER trg_qp_profiles_touch BEFORE UPDATE ON qp_profiles
  FOR EACH ROW EXECUTE FUNCTION qp_touch_updated_at();

-- ─── qp_projects ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qp_projects (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id    UUID NOT NULL REFERENCES qp_organizations(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  customer           TEXT,
  site               TEXT,
  system_name        TEXT,
  system_description TEXT,
  gmp_relevance      TEXT,
  gamp_category      TEXT,
  risk_class         TEXT,
  status             TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'in_progress', 'in_review', 'approved', 'archived')),
  owner_id           UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  start_date         DATE,
  target_date        DATE,
  created_by         UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  updated_by         UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_projects_all" ON qp_projects;
CREATE POLICY "qp_projects_all" ON qp_projects FOR ALL
  USING (organization_id = qp_user_org_id())
  WITH CHECK (organization_id = qp_user_org_id());

CREATE INDEX IF NOT EXISTS idx_qp_projects_org ON qp_projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_qp_projects_status ON qp_projects(status);

DROP TRIGGER IF EXISTS trg_qp_projects_touch ON qp_projects;
CREATE TRIGGER trg_qp_projects_touch BEFORE UPDATE ON qp_projects
  FOR EACH ROW EXECUTE FUNCTION qp_touch_updated_at();

-- ─── qp_documents ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qp_documents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES qp_organizations(id) ON DELETE CASCADE,
  project_id        UUID REFERENCES qp_projects(id) ON DELETE SET NULL,
  document_type     TEXT NOT NULL,
  document_number   TEXT,
  title             TEXT NOT NULL,
  version           INT NOT NULL DEFAULT 1,
  status            TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'ai_generated', 'in_review', 'reviewed', 'approved', 'obsolete')),
  content           JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_generated      BOOLEAN NOT NULL DEFAULT false,
  review_required   BOOLEAN NOT NULL DEFAULT false,
  author_id         UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  reviewer_id       UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  approver_id       UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  approved_at       TIMESTAMPTZ,
  created_by        UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  updated_by        UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_documents_select" ON qp_documents;
CREATE POLICY "qp_documents_select" ON qp_documents FOR SELECT
  USING (organization_id = qp_user_org_id());

DROP POLICY IF EXISTS "qp_documents_insert" ON qp_documents;
CREATE POLICY "qp_documents_insert" ON qp_documents FOR INSERT
  WITH CHECK (organization_id = qp_user_org_id());

-- GMP-Schutz: Approved-Dokumente dürfen NICHT direkt geändert werden
-- (die App erzeugt bei Änderungen stattdessen eine neue Version).
DROP POLICY IF EXISTS "qp_documents_update" ON qp_documents;
CREATE POLICY "qp_documents_update" ON qp_documents FOR UPDATE
  USING (organization_id = qp_user_org_id() AND status <> 'approved')
  WITH CHECK (organization_id = qp_user_org_id());

CREATE INDEX IF NOT EXISTS idx_qp_documents_org ON qp_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_qp_documents_project ON qp_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_qp_documents_status ON qp_documents(status);

DROP TRIGGER IF EXISTS trg_qp_documents_touch ON qp_documents;
CREATE TRIGGER trg_qp_documents_touch BEFORE UPDATE ON qp_documents
  FOR EACH ROW EXECUTE FUNCTION qp_touch_updated_at();

-- ─── qp_document_versions (append-only Versionshistorie) ────
CREATE TABLE IF NOT EXISTS qp_document_versions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id   UUID NOT NULL REFERENCES qp_documents(id) ON DELETE CASCADE,
  version       INT NOT NULL,
  content       JSONB NOT NULL DEFAULT '{}'::jsonb,
  change_reason TEXT,
  created_by    UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_document_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_document_versions_select" ON qp_document_versions;
CREATE POLICY "qp_document_versions_select" ON qp_document_versions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM qp_documents d
    WHERE d.id = document_id AND d.organization_id = qp_user_org_id()
  ));

DROP POLICY IF EXISTS "qp_document_versions_insert" ON qp_document_versions;
CREATE POLICY "qp_document_versions_insert" ON qp_document_versions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM qp_documents d
    WHERE d.id = document_id AND d.organization_id = qp_user_org_id()
  ));
-- Bewusst kein UPDATE/DELETE: Versionen sind unveränderlich.

CREATE INDEX IF NOT EXISTS idx_qp_document_versions_doc ON qp_document_versions(document_id, version DESC);

-- ─── qp_ai_providers ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qp_ai_providers (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id      UUID NOT NULL REFERENCES qp_organizations(id) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  provider_type        TEXT NOT NULL DEFAULT 'openai-compatible'
                       CHECK (provider_type IN ('openai-compatible', 'ollama', 'disabled')),
  base_url             TEXT,
  model_name           TEXT,
  embedding_model_name TEXT,
  api_key_encrypted    TEXT,
  temperature          NUMERIC NOT NULL DEFAULT 0.2,
  max_tokens           INT NOT NULL DEFAULT 4000,
  enabled              BOOLEAN NOT NULL DEFAULT true,
  is_default           BOOLEAN NOT NULL DEFAULT false,
  supports_embeddings  BOOLEAN NOT NULL DEFAULT false,
  supports_streaming   BOOLEAN NOT NULL DEFAULT false,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_ai_providers ENABLE ROW LEVEL SECURITY;

-- Nur Admins dürfen Provider-Konfigurationen (inkl. Secret-Spalte) sehen/ändern.
-- Normale Nutzer sehen die Provider-Secrets NICHT.
DROP POLICY IF EXISTS "qp_ai_providers_admin_all" ON qp_ai_providers;
CREATE POLICY "qp_ai_providers_admin_all" ON qp_ai_providers FOR ALL
  USING (organization_id = qp_user_org_id() AND qp_is_admin())
  WITH CHECK (organization_id = qp_user_org_id() AND qp_is_admin());

CREATE INDEX IF NOT EXISTS idx_qp_ai_providers_org ON qp_ai_providers(organization_id);

-- Nur EIN Default-Provider je Organisation.
CREATE UNIQUE INDEX IF NOT EXISTS idx_qp_ai_providers_one_default
  ON qp_ai_providers(organization_id) WHERE is_default;

DROP TRIGGER IF EXISTS trg_qp_ai_providers_touch ON qp_ai_providers;
CREATE TRIGGER trg_qp_ai_providers_touch BEFORE UPDATE ON qp_ai_providers
  FOR EACH ROW EXECUTE FUNCTION qp_touch_updated_at();

-- ─── qp_ai_generations (append-only KI-Log) ─────────────────
CREATE TABLE IF NOT EXISTS qp_ai_generations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID NOT NULL REFERENCES qp_organizations(id) ON DELETE CASCADE,
  project_id       UUID REFERENCES qp_projects(id) ON DELETE SET NULL,
  document_id      UUID REFERENCES qp_documents(id) ON DELETE SET NULL,
  provider_id      UUID REFERENCES qp_ai_providers(id) ON DELETE SET NULL,
  user_id          UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  model_name       TEXT,
  provider_type    TEXT,
  prompt_type      TEXT,
  prompt_input     JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_output JSONB NOT NULL DEFAULT '{}'::jsonb,
  temperature      NUMERIC,
  max_tokens       INT,
  status           TEXT NOT NULL DEFAULT 'completed'
                   CHECK (status IN ('completed', 'failed')),
  review_required  BOOLEAN NOT NULL DEFAULT true,
  reviewed_by      UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  reviewed_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_ai_generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_ai_generations_select" ON qp_ai_generations;
CREATE POLICY "qp_ai_generations_select" ON qp_ai_generations FOR SELECT
  USING (organization_id = qp_user_org_id());

DROP POLICY IF EXISTS "qp_ai_generations_insert" ON qp_ai_generations;
CREATE POLICY "qp_ai_generations_insert" ON qp_ai_generations FOR INSERT
  WITH CHECK (organization_id = qp_user_org_id());

-- Nur "review" darf gesetzt werden (kein Manipulieren von prompt/output).
-- Vereinfachte MVP-Regel: UPDATE erlaubt, aber die App schreibt nur reviewed_*.
-- TODO(GMP): serverseitig via Trigger erzwingen, dass ausschließlich
-- reviewed_by/reviewed_at/review_required geändert werden dürfen.
DROP POLICY IF EXISTS "qp_ai_generations_update" ON qp_ai_generations;
CREATE POLICY "qp_ai_generations_update" ON qp_ai_generations FOR UPDATE
  USING (organization_id = qp_user_org_id());

CREATE INDEX IF NOT EXISTS idx_qp_ai_generations_org ON qp_ai_generations(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qp_ai_generations_review ON qp_ai_generations(review_required);

-- ─── qp_risks (FMEA) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qp_risks (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id    UUID NOT NULL REFERENCES qp_organizations(id) ON DELETE CASCADE,
  project_id         UUID REFERENCES qp_projects(id) ON DELETE CASCADE,
  process_step       TEXT,
  function           TEXT,
  failure_mode       TEXT,
  failure_effect     TEXT,
  failure_cause      TEXT,
  existing_control   TEXT,
  severity           INT CHECK (severity BETWEEN 1 AND 10),
  occurrence         INT CHECK (occurrence BETWEEN 1 AND 10),
  detection          INT CHECK (detection BETWEEN 1 AND 10),
  rpn                INT,
  risk_class         TEXT,
  recommended_action TEXT,
  responsible_id     UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  due_date           DATE,
  status             TEXT NOT NULL DEFAULT 'open'
                     CHECK (status IN ('open', 'in_progress', 'mitigated', 'closed')),
  residual_risk      TEXT,
  rationale          TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_risks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_risks_all" ON qp_risks;
CREATE POLICY "qp_risks_all" ON qp_risks FOR ALL
  USING (organization_id = qp_user_org_id())
  WITH CHECK (organization_id = qp_user_org_id());

CREATE INDEX IF NOT EXISTS idx_qp_risks_project ON qp_risks(project_id);
CREATE INDEX IF NOT EXISTS idx_qp_risks_class ON qp_risks(risk_class);

DROP TRIGGER IF EXISTS trg_qp_risks_touch ON qp_risks;
CREATE TRIGGER trg_qp_risks_touch BEFORE UPDATE ON qp_risks
  FOR EACH ROW EXECUTE FUNCTION qp_touch_updated_at();

-- ─── qp_requirements ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qp_requirements (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID NOT NULL REFERENCES qp_organizations(id) ON DELETE CASCADE,
  project_id       UUID REFERENCES qp_projects(id) ON DELETE CASCADE,
  requirement_id   TEXT,
  title            TEXT NOT NULL,
  description      TEXT,
  requirement_type TEXT,
  criticality      TEXT CHECK (criticality IN ('low', 'medium', 'high', 'critical')),
  status           TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'approved', 'obsolete')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_requirements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_requirements_all" ON qp_requirements;
CREATE POLICY "qp_requirements_all" ON qp_requirements FOR ALL
  USING (organization_id = qp_user_org_id())
  WITH CHECK (organization_id = qp_user_org_id());

CREATE INDEX IF NOT EXISTS idx_qp_requirements_project ON qp_requirements(project_id);

DROP TRIGGER IF EXISTS trg_qp_requirements_touch ON qp_requirements;
CREATE TRIGGER trg_qp_requirements_touch BEFORE UPDATE ON qp_requirements
  FOR EACH ROW EXECUTE FUNCTION qp_touch_updated_at();

-- ─── qp_test_cases ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qp_test_cases (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID NOT NULL REFERENCES qp_organizations(id) ON DELETE CASCADE,
  project_id          UUID REFERENCES qp_projects(id) ON DELETE CASCADE,
  test_id             TEXT,
  title               TEXT NOT NULL,
  test_type           TEXT CHECK (test_type IN ('IQ', 'OQ', 'PQ', 'other') OR test_type IS NULL),
  objective           TEXT,
  prerequisites       TEXT,
  steps               JSONB NOT NULL DEFAULT '[]'::jsonb,
  expected_result     TEXT,
  actual_result       TEXT,
  status              TEXT NOT NULL DEFAULT 'not_run'
                      CHECK (status IN ('not_run', 'passed', 'failed', 'blocked')),
  tester_id           UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  execution_date      DATE,
  deviation_reference TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_test_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_test_cases_all" ON qp_test_cases;
CREATE POLICY "qp_test_cases_all" ON qp_test_cases FOR ALL
  USING (organization_id = qp_user_org_id())
  WITH CHECK (organization_id = qp_user_org_id());

CREATE INDEX IF NOT EXISTS idx_qp_test_cases_project ON qp_test_cases(project_id);

DROP TRIGGER IF EXISTS trg_qp_test_cases_touch ON qp_test_cases;
CREATE TRIGGER trg_qp_test_cases_touch BEFORE UPDATE ON qp_test_cases
  FOR EACH ROW EXECUTE FUNCTION qp_touch_updated_at();

-- ─── qp_traceability_links ──────────────────────────────────
CREATE TABLE IF NOT EXISTS qp_traceability_links (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id    UUID NOT NULL REFERENCES qp_organizations(id) ON DELETE CASCADE,
  project_id         UUID REFERENCES qp_projects(id) ON DELETE CASCADE,
  requirement_id     UUID REFERENCES qp_requirements(id) ON DELETE SET NULL,
  risk_id            UUID REFERENCES qp_risks(id) ON DELETE SET NULL,
  test_case_id       UUID REFERENCES qp_test_cases(id) ON DELETE SET NULL,
  document_id        UUID REFERENCES qp_documents(id) ON DELETE SET NULL,
  coverage_status    TEXT NOT NULL DEFAULT 'not_covered'
                     CHECK (coverage_status IN ('covered', 'partially_covered', 'not_covered', 'passed', 'failed')),
  evidence_reference TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_traceability_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_traceability_links_all" ON qp_traceability_links;
CREATE POLICY "qp_traceability_links_all" ON qp_traceability_links FOR ALL
  USING (organization_id = qp_user_org_id())
  WITH CHECK (organization_id = qp_user_org_id());

CREATE INDEX IF NOT EXISTS idx_qp_trace_project ON qp_traceability_links(project_id);
CREATE INDEX IF NOT EXISTS idx_qp_trace_requirement ON qp_traceability_links(requirement_id);

-- ─── qp_audit_trail (append-only, unveränderlich) ───────────
CREATE TABLE IF NOT EXISTS qp_audit_trail (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES qp_organizations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  entity_type     TEXT NOT NULL,
  entity_id       UUID,
  event_type      TEXT NOT NULL,
  old_value       JSONB,
  new_value       JSONB,
  reason          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_audit_trail ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_audit_trail_select" ON qp_audit_trail;
CREATE POLICY "qp_audit_trail_select" ON qp_audit_trail FOR SELECT
  USING (organization_id = qp_user_org_id());

DROP POLICY IF EXISTS "qp_audit_trail_insert" ON qp_audit_trail;
CREATE POLICY "qp_audit_trail_insert" ON qp_audit_trail FOR INSERT
  WITH CHECK (organization_id = qp_user_org_id());
-- Bewusst KEIN UPDATE/DELETE: der Audit-Trail ist unveränderlich (21 CFR Part 11).

CREATE INDEX IF NOT EXISTS idx_qp_audit_org ON qp_audit_trail(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qp_audit_entity ON qp_audit_trail(entity_type, entity_id);

-- ============================================================
-- RAG — nur vorbereiten (nicht überbauen)
-- ============================================================
CREATE TABLE IF NOT EXISTS qp_rag_sources (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES qp_organizations(id) ON DELETE CASCADE,
  project_id      UUID REFERENCES qp_projects(id) ON DELETE CASCADE,
  file_name       TEXT,
  file_type       TEXT,
  source_type     TEXT,
  content_hash    TEXT,
  uploaded_by     UUID REFERENCES qp_profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_rag_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_rag_sources_all" ON qp_rag_sources;
CREATE POLICY "qp_rag_sources_all" ON qp_rag_sources FOR ALL
  USING (organization_id = qp_user_org_id())
  WITH CHECK (organization_id = qp_user_org_id());

-- Embedding-Dimension 768 = nomic-embed-text (Ollama). Für andere
-- Modelle (z. B. 1536) Spalte anpassen. Für MVP genügt die Vorbereitung.
CREATE TABLE IF NOT EXISTS qp_rag_chunks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id   UUID NOT NULL REFERENCES qp_rag_sources(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content     TEXT NOT NULL,
  embedding   VECTOR(768),
  metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE qp_rag_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qp_rag_chunks_select" ON qp_rag_chunks;
CREATE POLICY "qp_rag_chunks_select" ON qp_rag_chunks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM qp_rag_sources s
    WHERE s.id = source_id AND s.organization_id = qp_user_org_id()
  ));

DROP POLICY IF EXISTS "qp_rag_chunks_insert" ON qp_rag_chunks;
CREATE POLICY "qp_rag_chunks_insert" ON qp_rag_chunks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM qp_rag_sources s
    WHERE s.id = source_id AND s.organization_id = qp_user_org_id()
  ));

-- TODO(RAG): ivfflat/hnsw-Index auf embedding anlegen, sobald Embeddings
-- geschrieben werden, z. B.:
--   CREATE INDEX ON qp_rag_chunks USING hnsw (embedding vector_cosine_ops);

-- ============================================================
-- Fertig. Nächster Schritt: In der App registrieren — die
-- Registrierung legt via Service-Role automatisch eine
-- qp_organizations-Zeile + ein qp_profiles-Zeile (role='admin') an.
-- ============================================================
