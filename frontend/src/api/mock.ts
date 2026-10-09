// Datos mock a partir de seed/data.json mientras el backend no expone la API.
import seed from '@seed/data.json'
import type { Actividad, Me, Movimiento, NuevaPeticion, PremioReclamado, Rango } from '@/types'

type Peticion = (typeof seed.peticiones)[number]

// Usuario simulado; para probar como directiva: localStorage.mockUser = 'shamir'
function currentHandle(): string {
  try {
    return localStorage.getItem('mockUser') ?? 'franco'
  } catch {
    return 'franco'
  }
}

const peticiones: Peticion[] = [...seed.peticiones]
const reclamos = [...seed.premios_reclamados]
const actividades: Actividad[] = seed.actividades
const rangos: Rango[] = [...seed.rangos].sort((a, b) => a.orden - b.orden)

function fakeWallet(handle: string): string {
  let h = 0x811c9dc5
  let hex = ''
  for (let i = 0; hex.length < 40; i++) {
    h = Math.imul(h ^ handle.charCodeAt(i % handle.length) ^ i, 0x01000193) >>> 0
    hex += h.toString(16).padStart(8, '0')
  }
  return `0x${hex.slice(0, 40)}`
}

function emisiones(handle: string) {
  const dePeticiones = peticiones
    .filter((p) => p.usuario === handle && p.estado === 'APROBADA')
    .map((p) => ({ actividad: p.actividad, fecha: p.resuelta_en ?? p.fecha, monto: p.monto_aprobado ?? 0 }))
  const directas = seed.otorgamientos
    .filter((g) => g.usuario === handle)
    .map((g) => ({ actividad: g.actividad, fecha: g.fecha, monto: g.monto }))
  return [...dePeticiones, ...directas]
}

function totalScc(handle: string): number {
  return emisiones(handle).reduce((sum, e) => sum + e.monto, 0)
}

function rangoActual(handle: string): Rango {
  const reclamados = reclamos.filter((c) => c.usuario === handle)
  const ultimo = reclamados.map((c) => rangos.find((r) => r.codigo === c.rango)!).sort((a, b) => b.orden - a.orden)[0]
  return ultimo ?? rangos[0]
}

const delay = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 150))

function hoy(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getMe(): Promise<Me> {
  const handle = currentHandle()
  const user = seed.usuarios.find((u) => u.handle === handle)!
  const rango = rangoActual(handle)
  const ranking = seed.usuarios.map((u) => ({ handle: u.handle, scc: totalScc(u.handle) })).sort((a, b) => b.scc - a.scc)
  const propias = emisiones(handle)
  return delay({
    handle,
    nombre: user.nombre,
    area: user.area,
    rol: user.rol as Me['rol'],
    wallet: fakeWallet(handle),
    scc: totalScc(handle),
    rango,
    siguienteRango: rangos.find((r) => r.orden === rango.orden + 1) ?? null,
    posicion: ranking.findIndex((r) => r.handle === handle) + 1,
    conteos: actividades.map((actividad) => ({
      actividad,
      cantidad: propias.filter((e) => e.actividad === actividad.codigo).length,
    })),
  })
}

export function getMyMovements(): Promise<Movimiento[]> {
  const handle = currentHandle()
  const nombreRango = (codigo: string) => rangos.find((r) => r.codigo === codigo)?.nombre ?? codigo
  const movs: Movimiento[] = [
    ...peticiones
      .filter((p) => p.usuario === handle)
      .map((p, i): Movimiento => {
        if (p.estado === 'APROBADA') {
          return { id: `p${i}`, fecha: p.resuelta_en ?? p.fecha, tipo: 'EMISIÓN', detalle: p.titulo, monto: p.monto_aprobado }
        }
        if (p.estado === 'RECHAZADA') {
          return { id: `p${i}`, fecha: p.resuelta_en ?? p.fecha, tipo: 'RECHAZADA', detalle: p.titulo, monto: null }
        }
        return { id: `p${i}`, fecha: p.fecha, tipo: 'PENDIENTE', detalle: `Solicitud: ${p.titulo}`, monto: null }
      }),
    ...seed.otorgamientos
      .filter((g) => g.usuario === handle)
      .map((g, i): Movimiento => ({ id: `g${i}`, fecha: g.fecha, tipo: 'EMISIÓN', detalle: g.motivo, monto: g.monto })),
    ...reclamos
      .filter((c) => c.usuario === handle)
      .map((c, i): Movimiento => ({
        id: `c${i}`,
        fecha: c.fecha,
        tipo: 'PREMIO',
        detalle: `Rango ${nombreRango(c.rango)}`,
        monto: null,
      })),
  ]
  return delay(movs.sort((a, b) => b.fecha.localeCompare(a.fecha)))
}

export function getActivities(): Promise<Actividad[]> {
  return delay(actividades)
}

export function createRequest(data: NuevaPeticion): Promise<void> {
  const actividad = actividades.find((a) => a.codigo === data.actividad)
  peticiones.push({
    usuario: currentHandle(),
    actividad: data.actividad,
    fecha: data.fecha,
    titulo: data.titulo,
    evidencia: [data.evidencia],
    monto_sugerido: actividad?.scc_sugeridos ?? 0,
    monto_aprobado: null,
    estado: 'PENDIENTE',
    motivo_rechazo: null,
    resuelta_por: null,
    resuelta_en: null,
  })
  return delay(undefined)
}

export function getRanks(): Promise<Rango[]> {
  return delay(rangos)
}

export function getMyClaims(): Promise<PremioReclamado[]> {
  const handle = currentHandle()
  return delay(
    reclamos
      .filter((c) => c.usuario === handle)
      .map((c) => ({ rango: rangos.find((r) => r.codigo === c.rango)!, fecha: c.fecha }))
      .sort((a, b) => b.fecha.localeCompare(a.fecha)),
  )
}

// Replica las reglas que valida el backend: solo el siguiente nivel y con SCC suficientes
export function claimRank(codigo: string): Promise<void> {
  const handle = currentHandle()
  const rango = rangos.find((r) => r.codigo === codigo)
  const actual = rangoActual(handle)
  if (!rango) return Promise.reject(new Error('El premio no existe.'))
  if (rango.prerequisito !== actual.codigo) {
    return Promise.reject(new Error(`Primero tienes que reclamar el nivel anterior a ${rango.nombre}.`))
  }
  if (totalScc(handle) < rango.scc_requeridos) {
    return Promise.reject(new Error(`Necesitas ${rango.scc_requeridos} SCC para reclamar ${rango.nombre}.`))
  }
  reclamos.push({ usuario: handle, rango: codigo, fecha: hoy() })
  return delay(undefined)
}
