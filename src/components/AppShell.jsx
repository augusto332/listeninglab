export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <span className="text-lg font-semibold">Listening Lab</span>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8">
        {children}
      </main>
    </div>
  )
}
