import { useState, type FormEvent } from 'react'
import { useGrantCoins, useMembers } from '@/api/admin'
import { useActivities } from '@/api/me'
import { btnPrimary, btnSecondary, inputClass, labelClass } from '@/components/ui/styles'
import { shortWallet } from '@/lib/format'

interface Props {
  onGranted: (nombre: string, monto: number) => void
}

export default function GrantForm({ onGranted }: Props) {
  const { data: members = [] } = useMembers()
  const { data: activities = [] } = useActivities()
  const grant = useGrantCoins()
  const [usuario, setUsuario] = useState('')
  const [actividad, setActividad] = useState('')
  const [monto, setMonto] = useState('')
  const [motivo, setMotivo] = useState('')

  const sugerido = activities.find((a) => a.codigo === actividad)?.scc_sugeridos

  function reset() {
    setUsuario('')
    setActividad('')
    setMonto('')
    setMotivo('')
    grant.reset()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const montoNum = Number(monto || sugerido)
    try {
      await grant.mutateAsync({ usuario, actividad, monto: montoNum, motivo })
      onGranted(members.find((m) => m.handle === usuario)?.nombre ?? usuario, montoNum)
      reset()
    } catch {
      // se muestra grant.error
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-card border-border flex min-w-0 flex-[1_1_420px] flex-col gap-4.5 border bg-white p-6"
    >
      <h2 className="m-0 text-xl font-semibold">Otorgar coins directamente</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="grant-miembro" className={labelClass}>
          Miembro
        </label>
        <select
          id="grant-miembro"
          required
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Elige un miembro
          </option>
          {members.map((m) => (
            <option key={m.handle} value={m.handle}>
              {m.nombre} · {shortWallet(m.wallet)}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="grant-actividad" className={labelClass}>
            Actividad
          </label>
          <select
            id="grant-actividad"
            required
            value={actividad}
            onChange={(e) => {
              setActividad(e.target.value)
              setMonto('')
            }}
            className={inputClass}
          >
            <option value="" disabled>
              Elige
            </option>
            {activities.map((a) => (
              <option key={a.codigo} value={a.codigo}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="grant-monto" className={labelClass}>
            Monto (SCC)
          </label>
          <input
            id="grant-monto"
            type="number"
            min={1}
            step={1}
            required
            inputMode="numeric"
            value={monto || (sugerido ?? '')}
            onChange={(e) => setMonto(e.target.value)}
            className={`${inputClass} text-scesi font-mono`}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="grant-motivo" className={labelClass}>
          Motivo
        </label>
        <textarea
          id="grant-motivo"
          rows={3}
          required
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder='Ej. Taller "Docker desde cero"'
          className={`${inputClass} resize-y`}
        />
      </div>
      {grant.isError && (
        <p role="alert" className="text-scesi m-0 text-sm">
          {grant.error.message}
        </p>
      )}
      <div className="flex flex-wrap gap-2.5">
        <button type="submit" disabled={grant.isPending} className={btnPrimary}>
          {grant.isPending ? 'Emitiendo…' : 'Firmar y emitir'}
        </button>
        <button type="button" onClick={reset} className={btnSecondary}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
