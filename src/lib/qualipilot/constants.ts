// QualiPilot — zentrale Labels, Enums und Auswahllisten.
// Single source of truth für Dropdowns, Badges und Validierung.

import type {
  ProjectStatus,
  DocumentStatus,
  RiskClass,
  RiskStatus,
  TestStatus,
  CoverageStatus,
  ProviderType,
} from './types'

export const QP_BASE = '/qualipilot'

// ─── Dokumenttypen (GMP/CSV) ────────────────────────────────
export const DOCUMENT_TYPES = [
  'URS',
  'FDS',
  'HDS',
  'SDS',
  'Risk Assessment',
  'FMEA',
  'IQ',
  'OQ',
  'PQ',
  'Traceability Matrix',
  'CSV Assessment',
  'Annex 11 Checklist',
  '21 CFR Part 11 Checklist',
  'Qualification Plan',
  'Validation Summary Report',
] as const
export type DocumentType = (typeof DOCUMENT_TYPES)[number]

// Dokumenttypen, für die der AI Draft Generator strukturierte Entwürfe kann.
export const AI_DOCUMENT_TYPES = [
  'URS',
  'FDS',
  'IQ',
  'OQ',
  'PQ',
  'FMEA',
  'Traceability Matrix',
  'Annex 11 Checklist',
  'CSV Assessment',
] as const

// ─── GAMP-Kategorien ────────────────────────────────────────
export const GAMP_CATEGORIES = [
  { value: '1', label: 'Kategorie 1 — Infrastruktur-Software' },
  { value: '3', label: 'Kategorie 3 — Nicht konfigurierte Produkte' },
  { value: '4', label: 'Kategorie 4 — Konfigurierte Produkte' },
  { value: '5', label: 'Kategorie 5 — Individualsoftware' },
] as const

export const GMP_RELEVANCE = ['GMP-relevant', 'Nicht GMP-relevant', 'Zu bewerten'] as const

export const RISK_CLASSES = ['low', 'medium', 'high', 'critical'] as const

// ─── Status-Labels (DE) ─────────────────────────────────────
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: 'Entwurf',
  in_progress: 'In Arbeit',
  in_review: 'In Prüfung',
  approved: 'Freigegeben',
  archived: 'Archiviert',
}

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  draft: 'Entwurf',
  ai_generated: 'KI-Entwurf',
  in_review: 'In Prüfung',
  reviewed: 'Geprüft',
  approved: 'Freigegeben',
  obsolete: 'Veraltet',
}

export const RISK_STATUS_LABELS: Record<RiskStatus, string> = {
  open: 'Offen',
  in_progress: 'In Bearbeitung',
  mitigated: 'Gemindert',
  closed: 'Geschlossen',
}

export const RISK_CLASS_LABELS: Record<RiskClass, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export const TEST_STATUS_LABELS: Record<TestStatus, string> = {
  not_run: 'Nicht ausgeführt',
  passed: 'Bestanden',
  failed: 'Fehlgeschlagen',
  blocked: 'Blockiert',
}

export const COVERAGE_STATUS_LABELS: Record<CoverageStatus, string> = {
  covered: 'Abgedeckt',
  partially_covered: 'Teilweise abgedeckt',
  not_covered: 'Nicht abgedeckt',
  passed: 'Bestanden',
  failed: 'Fehlgeschlagen',
}

export const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
  'openai-compatible': 'OpenAI-kompatibel (LM Studio, LocalAI …)',
  ollama: 'Ollama',
  disabled: 'Deaktiviert',
}

// ─── GMP-Review-Disclaimer (überall gleich) ─────────────────
export const AI_DRAFT_DISCLAIMER =
  'AI-generated draft – expert review required. Not approved for GMP use without QA review. Verify against project-specific requirements.'
