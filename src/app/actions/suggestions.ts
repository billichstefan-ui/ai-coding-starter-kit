'use server'

import { after } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceRoleClient } from '@/lib/supabase-server'
import {
  fetchBoard,
  createNoraBizDevBoard,
  ensureGroup,
  createTask,
  addUpdate,
  type MondayGroup,
} from '@/lib/monday'
import { fetchDatabase, createNoraBizDevDatabase, createPage, type ElaboratedSection } from '@/lib/notion'
import { elaborateDocument } from '@/lib/anthropic'

const VALID_STATUSES = ['approved', 'rejected', 'pending', 'implemented'] as const

const UpdateStatusSchema = z.object({
  id: z.string().uuid('Ungültige Vorschlag-ID.'),
  status: z.enum(VALID_STATUSES),
})

type ActionResult = {
  success: boolean
  error?: string
  monday_task_url?: string
  notion_page_url?: string
  notion_warning?: string
  elaboration_warning?: string
}

async function getOrCreateMondayBoard(
  supabase: Awaited<ReturnType<typeof createClient>>,
  apiKey: string
): Promise<{ boardId: string; groups: MondayGroup[] }> {
  const { data: configRow } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'monday_board_id')
    .maybeSingle()

  if (configRow?.value) {
    const board = await fetchBoard(apiKey, configRow.value)
    if (board) return { boardId: board.id, groups: board.groups }
  }

  // Board not found or deleted — create fresh
  const newBoard = await createNoraBizDevBoard(apiKey)
  await supabase.from('app_config').upsert(
    { key: 'monday_board_id', value: newBoard.id, updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  )
  return { boardId: newBoard.id, groups: newBoard.groups }
}

async function getOrCreateNotionDatabase(
  supabase: Awaited<ReturnType<typeof createClient>>,
  apiKey: string,
  parentPageId: string
): Promise<{ databaseId: string }> {
  const { data: configRow } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'notion_database_id')
    .maybeSingle()

  if (configRow?.value) {
    const db = await fetchDatabase(apiKey, configRow.value)
    if (db) return { databaseId: db.id }
  }

  const newDb = await createNoraBizDevDatabase(apiKey, parentPageId)
  await supabase.from('app_config').upsert(
    { key: 'notion_database_id', value: newDb.id, updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  )
  return { databaseId: newDb.id }
}

export async function updateSuggestionStatus(
  id: string,
  status: 'approved' | 'rejected' | 'pending' | 'implemented'
): Promise<ActionResult> {
  const parsed = UpdateStatusSchema.safeParse({ id, status })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Ungültige Eingabe.' }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Nicht eingeloggt.' }
  }

  if (parsed.data.status === 'approved') {
    const mondayApiKey = process.env.MONDAY_API_KEY
    if (!mondayApiKey) {
      return { success: false, error: 'Monday.com nicht konfiguriert — API-Key fehlt.' }
    }

    // Fetch full suggestion to build the Monday task content
    const { data: suggestion, error: fetchError } = await supabase
      .from('suggestions')
      .select('title, body, insight, source, category')
      .eq('id', parsed.data.id)
      .single()

    if (fetchError || !suggestion) {
      return { success: false, error: 'Vorschlag nicht gefunden.' }
    }

    try {
      const { boardId, groups } = await getOrCreateMondayBoard(supabase, mondayApiKey)
      const groupId = await ensureGroup(mondayApiKey, boardId, groups, suggestion.category as string)
      const item = await createTask(mondayApiKey, boardId, groupId, suggestion.title as string)
      await addUpdate(
        mondayApiKey,
        item.id,
        suggestion.body as string,
        suggestion.insight as string | null,
        suggestion.source as string | null
      )

      // Persist approval immediately so UI can return fast
      const { error: updateError } = await supabase
        .from('suggestions')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', parsed.data.id)

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      // Notion elaboration runs after response is sent — user doesn't wait
      const notionApiKey = process.env.NOTION_API_KEY
      const notionParentPageId = process.env.NOTION_PARENT_PAGE_ID

      if (notionApiKey && notionParentPageId) {
        const suggestionSnapshot = {
          title: suggestion.title as string,
          body: suggestion.body as string,
          insight: suggestion.insight as string | null,
          source: suggestion.source as string | null,
          category: suggestion.category as string,
          mondayUrl: item.url ?? null,
        }
        after(async () => {
          try {
            const bgSupabase = createServiceRoleClient()
            const { databaseId } = await getOrCreateNotionDatabase(bgSupabase, notionApiKey, notionParentPageId)

            let elaboratedSections: ElaboratedSection[] | undefined
            try {
              const elaboration = await elaborateDocument(suggestionSnapshot)
              elaboratedSections = elaboration.sections
            } catch {
              // Falls back to short text
            }

            await createPage(notionApiKey, databaseId, {
              ...suggestionSnapshot,
              elaboratedSections,
            })
          } catch {
            // Background task — errors are silent
          }
        })
      }

      return { success: true, monday_task_url: item.url }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Monday.com nicht erreichbar — bitte erneut versuchen.'
      return { success: false, error: message }
    }
  }

  // implemented — einfacher Statuswechsel ohne Monday/Notion
  if (parsed.data.status === 'implemented') {
    const { error } = await supabase
      .from('suggestions')
      .update({
        status: 'implemented',
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', parsed.data.id)

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  // rejected / pending — just update Supabase
  const { error } = await supabase
    .from('suggestions')
    .update({
      status: parsed.data.status,
      reviewed_at: parsed.data.status !== 'pending' ? new Date().toISOString() : null,
    })
    .eq('id', parsed.data.id)

  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}
