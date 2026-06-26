import { ModuleShell } from '@/components/os/ModuleShell'
import { EmptySlot } from '@/components/os/EmptySlot'

/**
 * Copy + provider for every Operate/Remember/Decide slot route.
 * The slot routes exist so nav targets land on an honest ModuleShell +
 * EmptySlot placeholder (empty-slot doctrine) instead of a 404 — the modules
 * are real IA slots seeded as `status='slot'` in supabase/schema.sql, not yet
 * wired to a connector. NEVER renders a fabricated number.
 */
type SlotDef = {
  title: string
  description: string
  provider: string
}

const SLOTS: Record<string, SlotDef> = {
  projects: {
    title: 'Projects',
    description:
      'Projekt-Übersicht und Heatmap. Verbinde eine Quelle (z. B. Monday.com), um aktive Projekte und Status hier zu sehen.',
    provider: 'Monday.com',
  },
  agents: {
    title: 'AI Agents',
    description:
      'Status und Läufe deiner KI-Agenten. Sobald Agenten-Telemetrie angebunden ist, erscheinen Aktivität und Ergebnisse hier.',
    provider: 'Agent-Telemetrie',
  },
  crm: {
    title: 'CRM',
    description:
      'Leads, Kontakte und Pipeline. Verbinde dein CRM, um Kontakte und Deal-Stages hier zu verwalten.',
    provider: 'CRM',
  },
  finance: {
    title: 'Finance',
    description:
      'MRR, ARR, Cash und Runway. Verbinde Stripe oder dein Buchhaltungs-Tool, um echte Finanzkennzahlen zu sehen.',
    provider: 'Stripe',
  },
  marketing: {
    title: 'Marketing',
    description:
      'Kampagnen, Reichweite und Conversion. Verbinde deine Marketing-Quellen, um Performance hier auszuwerten.',
    provider: 'Marketing-Analytics',
  },
  products: {
    title: 'Products',
    description:
      'Produkt-Roadmap und Nutzung. Verbinde eine Produkt-Datenquelle, um Releases und Metriken hier zu sehen.',
    provider: 'Produkt-Analytics',
  },
  knowledge: {
    title: 'Knowledge',
    description:
      'Durchsuchbare Wissensbasis. Verbinde Notion oder andere Quellen, um Wissen zentral abzulegen.',
    provider: 'Notion',
  },
  documents: {
    title: 'Documents',
    description:
      'Dokumente und Vorlagen. Verbinde deinen Dokumentenspeicher, um Dateien hier zu verwalten.',
    provider: 'Dokumentenspeicher',
  },
  analytics: {
    title: 'Executive Analytics',
    description:
      'Aggregierte Kennzahlen über alle Module. Sobald die ersten KPI-Snapshots vorliegen, erscheinen Trends und Charts hier.',
    provider: 'KPI-Snapshots',
  },
  copilot: {
    title: 'Copilot',
    description:
      'Frag NORA zu deinem Business. Der Copilot-Chat wird in einer späteren Phase aktiviert.',
    provider: 'NORA Copilot',
  },
}

export function SlotPage({ slot }: { slot: keyof typeof SLOTS }) {
  const def = SLOTS[slot]
  return (
    <ModuleShell title={def.title}>
      <EmptySlot
        title={`${def.title} ist noch nicht verbunden`}
        description={def.description}
        provider={def.provider}
      />
    </ModuleShell>
  )
}
