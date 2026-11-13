import { Flag, Keyboard, Pause, Play, RotateCcw } from 'lucide-react'
import SplitChart from './SplitChart'
import TimeDisplay from './TimeDisplay'

function StatusPill({ isRunning, hasStarted }) {
  const state = isRunning
    ? {
        label: 'Running',
        dot: 'bg-emerald-400',
        className:
          'border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
      }
    : hasStarted
      ? {
          label: 'Paused',
          dot: 'bg-amber-400',
          className: 'border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300',
        }
      : {
          label: 'Ready',
          dot: 'bg-slate-400',
          className: 'border-navy-900/10 bg-white/60 text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400',
        }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${state.className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {isRunning && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${state.dot}`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${state.dot}`} />
      </span>
      {state.label}
    </span>
  )
}

export default function TimerCard({
  elapsed,
  isRunning,
  hasStarted,
  laps,
  onToggle,
  onLap,
  onReset,
  onShowShortcuts,
}) {
  const canLap = elapsed > 0
  const lapCount = laps.length

  return (
    <section
      aria-label="Stopwatch"
      className="card card-sheen flex flex-col p-5 animate-rise sm:p-7 lg:p-9"
    >
      <div className="flex items-center justify-between gap-3">
        <StatusPill isRunning={isRunning} hasStarted={hasStarted} />
        <button
          type="button"
          onClick={onShowShortcuts}
          className="group inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          <Keyboard className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Shortcuts</span>
          <kbd className="hidden sm:inline-flex">?</kbd>
        </button>
      </div>

      <div className="mt-8 sm:mt-10">
        <TimeDisplay elapsed={elapsed} isRunning={isRunning} />
      </div>

      <div className="mt-7 h-px w-full overflow-hidden rounded-full bg-navy-900/[0.06] dark:bg-white/[0.06]">
        <div
          className={`h-full w-full bg-gradient-to-r from-transparent via-sky-400/80 to-transparent transition-opacity duration-500 dark:via-cyan-300/70 ${
            isRunning ? 'animate-shimmer opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onToggle}
          className="btn-primary w-full py-4 sm:w-auto sm:min-w-[188px]"
        >
          {isRunning ? (
            <Pause className="h-5 w-5" fill="currentColor" strokeWidth={1.5} />
          ) : (
            <Play className="h-5 w-5" fill="currentColor" strokeWidth={1.5} />
          )}
          <span>{isRunning ? 'Pause' : hasStarted ? 'Resume' : 'Start'}</span>
          <span className="ml-1 hidden font-mono text-[10px] font-normal text-white/60 sm:inline">
            space
          </span>
        </button>

        <div className="grid grid-cols-2 gap-3 sm:ml-auto sm:flex">
          <button
            type="button"
            onClick={onLap}
            disabled={!canLap}
            title="Record a lap (L)"
            className="btn-ghost py-4"
          >
            <Flag className="h-4 w-4" />
            <span>Lap</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={!hasStarted}
            title="Reset the stopwatch (R)"
            className="btn-ghost py-4"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <SplitChart laps={laps} />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-navy-900/[0.06] pt-4 dark:border-white/[0.06]">
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {lapCount > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5 text-sky-500 dark:text-cyan-300" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">{lapCount}</span>
              {lapCount === 1 ? 'lap' : 'laps'} recorded
            </span>
          ) : (
            'Press L any time to capture a split.'
          )}
        </p>
        <p className="hidden items-center gap-1.5 text-[11px] text-slate-400 sm:flex dark:text-slate-500">
          <span>Drift-free timing</span>
          <span className="h-1 w-1 rounded-full bg-emerald-400" />
          <span>saved locally</span>
        </p>
      </div>
    </section>
  )
}
