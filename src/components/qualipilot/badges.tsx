import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  PROJECT_STATUS_LABELS,
  DOCUMENT_STATUS_LABELS,
  RISK_STATUS_LABELS,
  RISK_CLASS_LABELS,
  TEST_STATUS_LABELS,
  COVERAGE_STATUS_LABELS,
} from '@/lib/qualipilot/constants'
import type {
  ProjectStatus,
  DocumentStatus,
  RiskClass,
  RiskStatus,
  TestStatus,
  CoverageStatus,
} from '@/lib/qualipilot/types'

// Dezente, auditnahe Badge-Farben (dunkler Hintergrund + neon-nahe Akzente).
const tone = {
  neutral: 'border-white/15 bg-white/5 text-white/80',
  blue: 'border-[#0078FF]/40 bg-[#0078FF]/15 text-[#7FB4FF]',
  cyan: 'border-[#38E5FF]/40 bg-[#38E5FF]/15 text-[#9DEDFF]',
  amber: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  green: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  red: 'border-red-500/40 bg-red-500/15 text-red-300',
  violet: 'border-[#A720FF]/40 bg-[#A720FF]/15 text-[#D69BFF]',
} as const

type Tone = keyof typeof tone

function Pill({ label, t, className }: { label: string; t: Tone; className?: string }) {
  return (
    <Badge variant="outline" className={cn('font-medium', tone[t], className)}>
      {label}
    </Badge>
  )
}

const PROJECT_TONE: Record<ProjectStatus, Tone> = {
  draft: 'neutral',
  in_progress: 'blue',
  in_review: 'amber',
  approved: 'green',
  archived: 'neutral',
}

const DOCUMENT_TONE: Record<DocumentStatus, Tone> = {
  draft: 'neutral',
  ai_generated: 'violet',
  in_review: 'amber',
  reviewed: 'cyan',
  approved: 'green',
  obsolete: 'neutral',
}

const RISK_STATUS_TONE: Record<RiskStatus, Tone> = {
  open: 'red',
  in_progress: 'amber',
  mitigated: 'blue',
  closed: 'green',
}

const RISK_CLASS_TONE: Record<RiskClass, Tone> = {
  low: 'green',
  medium: 'amber',
  high: 'red',
  critical: 'red',
}

const TEST_TONE: Record<TestStatus, Tone> = {
  not_run: 'neutral',
  passed: 'green',
  failed: 'red',
  blocked: 'amber',
}

const COVERAGE_TONE: Record<CoverageStatus, Tone> = {
  covered: 'green',
  partially_covered: 'amber',
  not_covered: 'red',
  passed: 'green',
  failed: 'red',
}

export function StatusBadge({ status, kind }: { status: string; kind: 'project' | 'document' }) {
  if (kind === 'project') {
    const s = status as ProjectStatus
    return <Pill label={PROJECT_STATUS_LABELS[s] ?? status} t={PROJECT_TONE[s] ?? 'neutral'} />
  }
  const s = status as DocumentStatus
  return <Pill label={DOCUMENT_STATUS_LABELS[s] ?? status} t={DOCUMENT_TONE[s] ?? 'neutral'} />
}

export function RiskBadge({ riskClass }: { riskClass: string | null | undefined }) {
  if (!riskClass) return <Pill label="—" t="neutral" />
  const c = riskClass as RiskClass
  return (
    <Pill
      label={RISK_CLASS_LABELS[c] ?? riskClass}
      t={RISK_CLASS_TONE[c] ?? 'neutral'}
      className={c === 'critical' ? 'font-semibold' : undefined}
    />
  )
}

export function RiskStatusBadge({ status }: { status: string }) {
  const s = status as RiskStatus
  return <Pill label={RISK_STATUS_LABELS[s] ?? status} t={RISK_STATUS_TONE[s] ?? 'neutral'} />
}

export function TestStatusBadge({ status }: { status: string }) {
  const s = status as TestStatus
  return <Pill label={TEST_STATUS_LABELS[s] ?? status} t={TEST_TONE[s] ?? 'neutral'} />
}

export function CoverageBadge({ status }: { status: string }) {
  const s = status as CoverageStatus
  return <Pill label={COVERAGE_STATUS_LABELS[s] ?? status} t={COVERAGE_TONE[s] ?? 'neutral'} />
}
