import type {
  BookIntelligenceOverviewDocument,
  BookIntelligenceUnitOverview,
  LearningOutcomesProvenance,
} from '../../types/bookIntelligence'
import { hasPhase1EvidenceLink } from './phase1EvidenceLink'

type ContentField = {
  key: string
  label: string
  value: string
  badge?: string
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

function contentFields(unit: BookIntelligenceUnitOverview): ContentField[] {
  return [
    { key: 'vocabulary', label: 'Vocabulary', value: unit.vocabulary },
    {
      key: 'grammarStructures',
      label: 'Grammar / Structures',
      value: unit.grammarStructures,
    },
    {
      key: 'communicativeFunctions',
      label: 'Communicative Functions',
      value: unit.communicativeFunctions,
    },
    {
      key: 'learningOutcomes',
      label: 'Learning Outcomes',
      value: unit.learningOutcomes,
      badge: provenanceLabel(unit.learningOutcomesProvenance),
    },
    { key: 'clilCulture', label: 'CLIL / Culture', value: unit.clilCulture },
    { key: 'values', label: 'Values', value: unit.values },
    { key: 'phonics', label: 'Phonics', value: unit.phonics },
    { key: 'writing', label: 'Writing', value: unit.writing },
  ]
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
  const fields = contentFields(unit)
  const pages = pageRange(unit)
  const showEvidenceLink =
    Boolean(onViewSourceEvidence) && hasPhase1EvidenceLink(unit.unitNumber)

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
      <header className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
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
            className={`grid gap-2 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4 ${
              field.key === 'writing' ? 'bg-emerald-50/40' : ''
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
