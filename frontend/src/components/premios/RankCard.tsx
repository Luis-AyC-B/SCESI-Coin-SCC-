import { LockIcon } from '@/components/ui/icons'
import type { Me, Rango } from '@/types'
import { rankStatus } from './rankStatus'

interface Props {
  rango: Rango
  prerequisito: Rango | undefined
  me: Me
  onClaim: () => void
}

export default function RankCard({ rango, prerequisito, me, onClaim }: Props) {
  const status = rankStatus(rango, me)
  const current = status === 'TU RANGO'
  const claimable = status === 'DISPONIBLE'
  const locked = status === 'BLOQUEADO'
  const pct = Math.min(100, Math.round((me.scc / rango.scc_requeridos) * 100))

  const card = current
    ? 'bg-ink text-white border-ink'
    : claimable
      ? 'bg-white text-ink border-scesi'
      : `bg-white border-border ${locked ? 'text-ink-2' : 'text-ink'}`
  const tag = current || claimable ? 'bg-scesi text-white' : 'bg-divider text-ink'
  const cost = current ? 'text-scesi-light' : locked ? 'text-ink-2' : 'text-scesi'

  return (
    <article className={`rounded-card flex flex-col gap-3.5 border-2 p-6 ${card}`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-semibold opacity-80">NIVEL {rango.orden}</span>
        <span className={`rounded px-2 py-[3px] text-xs font-bold tracking-[0.04em] ${tag}`}>{status}</span>
      </div>
      <h2 className="m-0 text-[26px] font-bold">{rango.nombre}</h2>
      <div className={`font-mono text-xl font-medium ${cost}`}>
        {rango.scc_requeridos === 0 ? 'Inicial' : `${rango.scc_requeridos} SCC`}
      </div>

      {claimable && (
        <button
          type="button"
          onClick={onClaim}
          className="bg-scesi hover:bg-scesi-hover min-h-11 cursor-pointer rounded-lg border-none text-[15px] font-semibold text-white"
        >
          Reclamar
        </button>
      )}

      {status === 'SIGUIENTE' && (
        <div className="flex flex-col gap-1.5">
          <div
            role="progressbar"
            aria-label={`Progreso hacia ${rango.nombre}`}
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            className="bg-divider h-2 rounded"
          >
            <div className="bg-scesi h-2 rounded" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-ink-2 text-sm">Te faltan {rango.scc_requeridos - me.scc} SCC</span>
        </div>
      )}

      {locked && (
        <div className="flex items-center gap-2 text-sm">
          <LockIcon />
          <span>Requiere {prerequisito?.nombre}</span>
        </div>
      )}
    </article>
  )
}
