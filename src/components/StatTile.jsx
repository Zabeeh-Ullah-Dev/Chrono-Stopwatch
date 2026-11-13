const TONES = {
  fastest: {
    icon: 'text-emerald-500 dark:text-emerald-400',
    ring: 'ring-emerald-500/15',
    glow: 'from-emerald-400/15',
    label: 'text-emerald-600 dark:text-emerald-300',
  },
  slowest: {
    icon: 'text-rose-500 dark:text-rose-400',
    ring: 'ring-rose-500/15',
    glow: 'from-rose-400/15',
    label: 'text-rose-600 dark:text-rose-300',
  },
  average: {
    icon: 'text-sky-500 dark:text-cyan-300',
    ring: 'ring-sky-500/15',
    glow: 'from-sky-400/15',
    label: 'text-sky-600 dark:text-cyan-300',
  },
}

export default function StatTile({ icon: Icon, label, value, tone = 'average', hint }) {
  const styles = TONES[tone] ?? TONES.average

  return (
    <div className="relative overflow-hidden rounded-2xl border border-navy-900/[0.06] bg-white/60 p-2.5 sm:p-3 dark:border-white/[0.06] dark:bg-white/[0.025]">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.glow} to-transparent opacity-70`}
      />
      <div className="relative flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${styles.icon}`} />
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>
      <p className="relative mt-2 truncate font-mono text-[10px] font-medium tracking-[-0.03em] tabular-nums text-navy-900 sm:text-[13px] dark:text-white">
        {value}
      </p>
      {hint && (
        <p className="relative mt-0.5 truncate text-[9px] text-slate-400 dark:text-slate-500">{hint}</p>
      )}
    </div>
  )
}
