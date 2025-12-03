import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Check, Eye, EyeOff, Lock, Shield, X } from "lucide-react"

export default function SecurityPage() {
  const [accountEmail, setAccountEmail] = useState("")
  const [passwordMessage, setPasswordMessage] = useState(null)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    const fetchAccount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setAccountEmail(user.email || "")
      }
    }

    fetchAccount()
  }, [])

  const togglePasswordFields = () => {
    setShowPasswordFields((prev) => !prev)
    setPasswordMessage(null)
    setCurrentPassword("")
    setNewPassword("")
  }

  const getPasswordStrength = (password) => {
    const requirements = [
      { test: password.length >= 8, text: "Al menos 8 caracteres" },
      { test: /[A-Z]/.test(password), text: "Una letra mayúscula" },
      { test: /[a-z]/.test(password), text: "Una letra minúscula" },
      { test: /\d/.test(password), text: "Un número" },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: "Un carácter especial" },
    ]

    const passed = requirements.filter((req) => req.test).length
    return { requirements, passed, total: requirements.length }
  }

  const passwordStrength = useMemo(() => getPasswordStrength(newPassword), [newPassword])
  const isPasswordValid = passwordStrength.passed >= 3

  const handleChangePassword = async () => {
    setPasswordMessage(null)

    if (!isPasswordValid) {
      setPasswordMessage({ type: "error", text: "La contraseña debe cumplir al menos 3 requisitos" })
      return
    }

    setChangingPassword(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: accountEmail,
        password: currentPassword,
      })

      if (signInError) {
        setPasswordMessage({ type: "error", text: "Contraseña actual incorrecta" })
        setChangingPassword(false)
        return
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) {
        setPasswordMessage({ type: "error", text: error.message })
      } else {
        setPasswordMessage({ type: "success", text: "Contraseña actualizada exitosamente" })
        setShowPasswordFields(false)
        setCurrentPassword("")
        setNewPassword("")
      }
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <CardTitle className="text-white">Seguridad</CardTitle>
        </div>
        <CardDescription className="text-slate-400">
          Gestiona tu contraseña y configuración de seguridad
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showPasswordFields ? (
          <Button
            onClick={togglePasswordFields}
            variant="outline"
            className="w-full border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 bg-slate-800/30"
          >
            <Lock className="w-4 h-4 mr-2" />
            Cambiar contraseña
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Contraseña actual</label>
              <div className="relative">
                <Input
                  className="bg-slate-800/50 border-slate-700/50 text-white pr-10 focus:border-blue-500/50 focus:ring-blue-500/20"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nueva contraseña</label>
              <div className="relative">
                <Input
                  className="bg-slate-800/50 border-slate-700/50 text-white pr-10 focus:border-blue-500/50 focus:ring-blue-500/20"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {newPassword && (
                <div className="p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">Seguridad de la contraseña</span>
                  </div>
                  <div className="space-y-1">
                    {passwordStrength.requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {req.test ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <X className="w-3 h-3 text-slate-500" />
                        )}
                        <span className={req.test ? "text-green-400" : "text-slate-500"}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[...Array(passwordStrength.total)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < passwordStrength.passed
                            ? passwordStrength.passed <= 2
                              ? "bg-red-500"
                              : passwordStrength.passed <= 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            : "bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {passwordMessage && (
              <div
                className={`p-3 rounded-lg border flex items-center gap-2 ${
                  passwordMessage.type === "error"
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : "bg-green-500/10 border-green-500/20 text-green-400"
                }`}
              >
                {passwordMessage.type === "success" ? (
                  <Check className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="text-sm">{passwordMessage.text}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleChangePassword}
                disabled={changingPassword || !currentPassword || !newPassword || !isPasswordValid}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
              >
                {changingPassword ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Guardar cambios
                  </>
                )}
              </Button>
              <Button
                onClick={togglePasswordFields}
                variant="outline"
                className="border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 bg-slate-800/30"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
