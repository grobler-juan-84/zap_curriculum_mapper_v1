import type {
  BookIntelligenceOverviewDocument,
  BookIntelligenceUnitOverview,
  LearningOutcomesProvenance,
} from '../../types/bookIntelligence'

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
}: {
  document: BookIntelligenceOverviewDocument
  unit: BookIntelligenceUnitOverview
}) {
  const fields = contentFields(unit)
  const pages = pageRange(unit)

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
      <header className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              {document.catalogBookId}
              {document.registryId ? ` · ${document.registryId}` : ''}
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
              Unit {unit.unitNumber}: {unit.title}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {pages ?? 'Pages not specified'}
              {' · '}
              <span className="font-mono text-slate-600">{unit.unitId}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
              {document.columnSet}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {document.layer}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              Read-only preview
            </span>
          </div>
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
