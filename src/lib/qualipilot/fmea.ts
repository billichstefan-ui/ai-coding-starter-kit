// QualiPilot — FMEA-Kernlogik.
// RPN = Severity × Occurrence × Detection.
// Risikoklassen laut Spezifikation:
//   1–30 = Low, 31–80 = Medium, 81–150 = High, >150 = Critical.

import type { RiskClass } from './types'

export function computeRpn(
  severity: number | null | undefined,
  occurrence: number | null | undefined,
  detection: number | null | undefined
): number | null {
  if (severity == null || occurrence == null || detection == null) return null
  return severity * occurrence * detection
}

export function riskClassForRpn(rpn: number | null | undefined): RiskClass | null {
  if (rpn == null) return null
  if (rpn <= 30) return 'low'
  if (rpn <= 80) return 'medium'
  if (rpn <= 150) return 'high'
  return 'critical'
}

/** Kritische Risiken (Critical/High) benötigen eine empfohlene Maßnahme. */
export function requiresRecommendedAction(riskClass: RiskClass | null | undefined): boolean {
  return riskClass === 'critical' || riskClass === 'high'
}
