export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-3xl items-center justify-center rounded-3xl border border-slate-700/50 bg-slate-900/60 p-10 text-center shadow-2xl shadow-black/40 backdrop-blur sm:p-12">
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
            Próximamente
          </span>
        </div>
      </div>
    </div>
  )
}
