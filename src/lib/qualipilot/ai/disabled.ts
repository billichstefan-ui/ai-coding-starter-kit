// QualiPilot — DisabledProvider.
// Platzhalter, wenn keine lokale KI konfiguriert/aktiviert ist. Wirft klare
// Fehler statt zu crashen; testConnection meldet sauber "deaktiviert".

import {
  type AIProvider,
  type AIConnectionTestResult,
  type GenerateChatResult,
  type GenerateTextResult,
  AIUnavailableError,
} from './types'

export class DisabledProvider implements AIProvider {
  readonly type = 'disabled' as const
  readonly name = 'Deaktiviert'

  async generateText(): Promise<GenerateTextResult> {
    throw new AIUnavailableError(
      'Kein KI-Provider aktiv. Bitte unter Einstellungen → KI-Provider konfigurieren.'
    )
  }

  async generateChat(): Promise<GenerateChatResult> {
    throw new AIUnavailableError(
      'Kein KI-Provider aktiv. Bitte unter Einstellungen → KI-Provider konfigurieren.'
    )
  }

  async testConnection(): Promise<AIConnectionTestResult> {
    return {
      ok: false,
      message: 'KI deaktiviert',
      checks: { reachable: false, modelConfigured: false, chatCompletion: false },
    }
  }
}
