import React from 'react'

interface ChalkieOutputPanelProps {
  onPreparePrompt: () => void
}

export const ChalkieOutputPanel: React.FC<ChalkieOutputPanelProps> = ({ onPreparePrompt }) => {
  return (
    <div className="flex shrink-0 flex-col border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <button
          type="button"
          onClick={onPreparePrompt}
          className="inline-flex w-fit items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-indigo-500"
        >
          Create a prompt
        </button>
        <p className="max-w-xl text-sm leading-relaxed text-slate-500">
          Review the current lesson and any useful prior learning, then choose the output you need.
        </p>
      </div>
    </div>
  )
}
