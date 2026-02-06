import logo from "@/assets/logo.png"
import { useEffect, useMemo, useRef, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  User,
  Shield,
  CreditCard,
  Users,
  CircleHelp,
  Headset,
  ChevronDown,
  CircleUser,
  LogOut,
  Menu,
  X,
} from "lucide-react"

const sectionRoutes = {
  profile: "/account/profile",
  security: "/account/security",
  plan: "/account/plan",
  team: "/account/team",
}

export default function AccountLayout() {
  const { user, role, planId, planLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = role?.toLowerCase?.() === "admin"
  const canManageTeam = isAdmin && !planLoading && Number(planId) >= 3
  const avatarDisplayName = user?.user_metadata?.display_name || user?.email || ""
  const avatarLabel = avatarDisplayName ? avatarDisplayName.charAt(0).toUpperCase() : "U"
  const [menuOpen, setMenuOpen] = useState(false)
  const [helpMenuOpen, setHelpMenuOpen] = useState(false)
  const helpMenuRef = useRef(null)
  const userMenuRef = useRef(null)
  const [isAccountSidebarOpen, setIsAccountSidebarOpen] = useState(false)

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

  const openAccountSidebar = () => setIsAccountSidebarOpen(true)
  const closeAccountSidebar = () => setIsAccountSidebarOpen(false)

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

  const menuItems = useMemo(() => {
    const baseItems = [
      {
        id: "profile",
        title: "Mi Perfil",
        icon: User,
      },
      {
        id: "security",
        title: "Seguridad",
        icon: Shield,
      },
      {
        id: "plan",
        title: "Plan y Facturación",
        icon: CreditCard,
      },
    ]

    const items = canManageTeam
      ? [
          ...baseItems,
          {
            id: "team",
            title: "Gestionar equipo",
            icon: Users,
          },
        ]
      : baseItems

    if (isAdmin) {
      return items
    }

    return items.filter((item) => item.id !== "plan")
  }, [canManageTeam, isAdmin])

  const activeSection = location.pathname.split("/")[2] || "profile"

  useEffect(() => {
    if (!isAdmin && activeSection === "plan") {
      navigate(sectionRoutes.profile, { replace: true })
      return
    }

    if (activeSection === "team" && !canManageTeam) {
      navigate(sectionRoutes.profile, { replace: true })
    }
  }, [activeSection, canManageTeam, isAdmin, navigate])

  const renderSidebarContent = (onItemSelect) => (
    <nav className="space-y-1 flex-1">
      {menuItems.map((item) => {
        const Icon = item.icon
        const handleClick = () => {
          navigate(sectionRoutes[item.id])
          if (onItemSelect) {
            onItemSelect()
          }
        }

        return (
          <button
            key={item.id}
            onClick={handleClick}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              activeSection === item.id
                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50",
            )}
          >
            <Icon className="w-4 h-4" />
            {item.title}
          </button>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg transition-all duration-200 hover:opacity-80"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <img src={logo} alt="Listening Lab" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Listening Lab
            </span>
          </button>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                openAccountSidebar()
                setMenuOpen(false)
                setHelpMenuOpen(false)
              }}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700/60 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
              aria-label="Abrir menú de Mi Cuenta"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative" ref={helpMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setHelpMenuOpen((prev) => !prev)
                  setMenuOpen(false)
                }}
                className="text-slate-300 hover:text-white"
              >
                <CircleHelp className="w-4 h-4" />
              </Button>
              {helpMenuOpen && (
                <div className="absolute right-0 top-12 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-xl rounded-lg p-2 space-y-1 z-50 min-w-[210px]">
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
                <ChevronDown className="w-4 h-4" />
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
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isAccountSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={closeAccountSidebar} />
          <div className="relative ml-0 flex h-full">
            <div
              className="relative h-full w-72 max-w-[80vw] bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 p-6 flex flex-col space-y-2 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Mi Cuenta</h2>
                <button
                  type="button"
                  onClick={closeAccountSidebar}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                  aria-label="Cerrar menú de Mi Cuenta"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {renderSidebarContent(closeAccountSidebar)}
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
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
