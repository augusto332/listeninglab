import { Minus, Plus, X } from "lucide-react"
import DatePickerInput from "@/components/DatePickerInput"
import ReportsTable from "@/components/ReportsTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/context/AuthContext"

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

  const handleRecipientKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      onReportEmailRecipientsCommit()
    }
  }

  const isAiReport = reportFormType === "ai"
  const isAiPlanLocked = planLoading || !planId || Number(planId) < 4

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
