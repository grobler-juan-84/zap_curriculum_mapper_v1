import React from 'react'
import { FileText } from 'lucide-react'

interface ValidationPdfPaneProps {
  pdfUrl: string | null
  loading: boolean
  bookTitle: string
}

export const ValidationPdfPane: React.FC<ValidationPdfPaneProps> = ({
  pdfUrl,
  loading,
  bookTitle,
}) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-xs">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <FileText className="h-3.5 w-3.5 text-slate-500" />
          Source PDF
        </div>
        <span className="truncate font-mono text-[10px] text-slate-500">{bookTitle}</span>
      </div>

      <div className="relative min-h-0 flex-1 bg-slate-100">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Checking for source PDF…
          </div>
        ) : pdfUrl ? (
          <iframe title={`${bookTitle} source PDF`} src={pdfUrl} className="h-full w-full border-0" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="rounded-full border border-dashed border-slate-300 bg-white p-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-800">PDF not uploaded yet</p>
            <p className="max-w-sm text-xs leading-relaxed text-slate-500">
              Upload the student-book PDF to the private <code className="text-[11px]">book-sources</code>{' '}
              bucket and register a <code className="text-[11px]">source_pdf</code> row on{' '}
              <code className="text-[11px]">book_files</code>. It will embed here for side-by-side
              verification against the unit JSON.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
