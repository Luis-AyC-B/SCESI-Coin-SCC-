import type { Me, Rango } from '@/types'

export type RankStatus = 'TU RANGO' | 'OBTENIDO' | 'DISPONIBLE' | 'SIGUIENTE' | 'BLOQUEADO'

export function rankStatus(rango: Rango, me: Me): RankStatus {
  if (rango.orden === me.rango.orden) return 'TU RANGO'
  if (rango.orden < me.rango.orden) return 'OBTENIDO'
  if (rango.orden === me.rango.orden + 1) {
    return me.scc >= rango.scc_requeridos ? 'DISPONIBLE' : 'SIGUIENTE'
  }
  return 'BLOQUEADO'
}
