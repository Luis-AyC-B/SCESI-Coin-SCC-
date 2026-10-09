import { useState } from 'react'
import { useApproveRequest } from '@/api/admin'
import { formatDate } from '@/lib/format'
import type { PeticionPendiente } from '@/types'
import ActivityTag from './ActivityTag'

interface Props {
  requests: PeticionPendiente[]
  onApproved: (request: PeticionPendiente, monto: number) => void
  onReject: (request: PeticionPendiente) => void
}

export default function PendingRequests({ requests, onApproved, onReject }: Props) {
  const approve = useApproveRequest()
  const [amounts, setAmounts] = useState<Record<number, string>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})
  const n = requests.length

  async function handleApprove(r: PeticionPendiente) {
    const monto = Number(amounts[r.id] ?? r.montoSugerido)
    setErrors((e) => ({ ...e, [r.id]: '' }))
    try {
      await approve.mutateAsync({ id: r.id, monto })
      onApproved(r, monto)
    } catch (err) {
      setErrors((e) => ({ ...e, [r.id]: (err as Error).message }))
    }
  }

  return (
    <section className="rounded-card border-border border bg-white p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-xl font-semibold">Peticiones de coins</h2>
        <span className="bg-divider text-ink rounded px-2 py-1 font-mono text-[13px]">
          {n === 1 ? '1 pendiente' : `${n} pendientes`}
        </span>
      </div>

      {n === 0 && (
        <p className="border-divider text-ink-2 m-0 border-t py-7 text-center">No hay peticiones pendientes.</p>
      )}

      <ul className="m-0 list-none p-0">
        {requests.map((r) => {
          const inputId = `amt-${r.id}`
          const busy = approve.isPending && approve.variables?.id === r.id
          return (
            <li key={r.id} className="border-divider flex flex-wrap items-center gap-4 border-t py-4">
              <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-semibold">{r.usuario.nombre}</span>
                  <ActivityTag actividad={r.actividad} />
                  <span className="text-ink-2 text-sm">{formatDate(r.fecha)}</span>
                </div>
                <div className="text-[15px] font-medium">{r.titulo}</div>
                {r.evidencia[0] && (
                  <a
                    href={r.evidencia[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-scesi hover:text-scesi-hover self-start text-sm"
                  >
                    Ver evidencia
                  </a>
                )}
                {errors[r.id] && (
                  <p role="alert" className="text-scesi m-0 text-sm">
                    {errors[r.id]}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={inputId} className="text-ink-2 text-sm">
                  Monto (SCC)
                </label>
                <input
                  id={inputId}
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={amounts[r.id] ?? String(r.montoSugerido)}
                  onChange={(e) => setAmounts((a) => ({ ...a, [r.id]: e.target.value }))}
                  className="border-input text-scesi focus:outline-scesi w-22 rounded-lg border bg-white px-3 py-2.5 font-mono text-[15px] focus:outline-2"
                />
              </div>
              <div className="flex gap-2 self-end">
                <button
                  type="button"
                  onClick={() => handleApprove(r)}
                  disabled={busy}
                  className="bg-scesi hover:bg-scesi-hover min-h-11 cursor-pointer rounded-md border-none px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {busy ? 'Aprobando…' : 'Aprobar'}
                </button>
                <button
                  type="button"
                  onClick={() => onReject(r)}
                  className="border-input text-ink min-h-11 cursor-pointer rounded-md border bg-transparent px-4 py-2.5 text-sm hover:bg-black/5"
                >
                  Rechazar
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
