import { formatTime } from './time'

const escapeCell = (value) => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

/**
 * Build a CSV document from laps. Laps are stored newest-first in state,
 * but exported oldest-first so the file reads like a race log.
 */
export function lapsToCsv(laps) {
  const header = [
    'Lap',
    'Lap Time',
    'Lap Time (ms)',
    'Total Time',
    'Total Time (ms)',
    'Recorded At (ISO)',
  ]
  const rows = [...laps]
    .sort((a, b) => a.index - b.index)
    .map((lap) => [
      lap.index,
      formatTime(lap.split),
      Math.round(lap.split),
      formatTime(lap.total),
      Math.round(lap.total),
      new Date(lap.at).toISOString(),
    ])

  return [header, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n')
}

/** Trigger a client-side download — no server, no dependencies. */
export function downloadCsv(filename, csv) {
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function buildCsvFilename(now = new Date()) {
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
  const clock = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
  ].join('')
  return `chrono-laps-${stamp}-${clock}.csv`
}
