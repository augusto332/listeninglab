export default function LoadingIndicator({ label = 'Cargando...' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/70">
      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-sky-400" />
      <span aria-live="polite">{label}</span>
    </div>
  )
}
