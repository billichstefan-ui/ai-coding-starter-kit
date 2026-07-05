import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Sparkles,
  ShieldAlert,
  Network,
  ScrollText,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { QP_BASE } from '@/lib/qualipilot/constants'

export type QpNavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export type QpNavGroup = {
  label: string
  items: QpNavItem[]
}

/** Single source of truth für Sidebar + Command-Navigation. */
export const QP_NAV: QpNavGroup[] = [
  {
    label: 'Übersicht',
    items: [
      { label: 'Dashboard', href: `${QP_BASE}/dashboard`, icon: LayoutDashboard },
    ],
  },
  {
    label: 'Arbeit',
    items: [
      { label: 'Projekte', href: `${QP_BASE}/projects`, icon: FolderKanban },
      { label: 'Dokumente', href: `${QP_BASE}/documents`, icon: FileText },
      { label: 'AI Draft Generator', href: `${QP_BASE}/ai-generator`, icon: Sparkles },
    ],
  },
  {
    label: 'Qualität & Compliance',
    items: [
      { label: 'Risk / FMEA', href: `${QP_BASE}/risk-assessment`, icon: ShieldAlert },
      { label: 'Traceability', href: `${QP_BASE}/traceability`, icon: Network },
      { label: 'Audit Trail', href: `${QP_BASE}/audit-trail`, icon: ScrollText },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Einstellungen', href: `${QP_BASE}/settings/ai-providers`, icon: Settings },
    ],
  },
]

export const QP_NAV_FLAT: QpNavItem[] = QP_NAV.flatMap((g) => g.items)
