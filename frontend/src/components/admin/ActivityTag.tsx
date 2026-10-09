import { ACTIVITY_SHORT } from '@/lib/activities'
import type { Actividad } from '@/types'

export default function ActivityTag({ actividad }: { actividad: Actividad }) {
  return (
    <span className="bg-divider text-ink rounded px-2 py-0.5 text-[13px]">
      {ACTIVITY_SHORT[actividad.abreviatura] ?? actividad.nombre}
    </span>
  )
}
