import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertCircle, Bell, CreditCard, MessageSquare } from "lucide-react"

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  const notifications = useMemo(
    () => [
      {
        id: 1,
        type: "payment",
        title: "Pago procesado",
        description: "Tu suscripción Pro se renovó correctamente.",
        timestamp: "Hace 2h",
        unread: true,
      },
      {
        id: 2,
        type: "system",
        title: "Actualización del sistema",
        description: "Nuevo dashboard de reportes disponible.",
        timestamp: "Hace 5h",
        unread: true,
      },
      {
        id: 3,
        type: "mention",
        title: "Nueva mención",
        description: "Se detectó una mención en Twitter sobre tu marca.",
        timestamp: "Ayer",
        unread: false,
      },
    ],
    []
  )

  const unreadCount = notifications.filter((notification) => notification.unread).length

  const getNotificationIcon = (type) => {
    const iconClasses = "w-4 h-4"
    switch (type) {
      case "payment":
        return <CreditCard className={iconClasses} />
      case "system":
        return <AlertCircle className={iconClasses} />
      case "mention":
      default:
        return <MessageSquare className={iconClasses} />
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="text-slate-300 hover:text-white relative"
        aria-label="Abrir notificaciones"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-[11px] font-semibold text-white flex items-center justify-center shadow-lg">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-12 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-xl p-3 space-y-3 z-50 min-w-[320px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Notificaciones</p>
              <p className="text-xs text-slate-400">Mantente al día</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs bg-white/5 text-slate-200 hover:bg-white/10"
            >
              Marcar todas como leídas
            </Button>
          </div>

          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex gap-3 p-3 rounded-lg border transition-colors",
                  notification.unread
                    ? "border-blue-500/30 bg-blue-500/5"
                    : "border-slate-700/60 bg-slate-800/60 hover:bg-slate-800"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center",
                    notification.unread
                      ? "bg-blue-500/20 text-blue-200"
                      : "bg-slate-700/50 text-slate-200"
                  )}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-white leading-tight">
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <span className="mt-0.5 inline-flex w-2 h-2 rounded-full bg-blue-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{notification.description}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{notification.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
