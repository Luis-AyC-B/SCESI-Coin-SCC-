import { useState } from 'react'
import { Link } from 'react-router'
import { useDecisions, usePendingRequests, useRecentClaims } from '@/api/admin'
import { useMe } from '@/api/me'
import { useRanks } from '@/api/ranks'
import DecisionsTable from '@/components/admin/DecisionsTable'
import GrantForm from '@/components/admin/GrantForm'
import PendingRequests from '@/components/admin/PendingRequests'
import RanksAdmin from '@/components/admin/RanksAdmin'
import RecentClaims from '@/components/admin/RecentClaims'
import RejectModal from '@/components/admin/RejectModal'
import { CloseIcon } from '@/components/ui/icons'
import { gestionActual } from '@/lib/format'
import type { PeticionPendiente } from '@/types'

export default function Admin() {
  const me = useMe()
  if (me.isPending) return <p className="text-ink-2">Cargando…</p>
  if (me.data?.rol !== 'DIRECTIVA') {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[32px] font-semibold tracking-tight">Administración</h1>
        <p className="text-ink-2 m-0">Solo la mesa directiva puede ver esta sección.</p>
        <Link to="/panel" className="text-scesi hover:text-scesi-hover self-start font-semibold">
          Volver a mi panel
        </Link>
      </div>
    )
  }
  return <AdminContent />
}

function AdminContent() {
  const pending = usePendingRequests()
  const decisions = useDecisions()
  const claims = useRecentClaims()
  const ranks = useRanks()
  const [rejecting, setRejecting] = useState<PeticionPendiente | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  if (pending.isPending || decisions.isPending || claims.isPending || ranks.isPending) {
    return <p className="text-ink-2">Cargando…</p>
  }
  if (pending.isError || decisions.isError || claims.isError || ranks.isError) {
    return <p className="text-scesi">No se pudo cargar la administración.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-ink-2 font-mono text-sm tracking-[0.08em] uppercase">{gestionActual()}</div>
        <h1 className="mt-1.5 mb-0 text-[32px] font-semibold tracking-tight">Administración</h1>
      </div>

      {toast && (
        <div
          role="status"
          className="border-input flex items-center justify-between gap-3 rounded-[10px] border bg-[#F4F4F4] px-4.5 py-3.5 text-[15px]"
        >
          <span>{toast}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Cerrar aviso"
            className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-lg hover:bg-black/5"
          >
            <CloseIcon />
          </button>
        </div>
      )}

      <PendingRequests
        requests={pending.data}
        onApproved={(r, monto) =>
          setToast(`Aprobada: se emitieron ${monto} SCC a ${r.usuario.nombre} en un nuevo bloque.`)
        }
        onReject={setRejecting}
      />

      <DecisionsTable decisions={decisions.data} />

      <div className="flex flex-wrap items-start gap-4">
        <GrantForm onGranted={(nombre, monto) => setToast(`Se emitieron ${monto} SCC a ${nombre} en un nuevo bloque.`)} />
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
          <RanksAdmin ranks={ranks.data} onCreated={(nombre) => setToast(`Premio "${nombre}" agregado.`)} />
          <RecentClaims claims={claims.data} />
        </div>
      </div>

      <RejectModal
        request={rejecting}
        onClose={() => setRejecting(null)}
        onRejected={(r) => {
          setRejecting(null)
          setToast(`Petición de ${r.usuario.nombre} rechazada.`)
        }}
      />
    </div>
  )
}
