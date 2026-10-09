import { useState, type FormEvent } from 'react'
import { useCreateRank } from '@/api/admin'
import Modal, { ModalActions, ModalBody } from '@/components/ui/Modal'
import { btnPrimary, btnSecondary, inputClass, labelClass } from '@/components/ui/styles'
import type { Rango } from '@/types'

export default function RanksAdmin({ ranks, onCreated }: { ranks: Rango[]; onCreated: (nombre: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <section className="rounded-card border-border border bg-white p-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="m-0 text-xl font-semibold">Premios</h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-scesi hover:bg-scesi-hover min-h-11 cursor-pointer rounded-md border-none px-3.5 py-2.5 text-sm font-semibold text-white"
        >
          + Agregar premio
        </button>
      </div>
      <ul className="m-0 list-none p-0">
        {ranks.map((r) => (
          <li
            key={r.codigo}
            className="border-divider flex items-center justify-between gap-3 border-t py-3 text-[15px]"
          >
            <span className="font-medium">{r.nombre}</span>
            <span className="text-scesi font-mono">
              {r.scc_requeridos === 0 ? 'Inicial' : `${r.scc_requeridos} SCC`}
            </span>
          </li>
        ))}
      </ul>
      <Modal open={open} title="Agregar premio" onClose={() => setOpen(false)}>
        <AddRankForm
          ranks={ranks}
          onClose={() => setOpen(false)}
          onCreated={(nombre) => {
            setOpen(false)
            onCreated(nombre)
          }}
        />
      </Modal>
    </section>
  )
}

function AddRankForm({
  ranks,
  onClose,
  onCreated,
}: {
  ranks: Rango[]
  onClose: () => void
  onCreated: (nombre: string) => void
}) {
  const create = useCreateRank()
  const last = ranks[ranks.length - 1]

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const nombre = String(form.get('nombre')).trim()
    try {
      await create.mutateAsync({
        nombre,
        scc_requeridos: Number(form.get('scc')),
        prerequisito: String(form.get('prerequisito')),
      })
      onCreated(nombre)
    } catch {
      // se muestra create.error
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rank-nombre" className={labelClass}>
            Nombre del premio
          </label>
          <input id="rank-nombre" name="nombre" required placeholder="Ej. Leyenda SCESI" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rank-scc" className={labelClass}>
              SCC requeridos
            </label>
            <input
              id="rank-scc"
              name="scc"
              type="number"
              required
              min={last.scc_requeridos + 1}
              step={1}
              inputMode="numeric"
              placeholder={String(last.scc_requeridos + 50)}
              className={`${inputClass} text-scesi font-mono`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rank-prereq" className={labelClass}>
              Requiere
            </label>
            <select id="rank-prereq" name="prerequisito" defaultValue={last.codigo} className={inputClass}>
              {[...ranks].reverse().map((r) => (
                <option key={r.codigo} value={r.codigo}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        {create.isError && (
          <p role="alert" className="text-scesi m-0 text-sm">
            {create.error.message}
          </p>
        )}
      </ModalBody>
      <ModalActions>
        <button type="button" onClick={onClose} className={btnSecondary}>
          Cancelar
        </button>
        <button type="submit" disabled={create.isPending} className={btnPrimary}>
          {create.isPending ? 'Guardando…' : 'Guardar premio'}
        </button>
      </ModalActions>
    </form>
  )
}
