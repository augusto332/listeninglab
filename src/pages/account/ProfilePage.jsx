import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, User, Calendar, TrendingUp, Sparkles, AlertTriangle, Check } from "lucide-react"
import { roleConfig } from "./constants"

export default function ProfilePage() {
  const { user, accountId, role, planLoading } = useAuth()
  const [accountEmail, setAccountEmail] = useState("")
  const [accountName, setAccountName] = useState("")
  const [originalAccountName, setOriginalAccountName] = useState("")
  const [nameMessage, setNameMessage] = useState(null)
  const [accountCreatedAt, setAccountCreatedAt] = useState(null)
  const [stats, setStats] = useState({ mentions: 0, keywords: 0 })
  const [savingName, setSavingName] = useState(false)

  useEffect(() => {
    const fetchAccount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const displayName = user.user_metadata?.display_name || ""
        setAccountEmail(user.email || "")
        setAccountName(displayName)
        setOriginalAccountName(displayName)
        setAccountCreatedAt(user.created_at)
      }
    }

    fetchAccount()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || accountId === undefined) return

      let keywordsCount = 0

      if (accountId) {
        const { count } = await supabase
          .from("dim_keywords")
          .select("*", { count: "exact", head: true })
          .eq("account_id", accountId)
          .eq("active", true)

        keywordsCount = count || 0
      }

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: mentionsCount } = await supabase
        .from("fact_mentions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString())

      setStats({
        keywords: keywordsCount,
        mentions: mentionsCount || 0,
      })
    }

    fetchStats()
  }, [user, accountId])

  const getRoleBadge = useMemo(() => {
    if (planLoading) return null

    const normalizedRole = typeof role === "string" ? role.toLowerCase() : "contributor"
    const config = roleConfig[normalizedRole] ?? roleConfig.contributor
    const RoleIcon = config.icon

    return (
      <Badge variant="secondary" className={`${config.color} flex items-center gap-1.5 px-3 py-1.5`}>
        <RoleIcon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }, [planLoading, role])

  const formatDate = (dateString) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSaveAccountName = async () => {
    setNameMessage(null)
    setSavingName(true)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: accountName },
      })

      if (error) {
        setNameMessage({ type: "error", text: error.message })
      } else {
        setNameMessage({ type: "success", text: "Nombre actualizado exitosamente" })
        setOriginalAccountName(accountName)
      }
    } finally {
      setSavingName(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
          Mi Perfil
        </h1>
        <p className="text-slate-400">Información general de tu cuenta</p>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl mb-1">{accountName || "Usuario"}</CardTitle>
                <CardDescription className="text-slate-400">{accountEmail}</CardDescription>
                <div className="mt-2">{getRoleBadge}</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-px bg-slate-700/50 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Miembro desde</span>
              </div>
              <p className="text-lg font-semibold text-white">{formatDate(accountCreatedAt)}</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-400">Keywords activas</span>
              </div>
              <p className="text-lg font-semibold text-white">{stats.keywords}</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-400">Menciones (30 días)</span>
              </div>
              <p className="text-lg font-semibold text-white">{stats.mentions}</p>
            </div>
          </div>

          <div className="w-full h-px bg-slate-700/50 mb-6" />

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Información Personal</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Correo electrónico
              </label>
              <Input
                className="bg-slate-800/50 border-slate-700/50 text-white cursor-not-allowed"
                value={accountEmail}
                readOnly
              />
              <p className="text-xs text-slate-500">El correo electrónico no se puede modificar</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nombre de usuario</label>
              <div className="flex items-center gap-3">
                <Input
                  className="bg-slate-800/50 border-slate-700/50 text-white flex-1 focus:border-blue-500/50 focus:ring-blue-500/20"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Tu nombre"
                />
                {accountName !== originalAccountName && (
                  <Button
                    onClick={handleSaveAccountName}
                    disabled={savingName || !accountName.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                  >
                    {savingName ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Guardar
                      </>
                    )}
                  </Button>
                )}
              </div>
              {nameMessage && (
                <div
                  className={`p-3 rounded-lg border flex items-center gap-2 ${
                    nameMessage.type === "error"
                      ? "bg-red-500/10 border-red-500/20 text-red-400"
                      : "bg-green-500/10 border-green-500/20 text-green-400"
                  }`}
                >
                  {nameMessage.type === "success" ? (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="text-sm">{nameMessage.text}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
