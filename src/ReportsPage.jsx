import { Minus, Plus, X } from "lucide-react"
import DatePickerInput from "@/components/DatePickerInput"
import ReportsTable from "@/components/ReportsTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/context/AuthContext"

const WEEK_DAYS = [
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
  { value: "7", label: "Domingo" },
]

const MONTH_DAYS = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1
  return { value: String(day), label: `Día ${day}` }
})

const REPORT_HOURS = Array.from({ length: 24 }, (_, index) => {
  const hourValue = String(index).padStart(2, "0")
  const hourNumber = index % 12 === 0 ? 12 : index % 12
  const period = index < 12 ? "AM" : "PM"
  return { value: `${hourValue}:00`, label: `${hourNumber}:00 ${period}` }
})

const TIMEZONE_OPTIONS = [
  { value: "-08:00", label: "UTC-8 (Pacífico)" },
  { value: "-06:00", label: "UTC-6 (Centroamérica)" },
  { value: "-05:00", label: "UTC-5 (CDMX / Bogotá)" },
  { value: "-04:00", label: "UTC-4 (Santiago)" },
  { value: "-03:00", label: "UTC-3 (Buenos Aires)" },
  { value: "+00:00", label: "UTC" },
  { value: "+01:00", label: "UTC+1 (Madrid)" },
]

export default function ReportsPage({
  savedReports,
  onDownload,
  onDelete,
  onEdit,
  showReportForm,
  showReportTypeSelector,
  reportFormType,
  onToggleReportForm,
  onReportTypeSelect,
  newReportName,
  onReportNameChange,
  reportPlatform,
  onReportPlatformChange,
  reportKeyword,
  onReportKeywordChange,
  reportDateOption,
  onReportDateOptionChange,
  reportStartDate,
  onReportStartDateChange,
  reportEndDate,
  onReportEndDateChange,
  activeKeywords,
  isReportScheduled,
  onReportScheduledChange,
  reportScheduleFrequency,
  onReportScheduleFrequencyChange,
  reportScheduleDay,
  onReportScheduleDayChange,
  reportScheduleTime,
  onReportScheduleTimeChange,
  reportScheduleTimezone,
  onReportScheduleTimezoneChange,
  reportEmailRecipients,
  reportEmailRecipientInput,
  onReportEmailRecipientInputChange,
  onReportEmailRecipientsCommit,
  onRemoveReportEmailRecipient,
  onCreateReport,
  reportMessage,
  isEditingReport,
  onCancelEdit,
}) {
  const { planId, planLoading } = useAuth()
  const handlePlatformChange = (value) => {
    onReportPlatformChange(value)
  }

  const handleScheduleFrequencyChange = (value) => {
    onReportScheduleFrequencyChange(value)

    if ((value === "weekly" || value === "biweekly") && Number(reportScheduleDay) > 7) {
      onReportScheduleDayChange("1")
    }

    if (value === "monthly" && Number(reportScheduleDay) > 31) {
      onReportScheduleDayChange("1")
    }
  }

  const handleRecipientKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      onReportEmailRecipientsCommit()
    }
  }

  const isAiReport = reportFormType === "ai"
  const isAiPlanLocked = planLoading || !planId || Number(planId) < 4

  const scheduleFrequencies = [
    { value: "weekly", label: "Semanal" },
    { value: "monthly", label: "Mensual" },
  ]

  const recipientsSection = (
    <div>
      <p className="text-sm font-medium mb-2 text-slate-300">Destinatarios del reporte</p>
      <Input
        type="email"
        value={reportEmailRecipientInput}
        onChange={(e) => onReportEmailRecipientInputChange(e.target.value)}
        onKeyDown={handleRecipientKeyDown}
        onBlur={onReportEmailRecipientsCommit}
        className="bg-slate-800/50 border-slate-700/50 text-white"
        placeholder="Escribe un correo y presiona coma o enter"
      />
      <p className="text-xs text-slate-500 mt-2">
        Puedes agregar múltiples direcciones.
      </p>
      {reportEmailRecipients.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {reportEmailRecipients.map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-2 rounded-full bg-slate-700/70 px-3 py-1 text-xs text-slate-100"
            >
              {email}
              <button
                type="button"
                onClick={() => onRemoveReportEmailRecipient(email)}
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
  )

  const scheduleSection = (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-300">Programar envío por correo</p>
          <p className="text-xs text-slate-500">Recibe el reporte automáticamente según la frecuencia seleccionada.</p>
        </div>
        <Switch checked={isReportScheduled} onCheckedChange={onReportScheduledChange} />
      </div>

      {isReportScheduled && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Frecuencia</p>
            <Select value={reportScheduleFrequency} onValueChange={handleScheduleFrequencyChange}>
              <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {scheduleFrequencies.map((frequency) => (
                  <SelectItem key={frequency.value} value={frequency.value}>
                    {frequency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(reportScheduleFrequency === "weekly" || reportScheduleFrequency === "biweekly") && (
            <div>
              <p className="text-sm font-medium mb-2 text-slate-300">
                {reportScheduleFrequency === "weekly" ? "Día de envío" : "Día de la semana"}
              </p>
              <Select value={reportScheduleDay} onValueChange={onReportScheduleDayChange}>
                <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {WEEK_DAYS.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {reportScheduleFrequency === "monthly" && (
            <div>
              <p className="text-sm font-medium mb-2 text-slate-300">Día del mes</p>
              <Select value={reportScheduleDay} onValueChange={onReportScheduleDayChange}>
                <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_DAYS.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2 text-slate-300">Hora de envío</p>
              <Select value={reportScheduleTime} onValueChange={onReportScheduleTimeChange}>
                <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_HOURS.map((hour) => (
                    <SelectItem key={hour.value} value={hour.value}>
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm font-medium mb-2 text-slate-300">Zona horaria</p>
              <Select value={reportScheduleTimezone} onValueChange={onReportScheduleTimezoneChange}>
                <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {recipientsSection}
        </div>
      )}
    </div>
  )

  return (
    <section className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
          Mis Reportes
        </h1>
        <p className="text-slate-400">Crea y gestiona tus reportes descargables y automatiza su envío por correo</p>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <ReportsTable reports={savedReports} onDownload={onDownload} onDelete={onDelete} onEdit={onEdit} />
      </div>

      <Button
        variant="outline"
        onClick={isEditingReport ? onCancelEdit : onToggleReportForm}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        {showReportForm ? <Minus className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
        {isEditingReport ? "Cancelar edición" : "Crear nuevo reporte"}
      </Button>

      {showReportTypeSelector && !showReportForm && (
        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => onReportTypeSelect("standard")}
            className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-4 text-left text-slate-200 hover:bg-slate-700/60 transition"
          >
            <p className="text-sm font-semibold text-white">Reporte estándar</p>
            <p className="text-xs text-slate-400 mt-1">Descargable y configurable con filtros completos.</p>
          </button>
          {isAiPlanLocked ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block">
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-4 text-left text-slate-500 opacity-70 cursor-not-allowed"
                    >
                      <p className="text-sm font-semibold text-slate-400">Reporte generado por IA</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Crea un informe basado en instrucciones personalizadas.
                      </p>
                    </button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>Funcionalidad exclusiva para planes Pro o superior</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              type="button"
              onClick={() => onReportTypeSelect("ai")}
              className="rounded-xl border border-purple-500/40 bg-purple-500/10 px-4 py-4 text-left text-slate-200 hover:bg-purple-500/20 transition"
            >
              <p className="text-sm font-semibold text-white">Reporte generado por IA</p>
              <p className="text-xs text-slate-400 mt-1">Crea un informe basado en instrucciones personalizadas.</p>
            </button>
          )}
        </div>
      )}

      {showReportForm && (
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">
            {isEditingReport
              ? isAiReport
                ? "Editar Reporte IA"
                : "Editar Reporte"
              : isAiReport
                ? "Nuevo Reporte IA"
                : "Nuevo Reporte"}
          </h3>

          {!isEditingReport && isAiReport && (
            <p className="text-sm text-slate-400">
              Nuestro asistente de IA analizará las menciones de la última semana y generará automáticamente un reporte
              detallado resumiendo insights y tendencias relevantes, para ser enviado por correo a los destinatarios
              que elijas cada lunes al inicio de la semana.
            </p>
          )}

          {!isAiReport && (
            <div>
              <p className="text-sm font-medium mb-2 text-slate-300">Nombre del reporte</p>
              <Input
                className="bg-slate-800/50 border-slate-700/50 text-white"
                value={newReportName}
                onChange={(e) => onReportNameChange(e.target.value)}
                placeholder="Ingresa un nombre para el reporte"
              />
            </div>
          )}

          {isAiReport ? (
            <div className="space-y-6">
              {recipientsSection}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-3 text-slate-300">Plataforma</p>
                <Select value={reportPlatform} onValueChange={handlePlatformChange}>
                  <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="reddit">Reddit</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm font-medium mb-2 text-slate-300">Palabra clave</p>
                <Select value={reportKeyword} onValueChange={onReportKeywordChange}>
                  <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {activeKeywords.map((k) => (
                      <SelectItem key={k.keyword} value={k.keyword}>
                        {k.keyword}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm font-medium mb-2 text-slate-300">Rango de fechas</p>
                <div className="space-y-3">
                  <Select value={reportDateOption} onValueChange={onReportDateOptionChange}>
                    <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="range">Rango personalizado</SelectItem>
                      <SelectItem value="7">Últimos 7 días</SelectItem>
                      <SelectItem value="15">Últimos 15 días</SelectItem>
                      <SelectItem value="30">Últimos 30 días</SelectItem>
                    </SelectContent>
                  </Select>
                  {reportDateOption === "range" && (
                    <div className="flex items-center gap-2">
                      <DatePickerInput
                        value={reportStartDate}
                        onChange={onReportStartDateChange}
                        placeholder="Desde"
                        className="w-40"
                      />
                      <span className="text-slate-400">a</span>
                      <DatePickerInput
                        value={reportEndDate}
                        onChange={onReportEndDateChange}
                        placeholder="Hasta"
                        className="w-40"
                      />
                    </div>
                  )}
                </div>
              </div>

              {scheduleSection}
            </div>
          )}

          {reportMessage?.text && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                reportMessage.type === "error"
                  ? "border-red-500/40 bg-red-500/10 text-red-200"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              }`}
              role="status"
            >
              {reportMessage.text}
            </div>
          )}

          <Button
            onClick={onCreateReport}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isEditingReport ? "Guardar cambios" : "Crear reporte"}
          </Button>
        </div>
      )}
    </section>
  )
}
