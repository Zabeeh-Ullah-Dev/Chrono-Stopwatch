import { useMemo } from 'react'
import { computeLapStats } from '../lib/stats'
import { formatTime } from '../lib/time'

const MAX_BARS = 16

export default function SplitChart({ laps }) {
  const stats = useMemo(() => computeLapStats(laps), [laps])
  const bars = useMemo(() => [...laps].reverse().slice(-MAX_BARS), [laps])
  const maxSplit = useMemo(
    () => bars.reduce((max, lap) => Math.max(max, lap.split), 0),
    [bars],
  )

  return (
    <div className="mt-6 hidden border-t border-navy-900/[0.06] pt-5 sm:block dark:border-white/[0.06]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
          Split rhythm
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          {stats.count > 0 ? `Last ${bars.length} of ${stats.count}` : 'Waiting for laps'}
        </span>
      </div>

      {bars.length === 0 ? (
        <div className="mt-3 flex h-[86px] items-center justify-center rounded-xl border border-dashed border-navy-900/[0.08] dark:border-white/[0.07]">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Your lap bars appear here as you record splits.
          </p>
        </div>
      ) : (
        <div
          className="mt-3 flex h-[86px] items-end gap-1"
          role="img"
          aria-label={`Split chart with ${bars.length} laps, fastest ${formatTime(stats.fastest.split)} and slowest ${formatTime(stats.slowest.split)}`}
        >
          {bars.map((lap, index) => {
            const ratio = maxSplit > 0 ? lap.split / maxSplit : 1
            const height = Math.max(18, Math.round(ratio * 100))
            const isFastest = lap.id === stats.fastestId
            const isSlowest = lap.id === stats.slowestId
            return (
              <div
                key={lap.id}
                title={`Lap ${lap.index} — ${formatTime(lap.split)}`}
                className={`min-w-[5px] flex-1 rounded-t-[4px] transition-[height] duration-500 ease-out ${
                  isFastest
                    ? 'bg-gradient-to-t from-emerald-600/60 to-emerald-300'
                    : isSlowest
                      ? 'bg-gradient-to-t from-rose-600/60 to-rose-300'
                      : 'bg-gradient-to-t from-blue-700/50 to-sky-400/90'
                }`}
                style={{
                  height: `${height}%`,
                  animationDelay: `${index * 20}ms`,
                }}
              />
            )
          })}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-t from-blue-600 to-sky-400" />
          lap split
        </span>
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> fastest
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> slowest
          </span>
        </span>
      </div>
    </div>
  )
}
