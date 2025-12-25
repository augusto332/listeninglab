export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-slate-700/50 bg-slate-900/60 p-10 text-center shadow-2xl shadow-black/40 backdrop-blur sm:p-12">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
            Sobre nosotros
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Estamos construyendo una historia para escuchar mejor
            </span>
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Muy pronto compartiremos nuestro propósito, el equipo detrás de la
            plataforma y las ideas que inspiran Listening Lab.
          </p>
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            Próximamente
          </span>
        </div>
      </div>
    </div>
  )
}
