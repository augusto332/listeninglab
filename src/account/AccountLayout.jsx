import { useEffect, useMemo, useRef, useState } from "react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabaseClient"
import { CircleHelp, CircleUser, CreditCard, Headset, Menu, Shield, Users, X } from "lucide-react"
import RightSidebar from "@/components/RightSidebar"

const menuItems = [
  { id: "profile", title: "Perfil", path: "/app/account/profile", icon: CircleUser },
  { id: "security", title: "Seguridad", path: "/app/account/security", icon: Shield },
  { id: "plan", title: "Plan y Facturación", path: "/app/account/plan", icon: CreditCard },
  { id: "team", title: "Gestionar equipo", path: "/app/account/team", icon: Users },
]

export default function AccountLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, role } = useAuth()
  const avatarDisplayName = user?.user_metadata?.display_name || user?.email || ""
  const avatarLabel = avatarDisplayName ? avatarDisplayName.charAt(0).toUpperCase() : "U"
  const isAdmin = role?.toLowerCase?.() === "admin"
  const [menuOpen, setMenuOpen] = useState(false)
  const [helpMenuOpen, setHelpMenuOpen] = useState(false)
  const [isAccountSidebarOpen, setIsAccountSidebarOpen] = useState(false)
  const helpMenuRef = useRef(null)
  const userMenuRef = useRef(null)

  const visibleMenuItems = useMemo(() => {
    if (isAdmin) return menuItems
    return menuItems.filter((item) => item.id !== "plan" && item.id !== "team")
  }, [isAdmin])

  const pathname = location?.pathname ?? ""
  const currentItem = visibleMenuItems.find((item) => pathname.includes(item.path))

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target)) {
        setHelpMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
    setHelpMenuOpen(false)
    navigate("/login")
  }

  const handleLogoClick = () => {
    setMenuOpen(false)
    setHelpMenuOpen(false)
    navigate("/app/mentions")
  }

  const renderSidebarContent = (onItemSelect) => (
    <nav className="space-y-1 flex-1">
      {visibleMenuItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50",
              )
            }
            onClick={onItemSelect}
          >
            <Icon className="w-4 h-4" />
            {item.title}
          </NavLink>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.05), transparent 25%), radial-gradient(circle at 80% 0%, rgba(168,85,247,0.05), transparent 25%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(120deg, rgba(59,130,246,0.07), rgba(168,85,247,0.05))", opacity: 0.4 }} />
      </div>

      <div className="relative">
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800 shadow-lg shadow-blue-500/5">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogoClick}
                className="p-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 text-blue-200 hover:from-blue-500/20 hover:to-purple-600/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  LL
                </div>
              </button>
              <div>
                <p className="text-lg font-semibold text-white">Mi cuenta</p>
                <p className="text-sm text-slate-400">Configura tu perfil y preferencias</p>
              </div>
            </div>

            <div className="flex items-center gap-2" ref={helpMenuRef}>
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setHelpMenuOpen((prev) => !prev)
                    setMenuOpen(false)
                  }}
                  className="text-slate-300 hover:text-white"
                >
                  <CircleHelp className="w-4 h-4" />
                </Button>
                {helpMenuOpen && (
                  <div className="absolute right-28 top-14 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-xl rounded-lg p-2 space-y-1 z-50 min-w-[210px]">
                    <button
                      onClick={() => {
                        setHelpMenuOpen(false)
                        navigate("/app/support")
                      }}
                      className="flex items-center gap-3 w-full text-left p-3 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                    >
                      <Headset className="w-4 h-4" />
                      Solicitar soporte
                    </button>
                  </div>
                )}
              </div>

              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMenuOpen((prev) => !prev)
                    setHelpMenuOpen(false)
                  }}
                  className="flex items-center gap-2 text-slate-300 hover:text-white"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarImage src="/placeholder.svg?height=28&width=28" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                      {avatarLabel}
                    </AvatarFallback>
                  </Avatar>
                  <CircleUser className="w-4 h-4" />
                </Button>

                {menuOpen && (
                  <div className="absolute right-0 top-12 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-xl rounded-lg p-2 space-y-1 z-50 min-w-[180px]">
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                      }}
                      className="flex items-center gap-3 w-full text-left p-3 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                    >
                      <CircleUser className="w-4 h-4" />
                      Mi Cuenta
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left p-3 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                    >
                      <CircleUser className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsAccountSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                aria-label="Abrir menú de Mi Cuenta"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {isAccountSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setIsAccountSidebarOpen(false)} />
            <div className="relative ml-0 flex h-full">
              <div
                className="relative h-full w-72 max-w-[80vw] bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 p-6 flex flex-col space-y-2 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Mi Cuenta</h2>
                  <button
                    type="button"
                    onClick={() => setIsAccountSidebarOpen(false)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    aria-label="Cerrar menú de Mi Cuenta"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {renderSidebarContent(() => setIsAccountSidebarOpen(false))}
              </div>
            </div>
          </div>
        )}

        <div className="flex">
          <aside className="hidden lg:flex w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 p-6 flex-col space-y-2 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            {renderSidebarContent()}
          </aside>

          <main className="flex-1 p-8">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                  {currentItem?.title || "Mi Cuenta"}
                </h1>
                <p className="text-slate-400">Gestiona la configuración de tu cuenta</p>
              </div>
              <Outlet />
            </div>
          </main>

          <RightSidebar onOpenSupport={() => navigate("/app/support")} />
        </div>
      </div>
    </div>
  )
}
