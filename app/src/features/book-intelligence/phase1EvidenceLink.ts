/**
 * Read-only deep links from Book Intelligence → Phase 1 Validation evidence.
 * Additive UI wiring only — no book_files / schema changes.
 */

/** Units that expose a "View Source Evidence" control (BE3 U1–9). */
const EVIDENCE_LINK_UNIT_NUMBERS = new Set([
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
])

export function hasPhase1EvidenceLink(unitNumber: string | undefined | null): boolean {
  return Boolean(unitNumber && EVIDENCE_LINK_UNIT_NUMBERS.has(unitNumber))
}

export function phase1EvidencePath(unitNumber: string): string {
  return `/app/validation?unit=${encodeURIComponent(unitNumber)}`
}
