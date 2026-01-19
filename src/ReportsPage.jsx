import { Minus, Plus } from "lucide-react"
import DatePickerInput from "@/components/DatePickerInput"
import ReportsTable from "@/components/ReportsTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

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
  showReportForm,
  onToggleReportForm,
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
  onCreateReport,
}) {
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

  return (
    <section className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
          Mis Reportes
        </h1>
        <p className="text-slate-400">Crea y gestiona tus reportes descargables y automatiza su envío por correo</p>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <ReportsTable reports={savedReports} onDownload={onDownload} onDelete={onDelete} />
      </div>

      <Button
        variant="outline"
        onClick={onToggleReportForm}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        {showReportForm ? <Minus className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
        Crear nuevo reporte
      </Button>

      {showReportForm && (
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Nuevo Reporte</h3>

          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Nombre del reporte</p>
            <Input
              className="bg-slate-800/50 border-slate-700/50 text-white"
              value={newReportName}
              onChange={(e) => onReportNameChange(e.target.value)}
              placeholder="Ingresa un nombre para el reporte"
            />
          </div>

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
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="biweekly">Cada dos semanas</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
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
                    <Input
                      type="time"
                      value={reportScheduleTime}
                      onChange={(e) => onReportScheduleTimeChange(e.target.value)}
                      className="bg-slate-800/50 border-slate-700/50 text-white"
                    />
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
              </div>
            )}
          </div>

          <Button
            onClick={onCreateReport}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Crear reporte
          </Button>
        </div>
      )}
    </section>
  )
}
