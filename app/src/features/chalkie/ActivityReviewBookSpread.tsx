/**
 * Equal-height open-book page panels for Create-a-prompt activity review.
 * Page lists scroll independently; activity cards expand to their content.
 */
import type { ReactNode } from 'react'

export function ActivityReviewBookSpread(props: {
  /** Outer data attribute for SB vs WB spreads. */
  spreadAttr: 'data-sb-activity-spread' | 'data-wb-activity-spread'
  pageCount: number
  title: string
  /** Optional id for dialog aria-labelledby when no separate page heading is shown. */
  titleId?: string
  countLabel: string
  /** Show the centre gutter when two facing pages are present. */
  showGutter: boolean
  /** Two-column grid from md up when facing pages apply. */
  twoColumn: boolean
  children: ReactNode
}) {
  const {
    spreadAttr,
    pageCount,
    title,
    titleId,
    countLabel,
    showGutter,
    twoColumn,
    children,
  } = props
  const spreadProps =
    spreadAttr === 'data-sb-activity-spread'
      ? { 'data-sb-activity-spread': true as const }
      : { 'data-wb-activity-spread': true as const }

  return (
    <div
      {...spreadProps}
      data-page-count={pageCount}
      data-activity-book-spread="true"
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-300/80 bg-slate-200/55 p-2 shadow-sm sm:p-3"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 px-2 pb-2 pt-0.5 sm:px-3">
        <h2 id={titleId} className="text-sm font-semibold text-slate-800">
          {title}
        </h2>
        <p className="text-sm font-medium text-slate-600" aria-live="polite">
          {countLabel}
        </p>
      </div>

      <div className="relative min-h-0 flex-1">
        {showGutter ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-6 -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-400/25 to-transparent md:block"
          />
        ) : null}
        <div
          className={`grid h-full min-h-0 grid-cols-1 gap-3 ${
            twoColumn ? 'md:grid-cols-2 md:gap-5' : ''
          }`}
          data-activity-book-grid="true"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function ActivityReviewBookPage(props: {
  heading: string | null
  placeholderText: string | null
  pageAttrName: 'data-sb-activity-page' | 'data-wb-activity-page'
  pageAttrValue?: number
  facingPlaceholderAttr:
    | 'data-sb-facing-placeholder'
    | 'data-wb-facing-placeholder'
  facingPosition?: 'left' | 'right'
  includedInLessonScope: boolean
  children?: ReactNode
}) {
  const {
    heading,
    placeholderText,
    pageAttrName,
    pageAttrValue,
    facingPlaceholderAttr,
    facingPosition,
    includedInLessonScope,
    children,
  } = props

  const pageProps =
    includedInLessonScope && pageAttrValue != null
      ? { [pageAttrName]: pageAttrValue }
      : {}
  const facingProps =
    !includedInLessonScope && facingPosition
      ? { [facingPlaceholderAttr]: facingPosition }
      : {}

  return (
    <div
      {...pageProps}
      {...facingProps}
      data-activity-book-page="true"
      className={`flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border p-3 sm:p-4 ${
        includedInLessonScope
          ? 'border-slate-200 bg-[#fffefb] shadow-sm'
          : 'border-slate-200/70 bg-slate-100/55'
      }`}
    >
      {includedInLessonScope && heading ? (
        <h4 className="mb-3 shrink-0 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-700">
          {heading}
        </h4>
      ) : null}

      {!includedInLessonScope && placeholderText ? (
        <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-8 text-center">
          <p className="max-w-xs text-xs leading-relaxed text-slate-400">
            {placeholderText}
          </p>
        </div>
      ) : null}

      {includedInLessonScope ? (
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgb(148_163_184)_transparent]"
          data-activity-book-page-scroll="true"
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
