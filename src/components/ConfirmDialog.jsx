import { useEffect } from 'react'
import { RotateCcw, TriangleAlert, X } from 'lucide-react'

export default function ConfirmDialog({ open, lapCount, onCancel, onConfirm }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      data-modal-open="true"
      role="presentation"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-navy-950/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        aria-describedby="reset-description"
        className="card relative w-full max-w-sm animate-rise p-6"
      >
        <div className="flex items-start justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500/10 text-rose-500 ring-1 ring-inset ring-rose-500/20">
            <TriangleAlert className="h-5 w-5" />
          </span>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel reset"
            className="icon-btn h-9 w-9"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 id="reset-title" className="mt-4 text-base font-semibold text-navy-900 dark:text-white">
          Reset this run?
        </h2>
        <p id="reset-description" className="mt-1.5 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
          The timer goes back to zero
          {lapCount > 0 ? ` and ${lapCount} recorded ${lapCount === 1 ? 'lap' : 'laps'} will be deleted` : ''}.
          This can’t be undone — export a CSV first if you need the data.
        </p>

        <div className="mt-6 flex gap-2.5">
          <button type="button" onClick={onCancel} className="btn-ghost flex-1 py-3 text-[13px]">
            Keep running
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 px-4 py-3 text-[13px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(244,63,94,0.9)] transition-transform duration-200 hover:-translate-y-px active:scale-[0.99]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
