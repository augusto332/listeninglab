import { AlertTriangle, BellRing, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
  const [openMenu, setOpenMenu] = useState(null)
  const menuRefs = useRef([])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu === null) return
      const currentMenu = menuRefs.current[openMenu]
      if (currentMenu && !currentMenu.contains(event.target)) {
        setOpenMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openMenu])

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
              <th className="text-left p-4 text-slate-300 font-medium">Estado</th>
              <th className="text-right p-4 text-slate-300 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-b border-slate-700/40 last:border-b-0 group">
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
                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${
                      STATUS_STYLES[alert.status] || STATUS_STYLES.borrador
                    }`}
                  >
                    {formatStatus(alert.status)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="relative inline-flex" ref={(el) => (menuRefs.current[alert.id] = el)}>
                    <button
                      type="button"
                      onClick={() => setOpenMenu(openMenu === alert.id ? null : alert.id)}
                      className="inline-flex items-center p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                      aria-label="Opciones"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenu === alert.id && (
                      <div className="absolute right-0 top-full mt-2 w-40 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-xl z-10">
                        <button
                          type="button"
                          className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Editar
                        </button>
                        <div className="border-t border-slate-700/50 my-1"></div>
                        <button
                          type="button"
                          className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
