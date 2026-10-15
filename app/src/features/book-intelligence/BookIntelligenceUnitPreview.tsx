import type {
  BookIntelligenceOverviewDocument,
  BookIntelligenceUnitOverview,
  LearningOutcomesProvenance,
} from '../../types/bookIntelligence'
import {
  uiFieldsForColumnSet,
  type BookIntelligenceUiFieldKey,
} from '../../lib/bookIntelligence/fieldMap'
import { hasPhase1EvidenceLink } from './phase1EvidenceLink'

type ContentField = {
  key: string
  label: string
  value: string
  badge?: string
  emphasize?: boolean
}

function provenanceLabel(
  provenance: LearningOutcomesProvenance | undefined,
): string {
  switch (provenance) {
    case 'evidence_quoted':
      return 'Evidence quoted'
    case 'mixed':
      return 'Mixed'
    case 'ai_inferred':
    default:
      return 'AI-inferred'
  }
}

function unitFieldValue(
  unit: BookIntelligenceUnitOverview,
  key: BookIntelligenceUiFieldKey,
): string {
  switch (key) {
    case 'vocabulary':
      return unit.vocabulary
    case 'grammarStructures':
      return unit.grammarStructures
    case 'communicativeFunctions':
      return unit.communicativeFunctions
    case 'learningOutcomes':
      return unit.learningOutcomes
    case 'clilCulture':
      return unit.clilCulture
    case 'values':
      return unit.values
    case 'phonics':
      return unit.phonics
    case 'writing':
      return unit.writing ?? ''
  }
}

function contentFields(
  document: BookIntelligenceOverviewDocument,
  unit: BookIntelligenceUnitOverview,
): ContentField[] {
  return uiFieldsForColumnSet(document.columnSet).map((descriptor) => {
    const field: ContentField = {
      key: descriptor.key,
      label: descriptor.label,
      value: unitFieldValue(unit, descriptor.key),
      emphasize: descriptor.emphasize,
    }
    if (descriptor.showProvenanceBadge) {
      field.badge = provenanceLabel(unit.learningOutcomesProvenance)
    }
    return field
  })
}

function pageRange(unit: BookIntelligenceUnitOverview): string | null {
  if (
    typeof unit.printedPageStart === 'number' &&
    typeof unit.printedPageEnd === 'number'
  ) {
    return `pp. ${unit.printedPageStart}–${unit.printedPageEnd}`
  }
  return null
}

export function BookIntelligenceUnitPreview({
  document,
  unit,
  onViewSourceEvidence,
}: {
  document: BookIntelligenceOverviewDocument
  unit: BookIntelligenceUnitOverview
  /** Read-only jump to Phase 1 Validation for this unit. */
  onViewSourceEvidence?: (unitNumber: string) => void
}) {
  const fields = contentFields(document, unit)
  const pages = pageRange(unit)
  const showEvidenceLink =
    Boolean(onViewSourceEvidence) && hasPhase1EvidenceLink(unit.unitNumber)

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
      <header className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              Unit {unit.unitNumber}: {unit.title}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {pages ?? 'Pages not specified'}
              {' · '}
              <span className="font-mono text-slate-600">{unit.unitId}</span>
              {document.layer ? (
                <>
                  {' · '}
                  <span className="text-slate-500">{document.layer}</span>
                </>
              ) : null}
            </p>
          </div>
          {showEvidenceLink ? (
            <button
              type="button"
              onClick={() => onViewSourceEvidence?.(unit.unitNumber)}
              className="shrink-0 rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-xs hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-800"
              title="Open Phase 1 Validation for this unit (read-only evidence view)"
            >
              View Source Evidence
            </button>
          ) : null}
        </div>
      </header>

      <dl className="divide-y divide-slate-100">
        {fields.map((field) => (
          <div
            key={field.key}
            className={`grid gap-1.5 px-4 py-3 sm:grid-cols-[9.5rem_1fr] sm:gap-3 ${
              field.emphasize ? 'bg-emerald-50/40' : ''
            }`}
          >
            <dt className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
              <span>{field.label}</span>
              {field.badge ? (
                <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-800">
                  {field.badge}
                </span>
              ) : null}
            </dt>
            <dd className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
