import { Github, Keyboard, Timer } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header({ isDark, onToggleTheme, onShowShortcuts }) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 text-white shadow-[0_14px_30px_-14px_rgba(37,99,235,0.9)]">
          <Timer className="h-5 w-5" strokeWidth={2.4} />
          <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
        </div>
        <div>
          <h1 className="text-[17px] font-semibold leading-tight tracking-tight">Chrono</h1>
          <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
            Precision stopwatch
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://github.com/Zabeeh-Ullah-Dev/Chrono-Stopwatch"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-xl border border-navy-900/10 bg-white/70 px-3 py-2 text-xs font-medium text-slate-600 transition-all duration-200 hover:-translate-y-px hover:text-navy-900 hover:shadow-sm sm:inline-flex dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.09] dark:hover:text-white"
        >
          <Github className="h-4 w-4" />
          <span>Star on GitHub</span>
        </a>
        <button
          type="button"
          onClick={onShowShortcuts}
          aria-label="Show keyboard shortcuts"
          title="Keyboard shortcuts (?)"
          className="icon-btn"
        >
          <Keyboard className="h-[18px] w-[18px]" />
        </button>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}
