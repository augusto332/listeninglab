import { useCallback, useEffect, useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/AuthContext"
import { AlertCircle, Bell, CreditCard, MessageSquare } from "lucide-react"

export default function NotificationsMenu({ isEnabled = true }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const [notifications, setNotifications] = useState([])
  const { user, accountId } = useAuth()

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

  const formatTimestamp = (value) => {
    if (!value) return ""
    return formatDistanceToNow(new Date(value), { addSuffix: true, locale: es })
  }

  const fetchNotifications = useCallback(async () => {
    if (!isEnabled || !user) {
      setNotifications([])
      return
    }

    let query = supabase
      .from("notifications")
      .select("id, account_id, user_id, type, title, body, meta, is_read, created_at")
      .order("created_at", { ascending: false })

    if (accountId) {
      query = query.eq("account_id", accountId)
    } else {
      query = query.eq("user_id", user.id)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching notifications", error)
      return
    }

    setNotifications(data ?? [])
  }, [accountId, isEnabled, user])

  useEffect(() => {
    if (!isEnabled) {
      setOpen(false)
      setNotifications([])
      return
    }

    fetchNotifications()
  }, [fetchNotifications, isEnabled])

  const unreadCount = notifications.filter((notification) => !notification.is_read).length

  const handleMarkAsRead = async (notificationId) => {
    const target = notifications.find((notification) => notification.id === notificationId)
    if (!target || target.is_read) return

    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, is_read: true } : notification
      )
    )

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)

    if (error) {
      console.error("Error marking notification as read", error)
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: false } : notification
        )
      )
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!notifications.length) return

    const previousNotifications = notifications.map((notification) => ({ ...notification }))

    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, is_read: true }))
    )

    let query = supabase.from("notifications").update({ is_read: true })

    if (accountId) {
      query = query.eq("account_id", accountId)
    } else if (user) {
      query = query.eq("user_id", user.id)
    }

    const { error } = await query

    if (error) {
      console.error("Error marking all notifications as read", error)
      setNotifications(previousNotifications)
    }
  }

  const handleToggleMenu = () => {
    if (!isEnabled) {
      return
    }

    const nextOpen = !open
    setOpen(nextOpen)
    if (!open) {
      fetchNotifications()
    }
  }

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
        onClick={handleToggleMenu}
        disabled={!isEnabled}
        className={cn(
          "relative",
          isEnabled
            ? "text-slate-300 hover:text-white"
            : "text-slate-500 opacity-60 cursor-not-allowed hover:text-slate-500"
        )}
        aria-label="Abrir notificaciones"
        aria-disabled={!isEnabled}
      >
        <Bell className="w-4 h-4" />
        {isEnabled && unreadCount > 0 && (
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
              onClick={handleMarkAllAsRead}
            >
              Marcar todas como leídas
            </Button>
          </div>

          <div className="space-y-2">
            {notifications.map((notification) => {
              const unread = !notification.is_read
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 p-3 rounded-lg border transition-colors",
                    unread
                      ? "border-blue-500/30 bg-blue-500/5"
                      : "border-slate-700/60 bg-slate-800/60 hover:bg-slate-800"
                  )}
                  onClick={() => handleMarkAsRead(notification.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      handleMarkAsRead(notification.id)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center",
                      unread
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
                      {unread && (
                        <span className="mt-0.5 inline-flex w-2 h-2 rounded-full bg-blue-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{notification.body}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {formatTimestamp(notification.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
