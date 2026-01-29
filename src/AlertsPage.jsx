import { HelpCircle, Plus } from "lucide-react"
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

  const [alertName, setAlertName] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [platform, setPlatform] = useState(DEFAULT_PLATFORM)
  const [keywordSelection, setKeywordSelection] = useState(["all"])
  const [alertType, setAlertType] = useState("volume")
  const [timeWindowHours, setTimeWindowHours] = useState(DEFAULT_TIME_WINDOW)
  const [volumeThreshold, setVolumeThreshold] = useState("")
  const [sentimentType, setSentimentType] = useState("negative")
  const [sentimentThreshold, setSentimentThreshold] = useState("")
  const [criticalKeywords, setCriticalKeywords] = useState("")
  const [keywordMatchType, setKeywordMatchType] = useState("contains")
  const [keywordTrigger, setKeywordTrigger] = useState("once")
  const [keywordOccurrencesThreshold, setKeywordOccurrencesThreshold] = useState("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailRecipients, setEmailRecipients] = useState("")
  const [cooldownFrequency, setCooldownFrequency] = useState("instant")

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

  const resetForm = () => {
    setAlertName("")
    setIsActive(true)
    setPlatform(DEFAULT_PLATFORM)
    setKeywordSelection(["all"])
    setAlertType("volume")
    setTimeWindowHours(DEFAULT_TIME_WINDOW)
    setVolumeThreshold("")
    setSentimentType("negative")
    setSentimentThreshold("")
    setCriticalKeywords("")
    setKeywordMatchType("contains")
    setKeywordTrigger("once")
    setKeywordOccurrencesThreshold("")
    setNotificationsEnabled(true)
    setEmailRecipients("")
    setCooldownFrequency("instant")
    setEditingAlert(null)
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
    setAlertName(alert.name ?? "")
    setIsActive(alert.is_active ?? false)
    setPlatform(alert.platform ?? DEFAULT_PLATFORM)
    if (alert.scope_type === "specific_keywords" && Array.isArray(alert.keyword_ids)) {
      setKeywordSelection(alert.keyword_ids.map((id) => String(id)))
    } else {
      setKeywordSelection(["all"])
    }
    setAlertType(alert.alert_type ?? "volume")
    setTimeWindowHours(alert.time_window_hours ? String(alert.time_window_hours) : DEFAULT_TIME_WINDOW)
    setVolumeThreshold(alert.volume_threshold !== null && alert.volume_threshold !== undefined ? String(alert.volume_threshold) : "")
    setSentimentType(alert.sentiment ?? "negative")
    setSentimentThreshold(
      alert.sentiment_threshold !== null && alert.sentiment_threshold !== undefined ? String(alert.sentiment_threshold) : "",
    )
    setCriticalKeywords(alert.critical_keywords?.join(", ") ?? "")
    setKeywordMatchType(alert.keyword_match_type ?? "contains")
    if (alert.keyword_occurrences_threshold !== null && alert.keyword_occurrences_threshold !== undefined) {
      setKeywordTrigger("count")
      setKeywordOccurrencesThreshold(String(alert.keyword_occurrences_threshold))
    } else {
      setKeywordTrigger("once")
      setKeywordOccurrencesThreshold("")
    }
    setNotificationsEnabled(alert.notify_enabled ?? true)
    setEmailRecipients(alert.email_recipients?.join(", ") ?? "")
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
    const { error } = await supabase
      .from("user_alerts_parameters")
      .delete()
      .eq("id", alert.id)
      .eq("account_id", accountId)
    if (error) {
      console.error("Error deleting alert", error)
      setTableError("No pudimos eliminar la alerta. Intenta nuevamente.")
      return
    }
    setAlerts((prev) => prev.filter((item) => item.id !== alert.id))
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
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean)
    const criticalList = criticalKeywords
      .split(/[,\n]/)
      .map((word) => word.trim())
      .filter(Boolean)

    const base = {
      name: trimmedName,
      is_active: isActive,
      platform,
      scope_type: scopeType,
      keyword_ids: keywordIds,
      alert_type: alertType,
      time_window_hours: timeWindowHours ? Number(timeWindowHours) : null,
      notify_enabled: notificationsEnabled,
      email_recipients: notificationsEnabled ? recipients : [],
      cooldown_hours: cooldownFrequency === "daily" ? 24 : 0,
    }

    if (alertType === "volume") {
      return {
        ...base,
        volume_threshold: volumeThreshold ? Number(volumeThreshold) : null,
        sentiment: null,
        sentiment_threshold: null,
        critical_keywords: null,
        keyword_match_type: null,
        keyword_occurrences_threshold: null,
      }
    }

    if (alertType === "sentiment") {
      return {
        ...base,
        volume_threshold: null,
        sentiment: sentimentType,
        sentiment_threshold: sentimentThreshold ? Number(sentimentThreshold) : null,
        critical_keywords: null,
        keyword_match_type: null,
        keyword_occurrences_threshold: null,
      }
    }

    return {
      ...base,
      volume_threshold: null,
      sentiment: null,
      sentiment_threshold: null,
      critical_keywords: criticalList.length > 0 ? criticalList : null,
      keyword_match_type: keywordMatchType,
      keyword_occurrences_threshold: keywordTrigger === "count" ? Number(keywordOccurrencesThreshold) : null,
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
    if (alertType === "critical_keyword") {
      if (!criticalKeywords.trim()) {
        errors.push("Ingresa al menos una palabra crítica.")
      }
      if (keywordTrigger === "count" && !keywordOccurrencesThreshold) {
        errors.push("Define la cantidad mínima de apariciones.")
      }
    }
    if (notificationsEnabled) {
      const recipients = emailRecipients
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean)
      if (recipients.length === 0) {
        errors.push("Agrega al menos un correo destinatario para notificaciones.")
      }
    }
    return errors
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
      setFormError(`No se pudo guardar la alerta: ${error?.message || "Error desconocido"}`)
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
          resetForm()
          setFormError(null)
          setFormSuccess(null)
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Crear nueva alerta
      </Button>

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
                      <p>
                        Keyword crítica: Se activa cuando aparecen palabras o frases sensibles definidas por el
                        usuario.
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
                <SelectItem value="critical_keyword">Keyword crítica</SelectItem>
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

            {alertType === "critical_keyword" && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2 text-slate-300">Palabras o frases críticas</p>
                  <textarea
                    className="w-full rounded-md bg-slate-800/50 border border-slate-700/50 text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    placeholder="Ej: estafa, fraude, denuncia"
                    rows={3}
                    value={criticalKeywords}
                    onChange={(event) => setCriticalKeywords(event.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2 text-slate-300">Tipo de coincidencia</p>
                    <Select value={keywordMatchType} onValueChange={setKeywordMatchType}>
                      <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Contiene</SelectItem>
                        <SelectItem value="exact">Exacta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2 text-slate-300">Disparo de alerta</p>
                    <Select value={keywordTrigger} onValueChange={setKeywordTrigger}>
                      <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Al menos una vez</SelectItem>
                        <SelectItem value="count">Cantidad específica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-slate-300">Ventana temporal</p>
                  <Select value={timeWindowHours} onValueChange={setTimeWindowHours}>
                    <SelectTrigger className="w-full bg-slate-800/60 border-slate-700/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hora</SelectItem>
                      <SelectItem value="6">6 horas</SelectItem>
                      <SelectItem value="24">24 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {keywordTrigger === "count" && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-slate-300">Cantidad mínima de apariciones</p>
                    <Input
                      type="number"
                      className="bg-slate-800/50 border-slate-700/50 text-white"
                      placeholder="Ej: 3"
                      value={keywordOccurrencesThreshold}
                      onChange={(event) => setKeywordOccurrencesThreshold(event.target.value)}
                    />
                  </div>
                )}
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-300">Activar notificaciones</p>
              <p className="text-xs text-slate-500">Recibe avisos por correo cuando la alerta se dispare.</p>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>

          {notificationsEnabled && (
            <div>
              <p className="text-sm font-medium mb-2 text-slate-300">Destinatarios</p>
              <Input
                className="bg-slate-800/50 border-slate-700/50 text-white"
                placeholder="correo@empresa.com"
                value={emailRecipients}
                onChange={(event) => setEmailRecipients(event.target.value)}
              />
              <p className="text-xs text-slate-500 mt-2">Agrega múltiples correos separados por coma.</p>
            </div>
          )}
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
            <Button type="button" variant="ghost" className="text-slate-300" onClick={resetForm}>
              Cancelar edición
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
