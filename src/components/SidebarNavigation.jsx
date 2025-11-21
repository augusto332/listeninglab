import { NavLink } from "react-router-dom"
import { Home, BarChart2, FileLineChartIcon as FileChartLine, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SidebarNavigation({ currentTab, onTabSelect, onConfigNavigate, isAdmin }) {
  return (
    <>
      <nav className="space-y-1">
        <button
          onClick={() => onTabSelect("home")}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
            currentTab === "home"
              ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50",
          )}
        >
          <Home className="w-4 h-4" />
          Inicio
        </button>

        <button
          onClick={() => onTabSelect("dashboard")}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
            currentTab === "dashboard"
              ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50",
          )}
        >
          <BarChart2 className="w-4 h-4" />
          Dashboard
        </button>

        <button
          onClick={() => onTabSelect("reportes")}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
            currentTab === "reportes"
              ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50",
          )}
        >
          <FileChartLine className="w-4 h-4" />
          Reportes
        </button>
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
          onClick={onConfigNavigate}
        >
          <Settings className="w-4 h-4" />
          Configuración
        </NavLink>
      )}
    </>
  )
}
