import { useMemo } from 'react'
import { Download, Flag, Hourglass, ShieldCheck, Timer, Zap } from 'lucide-react'
import { computeLapStats } from '../lib/stats'
import { formatTime } from '../lib/time'
import LapRow from './LapRow'
import StatTile from './StatTile'

export default function LapPanel({ laps, onExport }) {
  const stats = useMemo(() => computeLapStats(laps), [laps])

  return (
    <section
      aria-label="Lap history"
      className="card card-sheen flex flex-col p-5 animate-rise [animation-delay:120ms] sm:p-6 lg:p-7"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold tracking-tight text-navy-900 dark:text-white">
              Lap history
            </h2>
            <span className="rounded-full border border-navy-900/[0.07] bg-white/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
              {stats.count}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Newest splits first, with live fastest and slowest detection.
          </p>
        </div>

        <button
          type="button"
          onClick={onExport}
          disabled={stats.count === 0}
          title="Export laps as CSV (E)"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-navy-900/10 bg-white/70 px-3 py-2 text-[11px] font-medium text-slate-600 transition-all duration-200 hover:-translate-y-px hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.09]"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">CSV</span>
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-2.5">
        <StatTile
          icon={Zap}
          label="Fastest"
          tone="fastest"
          value={stats.hasComparison ? formatTime(stats.fastest.split) : '—'}
          hint={stats.hasComparison ? `Lap ${stats.fastest.index}` : '2+ laps'}
        />
        <StatTile
          icon={Hourglass}
          label="Slowest"
          tone="slowest"
          value={stats.hasComparison ? formatTime(stats.slowest.split) : '—'}
          hint={stats.hasComparison ? `Lap ${stats.slowest.index}` : '2+ laps'}
        />
        <StatTile
          icon={Timer}
          label="Average"
          tone="average"
          value={stats.count > 0 ? formatTime(stats.average) : '—'}
          hint={stats.count > 0 ? `${stats.count} ${stats.count === 1 ? 'lap' : 'laps'}` : 'No laps'}
        />
      </div>

      <div className="mt-5 flex-1">
        {stats.count === 0 ? (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-navy-900/[0.12] bg-white/40 px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.015]">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-navy-900/[0.07] bg-white/80 text-sky-500 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-cyan-300">
              <Flag className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-medium text-navy-900 dark:text-slate-100">No laps yet</p>
            <p className="mt-1 max-w-[15rem] text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Start the timer and press{' '}
              <kbd className="mx-0.5">L</kbd> or tap Lap to lock in your first split.
            </p>
          </div>
        ) : (
          <ol className="scroll-slim max-h-[300px] space-y-2 overflow-y-auto pr-1 lg:max-h-[348px]">
            {laps.map((lap, index) => (
              <LapRow
                key={lap.id}
                lap={lap}
                delay={index * 25}
                isFastest={lap.id === stats.fastestId}
                isSlowest={lap.id === stats.slowestId}
              />
            ))}
          </ol>
        )}
      </div>

      <div className="mt-5 flex items-center gap-1.5 border-t border-navy-900/[0.06] pt-4 text-[10px] text-slate-400 dark:border-white/[0.06] dark:text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/80 dark:text-emerald-400/80" />
        Auto-saved to this browser — no account, no uploads.
      </div>
    </section>
  )
}
