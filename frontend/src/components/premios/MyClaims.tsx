import { formatDate } from '@/lib/format'
import type { PremioReclamado } from '@/types'

export default function MyClaims({ claims }: { claims: PremioReclamado[] }) {
  return (
    <section className="rounded-card border-border border bg-white p-6">
      <h2 className="m-0 mb-2 text-xl font-semibold">Mis premios</h2>
      {claims.length === 0 ? (
        <p className="border-divider text-ink-2 m-0 border-t py-5 text-[15px]">
          Todavía no reclamaste ningún premio.
        </p>
      ) : (
        <ul className="m-0 list-none p-0">
          {claims.map((c) => (
            <li
              key={c.rango.codigo}
              className="border-divider flex flex-wrap items-center gap-3 border-t py-3.5 text-[15px]"
            >
              <span className="flex-[1_1_200px] font-semibold">{c.rango.nombre}</span>
              <span className="text-ink-2 text-sm">{formatDate(c.fecha)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
