/**
 * NLL/NLP Inspector (D029) — read-only diagnostic report assembly.
 * Internal id: `nll_nlp_inspector`. Not an adapter; reuses NLP + NLL loaders.
 *
 * Status dimensions are independent:
 * - Source evidence verification (activity/card)
 * - NLL summary review_state
 * - Evidence sufficiency (evidence_status)
 * - Staleness (hash comparison when currentActivitySha256ById was supplied)
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { isAdminProfile } from '../auth/isAdminProfile'
import type { UserRole } from '../../types/user'
import type { TeacherAddedLanguageInput } from './buildChalkiePromptPreview'
import {
  buildNeutralSbOnlyLessonPackage,
  buildNeutralSbWbLessonPackage,
  type NeutralLessonPackage,
} from './buildNeutralSbWbLessonPackage'
import type {
  SbActivityCard,
  SbActivityHandoffSelection,
} from './chalkieActivitySelection'
import type {
  WbActivityCard,
  WbActivityHandoffSelection,
} from './chalkieWorkbookActivitySelection'
import {
  attachSelectedNllDerivedKnowledge,
  mapTeacherInputsToOpenerPriorSupportForGeneralLessonPlan,
} from './nllGeneralLessonPlanPilot'
import { resolveBe3U08NllActivitySummarySpec } from './nllActivitySummaries'
import type { ChalkieLessonContext } from './resolveChalkieLessonContext'
import type { VerifiedSbWbCompanion } from './resolveVerifiedSbWbCompanion'
import type { TeacherChoiceSuggestion } from './teacherChoiceSuggestions'
import {
  loadNeutralLessonComponent,
  type ResolvedNllComponent,
} from '../nll/neutralLessonLibrary'
import {
  resolveNllComponentByExactActivityMembershipFromClient,
  type ResolveNllComponentByExactMembershipResult,
} from '../nll/resolveNllComponentByExactActivityMembership'
import type { ScopeSequenceUnit } from '../scope-sequence/scopeSequence'

export const NLL_NLP_INSPECTOR_ID = 'nll_nlp_inspector' as const

/** Admin-only choose-output card gate (teachers keep ChatGPT placeholder). */
export function shouldShowNllNlpInspectorCard(
  role: UserRole | string | null | undefined,
): boolean {
  return isAdminProfile(role)
}

export type NllNlpInspectorActivityRow = {
  readonly activityId: string
  readonly cardId: string
  readonly source: 'SB' | 'WB'
  readonly title: string
  readonly printedPage: number
  readonly availableInNll: boolean
  readonly selectedByTeacher: boolean
  /**
   * Currently unselected in the Create-a-prompt handoff (`!selectedByTeacher`).
   * Not a separate intentional-exclusion event log.
   */
  readonly excludedByTeacher: boolean
  readonly includedInNlp: boolean
  /** Source/activity verification from Phase 1 evidence references. */
  readonly sourceVerificationStatus: string | null
  readonly nllSummaryId: string | null
  readonly nllReviewState: string | null
  readonly nllEvidenceStatus: string | null
  readonly nllDisplayStatus: string | null
  readonly nllStaleness: string | null
  readonly nllCurrentActivitySha256: string | null
  readonly nllStoredActivitySha256: string | null
}

/**
 * Reserved consumer-lineage stub (GLP / adapters). Not wired to Stage 4 or Chalkie;
 * reports `not_in_scope` until a separately authorized consumer probe exists.
 */
export type NllNlpAdapterOrConsumerInclusion =
  | 'included'
  | 'not_in_scope'
  | 'unavailable'

export type NllNlpInspectionIssueKind =
  | 'missing'
  | 'excluded'
  | 'unverified'
  | 'experimental'
  | 'insufficient_evidence'
  | 'stale'
  | 'staleness_unverifiable'
  | 'unavailable'
  | 'untraceable'

export type NllNlpInspectionIssue = {
  readonly kind: NllNlpInspectionIssueKind
  readonly message: string
}

export type NllNlpInspectionOverview = {
  readonly nllStatus: 'loaded' | 'unavailable' | 'not_applicable'
  readonly nllActivitiesAvailable: number
  readonly teacherSelectedCount: number
  readonly teacherExcludedCount: number
  readonly includedInNlpCount: number
  readonly derivedSummariesInNlpCount: number
  readonly experimentalOrReviewPendingCount: number
  readonly insufficientEvidenceCount: number
  readonly staleCount: number
  readonly stalenessUnverifiableCount: number
  readonly nlpStatus: 'assembled' | 'unavailable'
  readonly assembledPackageType: string | null
  readonly priorSupportCandidateCount: number
  readonly majorFindingsCount: number
}

export type NllNlpInspectionReport = {
  readonly inspectorId: typeof NLL_NLP_INSPECTOR_ID
  readonly generatedAt: string
  readonly overview: NllNlpInspectionOverview
  readonly lessonIdentity: {
    readonly seriesOrBookLabel: string
    readonly catalogBookId: string | null
    readonly unitNumber: number | null
    readonly unitTitle: string | null
    readonly lessonTitle: string
    readonly studentBookPages: readonly number[]
    readonly workbookPages: readonly number[]
    /**
     * Create-a-prompt two-lesson packaging configuration for Chalkie Step 3.
     * `sb_only` = Student-Book-only split of the current spread (not NLP package type).
     * `sb_wb` = verified SB→WB companion series packaging available.
     */
    readonly twoLessonPackagingConfiguration: string | null
    readonly companionRelationshipId: string | null
    readonly companionRelationshipType: string | null
    readonly nlpAssemblyStatus: 'assembled' | 'unavailable'
    readonly assembledPackageType: string | null
  }
  readonly scopeSequence: {
    readonly status: 'unit_level' | 'unavailable'
    readonly unitNumberRaw: string | null
    readonly unitTitleRaw: string | null
    readonly categories: readonly {
      readonly categoryNameRaw: string
      readonly columnOrder: number
      readonly rawText: string
    }[]
    readonly note: string
  }
  readonly nll: {
    readonly status: 'loaded' | 'unavailable' | 'not_applicable'
    readonly componentKey: string | null
    readonly componentId: string | null
    readonly componentTitle: string | null
    readonly activities: readonly {
      readonly activityId: string
      readonly position: number | null
      readonly summaryId: string | null
      readonly summaryText: string | null
      readonly evidenceStatus: string | null
      readonly displayStatus: string | null
      readonly reviewState: string | null
      readonly staleness: string | null
      readonly storedActivitySha256: string | null
      readonly currentActivitySha256: string | null
      readonly verificationNote: string
    }[]
    readonly note: string
    readonly experimentalSummaryPolicyNote: string
  }
  readonly teacherSelections: readonly NllNlpInspectorActivityRow[]
  readonly nlp: {
    readonly status: 'assembled' | 'unavailable'
    readonly package: NeutralLessonPackage | null
    readonly note: string
  }
  /**
   * Whether a downstream adapter/consumer (e.g. General Lesson Prompt) inclusion
   * is observable for this snapshot. Stub only — always `not_in_scope` in v1.
   */
  readonly adapterOrConsumerInclusion: NllNlpAdapterOrConsumerInclusion
  readonly issues: readonly NllNlpInspectionIssue[]
  readonly markdown: string
}

export type NllInspectorLoadOptions = {
  readonly includeHiddenExperimental: true
  readonly currentActivitySha256ById?: Readonly<Record<string, string>>
}

export type BuildNllNlpInspectionReportInput = {
  readonly lesson: ChalkieLessonContext
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly selectedSuggestions: readonly TeacherChoiceSuggestion[]
  readonly teacherAdditions: readonly TeacherAddedLanguageInput[]
  readonly scopeSequenceUnit?: ScopeSequenceUnit | null
  readonly client?: SupabaseClient | null
  /**
   * Optional authoritative current activity fingerprints (activity_id → sha256).
   * When omitted, preferred summaries remain staleness `unverifiable`.
   * Read-only; never written back to NLL.
   */
  readonly currentActivitySha256ById?: Readonly<Record<string, string>>
  readonly loadNll?: (
    client: SupabaseClient,
    componentKey: string,
    options: NllInspectorLoadOptions,
  ) => Promise<ResolvedNllComponent | null>
  /**
   * Optional exact membership resolver (test injection / overrides).
   * Default path queries `nll_components` + `nll_component_activities`.
   */
  readonly resolveNllComponentByExactMembership?: (
    lessonActivityIds: readonly string[],
  ) =>
    | ResolveNllComponentByExactMembershipResult
    | Promise<ResolveNllComponentByExactMembershipResult>
  readonly nowIso?: string
}

/** Complete available lesson activity IDs (cards), not teacher selection. */
export function collectAvailableLessonActivityIds(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
}): string[] {
  const ids: string[] = []
  for (const card of input.activityCards) {
    const id = activityIdFromSb(card).trim()
    if (id) ids.push(id)
  }
  for (const card of input.workbookActivityCards) {
    const id = activityIdFromWb(card).trim()
    if (id) ids.push(id)
  }
  return [...new Set(ids)]
}

function activityIdFromSb(card: SbActivityCard): string {
  return card.references.activityId
}

function activityIdFromWb(card: WbActivityCard): string {
  return card.references[0]?.activityId ?? ''
}

function nlpSelectedActivityIds(
  nlp: NeutralLessonPackage | null,
): Set<string> {
  if (!nlp) return new Set()
  const ids = new Set<string>()
  for (const activity of [
    ...nlp.lesson1.selectedActivities,
    ...nlp.lesson2.selectedActivities,
  ]) {
    const fromRef = activity.references[0]?.activityId?.trim()
    if (fromRef) ids.add(fromRef)
  }
  return ids
}

function nllActivityIndex(
  resolved: ResolvedNllComponent | null,
): Map<
  string,
  {
    summaryId: string | null
    reviewState: string | null
    summaryText: string | null
    evidenceStatus: string | null
    displayStatus: string | null
    position: number | null
    staleness: string | null
    currentActivitySha256: string | null
    storedActivitySha256: string | null
  }
> {
  const map = new Map<
    string,
    {
      summaryId: string | null
      reviewState: string | null
      summaryText: string | null
      evidenceStatus: string | null
      displayStatus: string | null
      position: number | null
      staleness: string | null
      currentActivitySha256: string | null
      storedActivitySha256: string | null
    }
  >()
  if (!resolved) return map
  for (const row of resolved.activities) {
    const summary = row.preferredSummary
    map.set(row.activityId, {
      summaryId: summary?.id ?? null,
      reviewState: summary?.review_state ?? null,
      summaryText: summary?.summary_text ?? null,
      evidenceStatus: summary?.evidence_status ?? null,
      displayStatus: summary?.display_status ?? null,
      position: row.position,
      staleness: summary?.staleness ?? null,
      currentActivitySha256: summary?.currentActivitySha256 ?? null,
      storedActivitySha256: summary?.activity_sha256 ?? null,
    })
  }
  return map
}

export function buildTeacherSelectionRows(input: {
  readonly activityCards: readonly SbActivityCard[]
  readonly workbookActivityCards: readonly WbActivityCard[]
  readonly sbSelection: SbActivityHandoffSelection
  readonly wbSelection: WbActivityHandoffSelection
  readonly nll: ResolvedNllComponent | null
  readonly nlp: NeutralLessonPackage | null
}): NllNlpInspectorActivityRow[] {
  const sbSelectedCards = new Set(
    input.sbSelection.selectedEvidence.map((e) => e.cardId),
  )
  const wbSelectedCards = new Set(
    input.wbSelection.selectedEvidence.map((e) => e.cardId),
  )
  const nllIndex = nllActivityIndex(input.nll)
  const nlpIds = nlpSelectedActivityIds(input.nlp)
  const rows: NllNlpInspectorActivityRow[] = []

  for (const card of input.activityCards) {
    const activityId = activityIdFromSb(card)
    const selected = sbSelectedCards.has(card.id)
    const nllMeta = nllIndex.get(activityId)
    rows.push({
      activityId,
      cardId: card.id,
      source: 'SB',
      title:
        card.activityNumber != null
          ? `Activity ${card.activityNumber}`
          : card.verifiedWording.slice(0, 80),
      printedPage: card.printedPage,
      availableInNll: nllIndex.has(activityId),
      selectedByTeacher: selected,
      excludedByTeacher: !selected,
      includedInNlp: nlpIds.has(activityId),
      sourceVerificationStatus: card.references.verificationStatus ?? null,
      nllSummaryId: nllMeta?.summaryId ?? null,
      nllReviewState: nllMeta?.reviewState ?? null,
      nllEvidenceStatus: nllMeta?.evidenceStatus ?? null,
      nllDisplayStatus: nllMeta?.displayStatus ?? null,
      nllStaleness: nllMeta?.staleness ?? null,
      nllCurrentActivitySha256: nllMeta?.currentActivitySha256 ?? null,
      nllStoredActivitySha256: nllMeta?.storedActivitySha256 ?? null,
    })
  }

  for (const card of input.workbookActivityCards) {
    const activityId = activityIdFromWb(card)
    const selected = wbSelectedCards.has(card.id)
    const nllMeta = activityId ? nllIndex.get(activityId) : undefined
    rows.push({
      activityId: activityId || '(unavailable)',
      cardId: card.id,
      source: 'WB',
      title:
        card.activityNumber != null
          ? `Activity ${card.activityNumber}`
          : card.verifiedWording.slice(0, 80),
      printedPage: card.printedPage,
      availableInNll: Boolean(activityId && nllIndex.has(activityId)),
      selectedByTeacher: selected,
      excludedByTeacher: !selected,
      includedInNlp: Boolean(activityId && nlpIds.has(activityId)),
      sourceVerificationStatus: card.references[0]?.verificationStatus ?? null,
      nllSummaryId: nllMeta?.summaryId ?? null,
      nllReviewState: nllMeta?.reviewState ?? null,
      nllEvidenceStatus: nllMeta?.evidenceStatus ?? null,
      nllDisplayStatus: nllMeta?.displayStatus ?? null,
      nllStaleness: nllMeta?.staleness ?? null,
      nllCurrentActivitySha256: nllMeta?.currentActivitySha256 ?? null,
      nllStoredActivitySha256: nllMeta?.storedActivitySha256 ?? null,
    })
  }

  return rows
}

function isSourceUnverified(status: string | null): boolean {
  if (!status) return false
  const normalized = status.trim().toLowerCase()
  return normalized === 'unverified' || normalized === 'not_verified'
}

function isExperimentalOrReviewPending(reviewState: string | null): boolean {
  if (!reviewState) return false
  const normalized = reviewState.trim().toLowerCase()
  return (
    normalized === 'experimental' ||
    normalized === 'review_pending' ||
    normalized === 'pending_review'
  )
}

export function collectInspectionIssues(input: {
  readonly teacherSelections: readonly NllNlpInspectorActivityRow[]
  readonly nllStatus: 'loaded' | 'unavailable' | 'not_applicable'
  readonly nlpStatus: 'assembled' | 'unavailable'
  readonly scopeSequenceStatus: 'unit_level' | 'unavailable'
  readonly nll: ResolvedNllComponent | null
}): NllNlpInspectionIssue[] {
  const issues: NllNlpInspectionIssue[] = []

  if (input.scopeSequenceStatus === 'unavailable') {
    issues.push({
      kind: 'unavailable',
      message: 'Scope & Sequence unit record is not available for this lesson.',
    })
  }

  if (input.nllStatus === 'unavailable') {
    issues.push({
      kind: 'unavailable',
      message: 'NLL component could not be loaded for this lesson scope.',
    })
  }

  if (input.nlpStatus === 'unavailable') {
    issues.push({
      kind: 'unavailable',
      message:
        'Neutral Lesson Package could not be assembled (verified SB→WB companion package failed, or genuine SB-only package could not be built from current Student Book selection).',
    })
  }

  for (const row of input.teacherSelections) {
    if (row.excludedByTeacher) {
      issues.push({
        kind: 'excluded',
        message: `${row.source} ${row.activityId} excluded by teacher selection.`,
      })
    }

    if (isSourceUnverified(row.sourceVerificationStatus)) {
      issues.push({
        kind: 'unverified',
        message: `${row.source} ${row.activityId} source verification status is ${row.sourceVerificationStatus}.`,
      })
    }

    if (isExperimentalOrReviewPending(row.nllReviewState)) {
      issues.push({
        kind: 'experimental',
        message: `${row.source} ${row.activityId} NLL summary review_state is ${row.nllReviewState} (not source-unverified).`,
      })
    }

    if (row.nllEvidenceStatus === 'insufficient') {
      issues.push({
        kind: 'insufficient_evidence',
        message: `${row.source} ${row.activityId} NLL evidence_status is insufficient.`,
      })
    }

    if (row.nllStaleness === 'potentially_stale') {
      issues.push({
        kind: 'stale',
        message: `${row.source} ${row.activityId} NLL summary staleness is potentially_stale.`,
      })
    } else if (row.nllStaleness === 'unverifiable') {
      issues.push({
        kind: 'staleness_unverifiable',
        message: `${row.source} ${row.activityId} NLL summary staleness is unverifiable (currentActivitySha256 unavailable).`,
      })
    }

    if (row.selectedByTeacher && !row.includedInNlp && input.nlpStatus === 'assembled') {
      issues.push({
        kind: 'untraceable',
        message: `${row.source} ${row.activityId} is selected but not present in assembled NLP selectedActivities.`,
      })
    }

    if (!row.activityId || row.activityId === '(unavailable)') {
      issues.push({
        kind: 'untraceable',
        message: `${row.source} card ${row.cardId} has no activity id.`,
      })
    }
  }

  if (input.nll) {
    for (const activity of input.nll.activities) {
      if (!activity.preferredSummary) {
        issues.push({
          kind: 'missing',
          message: `NLL membership ${activity.activityId} has no preferred summary.`,
        })
      }
    }
  }

  return issues
}

export function buildInspectionOverview(input: {
  readonly teacherSelections: readonly NllNlpInspectorActivityRow[]
  readonly nllStatus: 'loaded' | 'unavailable' | 'not_applicable'
  readonly nllActivityCount: number
  readonly nlp: NeutralLessonPackage | null
  readonly nlpStatus: 'assembled' | 'unavailable'
  readonly issues: readonly NllNlpInspectionIssue[]
}): NllNlpInspectionOverview {
  const selected = input.teacherSelections.filter((row) => row.selectedByTeacher)
  const excluded = input.teacherSelections.filter((row) => row.excludedByTeacher)
  const included = input.teacherSelections.filter((row) => row.includedInNlp)
  return {
    nllStatus: input.nllStatus,
    nllActivitiesAvailable: input.nllActivityCount,
    teacherSelectedCount: selected.length,
    teacherExcludedCount: excluded.length,
    includedInNlpCount: included.length,
    derivedSummariesInNlpCount:
      input.nlp?.derivedKnowledge?.activitySummaries.length ?? 0,
    experimentalOrReviewPendingCount: input.teacherSelections.filter((row) =>
      isExperimentalOrReviewPending(row.nllReviewState),
    ).length,
    insufficientEvidenceCount: input.teacherSelections.filter(
      (row) => row.nllEvidenceStatus === 'insufficient',
    ).length,
    staleCount: input.teacherSelections.filter(
      (row) => row.nllStaleness === 'potentially_stale',
    ).length,
    stalenessUnverifiableCount: input.teacherSelections.filter(
      (row) => row.nllStaleness === 'unverifiable',
    ).length,
    nlpStatus: input.nlpStatus,
    assembledPackageType: input.nlp?.packaging.type ?? null,
    priorSupportCandidateCount: input.nlp?.priorSupport.length ?? 0,
    majorFindingsCount: input.issues.length,
  }
}

const ISSUE_KIND_LABEL: Record<NllNlpInspectionIssueKind, string> = {
  missing: 'Missing',
  excluded: 'Excluded',
  unverified: 'Unverified (source)',
  experimental: 'Experimental / review pending',
  insufficient_evidence: 'Insufficient evidence',
  stale: 'Stale',
  staleness_unverifiable: 'Staleness unverifiable',
  unavailable: 'Unavailable',
  untraceable: 'Untraceable',
}

export function renderNllNlpInspectionMarkdown(
  report: Omit<NllNlpInspectionReport, 'markdown'>,
): string {
  const lines: string[] = []
  lines.push('# NLL/NLP Inspection Report')
  lines.push('')
  lines.push(`Inspector id: \`${report.inspectorId}\``)
  lines.push(`Generated at: ${report.generatedAt}`)
  lines.push('')

  lines.push('## Overview')
  lines.push('')
  const overview = report.overview
  lines.push(`- NLL component status: **${overview.nllStatus}**`)
  lines.push(`- NLL activities available: ${overview.nllActivitiesAvailable}`)
  lines.push(`- Teacher-selected activities: ${overview.teacherSelectedCount}`)
  lines.push(`- Teacher-excluded activities: ${overview.teacherExcludedCount}`)
  lines.push(
    `  - Note: Excluded means currently unselected in the Create-a-prompt handoff (\`!selected\`), not a separate intentional-exclusion event log.`,
  )
  lines.push(`- Activities included in NLP: ${overview.includedInNlpCount}`)
  lines.push(
    `- Derived summaries included in NLP: ${overview.derivedSummariesInNlpCount}`,
  )
  lines.push(
    `- Experimental / review-pending summaries: ${overview.experimentalOrReviewPendingCount}`,
  )
  lines.push(`- Insufficient-evidence records: ${overview.insufficientEvidenceCount}`)
  lines.push(`- Stale records: ${overview.staleCount}`)
  lines.push(
    `- Staleness-unverifiable records: ${overview.stalenessUnverifiableCount}`,
  )
  lines.push(
    `  - Note: \`unverifiable\` means an authoritative current activity hash was not supplied for comparison — it is not itself proof that NLL content is stale.`,
  )
  lines.push(`- NLP assembly status: **${overview.nlpStatus}**`)
  lines.push(
    `- Assembled package type: ${overview.assembledPackageType ?? 'none'}`,
  )
  lines.push(
    `- Adapter/consumer inclusion (stub): **${report.adapterOrConsumerInclusion}**`,
  )
  lines.push(
    `  - Note: Downstream GLP/adapter consumption is not probed by this Inspector version; \`not_in_scope\` is expected.`,
  )
  lines.push(
    `- Prior-support candidate count: ${overview.priorSupportCandidateCount}`,
  )
  lines.push(`- Major findings count: ${overview.majorFindingsCount}`)
  lines.push('')
  lines.push(
    'Prior-support records are an optional candidate pool. Broad prior support is not itself a warning; current selected activities define required lesson evidence.',
  )
  lines.push('')

  lines.push('## A. Lesson identity')
  lines.push('')
  const id = report.lessonIdentity
  lines.push(`- Book / label: ${id.seriesOrBookLabel}`)
  lines.push(`- Catalog book id: ${id.catalogBookId ?? 'unavailable'}`)
  lines.push(
    `- Unit: ${id.unitNumber ?? 'unavailable'}${id.unitTitle ? ` — ${id.unitTitle}` : ''}`,
  )
  lines.push(`- Lesson title: ${id.lessonTitle || 'unavailable'}`)
  lines.push(
    `- Student Book pages: ${id.studentBookPages.join(', ') || 'unavailable'}`,
  )
  lines.push(`- Workbook pages: ${id.workbookPages.join(', ') || 'none'}`)
  lines.push(
    `- Source/configuration mode (Create-a-prompt two-lesson packaging): ${id.twoLessonPackagingConfiguration ?? 'null'}`,
  )
  lines.push(
    `  - Note: \`sb_only\` means Student-Book-only packaging of the current spread for Chalkie Step 3 — not the NLP \`packaging.type\`.`,
  )
  lines.push(
    `- Verified companion relationship id: ${id.companionRelationshipId ?? 'none'}`,
  )
  lines.push(
    `- Companion relationship type: ${id.companionRelationshipType ?? 'none'}`,
  )
  lines.push(`- NLP assembly status: **${id.nlpAssemblyStatus}**`)
  lines.push(
    `- Assembled NLP package type: ${id.assembledPackageType ?? 'none'}`,
  )
  lines.push('')

  lines.push('## B. Scope & Sequence requirements')
  lines.push('')
  lines.push(`- Status: **${report.scopeSequence.status}**`)
  lines.push(`- Note: ${report.scopeSequence.note}`)
  if (report.scopeSequence.unitNumberRaw) {
    lines.push(`- Unit number (raw): ${report.scopeSequence.unitNumberRaw}`)
  }
  if (report.scopeSequence.unitTitleRaw) {
    lines.push(`- Unit title (raw): ${report.scopeSequence.unitTitleRaw}`)
  }
  for (const category of report.scopeSequence.categories) {
    lines.push(
      `- [${category.columnOrder}] ${category.categoryNameRaw}: ${category.rawText || '(empty)'}`,
    )
  }
  lines.push('')

  lines.push('## C. Available NLL knowledge')
  lines.push('')
  lines.push(`- Status: **${report.nll.status}**`)
  lines.push(`- Note: ${report.nll.note}`)
  lines.push(`- Experimental policy: ${report.nll.experimentalSummaryPolicyNote}`)
  lines.push(`- Component key: ${report.nll.componentKey ?? 'unavailable'}`)
  lines.push(`- Component id: ${report.nll.componentId ?? 'unavailable'}`)
  lines.push(`- Component title: ${report.nll.componentTitle ?? 'unavailable'}`)
  for (const activity of report.nll.activities) {
    lines.push('')
    lines.push(`### NLL activity \`${activity.activityId}\``)
    lines.push(`- Position: ${activity.position ?? 'unavailable'}`)
    lines.push(`- Summary id: ${activity.summaryId ?? 'unavailable'}`)
    lines.push(
      `- Evidence sufficiency: ${activity.evidenceStatus ?? 'unavailable'}`,
    )
    lines.push(`- Display status: ${activity.displayStatus ?? 'unavailable'}`)
    lines.push(`- Review state: ${activity.reviewState ?? 'unavailable'}`)
    lines.push(`- Staleness: ${activity.staleness ?? 'unavailable'}`)
    lines.push(
      `- Stored activity hash: ${activity.storedActivitySha256 ?? 'unavailable'}`,
    )
    lines.push(
      `- Current activity hash: ${activity.currentActivitySha256 ?? 'null (comparison not supplied)'}`,
    )
    lines.push(`- Verification note: ${activity.verificationNote}`)
    lines.push(`- Summary text: ${activity.summaryText ?? 'unavailable'}`)
  }
  lines.push('')

  lines.push('## D. Teacher activity selections')
  lines.push('')
  lines.push(
    'Excluded = currently unselected (`!selected`). Selected and Excluded are inverses in this report version.',
  )
  lines.push('')
  lines.push(
    '| Source | Activity | Page | In NLL | Selected | Excluded | In NLP | Source verification | Review | Evidence | Staleness |',
  )
  lines.push('|---|---|---|---|---|---|---|---|---|---|---|')
  for (const row of report.teacherSelections) {
    lines.push(
      `| ${row.source} | ${row.activityId} (${row.title}) | ${row.printedPage} | ${row.availableInNll ? 'yes' : 'no'} | ${row.selectedByTeacher ? 'yes' : 'no'} | ${row.excludedByTeacher ? 'yes' : 'no'} | ${row.includedInNlp ? 'yes' : 'no'} | ${row.sourceVerificationStatus ?? '—'} | ${row.nllReviewState ?? '—'} | ${row.nllEvidenceStatus ?? '—'} | ${row.nllStaleness ?? '—'} |`,
    )
  }
  lines.push('')

  lines.push('## E. Assembled NLP contents')
  lines.push('')
  lines.push(`- Status: **${report.nlp.status}**`)
  lines.push(`- Note: ${report.nlp.note}`)
  if (report.nlp.package) {
    const nlp = report.nlp.package
    lines.push(`- Package reference: ${nlp.identity.packageReference}`)
    lines.push(`- Component title: ${nlp.identity.componentTitle}`)
    lines.push(`- Packaging type: ${nlp.packaging.type}`)
    lines.push(
      `- priorSupportMayReplaceCurrentEvidence: ${nlp.boundaries.priorSupportMayReplaceCurrentEvidence}`,
    )
    lines.push(
      `- Lesson 1 selected activities: ${nlp.lesson1.selectedActivities.length}`,
    )
    lines.push(
      `- Lesson 2 selected activities: ${nlp.lesson2.selectedActivities.length}`,
    )
    lines.push(
      `- Prior support candidates (optional pool): ${nlp.priorSupport.length}`,
    )
    lines.push(
      `- Derived knowledge summaries: ${nlp.derivedKnowledge?.activitySummaries.length ?? 0}`,
    )
    lines.push('')
    lines.push('```json')
    lines.push(JSON.stringify(nlp, null, 2))
    lines.push('```')
  }
  lines.push('')

  lines.push('## F. Provenance and data lineage')
  lines.push('')
  lines.push(
    'Logical lineage where recorded: **Source evidence → NLL record → Teacher selection → NLP inclusion**.',
  )
  if (report.nlp.status === 'unavailable') {
    lines.push('')
    lines.push(
      'NLP assembly is **unavailable** for this snapshot, so provenance terminates at teacher selection: `nlp=false` does not mean missing NLL knowledge, and no assembled-package inclusion step exists to continue the chain.',
    )
  }
  lines.push('')
  for (const row of report.teacherSelections) {
    lines.push(
      `- ${row.source} \`${row.activityId}\`: source_verification=${row.sourceVerificationStatus ?? 'unavailable'}; NLL=${row.availableInNll ? row.nllSummaryId ?? 'membership without preferred summary' : 'not in loaded NLL'}; review=${row.nllReviewState ?? 'n/a'}; evidence=${row.nllEvidenceStatus ?? 'n/a'}; staleness=${row.nllStaleness ?? 'n/a'}; selected=${row.selectedByTeacher}; nlp=${row.includedInNlp}.`,
    )
  }
  lines.push('')
  lines.push(
    `- Adapter/consumer inclusion stub: \`${report.adapterOrConsumerInclusion}\` (Inspector does not probe General Lesson Prompt or other adapters in this version).`,
  )
  lines.push('')

  lines.push('## G. Findings and limitations')
  lines.push('')
  if (report.issues.length === 0) {
    lines.push('- None classified for this snapshot.')
  } else {
    for (const issue of report.issues) {
      lines.push(`- **${ISSUE_KIND_LABEL[issue.kind]}:** ${issue.message}`)
    }
  }
  lines.push('')

  return lines.join('\n')
}

/**
 * Assemble a read-only inspection report from current Create-a-prompt state.
 * Does not mutate selections. Reuses buildNeutralSbWbLessonPackage when a
 * verified companion exists, or buildNeutralSbOnlyLessonPackage for genuine
 * SB-only lessons (no fake Workbook companion). Attaches NLL derivedKnowledge
 * via the same attachSelectedNllDerivedKnowledge helper used by Stage 4 / GLP.
 */
export async function buildNllNlpInspectionReport(
  input: BuildNllNlpInspectionReportInput,
): Promise<NllNlpInspectionReport> {
  const generatedAt = input.nowIso ?? new Date().toISOString()
  const companion: VerifiedSbWbCompanion | null =
    input.lesson.workbookCompanion ?? null

  // Exact full-set membership lookup against nll_components /
  // nll_component_activities (available lesson activity IDs, not selection).
  // Temporary BE3 U8 hard-coded fallback retained only when membership
  // resolve returns unavailable — Create-a-prompt modal still uses that table.
  const lessonActivityIds = collectAvailableLessonActivityIds({
    activityCards: input.activityCards,
    workbookActivityCards: input.workbookActivityCards,
  })

  let membershipResolve: ResolveNllComponentByExactMembershipResult = {
    kind: 'unavailable',
  }
  try {
    if (input.resolveNllComponentByExactMembership) {
      membershipResolve = await input.resolveNllComponentByExactMembership(
        lessonActivityIds,
      )
    } else if (input.client) {
      membershipResolve =
        await resolveNllComponentByExactActivityMembershipFromClient(
          input.client,
          lessonActivityIds,
        )
    }
  } catch {
    // Membership catalog query failed — try temporary BE3 U8 fallback below.
    membershipResolve = { kind: 'unavailable' }
  }

  let resolvedComponentKey: string | null = null
  let resolvedVia: 'exact_membership' | 'be3_u08_fallback' | null = null
  let nllStatus: NllNlpInspectionReport['nll']['status'] = 'not_applicable'
  let nllNote =
    'No NLL component mapping resolved for this lesson scope (exact membership lookup found no matching component).'

  if (membershipResolve.kind === 'ambiguous') {
    nllStatus = 'unavailable'
    const keys = membershipResolve.matches.map((match) => match.componentKey)
    nllNote = `Ambiguous NLL component membership: ${membershipResolve.matches.length} components share this exact activity set (${keys.join(', ')}). No component was loaded.`
  } else if (membershipResolve.kind === 'matched') {
    resolvedComponentKey = membershipResolve.componentKey
    resolvedVia = 'exact_membership'
  } else {
    const be3Spec = resolveBe3U08NllActivitySummarySpec({
      activityCards: input.activityCards,
      workbookActivityCards: input.workbookActivityCards,
      companion,
    })
    if (be3Spec) {
      resolvedComponentKey = be3Spec.componentKey
      resolvedVia = 'be3_u08_fallback'
    }
  }

  let resolvedNll: ResolvedNllComponent | null = null

  const experimentalSummaryPolicyNote =
    'Current Create-a-prompt / Stage 4 / GLP pilots load preferred summaries with includeHiddenExperimental: true. attachSelectedNllDerivedKnowledge attaches preferred summaries for selected NLP activities without filtering out review_state=experimental or display_status=hidden. Inspector reports that faithfully; it does not invent a new eligibility gate.'

  if (resolvedComponentKey) {
    const client = input.client ?? null
    const load =
      input.loadNll ??
      ((c: SupabaseClient, key: string, options: NllInspectorLoadOptions) =>
        loadNeutralLessonComponent(c, key, options))
    if (!client) {
      nllStatus = 'unavailable'
      nllNote = 'NLL component key resolved but no Supabase client was provided.'
    } else {
      try {
        // Authoritative current hashes come only from the caller-supplied map
        // (workspace canonical raw → fingerprint helper). Default remains
        // unverifiable when the map is omitted.
        resolvedNll = await load(client, resolvedComponentKey, {
          includeHiddenExperimental: true,
          currentActivitySha256ById: input.currentActivitySha256ById,
        })
        if (resolvedNll) {
          nllStatus = 'loaded'
          nllNote =
            resolvedVia === 'exact_membership'
              ? 'NLL component loaded via exact activity-membership match with preferred summaries (hidden experimental included for inspection, matching Stage 4 load posture).'
              : 'NLL component loaded via temporary BE3 Unit 8 resolver fallback with preferred summaries (hidden experimental included for inspection, matching Stage 4 load posture).'
        } else {
          nllStatus = 'unavailable'
          nllNote = `NLL component \`${resolvedComponentKey}\` was not found.`
        }
      } catch (error) {
        nllStatus = 'unavailable'
        nllNote =
          error instanceof Error
            ? `NLL load error: ${error.message}`
            : 'NLL load error.'
      }
    }
  }

  let nlp: NeutralLessonPackage | null = null
  let nlpStatus: NllNlpInspectionReport['nlp']['status'] = 'unavailable'
  let nlpNote =
    'NLP assembly requires either a verified SB→WB companion supported by buildNeutralSbWbLessonPackage, or enough Student Book lesson identity to build a genuine SB-only package. No fake Workbook companion is invented.'

  const priorSupport = mapTeacherInputsToOpenerPriorSupportForGeneralLessonPlan({
    selectedSuggestions: input.selectedSuggestions,
    teacherAdditions: input.teacherAdditions,
  })

  if (companion) {
    try {
      nlp = buildNeutralSbWbLessonPackage({
        companion,
        sbSelection: input.sbSelection,
        wbSelection: input.wbSelection,
        priorSupport,
      })
      if (resolvedNll) {
        nlp = attachSelectedNllDerivedKnowledge({ nlp, resolved: resolvedNll })
      }
      nlpStatus = 'assembled'
      nlpNote = resolvedNll
        ? 'NLP assembled via buildNeutralSbWbLessonPackage from verified companion + current in-memory selections; selected NLL derivedKnowledge attached via attachSelectedNllDerivedKnowledge when summaries exist.'
        : 'NLP assembled via buildNeutralSbWbLessonPackage from verified companion + current in-memory selections; NLL derivedKnowledge not attached (NLL unavailable).'
    } catch (error) {
      nlp = null
      nlpStatus = 'unavailable'
      nlpNote =
        error instanceof Error
          ? `NLP assembly error: ${error.message}`
          : 'NLP assembly error.'
    }
  } else {
    const catalogBookId = input.lesson.catalogBookId?.trim() ?? ''
    const unitNumber = input.lesson.unitNumber
    const packageReference =
      input.lesson.stableLessonReference?.trim() ||
      (catalogBookId && unitNumber != null
        ? `${catalogBookId}_unit_${String(unitNumber).padStart(2, '0')}_sb_only`
        : '')
    const componentTitle =
      input.lesson.singleLessonTitle?.trim() ||
      input.lesson.currentFocus?.trim() ||
      input.lesson.lessonTopic?.trim() ||
      ''

    if (catalogBookId && unitNumber != null && packageReference && componentTitle) {
      try {
        nlp = buildNeutralSbOnlyLessonPackage({
          studentBookCatalogId: catalogBookId,
          unitNumber,
          unitTitle: input.lesson.unitTitle?.trim() || `Unit ${unitNumber}`,
          componentTitle,
          packageReference,
          componentKey: resolvedNll?.component.component_key ?? null,
          sbSelection: input.sbSelection,
          priorSupport,
        })
        if (resolvedNll) {
          nlp = attachSelectedNllDerivedKnowledge({ nlp, resolved: resolvedNll })
        }
        nlpStatus = 'assembled'
        nlpNote = resolvedNll
          ? 'NLP assembled via buildNeutralSbOnlyLessonPackage from current Student Book selection only (no Workbook companion invented); selected NLL derivedKnowledge attached via attachSelectedNllDerivedKnowledge when summaries exist.'
          : 'NLP assembled via buildNeutralSbOnlyLessonPackage from current Student Book selection only (no Workbook companion invented); NLL derivedKnowledge not attached (NLL unavailable).'
      } catch (error) {
        nlp = null
        nlpStatus = 'unavailable'
        nlpNote =
          error instanceof Error
            ? `SB-only NLP assembly error: ${error.message}`
            : 'SB-only NLP assembly error.'
      }
    } else {
      nlpNote =
        'Genuine SB-only NLP could not be assembled because Student Book lesson identity (catalog book, unit, package reference, or title) is incomplete. No Workbook companion was invented.'
    }
  }

  const scopeUnit = input.scopeSequenceUnit ?? null
  const scopeSequence: NllNlpInspectionReport['scopeSequence'] = scopeUnit
    ? {
        status: 'unit_level',
        unitNumberRaw: scopeUnit.unitNumberRaw,
        unitTitleRaw: scopeUnit.unitTitleRaw,
        categories: scopeUnit.publisherCategories.map((category) => ({
          categoryNameRaw: category.categoryNameRaw,
          columnOrder: category.columnOrder,
          rawText: category.rawText,
        })),
        note: 'Publisher Scope & Sequence is unit-level evidence — not lesson-specific publisher assignment.',
      }
    : {
        status: 'unavailable',
        unitNumberRaw: null,
        unitTitleRaw: null,
        categories: [],
        note: 'No Scope & Sequence unit was supplied to the inspector.',
      }

  const teacherSelections = buildTeacherSelectionRows({
    activityCards: input.activityCards,
    workbookActivityCards: input.workbookActivityCards,
    sbSelection: input.sbSelection,
    wbSelection: input.wbSelection,
    nll: resolvedNll,
    nlp,
  })

  const issues = collectInspectionIssues({
    teacherSelections,
    nllStatus,
    nlpStatus,
    scopeSequenceStatus: scopeSequence.status,
    nll: resolvedNll,
  })

  const overview = buildInspectionOverview({
    teacherSelections,
    nllStatus,
    nllActivityCount: resolvedNll?.activities.length ?? 0,
    nlp,
    nlpStatus,
    issues,
  })

  const draft: Omit<NllNlpInspectionReport, 'markdown'> = {
    inspectorId: NLL_NLP_INSPECTOR_ID,
    generatedAt,
    overview,
    lessonIdentity: {
      seriesOrBookLabel: input.lesson.bookLabel,
      catalogBookId: input.lesson.catalogBookId,
      unitNumber: input.lesson.unitNumber,
      unitTitle: input.lesson.unitTitle,
      lessonTitle: input.lesson.singleLessonTitle,
      studentBookPages: [...input.lesson.visiblePrintedPages],
      workbookPages: companion ? [...companion.workbookPrintedPages] : [],
      twoLessonPackagingConfiguration: input.lesson.twoLessonPackagingMode,
      companionRelationshipId: companion?.relationshipId ?? null,
      companionRelationshipType: companion?.relationshipType ?? null,
      nlpAssemblyStatus: nlpStatus,
      assembledPackageType: nlp?.packaging.type ?? null,
    },
    scopeSequence,
    nll: {
      status: nllStatus,
      componentKey:
        resolvedNll?.component.component_key ?? resolvedComponentKey ?? null,
      componentId: resolvedNll?.component.id ?? null,
      componentTitle: resolvedNll?.component.title ?? null,
      activities: (resolvedNll?.activities ?? []).map((activity) => ({
        activityId: activity.activityId,
        position: activity.position,
        summaryId: activity.preferredSummary?.id ?? null,
        summaryText: activity.preferredSummary?.summary_text ?? null,
        evidenceStatus: activity.preferredSummary?.evidence_status ?? null,
        displayStatus: activity.preferredSummary?.display_status ?? null,
        reviewState: activity.preferredSummary?.review_state ?? null,
        staleness: activity.preferredSummary?.staleness ?? null,
        storedActivitySha256: activity.preferredSummary?.activity_sha256 ?? null,
        currentActivitySha256:
          activity.preferredSummary?.currentActivitySha256 ?? null,
        verificationNote: activity.preferredSummary
          ? `preferred summary present; source dimensions reported separately (review=${activity.preferredSummary.review_state}; evidence=${activity.preferredSummary.evidence_status}; staleness=${activity.preferredSummary.staleness})`
          : 'preferred summary unavailable',
      })),
      note: nllNote,
      experimentalSummaryPolicyNote,
    },
    teacherSelections,
    nlp: {
      status: nlpStatus,
      package: nlp,
      note: nlpNote,
    },
    // Reserved contract field; Stage 4 GLP / adapters are not probed here.
    adapterOrConsumerInclusion: 'not_in_scope',
    issues,
  }

  return {
    ...draft,
    markdown: renderNllNlpInspectionMarkdown(draft),
  }
}
