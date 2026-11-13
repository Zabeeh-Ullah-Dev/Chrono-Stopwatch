export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 stage" />
      <div className="absolute inset-0 grid-overlay" />
      <div className="absolute -left-24 top-[-10rem] h-[26rem] w-[26rem] rounded-full bg-sky-400/20 blur-[120px] animate-drift dark:bg-sky-500/20" />
      <div
        className="absolute -right-28 top-24 h-[22rem] w-[22rem] rounded-full bg-cyan-300/20 blur-[110px] animate-drift dark:bg-cyan-400/10"
        style={{ animationDelay: '-6s' }}
      />
      <div className="absolute bottom-[-12rem] left-1/3 h-[24rem] w-[24rem] rounded-full bg-indigo-300/20 blur-[130px] animate-drift dark:bg-indigo-500/20" />
    </div>
  )
}
