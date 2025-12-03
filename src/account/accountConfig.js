import { CircleUser, Shield, Sparkles, TrendingUp, User } from "lucide-react"

export const planConfig = {
  free: {
    label: "Plan Gratuito",
    color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    icon: User,
  },
  basic: {
    label: "Plan Básico",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: CircleUser,
  },
  pro: {
    label: "Plan Pro",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: Sparkles,
  },
  enterprise: {
    label: "Plan Enterprise",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: TrendingUp,
  },
}

export const roleConfig = {
  admin: {
    label: "Administrador",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: Shield,
  },
  contributor: {
    label: "Colaborador",
    color: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    icon: CircleUser,
  },
}
