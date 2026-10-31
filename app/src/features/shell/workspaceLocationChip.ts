/**
 * Shared formatter for sidebar / shell location chips from workspace page scope.
 * Single page → `p.N`; multi-page → `pp.A–B` (first–last after normalize).
 */

export function formatPrintedPageScopeLabel(
  printedPages: readonly number[] | null | undefined,
): string | null {
  const normalized = [
    ...new Set(
      (printedPages ?? [])
        .filter((page) => Number.isFinite(page))
        .map((page) => Math.floor(page)),
    ),
  ].sort((a, b) => a - b)
  if (normalized.length === 0) return null
  if (normalized.length === 1) return `p.${normalized[0]}`
  return `pp.${normalized[0]}–${normalized[normalized.length - 1]}`
}

export function formatWorkspaceLocationChip(input: {
  bookTitle: string | null | undefined
  printedPages?: readonly number[] | null
}): string {
  const title = input.bookTitle?.trim() || null
  const pages = formatPrintedPageScopeLabel(input.printedPages)
  if (title && pages) return `${title} · ${pages}`
  if (title) return title
  if (pages) return pages
  return 'No book selected'
}
