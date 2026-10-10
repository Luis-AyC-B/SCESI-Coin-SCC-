import type { RankingArea } from '@/types'
import LineKey from './LineKey'
import type { SeriesStyle } from './seriesStyle'

const th = 'px-3 py-3 font-semibold'

export default function AreaTable({ filas, styles }: { filas: RankingArea[]; styles: Map<string, SeriesStyle> }) {
  return (
    <section className="rounded-card border-border overflow-hidden border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[15px]">
          <thead>
            <tr className="bg-ink text-right text-[13px] text-white">
              <th scope="col" className={`${th} w-12 text-center`}>#</th>
              <th scope="col" className={`${th} text-left`}>Área</th>
              <th scope="col" className={th}>Miembros</th>
              <th scope="col" className={th}>SCC total</th>
              <th scope="col" className={th}>Promedio</th>
              <th scope="col" className={th}>Δ mes</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr
                key={f.area}
                className={`border-divider border-t text-right ${f.esMiArea ? 'bg-scesi-tint' : ''}`}
              >
                <td className="text-ink-2 px-2 py-3.5 text-center font-mono">{f.posicion}</td>
                <td className="px-3 py-3.5 text-left">
                  <span className="inline-flex items-center gap-2.5 font-semibold">
                    <LineKey style={styles.get(f.area)!} />
                    {f.area}
                  </span>
                </td>
                <td className="px-3 py-3.5 font-mono">{f.miembros}</td>
                <td className="px-3 py-3.5 font-mono font-semibold">{f.scc}</td>
                <td className="px-3 py-3.5 font-mono">{f.promedio.toFixed(1)}</td>
                <td className={`px-3 py-3.5 font-mono ${f.deltaMes > 0 ? 'text-ink' : 'text-ink-2'}`}>
                  {f.deltaMes > 0 ? `+${f.deltaMes}` : '0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
