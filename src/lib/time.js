/** Clamp and normalise any incoming duration to a safe, non-negative number. */
export function safeMs(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return n
}

export function pad(value, length = 2) {
  return String(Math.max(0, Math.floor(value))).padStart(length, '0')
}

/** Break a duration in milliseconds into its clock parts. */
export function splitTime(value) {
  const ms = safeMs(value)
  return {
    hours: Math.floor(ms / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
    millis: Math.floor(ms % 1000),
  }
}

/** HH:MM:SS:MS — the format used across the app and in exports. */
export function formatTime(value) {
  const { hours, minutes, seconds, millis } = splitTime(value)
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(millis, 3)}`
}

/** HH:MM:SS without the millisecond segment. */
export function formatClock(value) {
  const { hours, minutes, seconds } = splitTime(value)
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

/** Read a duration aloud-ish, e.g. "1h 04m 09s" — used for summaries. */
export function formatSummary(value) {
  const { hours, minutes, seconds } = splitTime(value)
  if (hours > 0) return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`
  if (minutes > 0) return `${minutes}m ${pad(seconds)}s`
  return `${seconds}s`
}

/** Difference between two laps, signed, for the "vs fastest" hint. */
export function formatDelta(value) {
  const ms = Math.round(Math.abs(value))
  if (ms === 0) return '±0.000'
  return `${value > 0 ? '+' : '−'}${(ms / 1000).toFixed(3)}`
}

export function formatTimestamp(timestamp) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(timestamp))
  } catch {
    return ''
  }
}
