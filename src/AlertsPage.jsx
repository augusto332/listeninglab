import { Plus } from "lucide-react"
import AlertsTable from "@/components/AlertsTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const SAMPLE_ALERTS = [
  {
    id: 1,
    name: "Pico de menciones negativas",
    description: "Aviso cuando el sentimiento negativo supera el 35%.",
    type: "Sentimiento",
    platform: "twitter",
    keyword: "Marca X",
    frequency: "Inmediata",
    status: "activa",
    updatedAt: "Hoy",
  },
  {
    id: 2,
    name: "Incremento repentino de volumen",
    description: "Seguimiento automático de menciones por hora.",
    type: "Volumen",
    platform: "instagram",
    keyword: "Campaña Verano",
    frequency: "Cada 2 horas",
    status: "pausada",
    updatedAt: "Ayer",
  },
  {
    id: 3,
    name: "Contenido con alto alcance",
    description: "Detecta publicaciones con alcance alto en tiempo real.",
    type: "Alcance",
    platform: "all",
    keyword: "Producto Z",
    frequency: "Diaria",
    status: "borrador",
    updatedAt: "Hace 3 días",
  },
]

export default function AlertsPage() {
  return (
    <section className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
          Mis Alertas
        </h1>
        <p className="text-slate-400">Crea alertas personalizadas y recibe avisos cuando ocurra lo importante.</p>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <AlertsTable alerts={SAMPLE_ALERTS} />
      </div>

      <Button
        type="button"
        variant="outline"
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Crear nueva alerta
      </Button>

      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Nueva alerta</h3>
        <p className="text-sm text-slate-400">
          Configura los criterios y canales de notificación. Próximamente podrás activar reglas automáticas.
        </p>

        <div>
          <p className="text-sm font-medium mb-2 text-slate-300">Nombre de la alerta</p>
          <Input
            className="bg-slate-800/50 border-slate-700/50 text-white"
            placeholder="Ej: Alerta de crisis en redes"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Plataforma</p>
            <Select defaultValue="all">
              <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Palabra clave</p>
            <Select defaultValue="all">
              <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="marca-x">Marca X</SelectItem>
                <SelectItem value="producto-z">Producto Z</SelectItem>
                <SelectItem value="campana-verano">Campaña Verano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Tipo de alerta</p>
            <Select defaultValue="sentiment">
              <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sentiment">Sentimiento negativo</SelectItem>
                <SelectItem value="volume">Pico de volumen</SelectItem>
                <SelectItem value="reach">Alcance alto</SelectItem>
                <SelectItem value="trend">Tendencia emergente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Frecuencia</p>
            <Select defaultValue="instant">
              <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Inmediata</SelectItem>
                <SelectItem value="hourly">Cada 2 horas</SelectItem>
                <SelectItem value="daily">Diaria</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2 text-slate-300">Mensaje de la alerta</p>
          <textarea
            className="w-full rounded-md bg-slate-800/50 border border-slate-700/50 text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            placeholder="Describe la situación que quieres monitorear..."
            rows={4}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-300">Activar notificaciones</p>
              <p className="text-xs text-slate-500">Recibe avisos por correo cuando la alerta se dispare.</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Destinatarios</p>
            <Input
              className="bg-slate-800/50 border-slate-700/50 text-white"
              placeholder="correo@empresa.com"
            />
            <p className="text-xs text-slate-500 mt-2">Agrega múltiples correos separados por coma.</p>
          </div>
        </div>

        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          Guardar alerta
        </Button>
      </div>
    </section>
  )
}
