/**
 * Phase 5 packaging instructions for Chalkie prompt generation.
 * Evidence comes from the client (Phase 1 only). Do not invent Phase 2–4.
 */

export const CHALKIE_SYSTEM_PROMPT = `You are a curriculum packaging assistant for English teachers.
Your job is to write a paste-ready Chalkie.ai lesson brief that SUPPORTS the textbook pages the teacher is viewing.

Hard rules:
- Scope ONLY the printed pages listed in the evidence. Do not teach later unit pages.
- Use ONLY the Phase 1 textbook evidence provided. Do not invent Phase 2 interpretation, Phase 3 connections, or Phase 4 enrichment.
- Do not invent vocabulary, language frames, or activities that are not in the evidence.
- If evidence is thin, keep the brief short and honest; leave optional sections blank rather than inventing content.
- Beauty in simplicity: short slide lesson, age-appropriate English, pictures where helpful, few words per slide, no filler.
- Support the textbook — do not replace it. Prefer Model → guided practice → student speaking.
- Leave space for the teacher’s own book activities.

Output MUST be a single JSON object with exactly these keys:
- "lessonTopic": short teacher-facing topic string (one line)
- "chalkiePrompt": the full paste-ready Chalkie brief as plain text (use sections A CURRICULUM FLOOR, B TEACHING PROGRESSION, C PRIOR LEARNING optional, D OPTIONAL ENRICHMENT optional, E GENERATION RULES — similar spirit to a page-scoped Phase 5 brief)
- "vocabularyCsv": comma-separated vocabulary terms from the evidence for the visible pages when available; otherwise unit vocabulary from evidence; empty string if none

No markdown fences. No commentary outside the JSON object.`

export type ChalkieGenerateEvidence = {
  bookTitle: string
  catalogBookId?: string
  series?: string
  unitLabel: string
  unitTheme?: string | null
  unitPageRange?: string | null
  learningFocus?: string | null
  visiblePrintedPages: number[]
  unitVocabulary: string[]
  unitLanguage: string[]
  unitActivities: string[]
  visiblePageLabels: string[]
  visibleVocabulary: string[]
  visibleLanguage: string[]
  visibleActivities: string[]
}

export function buildUserEvidenceMessage(evidence: ChalkieGenerateEvidence): string {
  const pages =
    evidence.visiblePrintedPages.length > 0
      ? evidence.visiblePrintedPages.join(', ')
      : '(none — ask teacher to navigate PDF)'

  return [
    'Generate a page-scoped Chalkie teaching brief from this Phase 1 evidence.',
    '',
    `Book: ${evidence.bookTitle}${evidence.catalogBookId ? ` (${evidence.catalogBookId})` : ''}`,
    evidence.series ? `Series: ${evidence.series}` : null,
    `Unit: ${evidence.unitLabel}`,
    evidence.unitTheme ? `Theme: ${evidence.unitTheme}` : null,
    evidence.unitPageRange ? `Unit page range: ${evidence.unitPageRange}` : null,
    evidence.learningFocus ? `Section focus (from pages): ${evidence.learningFocus}` : null,
    `Visible printed pages (REQUIRED SCOPE): ${pages}`,
    '',
    'Unit vocabulary (Phase 1):',
    evidence.unitVocabulary.length ? evidence.unitVocabulary.join(', ') : '(none listed)',
    '',
    'Unit language frames (Phase 1):',
    evidence.unitLanguage.length ? evidence.unitLanguage.map((l) => `- ${l}`).join('\n') : '(none listed)',
    '',
    'Unit activities (Phase 1):',
    evidence.unitActivities.length
      ? evidence.unitActivities.map((a) => `- ${a}`).join('\n')
      : '(none listed)',
    '',
    'Visible spread — page labels:',
    evidence.visiblePageLabels.length
      ? evidence.visiblePageLabels.map((p) => `- ${p}`).join('\n')
      : '(none)',
    '',
    'Visible spread — vocabulary:',
    evidence.visibleVocabulary.length ? evidence.visibleVocabulary.join(', ') : '(none linked to these pages)',
    '',
    'Visible spread — language:',
    evidence.visibleLanguage.length
      ? evidence.visibleLanguage.map((l) => `- ${l}`).join('\n')
      : '(none linked)',
    '',
    'Visible spread — activities:',
    evidence.visibleActivities.length
      ? evidence.visibleActivities.map((a) => `- ${a}`).join('\n')
      : '(none linked)',
  ]
    .filter((line) => line !== null)
    .join('\n')
}
