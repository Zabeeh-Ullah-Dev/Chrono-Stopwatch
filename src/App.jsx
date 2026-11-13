import { useCallback, useEffect, useState } from 'react'
import { Keyboard } from 'lucide-react'
import Background from './components/Background'
import ConfirmDialog from './components/ConfirmDialog'
import Header from './components/Header'
import LapPanel from './components/LapPanel'
import ShortcutsDialog from './components/ShortcutsDialog'
import TimerCard from './components/TimerCard'
import Toast from './components/Toast'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useStopwatch } from './hooks/useStopwatch'
import { useTheme } from './hooks/useTheme'
import { buildCsvFilename, downloadCsv, lapsToCsv } from './lib/csv'
import { formatTime, pad } from './lib/time'

const STORAGE_KEY = 'chrono:session:v1'

const normaliseLap = (lap) => {
  if (!lap || typeof lap !== 'object') return null
  const split = Number(lap.split)
  const total = Number(lap.total)
  const index = Number(lap.index)
  if (!Number.isFinite(split) || split <= 0) return null
  if (!Number.isFinite(total) || total < split) return null
  if (!Number.isFinite(index) || index < 1) return null
  return {
    id: typeof lap.id === 'string' && lap.id ? lap.id : `lap-${index}-${Math.round(total)}`,
    index: Math.floor(index),
    split,
    total,
    at: Number.isFinite(lap.at) ? lap.at : Date.now(),
  }
}

function readSession() {
  if (typeof window === 'undefined') return { elapsed: 0, laps: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { elapsed: 0, laps: [] }
    const data = JSON.parse(raw)
    const laps = Array.isArray(data?.laps)
      ? data.laps.map(normaliseLap).filter(Boolean).sort((a, b) => b.index - a.index)
      : []
    const elapsed = Number(data?.elapsed)
    return {
      elapsed: Number.isFinite(elapsed) && elapsed > 0 ? elapsed : 0,
      laps,
    }
  } catch {
    return { elapsed: 0, laps: [] }
  }
}

// Read once at module scope so remounts never reload a stale snapshot.
const SESSION = readSession()

export default function App() {
  const sw = useStopwatch({ initialElapsed: SESSION.elapsed, initialLaps: SESSION.laps })
  const { isDark, toggleTheme } = useTheme()

  const [toast, setToast] = useState(null)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  const notify = useCallback((message, tone = 'info') => {
    setToast({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, message, tone })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  const writeSession = useCallback((elapsed, laps) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, elapsed, laps, updatedAt: Date.now() }),
      )
    } catch {
      /* storage full or blocked — the app still works in memory */
    }
  }, [])

  // Persist whenever the run state or lap list changes.
  useEffect(() => {
    writeSession(sw.getElapsed(), sw.laps)
  }, [sw.isRunning, sw.laps, sw.getElapsed, writeSession])

  // While running, checkpoint roughly once a second so a refresh is safe.
  useEffect(() => {
    if (!sw.isRunning) return undefined
    const id = window.setInterval(() => writeSession(sw.getElapsed(), sw.laps), 1000)
    return () => window.clearInterval(id)
  }, [sw.isRunning, sw.laps, sw.getElapsed, writeSession])

  // Flush on tab hide / page unload.
  useEffect(() => {
    const save = () => writeSession(sw.getElapsed(), sw.laps)
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') save()
    }
    window.addEventListener('pagehide', save)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pagehide', save)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [sw.getElapsed, sw.laps, writeSession])

  // Announce a restored snapshot once.
  useEffect(() => {
    if (SESSION.elapsed > 0 || SESSION.laps.length > 0) {
      const message =
        SESSION.laps.length > 0
          ? `Last session restored — ${SESSION.laps.length} ${SESSION.laps.length === 1 ? 'lap' : 'laps'} saved locally.`
          : 'Last session restored from this browser.'
      notify(message, 'success')
    }
  }, [notify])

  const { addLap, reset, hasStarted } = sw

  const handleLap = useCallback(() => {
    const lap = addLap()
    if (lap) {
      notify(`Lap ${pad(lap.index)} recorded · ${formatTime(lap.split)}`, 'lap')
    } else {
      notify('Start the timer first, then record a lap.', 'info')
    }
  }, [addLap, notify])

  const requestReset = useCallback(() => {
    if (hasStarted) setResetOpen(true)
  }, [hasStarted])

  const confirmReset = useCallback(() => {
    reset()
    setResetOpen(false)
    notify('Timer reset — clean slate.', 'reset')
  }, [reset, notify])

  const handleExport = useCallback(() => {
    if (sw.laps.length === 0) {
      notify('Record at least one lap before exporting.', 'info')
      return
    }
    downloadCsv(buildCsvFilename(), lapsToCsv(sw.laps))
    notify(`Exported ${sw.laps.length} ${sw.laps.length === 1 ? 'lap' : 'laps'} as CSV.`, 'download')
  }, [sw.laps, notify])

  useKeyboardShortcuts({
    ' ': sw.toggle,
    l: handleLap,
    r: requestReset,
    t: toggleTheme,
    e: handleExport,
    '?': () => setShortcutsOpen(true),
  })

  return (
    <div className="relative flex min-h-screen flex-col">
      <Background />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <Header
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onShowShortcuts={() => setShortcutsOpen(true)}
        />

        <main className="mt-5 grid flex-1 items-start gap-4 sm:mt-7 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:gap-5">
          <TimerCard
            elapsed={sw.elapsed}
            isRunning={sw.isRunning}
            hasStarted={sw.hasStarted}
            laps={sw.laps}
            onToggle={sw.toggle}
            onLap={handleLap}
            onReset={requestReset}
            onShowShortcuts={() => setShortcutsOpen(true)}
          />
          <LapPanel laps={sw.laps} onExport={handleExport} />
        </main>

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 text-[10px] text-slate-400 sm:flex-row dark:text-slate-500">
          <p>Chrono — precision stopwatch · React + Vite + Tailwind CSS</p>
          <p className="flex items-center gap-1.5">
            <Keyboard className="h-3.5 w-3.5" />
            Press <kbd>?</kbd> for shortcuts
          </p>
        </footer>
      </div>

      <ShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <ConfirmDialog
        open={resetOpen}
        lapCount={sw.laps.length}
        onCancel={() => setResetOpen(false)}
        onConfirm={confirmReset}
      />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  )
}
