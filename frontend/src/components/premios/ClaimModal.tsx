import { useClaimRank } from '@/api/ranks'
import Modal, { ModalActions, ModalBody } from '@/components/ui/Modal'
import { ArrowRightIcon } from '@/components/ui/icons'
import { btnPrimary, btnSecondary } from '@/components/ui/styles'
import type { Me, Rango } from '@/types'

interface Props {
  me: Me
  rango: Rango | null
  onClose: () => void
  onClaimed: (rango: Rango) => void
}

export default function ClaimModal({ me, rango, onClose, onClaimed }: Props) {
  const claim = useClaimRank()

  function close() {
    claim.reset()
    onClose()
  }

  async function confirm() {
    if (!rango) return
    try {
      await claim.mutateAsync(rango.codigo)
      onClaimed(rango)
    } catch {
      // el mensaje se muestra desde claim.error
    }
  }

  return (
    <Modal open={rango !== null} title="Reclamar premio" onClose={close}>
      {rango && (
        <>
          <ModalBody>
            <div className="flex items-center gap-3">
              <span className="bg-divider rounded px-2.5 py-1 text-[13px] font-bold tracking-[0.04em]">
                {me.rango.nombre.toUpperCase()}
              </span>
              <ArrowRightIcon />
              <span className="bg-scesi rounded px-2.5 py-1 text-[13px] font-bold tracking-[0.04em] text-white">
                {rango.nombre.toUpperCase()}
              </span>
            </div>
            <dl className="border-divider m-0 flex flex-col gap-2 rounded-lg border bg-[#F4F4F4] px-4 py-3.5 font-mono text-sm">
              <div className="flex justify-between">
                <dt>Tus SCC</dt>
                <dd className="m-0">{me.scc} SCC</dd>
              </div>
              <div className="flex justify-between">
                <dt>Requisito</dt>
                <dd className="m-0">{rango.scc_requeridos} SCC</dd>
              </div>
            </dl>
            {claim.isError && (
              <p role="alert" className="text-scesi m-0 text-sm">
                {claim.error.message}
              </p>
            )}
          </ModalBody>
          <ModalActions>
            <button type="button" onClick={close} className={btnSecondary}>
              Cancelar
            </button>
            <button type="button" onClick={confirm} disabled={claim.isPending} className={btnPrimary}>
              {claim.isPending ? 'Reclamando…' : `Reclamar ${rango.nombre}`}
            </button>
          </ModalActions>
        </>
      )}
    </Modal>
  )
}
