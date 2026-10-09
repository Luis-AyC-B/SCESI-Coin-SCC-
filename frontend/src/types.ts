export type Rol = 'MIEMBRO' | 'DIRECTIVA'
export type EstadoPeticion = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'
export type TipoMovimiento = 'EMISIÓN' | 'PREMIO' | 'PENDIENTE' | 'RECHAZADA'

export interface Actividad {
  codigo: string
  nombre: string
  abreviatura: string
  scc_sugeridos: number
}

export interface Rango {
  codigo: string
  nombre: string
  scc_requeridos: number
  prerequisito: string | null
  orden: number
}

export interface ConteoActividad {
  actividad: Actividad
  cantidad: number
}

export interface Me {
  handle: string
  nombre: string
  area: string
  rol: Rol
  wallet: string
  scc: number // total acumulado (define el rango)
  sccGestion: number // ganado en la gestión actual (define la posición)
  rango: Rango
  siguienteRango: Rango | null
  posicion: number
  conteos: ConteoActividad[]
}

export interface Movimiento {
  id: string
  fecha: string // ISO yyyy-mm-dd
  tipo: TipoMovimiento
  detalle: string
  monto: number | null
}

export interface NuevaPeticion {
  actividad: string
  fecha: string
  titulo: string
  evidencia: string
}

export interface PremioReclamado {
  rango: Rango
  fecha: string
}

export interface RankingMiembro {
  posicion: number
  handle: string
  nombre: string
  area: string
  rango: Rango
  conteos: Record<string, number> // por abreviatura, en la gestión actual
  scc: number // ganado en la gestión actual
  deltaSemana: number
  serie: number[] // acumulado al cierre de cada mes de la gestión
  esYo: boolean
}

export interface RankingArea {
  posicion: number
  area: string
  miembros: number
  scc: number
  promedio: number
  deltaMes: number
  serie: number[]
  esMiArea: boolean
}

export interface Ranking<T> {
  meses: string[] // "Mar", "Abr", …
  filas: T[]
}

export interface Miembro {
  handle: string
  nombre: string
  area: string
  wallet: string
}

export interface PeticionPendiente {
  id: number
  usuario: { handle: string; nombre: string }
  actividad: Actividad
  fecha: string
  titulo: string
  evidencia: string[]
  montoSugerido: number
}

export interface Decision {
  id: string
  fecha: string
  miembro: string
  actividad: Actividad
  detalle: string
  monto: number | null
  estado: 'APROBADA' | 'RECHAZADA'
  motivo: string | null
}

export interface NuevoOtorgamiento {
  usuario: string
  actividad: string
  monto: number
  motivo: string
}

export interface NuevoPremio {
  nombre: string
  scc_requeridos: number
  prerequisito: string
}

export interface PremioReclamadoAdmin {
  miembro: string
  rango: Rango
  fecha: string
}
