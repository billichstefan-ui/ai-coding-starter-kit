import { createClient } from '@/lib/supabase-server'
import type { ProjectRow } from '@/components/os/ProjectHeatmap'

/**
 * Liest das Company-OS-Projektportfolio für die CEO-Home ProjectHeatmap.
 *
 * Web-Quelle der Wahrheit ist die Supabase-`projects`-Tabelle (die Notion
 * KORDIX-OS Projekte-DB bleibt die menschliche Steuerzentrale). Defensiv:
 * jeder Fehler degradiert zu einer leeren Liste (→ EmptySlot), wirft nie.
 */
export async function getProjects(): Promise<ProjectRow[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('name, progress, priority, status')
      .order('sort_order', { ascending: true })
      .limit(50)

    if (error || !data) return []

    return data.map((p) => ({
      name: (p.name as string) ?? '',
      progress: (p.progress as number) ?? 0,
      priority: (p.priority as ProjectRow['priority']) ?? null,
      status: (p.status as string) ?? '',
    }))
  } catch {
    return []
  }
}
