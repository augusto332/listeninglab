import { Button } from "@/components/ui/button"

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{message}</p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" className="text-slate-200" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button onClick={onConfirm}>{confirmLabel}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
