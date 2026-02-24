import { HelpCircle, Minus, Plus, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import AlertsTable from "@/components/AlertsTable"
import MultiSelect from "@/components/MultiSelect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/AuthContext"

const DEFAULT_TIME_WINDOW = "24"
const DEFAULT_PLATFORM = "all"

export default function AlertsPage() {
  const { user, accountId } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [keywords, setKeywords] = useState([])
  const [loadingAlerts, setLoadingAlerts] = useState(false)
  const [loadingKeywords, setLoadingKeywords] = useState(false)
  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(null)
  const [tableError, setTableError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editingAlert, setEditingAlert] = useState(null)
  const [showAlertForm, setShowAlertForm] = useState(false)

  const [alertName, setAlertName] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [platform, setPlatform] = useState(DEFAULT_PLATFORM)
  const [keywordSelection, setKeywordSelection] = useState(["all"])
  const [alertType, setAlertType] = useState("volume")
  const [timeWindowHours, setTimeWindowHours] = useState(DEFAULT_TIME_WINDOW)
  const [volumeThreshold, setVolumeThreshold] = useState("")
  const [sentimentType, setSentimentType] = useState("negative")
  const [sentimentThreshold, setSentimentThreshold] = useState("")
  const [emailRecipients, setEmailRecipients] = useState([])
  const [emailRecipientInput, setEmailRecipientInput] = useState("")
  const [cooldownFrequency, setCooldownFrequency] = useState("instant")

  const EMAIL_RECIPIENT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i

  const keywordOptions = useMemo(
    () => [
      { value: "all", label: "Todas" },
      ...keywords.map((keyword) => ({
        value: String(keyword.keyword_id),
        label: keyword.keyword,
      })),
    ],
    [keywords],
  )

  const keywordMap = useMemo(
    () =>
      keywords.reduce((acc, keyword) => {
        acc[keyword.keyword_id] = keyword.keyword
        acc[String(keyword.keyword_id)] = keyword.keyword
        return acc
      }, {}),
    [keywords],
  )

  const resetForm = ({ keepOpen = false } = {}) => {
    setAlertName("")
    setIsActive(true)
    setPlatform(DEFAULT_PLATFORM)
    setKeywordSelection(["all"])
    setAlertType("volume")
    setTimeWindowHours(DEFAULT_TIME_WINDOW)
    setVolumeThreshold("")
    setSentimentType("negative")
    setSentimentThreshold("")
    setEmailRecipients([])
    setEmailRecipientInput("")
    setCooldownFrequency("instant")
    setEditingAlert(null)
    setFormError(null)
    setFormSuccess(null)
    if (!keepOpen) {
      setShowAlertForm(false)
    }
  }

  const fetchKeywords = async () => {
    if (!accountId) {
      setKeywords([])
      return
    }
    setLoadingKeywords(true)
    const { data, error } = await supabase
      .from("dim_keywords")
      .select("keyword, keyword_id")
      .eq("account_id", accountId)
      .order("created_at", { ascending: false })
    if (error) {
      console.error("Error fetching keywords", error)
      setKeywords([])
    } else {
      setKeywords(data || [])
    }
    setLoadingKeywords(false)
  }

  const fetchAlerts = async () => {
    if (!accountId) {
      setAlerts([])
      return
    }
    setLoadingAlerts(true)
    setTableError(null)
    const { data, error } = await supabase
      .from("user_alerts_parameters")
      .select("*")
      .eq("account_id", accountId)
      .order("created_at", { ascending: false })
    if (error) {
      console.error("Error fetching alerts", error)
      setTableError("No pudimos cargar tus alertas. Intenta nuevamente en unos segundos.")
      setAlerts([])
    } else {
      setAlerts(data || [])
    }
    setLoadingAlerts(false)
  }

  useEffect(() => {
    if (accountId === undefined) return
    fetchAlerts()
    fetchKeywords()
  }, [accountId])

  const handleEdit = (alert) => {
    setEditingAlert(alert)
    setShowAlertForm(true)
    setAlertName(alert.name ?? "")
    setIsActive(alert.is_active ?? false)
    setPlatform(alert.platform ?? DEFAULT_PLATFORM)
    if (alert.scope_type === "specific_keywords" && Array.isArray(alert.keyword_ids)) {
      setKeywordSelection(alert.keyword_ids.map((id) => String(id)))
    } else {
      setKeywordSelection(["all"])
    }
    const nextAlertType = alert.alert_type === "sentiment" ? "sentiment" : "volume"
    setAlertType(nextAlertType)
    setTimeWindowHours(alert.time_window_hours ? String(alert.time_window_hours) : DEFAULT_TIME_WINDOW)
    setVolumeThreshold(alert.volume_threshold !== null && alert.volume_threshold !== undefined ? String(alert.volume_threshold) : "")
    setSentimentType(alert.sentiment ?? "negative")
    setSentimentThreshold(
      alert.sentiment_threshold !== null && alert.sentiment_threshold !== undefined ? String(alert.sentiment_threshold) : "",
    )
    setEmailRecipients(alert.email_recipients ?? [])
    setEmailRecipientInput("")
    setCooldownFrequency(alert.cooldown_hours === 24 ? "daily" : "instant")
    setFormError(null)
    setFormSuccess(null)
  }

  const handleDelete = async (alert) => {
    if (!accountId) {
      setTableError("No pudimos identificar tu cuenta.")
      return
    }
    const confirmed = window.confirm("¿Estás seguro de eliminar esta alerta?")
    if (!confirmed) return
    setTableError(null)
    const { data, error } = await supabase
      .from("user_alerts_parameters")
      .delete()
      .select("id")
      .eq("id", alert.id)
      .eq("account_id", accountId)
    if (error) {
      console.error("Error deleting alert", error)
      setTableError("No pudimos eliminar la alerta. Intenta nuevamente.")
      return
    }
    if (!data || data.length === 0) {
      setTableError("No tienes permisos para eliminar esta alerta.")
      return
    }
    setAlerts((prev) => prev.filter((item) => item.id !== alert.id))
  }

  const commitEmailRecipients = (rawValue = emailRecipientInput) => {
    const candidates = rawValue
      .split(/[,\n]+/)
      .map((value) => value.trim())
      .filter(Boolean)
    if (candidates.length === 0) return
    const invalidRecipients = candidates.filter((value) => !EMAIL_RECIPIENT_REGEX.test(value))
    const validRecipients = candidates.filter((value) => EMAIL_RECIPIENT_REGEX.test(value))
    if (validRecipients.length > 0) {
      setEmailRecipients((prev) => {
        const existing = new Set(prev.map((email) => email.toLowerCase()))
        const next = [...prev]
        validRecipients.forEach((email) => {
          const normalized = email.toLowerCase()
          if (!existing.has(normalized)) {
            existing.add(normalized)
            next.push(email)
          }
        })
        return next
      })
    }
    if (invalidRecipients.length === 0) {
      setEmailRecipientInput("")
    }
  }

  const handleRecipientKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      commitEmailRecipients()
    }
  }

  const removeEmailRecipient = (email) => {
    setEmailRecipients((prev) => prev.filter((item) => item !== email))
  }

  const buildPayload = () => {
    const trimmedName = alertName.trim()
    const keywordIds =
      keywordSelection.includes("all") || keywordSelection.length === 0
        ? null
        : keywordSelection.map((id) => {
            const parsed = Number(id)
            return Number.isNaN(parsed) ? id : parsed
          })
    const scopeType =
      keywordSelection.includes("all") || keywordSelection.length === 0 ? "all_keywords" : "specific_keywords"
    const recipients = emailRecipients
    const base = {
      name: trimmedName,
      is_active: isActive,
      platform,
      scope_type: scopeType,
      keyword_ids: keywordIds,
      alert_type: alertType,
      time_window_hours: timeWindowHours ? Number(timeWindowHours) : null,
      email_recipients: recipients,
      cooldown_hours: cooldownFrequency === "daily" ? 24 : 0,
    }

    if (alertType === "sentiment") {
      return {
        ...base,
        volume_threshold: null,
        sentiment: sentimentType,
        sentiment_threshold: sentimentThreshold ? Number(sentimentThreshold) : null,
      }
    }

    return {
      ...base,
      volume_threshold: volumeThreshold ? Number(volumeThreshold) : null,
      sentiment: null,
      sentiment_threshold: null,
    }
  }

  const validateForm = () => {
    const errors = []
    if (!user?.id) {
      errors.push("Debes iniciar sesión para guardar alertas.")
    }
    if (!accountId) {
      errors.push("No pudimos identificar tu cuenta.")
    }
    if (!alertName.trim()) {
      errors.push("El nombre de la alerta es obligatorio.")
    }
    if (!platform) {
      errors.push("Selecciona una plataforma.")
    }
    if (!timeWindowHours) {
      errors.push("Selecciona una ventana temporal.")
    }
    if (!keywordSelection.includes("all") && keywordSelection.length === 0) {
      errors.push("Selecciona al menos una palabra clave o todas.")
    }

    if (alertType === "volume" && !volumeThreshold) {
      errors.push("Define un umbral de volumen para la alerta.")
    }
    if (alertType === "sentiment" && !sentimentThreshold) {
      errors.push("Define un umbral de sentimiento para la alerta.")
    }
    if (emailRecipients.length === 0) {
      errors.push("Agrega al menos un correo destinatario para notificaciones.")
    }
    return errors
  }

  const getAlertSaveErrorMessage = (error) => {
    const rawMessage = error?.message ?? ""
    const errorMessageMap = {
      'new row violates row-level security policy for table "user_alerts_parameters"':
        "No tienes permisos para guardar alertas en esta cuenta.",
    }

    if (errorMessageMap[rawMessage]) {
      return errorMessageMap[rawMessage]
    }

    return "Ocurrió un error al guardar la alerta. Si el problema continúa, contacta a soporte."
  }

  const handleSave = async () => {
    setFormError(null)
    setFormSuccess(null)
    const errors = validateForm()
    if (errors.length > 0) {
      setFormError(errors.join(" "))
      return
    }
    setSaving(true)
    const payload = buildPayload()
    try {
      if (editingAlert) {
        const { data, error } = await supabase
          .from("user_alerts_parameters")
          .update(payload)
          .eq("id", editingAlert.id)
          .eq("account_id", accountId)
          .select()
          .single()
        if (error) {
          throw error
        }
        setAlerts((prev) => prev.map((alert) => (alert.id === editingAlert.id ? data : alert)))
        setFormSuccess("Alerta actualizada correctamente.")
        resetForm()
      } else {
        const { data, error } = await supabase
          .from("user_alerts_parameters")
          .insert({
            ...payload,
            account_id: accountId,
            created_by: user.id,
          })
          .select()
          .single()
        if (error) {
          throw error
        }
        setAlerts((prev) => [data, ...prev])
        setFormSuccess("Alerta creada correctamente.")
        resetForm()
      }
    } catch (error) {
      console.error("Error saving alert", error)
      setFormError(getAlertSaveErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
          Mis Alertas
        </h1>
        <p className="text-slate-400">Crea alertas personalizadas y recibe avisos cuando ocurra lo importante.</p>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        {tableError && <p className="text-sm text-red-400 mb-4">{tableError}</p>}
        <AlertsTable
          alerts={alerts}
          keywordMap={keywordMap}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loadingAlerts}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        onClick={() => {
          if (editingAlert) {
            resetForm()
            return
          }
          if (showAlertForm) {
            setShowAlertForm(false)
            return
          }
          resetForm({ keepOpen: true })
          setShowAlertForm(true)
        }}
      >
        {showAlertForm ? <Minus className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
        {editingAlert ? "Cancelar edición" : "Crear nueva alerta"}
      </Button>

      {(showAlertForm || editingAlert) && (
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">
          {editingAlert ? "Editar alerta" : "Nueva alerta"}
        </h3>
        <p className="text-sm text-slate-400">
          Configura los criterios y canales de notificación. Próximamente podrás activar reglas automáticas.
        </p>

        <div>
          <p className="text-sm font-medium mb-2 text-slate-300">Nombre de la alerta</p>
          <Input
            className="bg-slate-800/50 border-slate-700/50 text-white"
            placeholder="Ej: Pico de sentimiento negativo"
            value={alertName}
            onChange={(event) => setAlertName(event.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Plataforma</p>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Palabra clave</p>
            <MultiSelect
              options={keywordOptions}
              value={keywordSelection}
              onChange={setKeywordSelection}
              placeholder={loadingKeywords ? "Cargando..." : "Seleccionar"}
              className="text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium text-slate-300">Tipo de alerta</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-slate-400 hover:text-slate-200">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs text-slate-200 bg-slate-900/95 border border-slate-700/70">
                    <div className="space-y-2">
                      <p>
                        Volumen de menciones: Se activa cuando el volumen de menciones supera un umbral definido en un
                        período de tiempo.
                      </p>
                      <p>
                        Sentimiento: Se activa cuando se detecta una cantidad definida de menciones positivas o
                        negativas.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Volumen de menciones</SelectItem>
                <SelectItem value="sentiment">Sentimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Frecuencia de notificación</p>
            <Select value={cooldownFrequency} onValueChange={setCooldownFrequency}>
              <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Inmediata</SelectItem>
                <SelectItem value="daily">Máximo una vez cada 24 horas</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-2">
              Útil para evitar recibir múltiples correos por el mismo evento.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-4 space-y-3">
            <p className="text-sm font-medium text-slate-300">Condición de activación</p>
            {alertType === "volume" && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                <span>Se detecten</span>
                <Input
                  type="number"
                  className="w-24 bg-slate-800/60 border-slate-700/50 text-white"
                  placeholder="50"
                  value={volumeThreshold}
                  onChange={(event) => setVolumeThreshold(event.target.value)}
                />
                <span>menciones en</span>
                <Select value={timeWindowHours} onValueChange={setTimeWindowHours}>
                  <SelectTrigger className="w-28 bg-slate-800/60 border-slate-700/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="6">6 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {alertType === "sentiment" && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                <span>Se detecten</span>
                <Input
                  type="number"
                  className="w-24 bg-slate-800/60 border-slate-700/50 text-white"
                  placeholder="10"
                  value={sentimentThreshold}
                  onChange={(event) => setSentimentThreshold(event.target.value)}
                />
                <span>menciones</span>
                <Select value={sentimentType} onValueChange={setSentimentType}>
                  <SelectTrigger className="w-32 bg-slate-800/60 border-slate-700/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negative">Negativas</SelectItem>
                    <SelectItem value="positive">Positivas</SelectItem>
                  </SelectContent>
                </Select>
                <span>en</span>
                <Select value={timeWindowHours} onValueChange={setTimeWindowHours}>
                  <SelectTrigger className="w-28 bg-slate-800/60 border-slate-700/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="6">6 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

          </div>

          <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 px-4 py-3">
            <p className="text-sm text-slate-400">
              Esta alerta se disparará cuando se cumpla la condición configurada.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-300">Estado de la alerta</p>
              <p className="text-xs text-slate-500">Activa o pausa el monitoreo de esta alerta.</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Destinatarios</p>
            <Input
              className="bg-slate-800/50 border-slate-700/50 text-white"
              placeholder="Escribe un correo y presiona coma o enter"
              value={emailRecipientInput}
              onChange={(event) => setEmailRecipientInput(event.target.value)}
              onKeyDown={handleRecipientKeyDown}
              onBlur={commitEmailRecipients}
            />
            <p className="text-xs text-slate-500 mt-2">Puedes agregar múltiples direcciones.</p>
            {emailRecipients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {emailRecipients.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-700/70 px-3 py-1 text-xs text-slate-100"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmailRecipient(email)}
                      className="text-slate-300 hover:text-white"
                      aria-label={`Eliminar ${email}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {formError && <p className="text-sm text-red-400">{formError}</p>}
        {formSuccess && <p className="text-sm text-emerald-300">{formSuccess}</p>}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar alerta"}
          </Button>
          {editingAlert && (
            <Button type="button" variant="ghost" className="text-slate-300" onClick={() => resetForm()}>
              Cancelar edición
            </Button>
          )}
        </div>
      </div>
      )}
    </section>
  )
}
