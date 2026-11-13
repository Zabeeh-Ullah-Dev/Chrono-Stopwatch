import { useEffect } from 'react'
import { CheckCircle2, Download, Flag, Info, RotateCcw } from 'lucide-react'

const ICONS = {
  success: CheckCircle2,
  lap: Flag,
  download: Download,
  reset: RotateCcw,
  info: Info,
}

const TONES = {
  success: 'text-emerald-400',
  lap: 'text-sky-400',
  download: 'text-cyan-300',
  reset: 'text-amber-400',
  info: 'text-slate-300',
}

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(onDismiss, 2800)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null
  const Icon = ICONS[toast.tone] ?? Info

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div
        key={toast.id}
        className="pointer-events-auto flex max-w-full animate-toast-in items-center gap-2.5 rounded-2xl border border-white/10 bg-navy-850/95 px-4 py-3 text-[12px] font-medium text-slate-100 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      >
        <Icon className={`h-4 w-4 shrink-0 ${TONES[toast.tone] ?? TONES.info}`} />
        <span className="truncate">{toast.message}</span>
      </div>
    </div>
  )
}
