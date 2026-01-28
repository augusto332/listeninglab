import { HelpCircle, Plus } from "lucide-react"
import { useState } from "react"
import AlertsTable from "@/components/AlertsTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const SAMPLE_ALERTS = [
  {
    id: 1,
    name: "Pico de menciones negativas",
    description: "Aviso cuando el sentimiento negativo supera el 35%.",
    type: "Sentimiento",
    platform: "twitter",
    keyword: "Marca X",
    status: "activa",
  },
  {
    id: 2,
    name: "Incremento repentino de volumen",
    description: "Seguimiento automático de menciones por hora.",
    type: "Volumen",
    platform: "instagram",
    keyword: "Campaña Verano",
    status: "pausada",
  },
  {
    id: 3,
    name: "Contenido con alto alcance",
    description: "Detecta publicaciones con alcance alto en tiempo real.",
    type: "Alcance",
    platform: "all",
    keyword: "Producto Z",
    status: "borrador",
  },
]

export default function AlertsPage() {
  const [alertType, setAlertType] = useState("volume")
  const [sentimentType, setSentimentType] = useState("negativas")
  const [keywordTrigger, setKeywordTrigger] = useState("once")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

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
            placeholder="Ej: Pico de sentimiento negativo"
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
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
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
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium text-slate-300">Tipo de alerta</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-slate-400 hover:text-slate-200">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs text-slate-200 bg-slate-900/95 border border-slate-700/70">
                    <div className="space-y-2">
                      <p>
                        Volumen de menciones: Se activa cuando el volumen de menciones supera un umbral definido en un
                        período de tiempo.
                      </p>
                      <p>
                        Sentimiento: Se activa cuando se detecta una cantidad definida de menciones positivas o
                        negativas.
                      </p>
                      <p>
                        Keyword crítica: Se activa cuando aparecen palabras o frases sensibles definidas por el
                        usuario.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Volumen de menciones</SelectItem>
                <SelectItem value="sentiment">Sentimiento</SelectItem>
                <SelectItem value="critical">Keyword crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-slate-300">Frecuencia de notificación</p>
            <Select defaultValue="instant">
              <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Inmediata</SelectItem>
                <SelectItem value="daily">Máximo una vez cada 24 horas</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-2">
              Útil para evitar recibir múltiples correos por el mismo evento.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-4 space-y-3">
            <p className="text-sm font-medium text-slate-300">Condición de activación</p>
            {alertType === "volume" && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                <span>Se detecten</span>
                <Input
                  type="number"
                  className="w-24 bg-slate-800/60 border-slate-700/50 text-white"
                  placeholder="50"
                />
                <span>menciones en</span>
                <Select defaultValue="24">
                  <SelectTrigger className="w-28 bg-slate-800/60 border-slate-700/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="6">6 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {alertType === "sentiment" && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                <span>Se detecten</span>
                <Input
                  type="number"
                  className="w-24 bg-slate-800/60 border-slate-700/50 text-white"
                  placeholder="10"
                />
                <span>menciones</span>
                <Select value={sentimentType} onValueChange={setSentimentType}>
                  <SelectTrigger className="w-32 bg-slate-800/60 border-slate-700/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negativas">Negativas</SelectItem>
                    <SelectItem value="positivas">Positivas</SelectItem>
                  </SelectContent>
                </Select>
                <span>en</span>
                <Select defaultValue="24">
                  <SelectTrigger className="w-28 bg-slate-800/60 border-slate-700/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="6">6 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {alertType === "critical" && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2 text-slate-300">Palabras o frases críticas</p>
                  <textarea
                    className="w-full rounded-md bg-slate-800/50 border border-slate-700/50 text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    placeholder="Ej: estafa, fraude, denuncia"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2 text-slate-300">Tipo de coincidencia</p>
                    <Select defaultValue="contains">
                      <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Contiene</SelectItem>
                        <SelectItem value="exact">Exacta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2 text-slate-300">Disparo de alerta</p>
                    <Select value={keywordTrigger} onValueChange={setKeywordTrigger}>
                      <SelectTrigger className="w-full bg-slate-800/50 border-slate-700/50 text-white">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Al menos una vez</SelectItem>
                        <SelectItem value="count">Cantidad específica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {keywordTrigger === "count" && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-slate-300">Cantidad mínima de apariciones</p>
                    <Input
                      type="number"
                      className="bg-slate-800/50 border-slate-700/50 text-white"
                      placeholder="Ej: 3"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 px-4 py-3">
            <p className="text-sm text-slate-400">
              Esta alerta se disparará cuando se cumpla la condición configurada.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-300">Activar notificaciones</p>
              <p className="text-xs text-slate-500">Recibe avisos por correo cuando la alerta se dispare.</p>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>

          {notificationsEnabled && (
            <div>
              <p className="text-sm font-medium mb-2 text-slate-300">Destinatarios</p>
              <Input
                className="bg-slate-800/50 border-slate-700/50 text-white"
                placeholder="correo@empresa.com"
              />
              <p className="text-xs text-slate-500 mt-2">Agrega múltiples correos separados por coma.</p>
            </div>
          )}
        </div>

        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          Guardar alerta
        </Button>
      </div>
    </section>
  )
}
