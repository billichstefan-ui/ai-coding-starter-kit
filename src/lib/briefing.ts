import Anthropic from '@anthropic-ai/sdk'
import { NORA_COMPANY_CONTEXT } from '@/lib/nora-context'

// Gleiche Opus-Generation wie NORAs Hauptlauf (lib/anthropic.ts).
const MODEL = 'claude-opus-4-8'

export type BriefingInput = {
  pendingSuggestions: number
  openTasks: number
  topSuggestionTitles: string[]
}

export type Briefing = {
  text: string
  fallback: boolean
  generatedAt: string
}

/**
 * Deterministisches Offline-Briefing — kein Claude-Call. Wird verwendet, wenn
 * kein ANTHROPIC_API_KEY gesetzt ist oder der SDK-Call scheitert. CEO Home muss
 * IMMER rendern (integration note 7) — diese Funktion wirft nie.
 */
function fallbackBriefing(input: BriefingInput): string {
  const lines: string[] = []

  if (input.pendingSuggestions > 0) {
    lines.push(
      `NORA hat ${input.pendingSuggestions} ${
        input.pendingSuggestions === 1 ? 'Vorschlag' : 'Vorschläge'
      } zur Prüfung bereitgelegt.`
    )
  } else {
    lines.push('Aktuell keine offenen Vorschläge — alles bearbeitet.')
  }

  if (input.topSuggestionTitles.length > 0) {
    const top = input.topSuggestionTitles.slice(0, 3).map((t) => `• ${t}`)
    lines.push('Oben auf der Liste:')
    lines.push(...top)
  }

  lines.push(
    'Tipp: In unter 2 Minuten die offenen Vorschläge prüfen — bestätigte werden automatisch zu Monday-Tasks und Notion-Dokumenten.'
  )

  return lines.join('\n')
}

function buildPrompt(input: BriefingInput): string {
  const topList =
    input.topSuggestionTitles.length > 0
      ? input.topSuggestionTitles.map((t) => `- ${t}`).join('\n')
      : '(keine offenen Vorschläge)'

  return `${NORA_COMPANY_CONTEXT}

## Heutiger Stand (Live-Zahlen)
- Offene NORA-Vorschläge zur Prüfung: ${input.pendingSuggestions}
- Offene Tasks (Proxy): ${input.openTasks}
- Titel der wichtigsten offenen Vorschläge:
${topList}

## Deine Aufgabe
Du bist NORA. Schreibe Stefan ein knappes, motivierendes **Tagesbriefing** (3–5 Sätze,
reiner Fließtext, KEINE Aufzählungszeichen, KEIN Markdown). Bottom line zuerst: Was ist
heute der wichtigste Hebel? Beziehe dich konkret auf die offenen Vorschläge oben, falls
vorhanden. Halte es premium, fachlich und auf Augenhöhe — kein generisches Geschwätz.
Sprache: Deutsch.`
}

/**
 * Tagesbriefing via Claude — best-effort, blockiert nie. Fehlt der API-Key oder
 * scheitert der SDK-Call, liefert die Funktion ein deterministisches Offline-
 * Briefing mit `fallback: true` (NIE ein Wurf). Bewusst günstig: plain-text
 * messages.create mit kleinem max_tokens, kein zod-Schema.
 */
export async function getDailyBriefing(input: BriefingInput): Promise<Briefing> {
  const generatedAt = new Date().toISOString()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { text: fallbackBriefing(input), fallback: true, generatedAt }
  }

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      messages: [{ role: 'user', content: buildPrompt(input) }],
    })

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim()

    if (!text) {
      return { text: fallbackBriefing(input), fallback: true, generatedAt }
    }

    return { text, fallback: false, generatedAt }
  } catch (error) {
    // Best-effort: sichtbar in den Logs, aber CEO Home rendert weiter.
    console.error(
      'getDailyBriefing: Claude-Call fehlgeschlagen — Offline-Briefing verwendet:',
      error instanceof Error ? error.message : error
    )
    return { text: fallbackBriefing(input), fallback: true, generatedAt }
  }
}
