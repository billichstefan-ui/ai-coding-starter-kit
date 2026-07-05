// QualiPilot — Domänentypen (spiegeln supabase/qualipilot_schema.sql wider).
// Handgepflegt für das MVP; später via `supabase gen types` ersetzbar.

export type ProjectStatus = 'draft' | 'in_progress' | 'in_review' | 'approved' | 'archived'

export type DocumentStatus =
  | 'draft'
  | 'ai_generated'
  | 'in_review'
  | 'reviewed'
  | 'approved'
  | 'obsolete'

export type RiskClass = 'low' | 'medium' | 'high' | 'critical'

export type RiskStatus = 'open' | 'in_progress' | 'mitigated' | 'closed'

export type Criticality = 'low' | 'medium' | 'high' | 'critical'

export type TestStatus = 'not_run' | 'passed' | 'failed' | 'blocked'

export type CoverageStatus =
  | 'covered'
  | 'partially_covered'
  | 'not_covered'
  | 'passed'
  | 'failed'

export type ProviderType = 'openai-compatible' | 'ollama' | 'disabled'

export type UserRole = 'admin' | 'member' | 'reviewer' | 'approver'

export interface Organization {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  organization_id: string | null
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  organization_id: string
  name: string
  customer: string | null
  site: string | null
  system_name: string | null
  system_description: string | null
  gmp_relevance: string | null
  gamp_category: string | null
  risk_class: string | null
  status: ProjectStatus
  owner_id: string | null
  start_date: string | null
  target_date: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface DocumentRecord {
  id: string
  organization_id: string
  project_id: string | null
  document_type: string
  document_number: string | null
  title: string
  version: number
  status: DocumentStatus
  content: DocumentContent
  ai_generated: boolean
  review_required: boolean
  author_id: string | null
  reviewer_id: string | null
  approver_id: string | null
  approved_at: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface DocumentSection {
  heading: string
  body: string
}

export interface DocumentContent {
  summary?: string
  sections?: DocumentSection[]
  [key: string]: unknown
}

export interface DocumentVersion {
  id: string
  document_id: string
  version: number
  content: DocumentContent
  change_reason: string | null
  created_by: string | null
  created_at: string
}

export interface AIProviderConfig {
  id: string
  organization_id: string
  name: string
  provider_type: ProviderType
  base_url: string | null
  model_name: string | null
  embedding_model_name: string | null
  api_key_encrypted: string | null
  temperature: number
  max_tokens: number
  enabled: boolean
  is_default: boolean
  supports_embeddings: boolean
  supports_streaming: boolean
  created_at: string
  updated_at: string
}

export interface AIGeneration {
  id: string
  organization_id: string
  project_id: string | null
  document_id: string | null
  provider_id: string | null
  user_id: string | null
  model_name: string | null
  provider_type: string | null
  prompt_type: string | null
  prompt_input: Record<string, unknown>
  generated_output: Record<string, unknown>
  temperature: number | null
  max_tokens: number | null
  status: 'completed' | 'failed'
  review_required: boolean
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

export interface Risk {
  id: string
  organization_id: string
  project_id: string | null
  process_step: string | null
  function: string | null
  failure_mode: string | null
  failure_effect: string | null
  failure_cause: string | null
  existing_control: string | null
  severity: number | null
  occurrence: number | null
  detection: number | null
  rpn: number | null
  risk_class: RiskClass | null
  recommended_action: string | null
  responsible_id: string | null
  due_date: string | null
  status: RiskStatus
  residual_risk: string | null
  rationale: string | null
  created_at: string
  updated_at: string
}

export interface Requirement {
  id: string
  organization_id: string
  project_id: string | null
  requirement_id: string | null
  title: string
  description: string | null
  requirement_type: string | null
  criticality: Criticality | null
  status: 'draft' | 'approved' | 'obsolete'
  created_at: string
  updated_at: string
}

export interface TestCase {
  id: string
  organization_id: string
  project_id: string | null
  test_id: string | null
  title: string
  test_type: string | null
  objective: string | null
  prerequisites: string | null
  steps: unknown[]
  expected_result: string | null
  actual_result: string | null
  status: TestStatus
  tester_id: string | null
  execution_date: string | null
  deviation_reference: string | null
  created_at: string
  updated_at: string
}

export interface TraceabilityLink {
  id: string
  organization_id: string
  project_id: string | null
  requirement_id: string | null
  risk_id: string | null
  test_case_id: string | null
  document_id: string | null
  coverage_status: CoverageStatus
  evidence_reference: string | null
  created_at: string
}

export interface AuditEntry {
  id: string
  organization_id: string
  user_id: string | null
  entity_type: string
  entity_id: string | null
  event_type: string
  old_value: Record<string, unknown> | null
  new_value: Record<string, unknown> | null
  reason: string | null
  created_at: string
}
