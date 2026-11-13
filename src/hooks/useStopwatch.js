import { useCallback, useEffect, useRef, useState } from 'react'
import { safeMs } from '../lib/time'

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/**
 * Drift-free stopwatch engine.
 *
 * The displayed value is always derived from `performance.now()` timestamps
 * rather than accumulated intervals, so background tabs, slow frames and
 * throttled timers never make the clock lose time. React state is only used
 * to paint; the authoritative values live in refs.
 */
export function useStopwatch({ initialElapsed = 0, initialLaps = [] } = {}) {
  const [elapsed, setElapsed] = useState(() => safeMs(initialElapsed))
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState(() => (Array.isArray(initialLaps) ? initialLaps : []))

  const baseRef = useRef(safeMs(initialElapsed)) // elapsed at the last start
  const startedAtRef = useRef(0) // performance.now() at the last start
  const elapsedRef = useRef(safeMs(initialElapsed))
  const runningRef = useRef(false)
  const rafRef = useRef(0)
  const lastPaintRef = useRef(0)
  const lapsRef = useRef(laps)

  const paint = useCallback((value) => {
    elapsedRef.current = value
    setElapsed(value)
  }, [])

  const readClock = useCallback(() => {
    if (!runningRef.current) return elapsedRef.current
    return baseRef.current + (performance.now() - startedAtRef.current)
  }, [])

  const tick = useCallback(() => {
    if (!runningRef.current) return
    const value = readClock()
    // Repaint at ~60fps; keep the underlying value exact regardless.
    if (value - lastPaintRef.current >= 16) {
      lastPaintRef.current = value
      paint(value)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [paint, readClock])

  const start = useCallback(() => {
    if (runningRef.current) return
    baseRef.current = elapsedRef.current
    startedAtRef.current = performance.now()
    runningRef.current = true
    lastPaintRef.current = elapsedRef.current
    setIsRunning(true)
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  const pause = useCallback(() => {
    if (!runningRef.current) return
    const value = readClock()
    cancelAnimationFrame(rafRef.current)
    runningRef.current = false
    setIsRunning(false)
    paint(value)
  }, [paint, readClock])

  const toggle = useCallback(() => {
    if (runningRef.current) pause()
    else start()
  }, [pause, start])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    runningRef.current = false
    setIsRunning(false)
    baseRef.current = 0
    startedAtRef.current = 0
    elapsedRef.current = 0
    lapsRef.current = []
    lastPaintRef.current = 0
    setElapsed(0)
    setLaps([])
  }, [])

  /** Record the current split. Returns the new lap, or null if not started. */
  const addLap = useCallback(() => {
    const total = readClock()
    if (total <= 0) return null

    const previousTotal = lapsRef.current[0]?.total ?? 0
    const split = total - previousTotal
    if (split <= 0) return null

    const lap = {
      id: createId(),
      index: lapsRef.current.length + 1,
      split,
      total,
      at: Date.now(),
    }
    const next = [lap, ...lapsRef.current]
    lapsRef.current = next
    setLaps(next)
    // The lap action pins the clock to the exact moment it was recorded.
    paint(total)
    return lap
  }, [paint, readClock])

  const getElapsed = useCallback(() => readClock(), [readClock])

  // Repaint immediately when a throttled tab becomes visible again.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && runningRef.current) {
        const value = readClock()
        lastPaintRef.current = value
        paint(value)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [paint, readClock])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return {
    elapsed,
    isRunning,
    laps,
    hasStarted: elapsed > 0 || laps.length > 0,
    start,
    pause,
    toggle,
    reset,
    addLap,
    getElapsed,
  }
}
