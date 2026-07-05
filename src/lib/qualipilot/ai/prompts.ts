// QualiPilot — GMP-Prompt-Bausteine für den AI Draft Generator.
// Erzeugt strukturierte Entwürfe. Lokale Modelle können oft kein
// Tool-Calling → wir bitten um klar strukturiertes JSON und parsen
// tolerant (Fallback: ganzer Text als eine Section).

import { AI_DRAFT_DISCLAIMER } from '../constants'
import type { DocumentContent, DocumentSection } from '../types'

export interface DraftGeneratorInput {
  documentType: string
  language: 'de' | 'en'
  projectName?: string
  systemDescription?: string
  processDescription?: string
  gmpCriticality?: string
  gampCategory?: string
  chapters?: string
  additionalInfo?: string
}

const TYPE_GUIDANCE: Record<string, string> = {
  URS: 'User Requirements Specification: nummerierte, testbare Anforderungen (funktional, nicht-funktional, regulatorisch, Datenintegrität/Part 11).',
  FDS: 'Functional Design Specification: wie das System die URS-Anforderungen funktional erfüllt.',
  IQ: 'Installation Qualification: Prüfpunkte zu Installation, Versionsständen, Umgebung, Dokumentation — als ausführbare Testschritte mit Akzeptanzkriterien.',
  OQ: 'Operational Qualification: Testfälle, die die Funktion über den Betriebsbereich nachweisen — Schritte, erwartete Ergebnisse, Akzeptanzkriterien.',
  PQ: 'Performance Qualification: Nachweis der Leistung unter realen Bedingungen über mehrere Läufe.',
  FMEA: 'Failure Mode and Effects Analysis: Prozessschritt, Fehlermodus, Effekt, Ursache, bestehende Kontrolle, Bewertung (Severity/Occurrence/Detection), empfohlene Maßnahme.',
  'Traceability Matrix':
    'Traceability Matrix: Verknüpfung Anforderung ↔ Risiko ↔ Testfall ↔ Dokument mit Coverage-Status.',
  'Annex 11 Checklist':
    'EU-GMP Annex 11 Checkliste: Punkt-für-Punkt-Bewertung der Anforderungen an computergestützte Systeme.',
  'CSV Assessment':
    'Computerized System Validation Assessment: GxP-Relevanz, GAMP-Kategorie, Risikobewertung, Validierungsumfang.',
}

export function buildDraftPrompt(input: DraftGeneratorInput): { system: string; prompt: string } {
  const lang = input.language === 'en' ? 'English' : 'Deutsch'
  const guidance = TYPE_GUIDANCE[input.documentType] ?? `Dokumenttyp: ${input.documentType}.`

  const system = [
    'Du bist ein erfahrener GMP-/CSV-Spezialist und erstellst strukturierte Entwürfe für Qualifizierungs- und Validierungsdokumente (Pharma/Biotech/MedTech).',
    'Deine Ausgaben sind ausdrücklich ENTWÜRFE zur Experten-Prüfung — niemals final freigegeben.',
    `Antworte ausschließlich in ${lang}.`,
    'Gib die Antwort als striktes JSON in genau dieser Form zurück (keine Erklärungen davor/danach):',
    '{ "summary": string, "sections": [ { "heading": string, "body": string } ] }',
  ].join('\n')

  const facts = [
    input.projectName && `Projekt: ${input.projectName}`,
    input.systemDescription && `Systembeschreibung: ${input.systemDescription}`,
    input.processDescription && `Prozessbeschreibung: ${input.processDescription}`,
    input.gmpCriticality && `GMP-Kritikalität: ${input.gmpCriticality}`,
    input.gampCategory && `GAMP-Kategorie: ${input.gampCategory}`,
    input.chapters && `Gewünschte Kapitel: ${input.chapters}`,
    input.additionalInfo && `Zusatzinformationen: ${input.additionalInfo}`,
  ]
    .filter(Boolean)
    .join('\n')

  const prompt = [
    `Erstelle einen strukturierten Entwurf für ein Dokument vom Typ "${input.documentType}".`,
    `Inhaltliche Leitlinie: ${guidance}`,
    '',
    facts || '(Keine zusätzlichen Projektangaben — triff fachlich fundierte, generische Annahmen und markiere sie als solche.)',
    '',
    'Sei fachlich präzise, GMP-konform strukturiert und konkret. Nutze für jeden logischen Block eine eigene Section mit aussagekräftiger Überschrift.',
  ].join('\n')

  return { system, prompt }
}

/**
 * Tolerantes Parsen der Modellantwort in DocumentContent.
 * Erkennt reines JSON, JSON in ```-Fences und fällt sonst auf eine
 * Section mit dem Rohtext zurück. Hängt immer den GMP-Disclaimer an.
 */
export function parseDraftOutput(raw: string): DocumentContent {
  const disclaimer = AI_DRAFT_DISCLAIMER

  const jsonText = extractJson(raw)
  if (jsonText) {
    try {
      const parsed = JSON.parse(jsonText)
      const sections: DocumentSection[] = Array.isArray(parsed?.sections)
        ? parsed.sections
            .filter((s: unknown) => s && typeof s === 'object')
            .map((s: { heading?: unknown; body?: unknown }) => ({
              heading: String(s.heading ?? 'Abschnitt'),
              body: String(s.body ?? ''),
            }))
        : []
      if (sections.length > 0) {
        return {
          summary: typeof parsed.summary === 'string' ? parsed.summary : undefined,
          sections,
          disclaimer,
        }
      }
    } catch {
      // fällt unten auf Rohtext zurück
    }
  }

  return {
    sections: [{ heading: 'KI-Entwurf', body: raw.trim() }],
    disclaimer,
  }
}

function extractJson(raw: string): string | null {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenceMatch) return fenceMatch[1].trim()
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start !== -1 && end > start) return raw.slice(start, end + 1)
  return null
}
