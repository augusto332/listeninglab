import { format, isValid } from "date-fns"
import { es } from "date-fns/locale"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Power, X } from "lucide-react"

export default function KeywordTable({ keywords, onToggle, onDelete }) {
  const handleToggle = (id, current) => {
    if (onToggle) onToggle(id, !current)
  }

  const handleDelete = async (keyword) => {
    if (!onDelete) return
    const confirmed = window.confirm("¿Estás seguro de eliminar esta keyword?")
    if (!confirmed) return
    const { error } = await onDelete(keyword)
    if (error) {
      alert(error.message || "Ocurrió un error al eliminar la keyword.")
    }
  }

  return (
    <Table className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-md text-sm">
      <TableHeader>
        <TableRow>
          <TableHead>Keyword</TableHead>
          <TableHead>Fecha de creación</TableHead>
          <TableHead>Última extracción de datos</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">
            <Power className="w-4 h-4 inline" />
          </TableHead>
          <TableHead className="text-right">
            <X className="w-4 h-4 inline" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keywords.map((k) => {
          const timestampFields = ["last_processed_at_yt", "last_processed_at_rd"]

          const dates = timestampFields
            .map((field) => k[field])
            .filter(Boolean)
            .map((value) => new Date(value))
            .filter((date) => isValid(date))

          const lastDate = dates.length > 0 ? new Date(Math.max(...dates)) : null
          return (
            <TableRow key={k.keyword_id}>
              <TableCell className="font-medium">{k.keyword}</TableCell>
              <TableCell>
                {format(new Date(k.created_at), "dd/MM/yyyy", { locale: es })}
              </TableCell>
              <TableCell>
                {lastDate && isValid(lastDate)
                  ? format(lastDate, "dd/MM/yyyy HH:mm", { locale: es })
                  : "-"}
              </TableCell>
              <TableCell>{k.active ? "Activo" : "Inactivo"}</TableCell>
              <TableCell className="text-right">
                <Switch
                  checked={k.active}
                  onCheckedChange={() => handleToggle(k.keyword_id, k.active)}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-red-400"
                  onClick={() => handleDelete(k)}
                  aria-label={`Eliminar keyword ${k.keyword}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
