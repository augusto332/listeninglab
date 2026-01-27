import { NavLink } from "react-router-dom"
import { Home, BarChart2, FileLineChartIcon as FileChartLine, Bell, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SidebarNavigation({ onMentionsNavigate, onNavigate, isAdmin }) {
  return (
    <>
      <nav className="space-y-1">
        <NavLink
          to="/app/mentions"
          className={({ isActive }) =>
            cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50",
            )
          }
          onClick={onMentionsNavigate}
        >
          <Home className="w-4 h-4" />
          Inicio
        </NavLink>

        <NavLink
          to="/app/dashboard"
          className={({ isActive }) =>
            cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50",
            )
          }
          onClick={onNavigate}
        >
          <BarChart2 className="w-4 h-4" />
          Dashboard
        </NavLink>

        <NavLink
          to="/app/reportes"
          className={({ isActive }) =>
            cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50",
            )
          }
          onClick={onNavigate}
        >
          <FileChartLine className="w-4 h-4" />
          Reportes
        </NavLink>

        <NavLink
          to="/app/alertas"
          className={({ isActive }) =>
            cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50",
            )
          }
          onClick={onNavigate}
        >
          <Bell className="w-4 h-4" />
          Alertas
        </NavLink>
      </nav>

      <div className="flex-1" />

      {isAdmin && (
        <NavLink
          to="/app/config"
          className={({ isActive }) =>
            cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50",
            )
          }
          onClick={onNavigate}
        >
          <Settings className="w-4 h-4" />
          Configuración
        </NavLink>
      )}
    </>
  )
}
