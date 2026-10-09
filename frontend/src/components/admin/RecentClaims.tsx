import { formatDate } from '@/lib/format'
import type { PremioReclamadoAdmin } from '@/types'

export default function RecentClaims({ claims }: { claims: PremioReclamadoAdmin[] }) {
  return (
    <section className="rounded-card border-border border bg-white p-6">
      <h2 className="m-0 mb-2 text-xl font-semibold">Premios reclamados recientes</h2>
      {claims.length === 0 && <p className="border-divider text-ink-2 m-0 border-t py-5">Nadie reclamó premios aún.</p>}
      <ul className="m-0 list-none p-0">
        {claims.map((c) => (
          <li
            key={`${c.miembro}-${c.rango.codigo}`}
            className="border-divider flex flex-wrap items-center gap-3 border-t py-3 text-[15px]"
          >
            <span className="font-mono font-semibold">{c.miembro}</span>
            <span className="flex-[1_1_120px] font-medium">{c.rango.nombre}</span>
            <span className="text-ink-2 text-sm">{formatDate(c.fecha)}</span>
            <span className="text-ink-2 font-mono">{c.rango.scc_requeridos} SCC</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
