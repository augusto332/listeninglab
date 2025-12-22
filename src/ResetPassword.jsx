import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import logo from "@/assets/logo.png"
import { AlertCircle, ArrowLeft, CheckCircle, Lock, Loader2 } from "lucide-react"

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [ready, setReady] = useState(false) // listo para mostrar form (recovery link validado)
  const [status, setStatus] = useState({ loading: false, error: null, success: null })
  const navigate = useNavigate()

  const recoverySignal = useMemo(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get("code") // algunos flows usan ?code=
    const type = url.searchParams.get("type")
    const hash = window.location.hash || ""
    const hashHasRecovery = hash.includes("type=recovery")
    return {
      code,
      isRecovery: type === "recovery" || hashHasRecovery,
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        // 1) Si viene ?code=..., canjearlo por sesión (muy común en SPAs)
        if (recoverySignal.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(recoverySignal.code)
          if (error) {
            if (!mounted) return
            setStatus({ loading: false, error: error.message, success: null })
            setReady(false)
            return
          }
        }

        // 2) Ver si ya hay sesión (por ejemplo si el link venía con tokens en el hash)
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          if (!mounted) return
          setStatus({ loading: false, error: error.message, success: null })
          setReady(false)
          return
        }

        // Si hay sesión y el link era de recovery, habilitamos el form
        if (!mounted) return
        if (data?.session && recoverySignal.isRecovery) {
          setReady(true)
        } else {
          // Si el user entró a /reset-password sin link válido, queda esperando
          setReady(false)
        }
      } catch (e) {
        if (!mounted) return
        setStatus({ loading: false, error: e?.message || "Error inicializando recuperación.", success: null })
        setReady(false)
      }
    }

    init()

    // 3) Escuchar eventos de auth; algunos casos emiten PASSWORD_RECOVERY o SIGNED_IN
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        // Ojo: SIGNED_IN puede dispararse en algunos clientes/flows
        if (recoverySignal.isRecovery) setReady(true)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [recoverySignal.code, recoverySignal.isRecovery])

  const goToLoginAndSignOut = async () => {
    // ✅ Esto evita el bug/efecto que describís: que vuelva al login pero quede logueado
    await supabase.auth.signOut()
    navigate("/login", { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: false, error: null, success: null })

    if (!ready) {
      setStatus({
        loading: false,
        error: "Necesitamos validar tu enlace de recuperación antes de continuar.",
        success: null,
      })
      return
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        loading: false,
        error: "Las contraseñas no coinciden. Intenta nuevamente.",
        success: null,
      })
      return
    }

    setStatus({ loading: true, error: null, success: null })

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setStatus({ loading: false, error: error.message, success: null })
      return
    }

    setStatus({
      loading: false,
      error: null,
      success: "Tu contraseña fue actualizada. Te redirigiremos al inicio de sesión.",
    })

    // Por seguridad/UX: luego de cambiar password, cerramos sesión y volvemos al login
    setTimeout(async () => {
      await supabase.auth.signOut()
      navigate("/login", { replace: true })
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 overflow-hidden">
              <img src={logo} alt="Listening Lab" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
              Restablece tu contraseña
            </h1>
            <p className="text-slate-400">
              Si abriste el enlace del correo, vamos a habilitar el formulario para definir tu nueva contraseña.
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            {!ready ? (
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700/50 mx-auto">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                </div>
                <h2 className="text-lg font-semibold text-white">Esperando enlace válido</h2>
                <p className="text-sm text-slate-400">
                  Abrí el enlace desde tu correo. Si ya lo hiciste y no aparece el formulario, pedí uno nuevo.
                </p>

                {status.error && (
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-red-300 font-medium">No pudimos validar el enlace</p>
                      <p className="text-sm text-red-400">{status.error}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <ArrowLeft className="w-4 h-4" />
                  <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Solicitar un nuevo enlace
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={goToLoginAndSignOut}
                  className="w-full mt-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 block">Nueva contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Ingresa tu nueva contraseña"
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 block">Confirmar contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirma tu nueva contraseña"
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {status.error && (
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-red-300 font-medium">No pudimos actualizar tu contraseña</p>
                      <p className="text-sm text-red-400">{status.error}</p>
                    </div>
                  </div>
                )}

                {status.success && (
                  <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-green-300 font-medium">Contraseña actualizada</p>
                      <p className="text-sm text-green-400">{status.success}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {status.loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Actualizando contraseña...
                    </>
                  ) : (
                    <>Actualizar contraseña</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={goToLoginAndSignOut}
                  className="w-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  Volver al inicio de sesión
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
