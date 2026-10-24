/**
 * Optional Chalkie adapter framing from BI planning context (D022 Phase 4).
 * Default OFF. Never mutates activity/vocab/scope artifacts — only appends a
 * labelled interpretation block to the detailed handoff when enabled.
 */
import type { BiPlanningContext } from '../../lib/bookIntelligence/toBiPlanningContext'
import type { Be3U08OpenerSeriesHandoff } from './buildBe3U08OpenerSbWbSeriesHandoff'
import { formatBiPlanningContextSection } from './buildDetailedGeneralLessonPlan'

/** Vite public env flag — opt-in only; default unset/false keeps Chalkie parity. */
export const BE3_U08_OPENER_BI_FRAMING_ENV =
  'VITE_CHALKIE_BE3_U08_OPENER_BI_FRAMING'

function envFlagEnabled(raw: string | boolean | undefined): boolean {
  if (raw === true) return true
  if (typeof raw !== 'string') return false
  const normalized = raw.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes'
}

export function isBe3U08OpenerBiFramingEnabled(
  env?: { readonly [key: string]: string | boolean | undefined } | null,
): boolean {
  const resolved =
    env ??
    (typeof import.meta !== 'undefined'
      ? (import.meta.env as
          | { readonly [key: string]: string | boolean | undefined }
          | undefined)
      : undefined) ??
    {}
  return envFlagEnabled(resolved[BE3_U08_OPENER_BI_FRAMING_ENV])
}

export function formatChalkieBiFramingBlock(
  context: BiPlanningContext | null | undefined,
): string {
  const lines = formatBiPlanningContextSection(context)
  return lines.length > 0 ? lines.join('\n') : ''
}

/**
 * Append labelled BI framing to the Opener detailed handoff when enabled.
 * Vocabulary and outline artifacts stay unchanged (intentional delta = handoff only).
 */
export function applyOpenerBiFramingToHandoff(
  handoff: Be3U08OpenerSeriesHandoff,
  context: BiPlanningContext | null | undefined,
  options?: {
    readonly enabled?: boolean
    readonly env?: { readonly [key: string]: string | boolean | undefined } | null
  },
): Be3U08OpenerSeriesHandoff {
  const enabled =
    options?.enabled ?? isBe3U08OpenerBiFramingEnabled(options?.env ?? null)
  if (!enabled) return handoff
  const block = formatChalkieBiFramingBlock(context)
  if (!block) return handoff
  return {
    ...handoff,
    detailedHandoff: `${handoff.detailedHandoff.trimEnd()}\n\n${block}\n`,
  }
}
