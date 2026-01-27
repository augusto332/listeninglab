import { AlertTriangle, Calendar, BellRing } from "lucide-react"

const STATUS_STYLES = {
  activa: "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30",
  pausada: "bg-amber-500/20 text-amber-200 border border-amber-500/30",
  borrador: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
}

const PLATFORM_STYLES = {
  youtube: "bg-red-500/20 text-red-300 border border-red-500/30",
  reddit: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  twitter: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  tiktok: "bg-slate-900/50 text-cyan-300 border border-slate-600/60",
  instagram: "bg-pink-500/20 text-pink-200 border border-pink-500/30",
  all: "bg-slate-600/30 text-slate-200 border border-slate-500/40",
}

const formatPlatform = (platform) => {
  if (!platform) return "Sin definir"
  if (platform === "all") return "Todas"
  return platform.charAt(0).toUpperCase() + platform.slice(1)
}

const formatStatus = (status) => status?.charAt(0).toUpperCase() + status?.slice(1)

export default function AlertsTable({ alerts = [] }) {
  if (alerts.length === 0) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
        <BellRing className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-300 mb-2">No hay alertas</h3>
        <p className="text-slate-500">Crea tu primera alerta para monitorear cambios importantes</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-800/50">
              <th className="text-left p-4 text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Alerta
                </div>
              </th>
              <th className="text-left p-4 text-slate-300 font-medium">Tipo</th>
              <th className="text-left p-4 text-slate-300 font-medium">Plataforma</th>
              <th className="text-left p-4 text-slate-300 font-medium">Palabra clave</th>
              <th className="text-left p-4 text-slate-300 font-medium">Frecuencia</th>
              <th className="text-left p-4 text-slate-300 font-medium">Estado</th>
              <th className="text-left p-4 text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Última actualización
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-b border-slate-700/40 last:border-b-0">
                <td className="p-4 text-slate-100">
                  <div className="font-medium">{alert.name}</div>
                  <p className="text-xs text-slate-500 mt-1">{alert.description}</p>
                </td>
                <td className="p-4 text-slate-300">{alert.type}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${
                      PLATFORM_STYLES[alert.platform] || PLATFORM_STYLES.all
                    }`}
                  >
                    {formatPlatform(alert.platform)}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{alert.keyword}</td>
                <td className="p-4 text-slate-300">{alert.frequency}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${
                      STATUS_STYLES[alert.status] || STATUS_STYLES.borrador
                    }`}
                  >
                    {formatStatus(alert.status)}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{alert.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
