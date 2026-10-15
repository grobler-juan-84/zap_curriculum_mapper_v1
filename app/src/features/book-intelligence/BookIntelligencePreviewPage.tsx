import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import type {
  BookIntelligenceOverviewDocument,
  BookIntelligenceUnitOverview,
} from '../../types/bookIntelligence'
import {
  DEFAULT_BOOK_INTELLIGENCE_CATALOG_BOOK_ID,
  getBookIntelligenceStorageArtifact,
} from './bookIntelligenceStorageRegistry'
import { BookIntelligenceUnitPreview } from './BookIntelligenceUnitPreview'
import { loadBookIntelligenceFromStorage } from './loadBookIntelligenceFromStorage'

const UNIT_QUERY_KEY = 'unit'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; errors: string[] }
  | { status: 'ready'; data: BookIntelligenceOverviewDocument }

function resolveUnit(
  units: BookIntelligenceUnitOverview[],
  unitParam: string | null,
): BookIntelligenceUnitOverview | null {
  if (units.length === 0) return null
  if (unitParam) {
    const match = units.find((unit) => unit.unitNumber === unitParam)
    if (match) return match
  }
  return units[0] ?? null
}

/**
 * Read-only Book Intelligence preview for a catalog book.
 * Loads verified Phase 2 JSON from Supabase Storage via the draft-contract loader.
 * Selected unit is URL-addressable via `?unit={unitNumber}` (e.g. `?unit=5`).
 */
export function BookIntelligencePreviewPage() {
  const { catalogBookId: routeCatalogBookId } = useParams<{
    catalogBookId?: string
  }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const catalogBookId =
    routeCatalogBookId?.trim() || DEFAULT_BOOK_INTELLIGENCE_CATALOG_BOOK_ID
  const artifact = getBookIntelligenceStorageArtifact(catalogBookId)
  const unitParam = searchParams.get(UNIT_QUERY_KEY)

  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    const registered = getBookIntelligenceStorageArtifact(catalogBookId)
    if (!registered) {
      setState({
        status: 'error',
        errors: [
          `No Book Intelligence overview is available yet for ${catalogBookId}.`,
        ],
      })
      return
    }

    void (async () => {
      const result = await loadBookIntelligenceFromStorage(catalogBookId)
      if (cancelled) return
      if (!result.ok) {
        setState({ status: 'error', errors: result.errors })
        return
      }
      setState({ status: 'ready', data: result.data })
    })()

    return () => {
      cancelled = true
    }
  }, [catalogBookId])

  const selectedUnit =
    state.status === 'ready'
      ? resolveUnit(state.data.units, unitParam)
      : null

  // Keep `?unit=` in sync so refresh/share always address a valid unit.
  useEffect(() => {
    if (state.status !== 'ready' || !selectedUnit) return
    if (unitParam === selectedUnit.unitNumber) return
    const next = new URLSearchParams(searchParams)
    next.set(UNIT_QUERY_KEY, selectedUnit.unitNumber)
    setSearchParams(next, { replace: true })
  }, [state, selectedUnit, unitParam, searchParams, setSearchParams])

  function selectUnit(unitNumber: string) {
    const next = new URLSearchParams(searchParams)
    next.set(UNIT_QUERY_KEY, unitNumber)
    setSearchParams(next, { replace: true })
  }

  if (state.status === 'loading') {
    return (
      <div className="flex h-full flex-col overflow-auto bg-slate-50">
        <PreviewChrome catalogBookId={catalogBookId} />
        <div className="mx-auto w-full max-w-3xl px-6 py-8">
          <p className="text-sm text-slate-600">
            Loading Book Intelligence from Supabase Storage…
          </p>
          {artifact ? (
            <p className="mt-2 font-mono text-[11px] text-slate-400">
              {artifact.bucket}/{artifact.storagePath}
            </p>
          ) : null}
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="flex h-full flex-col overflow-auto bg-slate-50">
        <PreviewChrome catalogBookId={catalogBookId} />
        <div className="mx-auto w-full max-w-3xl px-6 py-8">
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            <p className="font-semibold">Failed to load Book Intelligence JSON</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
              {state.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const { data } = state

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide text-indigo-600 uppercase">
              Phase 2 · Experimental
            </p>
            <h1 className="mt-0.5 text-base font-semibold tracking-tight text-slate-900">
              Book Intelligence Preview
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-slate-500">
              Nine-column A+B overview from Supabase Storage via the draft-contract
              loader. Selected unit is URL-addressable (`?unit=`). Not Phase 1
              evidence.
            </p>
          </div>
          <Link
            to="/app/series"
            className="shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Back to series library
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
            {data.columnSet}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            {data.catalogBookId}
            {data.registryId ? ` · ${data.registryId}` : ''}
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
            Storage · {data.units.length} units
          </span>
        </div>
        {data.units.length > 0 ? (
          <div className="mt-4">
            <label className="mb-1.5 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Unit
            </label>
            <div
              role="tablist"
              aria-label="Select unit"
              className="flex flex-wrap gap-1.5"
            >
              {data.units.map((unit) => {
                const isSelected = unit.unitId === selectedUnit?.unitId
                return (
                  <button
                    key={unit.unitId}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => selectUnit(unit.unitNumber)}
                    className={`rounded border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-800'
                    }`}
                    title={`Unit ${unit.unitNumber}: ${unit.title}`}
                  >
                    U{unit.unitNumber}
                    <span className="ml-1.5 hidden sm:inline font-normal opacity-90">
                      {unit.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 overflow-auto px-6 py-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {data.title ? (
            <p className="text-xs font-medium text-slate-600">{data.title}</p>
          ) : null}
          {selectedUnit ? (
            <BookIntelligenceUnitPreview document={data} unit={selectedUnit} />
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

function PreviewChrome({ catalogBookId }: { catalogBookId: string }) {
  return (
    <div className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-sm font-semibold text-slate-900">
          Book Intelligence Preview
        </h1>
        <Link
          to="/app/series"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Back to series library
        </Link>
      </div>
      <p className="mt-1 font-mono text-[11px] text-slate-400">{catalogBookId}</p>
    </div>
  )
}
