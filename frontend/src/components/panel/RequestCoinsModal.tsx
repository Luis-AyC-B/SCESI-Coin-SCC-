import { useState, type FormEvent } from 'react'
import { useActivities, useCreateRequest } from '@/api/me'
import Modal, { ModalActions, ModalBody } from '@/components/ui/Modal'
import { btnPrimary, btnSecondary, inputClass, labelClass } from '@/components/ui/styles'
import { todayIso } from '@/lib/format'

interface Props {
  open: boolean
  onClose: () => void
  onSent: () => void
}

export default function RequestCoinsModal({ open, onClose, onSent }: Props) {
  return (
    <Modal open={open} title="Solicitar coins" onClose={onClose}>
      <RequestForm onClose={onClose} onSent={onSent} />
    </Modal>
  )
}

function RequestForm({ onClose, onSent }: Omit<Props, 'open'>) {
  const { data: activities = [] } = useActivities()
  const createRequest = useCreateRequest()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setError(null)
    try {
      await createRequest.mutateAsync({
        actividad: String(form.get('actividad')),
        fecha: String(form.get('fecha')),
        titulo: String(form.get('titulo')).trim(),
        evidencia: String(form.get('evidencia')).trim(),
      })
      onSent()
    } catch {
      setError('No se pudo enviar la solicitud. Intenta de nuevo.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="req-actividad" className={labelClass}>
              Actividad
            </label>
            <select id="req-actividad" name="actividad" required className={inputClass}>
              {activities.map((a) => (
                <option key={a.codigo} value={a.codigo}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="req-fecha" className={labelClass}>
              Fecha
            </label>
            <input
              id="req-fecha"
              name="fecha"
              type="date"
              required
              defaultValue={todayIso()}
              max={todayIso()}
              className={inputClass}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="req-titulo" className={labelClass}>
            Título
          </label>
          <input
            id="req-titulo"
            name="titulo"
            required
            placeholder="Ej. Taller de Git para nuevos"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="req-evidencia" className={labelClass}>
            Evidencia
          </label>
          <textarea
            id="req-evidencia"
            name="evidencia"
            rows={3}
            required
            placeholder="Link a fotos, repo, lista de asistentes…"
            className={`${inputClass} resize-y`}
          />
        </div>
        {error && (
          <p role="alert" className="text-scesi m-0 text-sm">
            {error}
          </p>
        )}
      </ModalBody>
      <ModalActions>
        <button type="button" onClick={onClose} className={btnSecondary}>
          Cancelar
        </button>
        <button type="submit" disabled={createRequest.isPending} className={btnPrimary}>
          {createRequest.isPending ? 'Enviando…' : 'Enviar solicitud'}
        </button>
      </ModalActions>
    </form>
  )
}
