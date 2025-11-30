"use client"

import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XCircle, RefreshCcw, ArrowLeft, Shield } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function PaymentCancelled() {
  const navigate = useNavigate()
  const { session } = useAuth()

  const primaryPath = useMemo(() => (session ? "/app/mentions" : "/"), [session])
  const primaryLabel = session ? "Volver al panel" : "Ir al inicio"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-44 -right-36 h-[26rem] w-[26rem] rounded-full bg-amber-500/15 blur-3xl"></div>
        <div className="absolute -bottom-48 -left-48 h-[30rem] w-[30rem] rounded-full bg-rose-500/15 blur-3xl"></div>
      </div>

      <main className="relative z-10 flex items-center justify-center px-6 py-16">
        <Card className="w-full max-w-3xl bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-800/70 border border-slate-700/50 shadow-xl backdrop-blur-lg">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-500/10">
              <XCircle className="h-9 w-9 text-amber-300" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Pago cancelado
            </CardTitle>
            <CardDescription className="text-base text-slate-300">
              La operación se canceló antes de completarse. Puedes intentarlo nuevamente cuando estés listo.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="mt-1 rounded-lg bg-amber-500/10 p-2">
                  <RefreshCcw className="h-4 w-4 text-amber-300" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-white">No se realizaron cargos</p>
                  <p className="text-sm text-slate-400">
                    Tu método de pago no fue debitado. Si quieres continuar, podrás reanudar el proceso sin penalizaciones.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="mt-1 rounded-lg bg-rose-500/10 p-2">
                  <Shield className="h-4 w-4 text-rose-300" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-white">Tu cuenta sigue protegida</p>
                  <p className="text-sm text-slate-400">
                    Los datos y configuraciones permanecen intactos. Contacta soporte si algo no se ve bien.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">¿Necesitas ayuda? Nuestro equipo está listo para ayudarte a completar tu suscripción.</p>
              <Button variant="secondary" size="lg" className="gap-2 bg-white/5 text-white hover:bg-white/10" onClick={() => navigate(primaryPath)}>
                <ArrowLeft className="h-4 w-4" />
                {primaryLabel}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

