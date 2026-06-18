/**
 * Lokaler BizDev-Agent-Lauf (NORA Suggestion Engine).
 *
 * Führt den Kern des Agents aus: baut den Live-Kontext und ruft Claude
 * (claude-opus-4-8) mit dem echten NORA-Prompt auf — wie der Cron-/Dashboard-Lauf.
 *
 * In dieser Umgebung fehlen Supabase/Notion-Credentials, daher läuft es als
 * "erster Lauf" mit leerem Live-Kontext. Es wird NICHT in die DB geschrieben.
 *
 *   npx tsx scripts/run-agent.ts
 */
import { generateSuggestions } from '../src/lib/anthropic'
import type { LiveContext } from '../src/lib/live-context'

async function main() {
  // Erster Lauf: leere Historie (kein Supabase/Notion verfügbar).
  const liveContext: LiveContext = {
    supabaseHistory: [],
    notionBizDevEntries: [],
    livingSpecContent: null,
  }

  console.log('🤖 NORA BizDev-Agent — Lauf gestartet')
  console.log('   Modell: claude-opus-4-8 | Kontext: erster Lauf (leere Historie)\n')

  const start = Date.now()
  const suggestions = await generateSuggestions(liveContext)
  const seconds = ((Date.now() - start) / 1000).toFixed(1)

  console.log(`✅ ${suggestions.length} Vorschläge in ${seconds}s generiert:\n`)

  suggestions.forEach((s, i) => {
    console.log(`${'─'.repeat(70)}`)
    console.log(`#${i + 1}  [${s.category.toUpperCase()}]  ${s.title}`)
    console.log(`${'─'.repeat(70)}`)
    console.log(`📋 Vorschlag:\n${s.body}\n`)
    console.log(`💡 Insight: ${s.insight}`)
    console.log(`🔎 Quelle:  ${s.source}\n`)
  })

  console.log(`${'─'.repeat(70)}`)
  console.log('Hinweis: Dies war ein Trockenlauf — nichts wurde in Supabase gespeichert.')
}

main().catch(err => {
  console.error('❌ Lauf fehlgeschlagen:', err instanceof Error ? err.message : err)
  process.exit(1)
})
