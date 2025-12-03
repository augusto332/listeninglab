import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Check, Eye, EyeOff, Loader2, Lock, Mail, UserPlus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function TeamPage() {
  const { user, role } = useAuth()
  const isAdmin = role?.toLowerCase?.() === "admin"
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
    if (!isAdmin) return
    if (!newMemberEmail.trim() || !newMemberTempPassword.trim()) {
      setNewMemberError("Debes completar el correo y la contraseña temporaria.")
      setNewMemberSuccess(null)
      return
    }

    setAddingMember(true)
    setNewMemberError(null)
    setNewMemberSuccess(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const accessToken = session?.access_token
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, "")

      if (!accessToken) {
        throw new Error("No se pudo obtener la sesión actual. Vuelve a iniciar sesión e inténtalo nuevamente.")
      }

      if (!supabaseUrl) {
        throw new Error("La URL de Supabase no está configurada correctamente.")
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/create-collaborator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: newMemberEmail.trim(),
          password: newMemberTempPassword,
        }),
      })

      let responsePayload = null

      try {
        responsePayload = await response.json()
      } catch (_error) {
        responsePayload = null
      }

      if (!response.ok) {
        const errorMessage =
          (responsePayload && (responsePayload.error || responsePayload.message)) ||
          "No se pudo crear el colaborador. Intenta nuevamente."
        throw new Error(errorMessage)
      }

      const successMessage =
        (responsePayload && (responsePayload.message || responsePayload?.data?.message)) ||
        "El nuevo colaborador fue creado correctamente."

      setNewMemberSuccess(successMessage)
      setNewMemberEmail("")
      setNewMemberTempPassword("")
      setTeamReloadKey((previousKey) => previousKey + 1)
    } catch (error) {
      setNewMemberError(error.message || "Ocurrió un error al crear el colaborador.")
    } finally {
      setAddingMember(false)
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
                    {showNewMemberTempPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
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
                disabled={
                  addingMember ||
                  !newMemberEmail.trim() ||
                  !newMemberTempPassword.trim()
                }
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {addingMember ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {addingMember ? "Creando..." : "Añadir al equipo"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Gestiona tu equipo</CardTitle>
          <CardDescription className="text-slate-400">
            Consulta los miembros asociados a tu cuenta y sus roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamLoading ? (
            <p className="text-sm text-slate-400">Cargando equipo...</p>
          ) : teamError ? (
            <p className="text-sm text-red-400">{teamError}</p>
          ) : teamMembers.length === 0 ? (
            <p className="text-sm text-slate-400">Aún no hay miembros asociados a esta cuenta.</p>
          ) : (
            <Table className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-md text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.user_id}>
                    <TableCell className="font-medium">{member.email || "-"}</TableCell>
                    <TableCell className="capitalize">{member.role || "-"}</TableCell>
                    <TableCell>
                      {member.created_at
                        ? format(new Date(member.created_at), "dd/MM/yyyy HH:mm", { locale: es })
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
