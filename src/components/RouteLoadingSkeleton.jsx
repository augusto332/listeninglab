import AppShell from '@/components/AppShell'
import { Skeleton } from '@/components/ui/skeleton'

export default function RouteLoadingSkeleton() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-slate-900/40 p-4"
            >
              <Skeleton className="mb-4 h-5 w-24" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
          <Skeleton className="mb-4 h-5 w-36" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
