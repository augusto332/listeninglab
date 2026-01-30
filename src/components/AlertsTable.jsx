import { AlertTriangle, BellRing, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"

const STATUS_STYLES = {
  activa: "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30",
  pausada: "bg-amber-500/20 text-amber-200 border border-amber-500/30",
  borrador: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
}

const ALERT_TYPE_STYLES = {
  volume: "bg-blue-500/20 text-blue-200 border border-blue-500/30",
  sentiment: "bg-purple-500/20 text-purple-200 border border-purple-500/30",
  default: "bg-slate-600/30 text-slate-200 border border-slate-500/40",
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

const formatAlertType = (alertType) => {
  switch (alertType) {
    case "volume":
      return "Volumen"
    case "sentiment":
      return "Sentimiento"
    default:
      return "Sin definir"
  }
}

const getKeywordTags = (alert, keywordMap = {}) => {
  if (alert.scope_type === "all_keywords") return ["Todas"]
  if (!alert.keyword_ids || alert.keyword_ids.length === 0) return ["Sin definir"]
  const mapped = alert.keyword_ids
    .map((id) => keywordMap[id] || keywordMap[String(id)])
    .filter(Boolean)
  return mapped.length > 0 ? mapped : ["Seleccionadas"]
}

const formatAlertDescription = (alert) => {
  switch (alert.alert_type) {
    case "volume":
      return `Se detecten ${alert.volume_threshold ?? "N/A"} menciones en ${alert.time_window_hours ?? "N/A"} h.`
    case "sentiment": {
      const sentimentLabel = alert.sentiment === "positive" ? "positivas" : "negativas"
      return `Se detecten ${alert.sentiment_threshold ?? "N/A"} menciones ${sentimentLabel} en ${
        alert.time_window_hours ?? "N/A"
      } h.`
    }
    default:
      return "Configuración personalizada."
  }
}

export default function AlertsTable({ alerts = [], keywordMap = {}, onEdit, onDelete, loading = false }) {
  const [openMenu, setOpenMenu] = useState(null)
  const [openUp, setOpenUp] = useState(false)
  const [menuRect, setMenuRect] = useState(null)
  const menuRefs = useRef([])
  const dropdownMenuRef = useRef(null)

  const closeMenu = () => {
    setOpenMenu(null)
    setMenuRect(null)
  }

  const toggleMenu = (alertId) => {
    if (openMenu === alertId) {
      closeMenu()
      return
    }
    const ref = menuRefs.current[alertId]
    if (ref) {
      const rect = ref.getBoundingClientRect()
      setMenuRect(rect)
      const menuHeight = 160
      setOpenUp(rect.bottom + menuHeight > window.innerHeight)
    }
    setOpenMenu(alertId)
  }

  useEffect(() => {
    if (openMenu === null) return

    const handleMouseDown = (event) => {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target) &&
        menuRefs.current[openMenu] &&
        !menuRefs.current[openMenu].contains(event.target)
      ) {
        closeMenu()
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu()
      }
    }

    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [openMenu])

  if (loading) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
        <BellRing className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-300 mb-2">Cargando alertas</h3>
        <p className="text-slate-500">Estamos sincronizando tu información.</p>
      </div>
    )
  }

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
      <div className="overflow-x-auto overflow-y-visible">
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
            {alerts.map((alert) => {
              const status = alert.is_active === null || alert.is_active === undefined ? "borrador" : alert.is_active
                ? "activa"
                : "pausada"
              return (
              <tr key={alert.id} className="border-b border-slate-700/40 last:border-b-0 group">
                <td className="p-4 text-slate-100">
                  <div className="font-medium">{alert.name}</div>
                  <p className="text-xs text-slate-500 mt-1">{formatAlertDescription(alert)}</p>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${
                      ALERT_TYPE_STYLES[alert.alert_type] || ALERT_TYPE_STYLES.default
                    }`}
                  >
                    {formatAlertType(alert.alert_type)}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${
                      PLATFORM_STYLES[alert.platform] || PLATFORM_STYLES.all
                    }`}
                  >
                    {formatPlatform(alert.platform)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {getKeywordTags(alert, keywordMap).map((keyword) => (
                      <span
                        key={`${alert.id}-${keyword}`}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-slate-600/50 text-slate-300 bg-slate-700/30"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${
                      STATUS_STYLES[status] || STATUS_STYLES.borrador
                    }`}
                  >
                    {formatStatus(status)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="relative inline-flex" ref={(el) => (menuRefs.current[alert.id] = el)}>
                    <button
                      type="button"
                      onClick={() => toggleMenu(alert.id)}
                      className="inline-flex items-center p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                      aria-label="Opciones"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenu === alert.id &&
                      menuRect &&
                      ReactDOM.createPortal(
                        <div
                          className="fixed z-50"
                          style={{
                            top: menuRect.top,
                            left: menuRect.left,
                            width: menuRect.width,
                            height: menuRect.height,
                          }}
                        >
                          <div
                            ref={dropdownMenuRef}
                            className={`absolute right-0 w-40 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-xl ${
                              openUp ? "bottom-full mb-2" : "top-full mt-2"
                            }`}
                          >
                            <button
                              type="button"
                              className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                              onClick={() => {
                                closeMenu()
                                if (onEdit) onEdit(alert)
                              }}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Editar
                            </button>
                            <div className="border-t border-slate-700/50 my-1"></div>
                            <button
                              type="button"
                              className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                              onClick={() => {
                                closeMenu()
                                if (onDelete) onDelete(alert)
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </button>
                          </div>
                        </div>,
                        document.body,
                      )}
                  </div>
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
