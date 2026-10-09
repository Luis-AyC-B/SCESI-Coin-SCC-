import { useState } from 'react'
import { formatDate } from '@/lib/format'
import type { Movimiento, TipoMovimiento } from '@/types'

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'in', label: 'Ingresos' },
  { id: 'pending', label: 'Pendientes' },
] as const

type FilterId = (typeof FILTERS)[number]['id']

const MATCHES: Record<FilterId, (t: TipoMovimiento) => boolean> = {
  all: () => true,
  in: (t) => t === 'EMISIÓN',
  pending: (t) => t === 'PENDIENTE',
}

export default function HistoryTable({ movements }: { movements: Movimiento[] }) {
  const [filter, setFilter] = useState<FilterId>('all')
  const rows = movements.filter((m) => MATCHES[filter](m.tipo))

  return (
    <section className="rounded-card border-border border bg-white p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold">Historial de transacciones</h1>
        <div className="flex gap-1" role="group" aria-label="Filtrar transacciones">
          {FILTERS.map((f) => {
            const on = f.id === filter
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
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
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="text-ink-2 text-left text-[13px]">
              <th className="py-2 pr-3 font-medium">Fecha</th>
              <th className="px-3 py-2 font-medium">Tipo</th>
              <th className="px-3 py-2 font-medium">Detalle</th>
              <th className="py-2 pl-3 text-right font-medium">Monto</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const isIn = m.tipo === 'EMISIÓN'
              return (
                <tr key={m.id} className="border-divider border-t">
                  <td className="text-ink-2 py-3 pr-3 whitespace-nowrap">{formatDate(m.fecha)}</td>
                  <td className="p-3">
                    <span
                      className={`rounded px-2 py-[3px] font-mono text-[13px] ${
                        isIn ? 'bg-scesi-tint text-scesi' : 'bg-divider text-ink'
                      }`}
                    >
                      {m.tipo}
                    </span>
                  </td>
                  <td className="p-3 font-medium">{m.detalle}</td>
                  <td
                    className={`py-3 pl-3 text-right font-mono font-semibold ${isIn ? 'text-scesi' : 'text-ink-2'}`}
                  >
                    {m.monto !== null ? `+${m.monto}` : '—'}
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr className="border-divider border-t">
                <td colSpan={4} className="text-ink-2 py-6 text-center">
                  No hay transacciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
