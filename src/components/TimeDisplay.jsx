import { pad, splitTime } from '../lib/time'

function Colon({ active }) {
  return (
    <span
      aria-hidden="true"
      className={`px-[0.04em] text-[clamp(1.9rem,9vw,3.7rem)] leading-none text-slate-400 transition-opacity duration-500 dark:text-slate-500 ${
        active ? 'animate-pulse-soft' : 'opacity-50'
      }`}
    >
      :
    </span>
  )
}

export default function TimeDisplay({ elapsed, isRunning }) {
  const { hours, minutes, seconds, millis } = splitTime(elapsed)

  return (
    <div
      role="timer"
      aria-label={`Elapsed time ${pad(hours)} hours ${pad(minutes)} minutes ${pad(seconds)} seconds ${pad(
        millis,
        3,
      )} milliseconds`}
      className="select-none text-center"
    >
      <div className="flex items-baseline justify-center font-mono font-medium tracking-[-0.03em] text-navy-900 dark:text-white">
        <span className="digits text-[clamp(2.45rem,12.2vw,4.8rem)] leading-none drop-shadow-[0_2px_24px_rgba(56,132,255,0.18)]">
          {pad(hours)}
        </span>
        <Colon active={isRunning} />
        <span className="digits text-[clamp(2.45rem,12.2vw,4.8rem)] leading-none drop-shadow-[0_2px_24px_rgba(56,132,255,0.18)]">
          {pad(minutes)}
        </span>
        <Colon active={isRunning} />
        <span className="digits text-[clamp(2.45rem,12.2vw,4.8rem)] leading-none drop-shadow-[0_2px_24px_rgba(56,132,255,0.18)]">
          {pad(seconds)}
        </span>
        <span className="digits ml-[0.12em] text-[clamp(1.35rem,5.4vw,2.3rem)] leading-none text-blue-500 dark:text-cyan-300">
          .{pad(millis, 3)}
        </span>
      </div>
      <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.34em] text-slate-400 dark:text-slate-500">
        Hours · Minutes · Seconds · Milliseconds
      </p>
    </div>
  )
}
