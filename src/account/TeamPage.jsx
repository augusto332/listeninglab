import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Check, Eye, EyeOff, Lock, Mail, UserPlus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { roleConfig } from "./accountConfig"

export default function TeamPage() {
  const { user } = useAuth()
  const userId = user?.id
  const [teamMembers, setTeamMembers] = useState([])
  const [teamLoading, setTeamLoading] = useState(false)
  const [teamError, setTeamError] = useState(null)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberTempPassword, setNewMemberTempPassword] = useState("")
  const [showNewMemberTempPassword, setShowNewMemberTempPassword] = useState(false)
  const [addingMember, setAddingMember] = useState(false)
  const [newMemberError, setNewMemberError] = useState(null)
  const [newMemberSuccess, setNewMemberSuccess] = useState(null)
  const [teamReloadKey, setTeamReloadKey] = useState(0)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!userId) return

      setTeamLoading(true)
      setTeamError(null)

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("account_id")
          .eq("user_id", userId)
          .single()

        if (profileError) {
          throw profileError
        }

        const accountId = profileData?.account_id

        if (!accountId) {
          setTeamMembers([])
          setTeamLoading(false)
          return
        }

        const { data: membersData, error: membersError } = await supabase
          .from("profiles")
          .select("user_id, email, role, created_at")
          .eq("account_id", accountId)
          .order("created_at", { ascending: false })

        if (membersError) {
          throw membersError
        }

        setTeamMembers(membersData || [])
      } catch (error) {
        setTeamError("No pudimos cargar tu equipo. Intenta nuevamente más tarde.")
        setTeamMembers([])
      } finally {
        setTeamLoading(false)
      }
    }

    fetchTeamMembers()
  }, [userId, teamReloadKey])

  const handleAddTeamMember = async () => {
    if (!newMemberEmail || !newMemberTempPassword) {
      setNewMemberError("Por favor completa todos los campos")
      return
    }

    setAddingMember(true)
    setNewMemberError(null)
    setNewMemberSuccess(null)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: newMemberEmail,
        password: newMemberTempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      setNewMemberSuccess("Miembro agregado exitosamente")
      setNewMemberEmail("")
      setNewMemberTempPassword("")
      setTeamReloadKey((prev) => prev + 1)
    } catch (error) {
      setNewMemberError(error.message || "No pudimos agregar al miembro. Intenta nuevamente.")
    } finally {
      setAddingMember(false)
    }
  }

  const renderRoleBadge = (memberRole) => {
    const normalizedRole = typeof memberRole === "string" ? memberRole.toLowerCase() : "contributor"
    const config = roleConfig[normalizedRole] ?? roleConfig.contributor
    const RoleIcon = config.icon

    return (
      <Badge variant="secondary" className={`${config.color} flex items-center gap-1.5 px-2 py-1 text-xs`}>
        <RoleIcon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible"

    try {
      return format(new Date(dateString), "d MMM yyyy", { locale: es })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "No disponible"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Invita a un nuevo miembro
              </CardTitle>
              <CardDescription className="text-slate-400">
                Agrega usuarios a tu equipo ingresando su correo electrónico y una contraseña temporaria.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2" htmlFor="new-member-email">
                  <Mail className="w-4 h-4" />
                  Correo electrónico del miembro
                </label>
                <Input
                  id="new-member-email"
                  type="email"
                  placeholder="nombre@empresa.com"
                  className="bg-slate-800/50 border-slate-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20"
                  value={newMemberEmail}
                  onChange={(event) => {
                    setNewMemberEmail(event.target.value)
                    setNewMemberError(null)
                    setNewMemberSuccess(null)
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2" htmlFor="new-member-password">
                  <Lock className="w-4 h-4" />
                  Contraseña temporaria
                </label>
                <div className="relative">
                  <Input
                    id="new-member-password"
                    type={showNewMemberTempPassword ? "text" : "password"}
                    placeholder="Ingresa una contraseña segura"
                    className="bg-slate-800/50 border-slate-700/50 text-white pr-10 focus:border-blue-500/50 focus:ring-blue-500/20"
                    value={newMemberTempPassword}
                    onChange={(event) => {
                      setNewMemberTempPassword(event.target.value)
                      setNewMemberError(null)
                      setNewMemberSuccess(null)
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewMemberTempPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-slate-400 hover:text-slate-300 transition-colors"
                    aria-label={showNewMemberTempPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showNewMemberTempPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 space-y-2">
                {newMemberError && (
                  <p className="text-sm text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {newMemberError}
                  </p>
                )}
                {newMemberSuccess && (
                  <p className="text-sm text-emerald-400 flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    {newMemberSuccess}
                  </p>
                )}
              </div>
              <Button
                type="button"
                onClick={handleAddTeamMember}
                disabled={addingMember}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
              >
                {addingMember ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Agregando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Invitar miembro
                  </div>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/40 border border-slate-800/80">
        <CardHeader>
          <CardTitle className="text-white">Miembros del equipo</CardTitle>
          <CardDescription className="text-slate-400">Gestiona los usuarios que tienen acceso a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden border border-slate-800/60">
            <Table>
              <TableHeader className="bg-slate-800/50">
                <TableRow>
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Rol</TableHead>
                  <TableHead className="text-slate-300">Fecha de alta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-slate-400">
                      Cargando miembros...
                    </TableCell>
                  </TableRow>
                ) : teamError ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-red-400">
                      {teamError}
                    </TableCell>
                  </TableRow>
                ) : teamMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-slate-400">
                      Aún no hay miembros en tu equipo
                    </TableCell>
                  </TableRow>
                ) : (
                  teamMembers.map((member) => (
                    <TableRow key={member.user_id} className="hover:bg-slate-800/30">
                      <TableCell className="text-white">{member.email}</TableCell>
                      <TableCell>{renderRoleBadge(member.role)}</TableCell>
                      <TableCell className="text-slate-400">{formatDate(member.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
