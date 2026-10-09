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
  scc: number
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
  conteos: Record<string, number> // por abreviatura: T, E, C, P, I, A
  scc: number
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
