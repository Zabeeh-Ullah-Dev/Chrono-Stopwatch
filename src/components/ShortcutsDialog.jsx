import { useEffect } from 'react'
import { Command, X } from 'lucide-react'

const SHORTCUTS = [
  { keys: ['Space'], label: 'Start, pause or resume' },
  { keys: ['L'], label: 'Record a lap' },
  { keys: ['R'], label: 'Reset timer (asks first)' },
  { keys: ['T'], label: 'Toggle dark / light mode' },
  { keys: ['E'], label: 'Export laps as CSV' },
  { keys: ['?'], label: 'Open this panel' },
]

export default function ShortcutsDialog({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      data-modal-open="true"
      role="presentation"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-navy-950/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        className="card card-sheen relative w-full max-w-md animate-rise p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-400/20 to-indigo-500/20 text-sky-600 ring-1 ring-inset ring-sky-500/20 dark:text-cyan-300">
              <Command className="h-5 w-5" />
            </span>
            <div>
              <h2 id="shortcuts-title" className="text-base font-semibold text-navy-900 dark:text-white">
                Keyboard shortcuts
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Works anywhere on the page
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close shortcuts" className="icon-btn h-9 w-9">
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="mt-5 divide-y divide-navy-900/[0.06] dark:divide-white/[0.06]">
          {SHORTCUTS.map((item) => (
            <li key={item.label} className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-[13px] text-slate-600 dark:text-slate-300">{item.label}</span>
              <span className="flex shrink-0 gap-1">
                {item.keys.map((key) => (
                  <kbd key={key}>{key}</kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-5 rounded-xl bg-sky-500/[0.07] px-3 py-2.5 text-[11px] leading-relaxed text-slate-600 ring-1 ring-inset ring-sky-500/10 dark:text-slate-300">
          Shortcuts stay disabled while the reset confirmation is open, so you can never lose a run by
          accident.
        </p>
      </div>
    </div>
  )
}
