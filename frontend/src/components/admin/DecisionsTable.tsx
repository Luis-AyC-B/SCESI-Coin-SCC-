import { useState } from 'react'
import { ACTIVITY_SHORT } from '@/lib/activities'
import { formatDate } from '@/lib/format'
import type { Decision } from '@/types'

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'APROBADA', label: 'Aprobadas' },
  { id: 'RECHAZADA', label: 'Rechazadas' },
] as const

const PAGE = 15

export default function DecisionsTable({ decisions }: { decisions: Decision[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all')
  const [visible, setVisible] = useState(PAGE)
  const rows = decisions.filter((d) => filter === 'all' || d.estado === filter)

  return (
    <section className="rounded-card border-border border bg-white p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-xl font-semibold">Historial de transacciones</h2>
        <div className="flex gap-1" role="group" aria-label="Filtrar decisiones">
          {FILTERS.map((f) => {
            const on = f.id === filter
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setFilter(f.id)
                  setVisible(PAGE)
                }}
                className={`min-h-10 cursor-pointer rounded-md border px-3 py-2 text-sm ${
                  on ? 'border-ink bg-ink text-white' : 'border-input text-ink bg-transparent hover:bg-black/5'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="text-ink-2 text-left text-[13px]">
              <th className="py-2 pr-3 font-medium">Fecha</th>
              <th className="px-3 py-2 font-medium">Miembro</th>
              <th className="px-3 py-2 font-medium">Actividad</th>
              <th className="px-3 py-2 font-medium">Detalle</th>
              <th className="px-3 py-2 text-right font-medium">Monto</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="py-2 pl-3 font-medium">Motivo</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, visible).map((d) => {
              const ok = d.estado === 'APROBADA'
              return (
                <tr key={d.id} className="border-divider border-t">
                  <td className="text-ink-2 py-3 pr-3 whitespace-nowrap">{formatDate(d.fecha)}</td>
                  <td className="p-3 font-mono font-semibold">{d.miembro}</td>
                  <td className="p-3">{ACTIVITY_SHORT[d.actividad.abreviatura]}</td>
                  <td className="p-3 font-medium">{d.detalle}</td>
                  <td
                    className={`p-3 text-right font-mono font-semibold whitespace-nowrap ${ok ? 'text-scesi' : 'text-ink-2'}`}
                  >
                    {ok ? `+${d.monto} SCC` : '—'}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded px-2 py-[3px] font-mono text-[13px] ${
                        ok ? 'bg-scesi-tint text-scesi' : 'bg-divider text-ink'
                      }`}
                    >
                      {d.estado}
                    </span>
                  </td>
                  <td className="text-ink-2 py-3 pl-3">{d.motivo ?? '—'}</td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr className="border-divider border-t">
                <td colSpan={7} className="text-ink-2 py-6 text-center">
                  No hay decisiones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {rows.length > visible && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + PAGE)}
          className="border-input text-ink mt-3 min-h-11 w-full cursor-pointer rounded-lg border bg-transparent text-sm hover:bg-black/5"
        >
          Mostrar más ({rows.length - visible} restantes)
        </button>
      )}
    </section>
  )
}
