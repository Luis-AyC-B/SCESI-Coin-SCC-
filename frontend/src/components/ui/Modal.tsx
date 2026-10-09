import { useEffect, useId, useRef, type ReactNode } from 'react'
import { CloseIcon } from './icons'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({ open, title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      className="rounded-card text-ink backdrop:bg-ink/55 m-auto w-[calc(100%-32px)] max-w-[480px] bg-white p-0 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
    >
      <div className="border-divider flex items-center justify-between border-b px-6 py-5">
        <h2 id={titleId} className="m-0 text-xl font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="flex size-11 cursor-pointer items-center justify-center rounded-lg hover:bg-black/5"
        >
          <CloseIcon size={20} />
        </button>
      </div>
      {open && children}
    </dialog>
  )
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 px-6 py-5">{children}</div>
}

export function ModalActions({ children }: { children: ReactNode }) {
  return <div className="flex justify-end gap-2.5 px-6 pt-4 pb-5">{children}</div>
}
