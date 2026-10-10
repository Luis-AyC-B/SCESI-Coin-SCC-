const pad = (n: number) => String(n).padStart(2, '0')

// Fecha local (no UTC) en formato yyyy-mm-dd
function TODAY(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** "2026-10-07" → "07 oct" ("Hoy" si es la fecha actual). */
export function formatDate(iso: string): string {
  if (iso === TODAY()) return 'Hoy'
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
    .toLocaleDateString('es', { day: '2-digit', month: 'short' })
    .replace('.', '')
}

/** "0x7a3f…c91e" */
export function shortWallet(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function todayIso(): string {
  return TODAY()
}

/** La gestión de la SCESI empieza en marzo: enero y febrero cuentan para la anterior. */
export function gestionActual(): string {
  const d = new Date()
  return `Gestión ${d.getMonth() >= 2 ? d.getFullYear() : d.getFullYear() - 1}`
}

/** "0x3b7e…d210" */
export function shortHash(hash: string): string {
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`
}
