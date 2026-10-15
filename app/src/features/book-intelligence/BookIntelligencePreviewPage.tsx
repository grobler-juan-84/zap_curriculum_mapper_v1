import { BookIntelligenceUnitPreview } from './BookIntelligenceUnitPreview'
import { loadLocalBe3Unit1BookIntelligence } from './loadLocalBe3Unit1BookIntelligence'

/**
 * Read-only BE3 Unit 1 Book Intelligence preview.
 * Local Phase 2 JSON + validated TS loader only — no Supabase.
 */
export function BookIntelligencePreviewPage() {
  const result = loadLocalBe3Unit1BookIntelligence()

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
  const unit = data.units[0]

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
          BE3 Unit 1 nine-column A+B overview from local JSON via the draft-contract
          loader. Not Phase 1 evidence. No Supabase or Storage.
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-auto px-6 py-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {data.title ? (
            <p className="text-xs font-medium text-slate-600">{data.title}</p>
          ) : null}
          {unit ? (
            <BookIntelligenceUnitPreview document={data} unit={unit} />
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
