/**
 * Deterministic teacher-facing lesson titles and stable internal references.
 *
 * Title pattern:
 *   `{series-level} {book-type} Unit {NN} {page ref} — {unit title} — {short focus}`
 *
 * Stable reference pattern (tracking only; not the copied title):
 *   `{series-level}-{book-type}-u{NN}-p{start}` or `…-p{start}-{end}`
 *
 * Lesson suffixes such as `-l01`, `-l02` may be appended later only when multiple
 * lessons are deliberately created from the same spread. Do not add them yet.
 */

export type ChalkieBookTypeCode = 'SB' | 'WB' | 'TG'

/** Exact teaching-focus string produced for Did…? past-activity practice. */
export const DID_PAST_ACTIVITY_TEACHING_FOCUS =
  'Ask and answer about past activities using Did…? and short answers.'

const GENERIC_SECTION_TITLES =
  /^(language in action|vocabulary|grammar|song|clil|reading|listening|phonics|values|review|content connection)$/i

export function formatZeroPaddedUnitNumber(unitNumber: number): string {
  return String(unitNumber).padStart(2, '0')
}

export function formatPageReference(visiblePrintedPages: number[]): string {
  const pages = [...visiblePrintedPages].sort((a, b) => a - b)
  if (pages.length === 0) return 'p. —'
  if (pages.length === 1) return `p. ${pages[0]}`
  return `pp. ${pages[0]}–${pages[pages.length - 1]}`
}

export function resolveBookTypeCode(input: {
  catalogBookId?: string | null
  bookType?: string | null
}): ChalkieBookTypeCode {
  const id = (input.catalogBookId ?? '').trim().toLowerCase()
  if (/(^|_)wb($|_)/.test(id)) return 'WB'
  if (/(^|_)tg($|_)/.test(id)) return 'TG'
  if (/(^|_)sb($|_)/.test(id)) return 'SB'

  const type = (input.bookType ?? '').trim().toLowerCase()
  if (type.includes('workbook')) return 'WB'
  if (type.includes('teacher')) return 'TG'
  return 'SB'
}

export function resolveSeriesLevelCode(input: {
  catalogBookId?: string | null
  bookTitle?: string | null
}): string | null {
  const id = (input.catalogBookId ?? '').trim().toLowerCase()
  let match = id.match(/^big_english_(\d+)/)
  if (match) return `BE${match[1]}`
  match = id.match(/^beehive_(\d+)/)
  if (match) return `BH${match[1]}`
  match = id.match(/^reach_higher_(\d+[a-z]?)/)
  if (match) return `RH${match[1].toUpperCase()}`

  const title = (input.bookTitle ?? '').trim()
  match = title.match(/Big English\s+(\d+)/i)
  if (match) return `BE${match[1]}`
  match = title.match(/Beehive\s+(\d+)/i)
  if (match) return `BH${match[1]}`
  match = title.match(/Reach Higher\s+(\d+[A-Za-z]?)/i)
  if (match) return `RH${match[1].toUpperCase()}`

  return null
}

export function buildStableLessonReference(input: {
  seriesLevelCode: string | null
  bookTypeCode: ChalkieBookTypeCode
  unitNumber: number | null
  visiblePrintedPages: number[]
}): string | null {
  if (!input.seriesLevelCode || input.unitNumber == null) return null
  const pages = [...input.visiblePrintedPages].sort((a, b) => a - b)
  if (pages.length === 0) return null

  const series = input.seriesLevelCode.toLowerCase()
  const bookType = input.bookTypeCode.toLowerCase()
  const unit = formatZeroPaddedUnitNumber(input.unitNumber)
  const pagePart =
    pages.length === 1
      ? `p${pages[0]}`
      : `p${pages[0]}-${pages[pages.length - 1]}`

  return `${series}-${bookType}-u${unit}-${pagePart}`
}

function isTeacherFriendlyLessonTitle(title: string): boolean {
  const trimmed = title.trim()
  if (!trimmed) return false
  if (GENERIC_SECTION_TITLES.test(trimmed)) return false
  if (trimmed.length > 48) return false
  if (/[.!?]$/.test(trimmed)) return false
  if (/^unit\s+\d+/i.test(trimmed)) return false
  if (/\blanguage practice\b/i.test(trimmed)) return false
  if (/\(\s*did\b/i.test(trimmed)) return false
  if (/\b(using|practise|practice|learn and|ask and answer)\b/i.test(trimmed)) {
    return false
  }
  return true
}

function cleanFallbackTopic(topic: string): string {
  const primary = topic.split(' · ').map((part) => part.trim()).find(Boolean) ?? topic.trim()
  return primary.replace(/\s+/g, ' ').replace(/[.]+$/g, '').trim()
}

function knownFocusTypeShortTitle(focus: string): string | null {
  if (
    focus === DID_PAST_ACTIVITY_TEACHING_FOCUS ||
    (/^ask and answer about past activities using did/i.test(focus) &&
      /short answers/i.test(focus))
  ) {
    return 'Asking About Yesterday'
  }
  return null
}

/**
 * Short lesson-focus title for the teacher-facing name.
 * Deterministic and local — no remote model calls.
 *
 * Order: teacher-friendly verified title → known focus-type label → cleaned topic.
 */
export function deriveShortLessonFocusTitle(input: {
  teachingFocus?: string | null
  lessonTopic?: string | null
}): string {
  const focus = input.teachingFocus?.trim() ?? ''
  const topic = input.lessonTopic?.trim() ?? ''

  if (topic) {
    const parts = topic.split(' · ').map((part) => part.trim()).filter(Boolean)
    for (const part of parts) {
      if (isTeacherFriendlyLessonTitle(part)) return part
    }
  }

  const known = knownFocusTypeShortTitle(focus)
  if (known) return known

  if (topic) {
    const cleaned = cleanFallbackTopic(topic)
    if (cleaned) return cleaned
  }

  if (focus) {
    const cleaned = focus.replace(/[.]+$/g, '').trim()
    if (cleaned.length <= 48 && isTeacherFriendlyLessonTitle(cleaned)) return cleaned
    return cleanFallbackTopic(cleaned) || 'Lesson'
  }

  return 'Lesson'
}

export function buildTeacherFacingLessonTitle(input: {
  seriesLevelCode: string | null
  bookTypeCode: ChalkieBookTypeCode
  unitNumber: number | null
  unitTitle: string | null
  visiblePrintedPages: number[]
  shortLessonFocusTitle: string
}): string {
  const series = input.seriesLevelCode ?? 'Book'
  const unitPart =
    input.unitNumber != null
      ? `Unit ${formatZeroPaddedUnitNumber(input.unitNumber)}`
      : 'Unit'
  const pageRef = formatPageReference(input.visiblePrintedPages)
  const unitTitle = (input.unitTitle ?? 'Lesson').trim() || 'Lesson'
  const focus = input.shortLessonFocusTitle.trim() || 'Lesson'
  return `${series} ${input.bookTypeCode} ${unitPart} ${pageRef} — ${unitTitle} — ${focus}`
}

export function buildChalkieLessonNaming(input: {
  catalogBookId?: string | null
  bookTitle?: string | null
  bookType?: string | null
  unitNumber: number | null
  unitTitle: string | null
  visiblePrintedPages: number[]
  teachingFocus?: string | null
  lessonTopic?: string | null
}): {
  teacherFacingTitle: string
  stableLessonReference: string | null
  seriesLevelCode: string | null
  bookTypeCode: ChalkieBookTypeCode
  shortLessonFocusTitle: string
} {
  const seriesLevelCode = resolveSeriesLevelCode({
    catalogBookId: input.catalogBookId,
    bookTitle: input.bookTitle,
  })
  const bookTypeCode = resolveBookTypeCode({
    catalogBookId: input.catalogBookId,
    bookType: input.bookType,
  })
  const shortLessonFocusTitle = deriveShortLessonFocusTitle({
    teachingFocus: input.teachingFocus,
    lessonTopic: input.lessonTopic,
  })
  const teacherFacingTitle = buildTeacherFacingLessonTitle({
    seriesLevelCode,
    bookTypeCode,
    unitNumber: input.unitNumber,
    unitTitle: input.unitTitle,
    visiblePrintedPages: input.visiblePrintedPages,
    shortLessonFocusTitle,
  })
  const stableLessonReference = buildStableLessonReference({
    seriesLevelCode,
    bookTypeCode,
    unitNumber: input.unitNumber,
    visiblePrintedPages: input.visiblePrintedPages,
  })

  return {
    teacherFacingTitle,
    stableLessonReference,
    seriesLevelCode,
    bookTypeCode,
    shortLessonFocusTitle,
  }
}
