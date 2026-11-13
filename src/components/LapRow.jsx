import { Hourglass, Zap } from 'lucide-react'
import { formatTime, formatTimestamp, pad } from '../lib/time'

const BASE =
  'relative flex items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 transition-colors duration-200 sm:px-3.5'

export default function LapRow({ lap, isFastest, isSlowest, delay = 0 }) {
  const tone = isFastest
    ? 'border-emerald-500/25 bg-emerald-500/[0.06] dark:border-emerald-400/25 dark:bg-emerald-400/[0.05]'
    : isSlowest
      ? 'border-rose-500/20 bg-rose-500/[0.05] dark:border-rose-400/20 dark:bg-rose-400/[0.04]'
      : 'border-navy-900/[0.06] bg-white/60 dark:border-white/[0.05] dark:bg-white/[0.02]'

  return (
    <li
      className={`${BASE} ${tone} animate-lap-in`}
      style={{ animationDelay: `${Math.min(delay, 240)}ms` }}
    >
      {(isFastest || isSlowest) && (
        <span
          aria-hidden="true"
          className={`absolute inset-y-2 left-0 w-[2px] rounded-full ${
            isFastest ? 'bg-emerald-400' : 'bg-rose-400'
          }`}
        />
      )}

      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-navy-900/[0.07] bg-white/70 font-mono text-[11px] font-semibold text-slate-500 dark:border-white/[0.07] dark:bg-white/[0.04] dark:text-slate-400">
        {pad(lap.index)}
      </span>

      <div className="min-w-0 flex-1">
        <p className="digits font-mono text-[15px] font-medium leading-tight text-navy-900 dark:text-white">
          {formatTime(lap.split)}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-500">
          <span className="hidden sm:inline">Total </span>
          <span className="font-mono">{formatTime(lap.total)}</span>
          <span className="mx-1 hidden opacity-40 sm:inline">·</span>
          <span className="hidden sm:inline">{formatTimestamp(lap.at)}</span>
        </p>
      </div>

      {isFastest && (
        <span className="chip shrink-0 border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
          <Zap className="h-3 w-3" />
          <span className="hidden sm:inline">Fastest</span>
        </span>
      )}
      {isSlowest && (
        <span className="chip shrink-0 border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-300">
          <Hourglass className="h-3 w-3" />
          <span className="hidden sm:inline">Slowest</span>
        </span>
      )}
    </li>
  )
}
