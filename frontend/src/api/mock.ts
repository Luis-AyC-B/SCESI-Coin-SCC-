// Datos mock a partir de seed/data.json mientras el backend no expone la API.
import seed from '@seed/data.json'
import type {
  Actividad,
  Decision,
  Me,
  Miembro,
  Movimiento,
  NuevaPeticion,
  NuevoOtorgamiento,
  NuevoPremio,
  PeticionPendiente,
  PremioReclamado,
  PremioReclamadoAdmin,
  Rango,
  Ranking,
  RankingArea,
  RankingMiembro,
} from '@/types'

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
const otorgamientos = [...seed.otorgamientos]
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
  const directas = otorgamientos
    .filter((g) => g.usuario === handle)
    .map((g) => ({ actividad: g.actividad, fecha: g.fecha, monto: g.monto }))
  return [...dePeticiones, ...directas]
}

function totalScc(handle: string): number {
  return emisiones(handle).reduce((sum, e) => sum + e.monto, 0)
}

// El ranking solo cuenta lo ganado en la gestión actual; el saldo y el rango usan el total
function emisionesGestion(handle: string) {
  return emisiones(handle).filter((e) => e.fecha >= seed.gestion.inicio)
}

function sccGestion(handle: string): number {
  return emisionesGestion(handle).reduce((sum, e) => sum + e.monto, 0)
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
  const ranking = seed.usuarios.map((u) => ({ handle: u.handle, scc: sccGestion(u.handle) })).sort((a, b) => b.scc - a.scc)
  const propias = emisiones(handle)
  return delay({
    handle,
    nombre: user.nombre,
    area: user.area,
    rol: user.rol as Me['rol'],
    wallet: fakeWallet(handle),
    scc: totalScc(handle),
    sccGestion: sccGestion(handle),
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
    ...otorgamientos
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

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Meses de la gestión hasta hoy, como "yyyy-mm"
function mesesGestion(): string[] {
  const [y0, m0] = seed.gestion.inicio.split('-').map(Number)
  const actual = hoy().slice(0, 7)
  const meses: string[] = []
  for (let y = y0, m = m0; ; m === 12 ? (y++, (m = 1)) : m++) {
    const ym = `${y}-${String(m).padStart(2, '0')}`
    meses.push(ym)
    if (ym >= actual || meses.length >= 12) break
  }
  return meses
}

function haceDias(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function serieAcumulada(handle: string, meses: string[]): number[] {
  const em = emisionesGestion(handle)
  return meses.map((ym) => em.filter((e) => e.fecha.slice(0, 7) <= ym).reduce((s, e) => s + e.monto, 0))
}

function sumaDesde(handle: string, desde: string): number {
  return emisiones(handle)
    .filter((e) => e.fecha > desde)
    .reduce((s, e) => s + e.monto, 0)
}

export function getIndividualRanking(): Promise<Ranking<RankingMiembro>> {
  const meses = mesesGestion()
  const yo = currentHandle()
  const filas = seed.usuarios
    .map((u): RankingMiembro => {
      const em = emisionesGestion(u.handle)
      return {
        posicion: 0,
        handle: u.handle,
        nombre: u.nombre,
        area: u.area,
        rango: rangoActual(u.handle),
        conteos: Object.fromEntries(
          actividades.map((a) => [a.abreviatura, em.filter((e) => e.actividad === a.codigo).length]),
        ),
        scc: sccGestion(u.handle),
        deltaSemana: sumaDesde(u.handle, haceDias(7)),
        serie: serieAcumulada(u.handle, meses),
        esYo: u.handle === yo,
      }
    })
    .sort((a, b) => b.scc - a.scc || a.nombre.localeCompare(b.nombre))
    .map((f, i) => ({ ...f, posicion: i + 1 }))
  return delay({ meses: meses.map((ym) => MESES[Number(ym.slice(5)) - 1]), filas })
}

export function getAreaRanking(): Promise<Ranking<RankingArea>> {
  const meses = mesesGestion()
  const miArea = seed.usuarios.find((u) => u.handle === currentHandle())?.area
  const filas = seed.areas
    .map((area): RankingArea => {
      const miembros = seed.usuarios.filter((u) => u.area === area)
      const scc = miembros.reduce((s, u) => s + sccGestion(u.handle), 0)
      return {
        posicion: 0,
        area,
        miembros: miembros.length,
        scc,
        promedio: miembros.length ? scc / miembros.length : 0,
        deltaMes: miembros.reduce((s, u) => s + sumaDesde(u.handle, haceDias(30)), 0),
        serie: meses.map((_, i) => miembros.reduce((s, u) => s + serieAcumulada(u.handle, meses)[i], 0)),
        esMiArea: area === miArea,
      }
    })
    .sort((a, b) => b.scc - a.scc || a.area.localeCompare(b.area))
    .map((f, i) => ({ ...f, posicion: i + 1 }))
  return delay({ meses: meses.map((ym) => MESES[Number(ym.slice(5)) - 1]), filas })
}

// ---------- Administración (solo directiva) ----------

function soloDirectiva(): Promise<never> | null {
  const user = seed.usuarios.find((u) => u.handle === currentHandle())
  return user?.rol === 'DIRECTIVA' ? null : Promise.reject(new Error('Solo la mesa directiva puede hacer esto.'))
}

// Orden de las decisiones tomadas en esta sesión, para listarlas primero dentro del mismo día
const decididas = new WeakMap<object, number>()
let secuencia = 0

const nombreDe = (handle: string) => seed.usuarios.find((u) => u.handle === handle)?.nombre ?? handle
const actividadDe = (codigo: string) => actividades.find((a) => a.codigo === codigo)!

export function getMembers(): Promise<Miembro[]> {
  return delay(
    seed.usuarios
      .map((u) => ({ handle: u.handle, nombre: u.nombre, area: u.area, wallet: fakeWallet(u.handle) }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre)),
  )
}

export function getPendingRequests(): Promise<PeticionPendiente[]> {
  return (
    soloDirectiva() ??
    delay(
      peticiones
        .map((p, id) => ({ p, id }))
        .filter(({ p }) => p.estado === 'PENDIENTE')
        .sort((a, b) => b.p.fecha.localeCompare(a.p.fecha))
        .map(({ p, id }) => ({
          id,
          usuario: { handle: p.usuario, nombre: nombreDe(p.usuario) },
          actividad: actividadDe(p.actividad),
          fecha: p.fecha,
          titulo: p.titulo,
          evidencia: p.evidencia,
          montoSugerido: p.monto_sugerido,
        })),
    )
  )
}

function pendiente(id: number): Peticion | Error {
  const p = peticiones[id]
  if (!p) return new Error('La petición no existe.')
  if (p.estado !== 'PENDIENTE') return new Error('La petición ya fue resuelta.')
  return p
}

export function approveRequest(id: number, monto: number): Promise<void> {
  const denied = soloDirectiva()
  if (denied) return denied
  const p = pendiente(id)
  if (p instanceof Error) return Promise.reject(p)
  if (!Number.isInteger(monto) || monto <= 0) return Promise.reject(new Error('El monto debe ser un entero mayor a 0.'))
  Object.assign(p, { estado: 'APROBADA', monto_aprobado: monto, resuelta_por: currentHandle(), resuelta_en: hoy() })
  decididas.set(p, ++secuencia)
  return delay(undefined)
}

export function rejectRequest(id: number, motivo: string): Promise<void> {
  const denied = soloDirectiva()
  if (denied) return denied
  const p = pendiente(id)
  if (p instanceof Error) return Promise.reject(p)
  Object.assign(p, {
    estado: 'RECHAZADA',
    motivo_rechazo: motivo.trim() || 'Sin motivo',
    resuelta_por: currentHandle(),
    resuelta_en: hoy(),
  })
  decididas.set(p, ++secuencia)
  return delay(undefined)
}

export function getDecisions(): Promise<Decision[]> {
  const resueltas = peticiones
    .map((p, id) => ({ p, id }))
    .filter(({ p }) => p.estado !== 'PENDIENTE')
    .map(
      ({ p, id }): Decision & { orden: number } => ({
        id: `p${id}`,
        fecha: p.resuelta_en ?? p.fecha,
        miembro: nombreDe(p.usuario),
        actividad: actividadDe(p.actividad),
        detalle: p.titulo,
        monto: p.monto_aprobado,
        estado: p.estado as Decision['estado'],
        motivo: p.motivo_rechazo,
        orden: decididas.get(p) ?? 0,
      }),
    )
  const directas = otorgamientos.map(
    (g, i): Decision & { orden: number } => ({
      id: `g${i}`,
      fecha: g.fecha,
      miembro: nombreDe(g.usuario),
      actividad: actividadDe(g.actividad),
      detalle: g.motivo,
      monto: g.monto,
      estado: 'APROBADA',
      motivo: 'Otorgado directamente',
      orden: decididas.get(g) ?? 0,
    }),
  )
  const todas = [...resueltas, ...directas].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.orden - a.orden)
  return soloDirectiva() ?? delay(todas.map(({ orden: _, ...d }) => d))
}

export function grantCoins(data: NuevoOtorgamiento): Promise<void> {
  const denied = soloDirectiva()
  if (denied) return denied
  if (!seed.usuarios.some((u) => u.handle === data.usuario)) return Promise.reject(new Error('El miembro no existe.'))
  if (!actividades.some((a) => a.codigo === data.actividad)) return Promise.reject(new Error('La actividad no existe.'))
  if (!Number.isInteger(data.monto) || data.monto <= 0) {
    return Promise.reject(new Error('El monto debe ser un entero mayor a 0.'))
  }
  if (!data.motivo.trim()) return Promise.reject(new Error('El motivo es obligatorio.'))
  const otorgamiento = { ...data, motivo: data.motivo.trim(), fecha: hoy(), otorgado_por: currentHandle() }
  otorgamientos.push(otorgamiento)
  decididas.set(otorgamiento, ++secuencia)
  return delay(undefined)
}

export function createRank(data: NuevoPremio): Promise<void> {
  const denied = soloDirectiva()
  if (denied) return denied
  const nombre = data.nombre.trim()
  const ultimo = rangos[rangos.length - 1]
  if (!nombre) return Promise.reject(new Error('El nombre es obligatorio.'))
  if (rangos.some((r) => r.nombre.toLowerCase() === nombre.toLowerCase())) {
    return Promise.reject(new Error('Ya existe un premio con ese nombre.'))
  }
  // La escalera es secuencial: un premio nuevo va después del último nivel
  if (data.prerequisito !== ultimo.codigo) {
    return Promise.reject(new Error(`El premio nuevo debe requerir el último nivel (${ultimo.nombre}).`))
  }
  if (!Number.isInteger(data.scc_requeridos) || data.scc_requeridos <= ultimo.scc_requeridos) {
    return Promise.reject(new Error(`Debe requerir más de ${ultimo.scc_requeridos} SCC.`))
  }
  const codigo = nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
  rangos.push({ codigo, nombre, scc_requeridos: data.scc_requeridos, prerequisito: ultimo.codigo, orden: ultimo.orden + 1 })
  return delay(undefined)
}

export function getRecentClaims(limit = 5): Promise<PremioReclamadoAdmin[]> {
  return (
    soloDirectiva() ??
    delay(
      [...reclamos]
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .slice(0, limit)
        .map((c) => ({ miembro: nombreDe(c.usuario), rango: rangos.find((r) => r.codigo === c.rango)!, fecha: c.fecha })),
    )
  )
}
