import { BookIntelligenceUnitPreview } from './BookIntelligenceUnitPreview'
import { loadLocalBe3BookIntelligence } from './loadLocalBe3BookIntelligence'

/**
 * Read-only BE3 Units 1–9 Book Intelligence preview.
 * Local Phase 2 JSON + validated TS loader only — no Supabase.
 */
export function BookIntelligencePreviewPage() {
  const result = loadLocalBe3BookIntelligence()

  if (!result.ok) {
    return (
      <div className="flex h-full flex-col overflow-auto bg-slate-50">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="text-sm font-semibold text-slate-900">
            Book Intelligence Preview
          </h1>
        </div>
        <div className="mx-auto w-full max-w-3xl px-6 py-8">
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            <p className="font-semibold">Failed to load local BI JSON</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
              {result.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const { data } = result

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <p className="text-[11px] font-semibold tracking-wide text-indigo-600 uppercase">
          Phase 2 · Experimental
        </p>
        <h1 className="mt-0.5 text-base font-semibold tracking-tight text-slate-900">
          Book Intelligence Preview
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-slate-500">
          BE3 Units 1–9 nine-column A+B overview from local JSON via the
          draft-contract loader. Not Phase 1 evidence. No Supabase or Storage.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
            {data.columnSet}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            {data.catalogBookId}
            {data.registryId ? ` · ${data.registryId}` : ''}
          </span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
            Read-only · {data.units.length} units
          </span>
        </div>
        {data.units.length > 1 ? (
          <nav
            aria-label="Jump to unit"
            className="mt-3 flex flex-wrap gap-1.5"
          >
            {data.units.map((unit) => (
              <a
                key={unit.unitId}
                href={`#${unit.unitId}`}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-800"
              >
                U{unit.unitNumber}
              </a>
            ))}
          </nav>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 overflow-auto px-6 py-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {data.title ? (
            <p className="text-xs font-medium text-slate-600">{data.title}</p>
          ) : null}
          {data.units.length > 0 ? (
            data.units.map((unit) => (
              <div key={unit.unitId} id={unit.unitId} className="scroll-mt-4">
                <BookIntelligenceUnitPreview document={data} unit={unit} />
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No units in document.</p>
          )}
          {data.notes ? (
            <p className="rounded-md border border-slate-200 bg-white px-4 py-3 text-[11px] leading-relaxed text-slate-500">
              {data.notes}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
