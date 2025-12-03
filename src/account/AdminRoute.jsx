import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function AdminRoute({ children }) {
  const { role, loading } = useAuth()
  const isAdmin = role?.toLowerCase?.() === "admin"

  if (loading) return null
  if (!isAdmin) return <Navigate to="/app/account/profile" replace />

  return children
}
