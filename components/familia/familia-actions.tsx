"use client"

import { Familia } from "@/lib/types"
import { EditarFamiliaDialog } from "@/components/dialogs/editar-familia-dialog"
import { EliminarFamiliaDialog } from "@/components/dialogs/eliminar-familia-dialog"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"

interface FamiliaActionsProps {
  familia: Familia
  esCreador: boolean
  onFamiliaActualizada?: () => void
  onFamiliaEliminada?: () => void
}

export function FamiliaActions({
  familia,
  esCreador,
  onFamiliaActualizada,
  onFamiliaEliminada,
}: FamiliaActionsProps) {
  // Si no es creador, no mostrar nada
  if (!esCreador) {
    return null
  }

  // Mostrar botones siempre, sin dropdown
  return (
    <div className="flex items-center gap-1">
      <EditarFamiliaDialog
        familia={familia}
        onSuccess={onFamiliaActualizada}
        trigger={
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-primary/10"
            title="Editar nombre"
          >
            <Edit2 className="w-4 h-4 text-primary" />
          </Button>
        }
      />

      <EliminarFamiliaDialog
        familia={familia}
        trigger={
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-destructive/10"
            title="Eliminar familia"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        }
      />
    </div>
  )
}
