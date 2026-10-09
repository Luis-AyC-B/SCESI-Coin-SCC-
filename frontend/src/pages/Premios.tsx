import { useState } from 'react'
import { useMe } from '@/api/me'
import { useMyClaims, useRanks } from '@/api/ranks'
import ClaimModal from '@/components/premios/ClaimModal'
import MyClaims from '@/components/premios/MyClaims'
import RankCard from '@/components/premios/RankCard'
import { CloseIcon } from '@/components/ui/icons'
import { gestionActual } from '@/lib/format'
import type { Rango } from '@/types'

export default function Premios() {
  const me = useMe()
  const ranks = useRanks()
  const claims = useMyClaims()
  const [selected, setSelected] = useState<Rango | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  if (me.isPending || ranks.isPending || claims.isPending) {
    return <p className="text-ink-2">Cargando…</p>
  }
  if (me.isError || ranks.isError || claims.isError) {
    return <p className="text-scesi">No se pudieron cargar los premios.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-ink-2 font-mono text-sm tracking-[0.08em] uppercase">{gestionActual()}</div>
          <h1 className="mt-1.5 mb-0 text-[32px] font-semibold tracking-tight">Premios</h1>
        </div>
        <div className="bg-ink flex items-center gap-3 rounded-lg px-4.5 py-3 text-white">
          <span className="bg-scesi rounded px-2.5 py-1 text-[13px] font-bold tracking-[0.04em]">
            {me.data.rango.nombre.toUpperCase()}
          </span>
          <span className="font-mono text-[22px] font-medium">{me.data.scc} SCC</span>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="bg-ink flex items-center justify-between gap-3 rounded-[10px] px-4.5 py-3.5 text-[15px] text-white"
        >
          <span>{toast}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Cerrar aviso"
            className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-lg text-white hover:bg-white/10"
          >
            <CloseIcon />
          </button>
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {ranks.data.map((rango) => (
          <RankCard
            key={rango.codigo}
            rango={rango}
            prerequisito={ranks.data.find((r) => r.codigo === rango.prerequisito)}
            me={me.data}
            onClaim={() => setSelected(rango)}
          />
        ))}
      </div>

      <MyClaims claims={claims.data} />

      <ClaimModal
        me={me.data}
        rango={selected}
        onClose={() => setSelected(null)}
        onClaimed={(rango) => {
          setSelected(null)
          setToast(`Ahora eres ${rango.nombre}. El premio quedó registrado en un nuevo bloque.`)
        }}
      />
    </div>
  )
}
