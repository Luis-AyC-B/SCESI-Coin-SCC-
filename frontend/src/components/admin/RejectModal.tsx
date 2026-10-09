import { useState } from 'react'
import { useRejectRequest } from '@/api/admin'
import Modal, { ModalActions, ModalBody } from '@/components/ui/Modal'
import { btnSecondary, inputClass, labelClass } from '@/components/ui/styles'
import type { PeticionPendiente } from '@/types'
import ActivityTag from './ActivityTag'

interface Props {
  request: PeticionPendiente | null
  onClose: () => void
  onRejected: (request: PeticionPendiente) => void
}

export default function RejectModal({ request, onClose, onRejected }: Props) {
  return (
    <Modal open={request !== null} title="Rechazar petición" onClose={onClose}>
      {request && <RejectForm request={request} onClose={onClose} onRejected={onRejected} />}
    </Modal>
  )
}

function RejectForm({ request, onClose, onRejected }: Props & { request: PeticionPendiente }) {
  const reject = useRejectRequest()
  const [motivo, setMotivo] = useState('')

  async function confirm() {
    try {
      await reject.mutateAsync({ id: request.id, motivo })
      onRejected(request)
    } catch {
      // se muestra reject.error
    }
  }

  return (
    <>
      <ModalBody>
        <div className="border-divider flex flex-col gap-1 rounded-lg border bg-[#F4F4F4] px-4 py-3.5">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold">{request.usuario.nombre}</span>
            <ActivityTag actividad={request.actividad} />
          </div>
          <div className="text-[15px] font-medium">{request.titulo}</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reject-motivo" className={labelClass}>
            Motivo del rechazo
          </label>
          <textarea
            id="reject-motivo"
            rows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej. Falta evidencia del evento"
            className={`${inputClass} resize-y`}
          />
        </div>
        {reject.isError && (
          <p role="alert" className="text-scesi m-0 text-sm">
            {reject.error.message}
          </p>
        )}
      </ModalBody>
      <ModalActions>
        <button type="button" onClick={onClose} className={btnSecondary}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={reject.isPending}
          className="bg-ink min-h-11 cursor-pointer rounded-lg border-none px-5 py-3 text-[15px] font-semibold text-white hover:bg-black disabled:opacity-60"
        >
          {reject.isPending ? 'Rechazando…' : 'Rechazar petición'}
        </button>
      </ModalActions>
    </>
  )
}
