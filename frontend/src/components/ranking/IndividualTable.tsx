import type { RankingMiembro } from '@/types'

const COUNTS = [
  { abbr: 'T', title: 'Talleres' },
  { abbr: 'E', title: 'Eventos organizados' },
  { abbr: 'C', title: 'Competencias ganadas' },
  { abbr: 'P', title: 'Proyectos' },
  { abbr: 'I', title: 'Investigaciones' },
  { abbr: 'A', title: 'Asistencias' },
]

const th = 'px-2 py-3 font-semibold'

export default function IndividualTable({ filas }: { filas: RankingMiembro[] }) {
  return (
    <section className="rounded-card border-border overflow-hidden border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink text-center text-[13px] text-white">
              <th scope="col" className={`${th} w-12`}>#</th>
              <th scope="col" className={`${th} px-3 text-left`}>Miembro</th>
              <th scope="col" className={th}>Área</th>
              <th scope="col" className={th}>Rango</th>
              {COUNTS.map((c) => (
                <th key={c.abbr} scope="col" className={th}>
                  <abbr title={c.title} className="no-underline">
                    {c.abbr}
                  </abbr>
                </th>
              ))}
              <th scope="col" className={`${th} px-3 text-right`}>SCC</th>
              <th scope="col" className={`${th} px-3 text-right`}>Δ semana</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr
                key={f.handle}
                aria-current={f.esYo ? 'true' : undefined}
                className={`border-divider border-t text-center ${
                  f.esYo ? 'bg-scesi-tint' : i % 2 ? 'bg-[#F7F7F7]' : 'bg-white'
                }`}
              >
                <td className="text-ink-2 px-2 py-2.5 font-mono">{f.posicion}</td>
                <td className="px-3 py-2.5 text-left font-mono font-semibold">
                  {f.nombre}
                  {f.esYo && ' (tú)'}
                </td>
                <td className="px-2 py-2.5">{f.area}</td>
                <td className="px-2 py-2.5">
                  <span className="bg-ink rounded px-2 py-[3px] text-xs font-bold tracking-[0.04em] whitespace-nowrap text-white">
                    {f.rango.nombre.toUpperCase()}
                  </span>
                </td>
                {COUNTS.map((c) => (
                  <td key={c.abbr} className="px-2 py-2.5 font-mono">
                    {f.conteos[c.abbr] || '·'}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-right font-mono font-semibold">{f.scc}</td>
                <td className={`px-3 py-2.5 text-right font-mono ${f.deltaSemana > 0 ? 'text-ink' : 'text-ink-2'}`}>
                  {f.deltaSemana > 0 ? `+${f.deltaSemana}` : '0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-divider text-ink-2 m-0 border-t px-4 py-3 text-sm">
        T talleres · E eventos · C competencias · P proyectos · I investigaciones · A asistencias
      </p>
    </section>
  )
}
