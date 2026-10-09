import { useState } from 'react'
import { useMe, useMyMovements } from '@/api/me'
import BalanceCard from '@/components/panel/BalanceCard'
import HistoryTable from '@/components/panel/HistoryTable'
import ProfileCard from '@/components/panel/ProfileCard'
import RequestCoinsModal from '@/components/panel/RequestCoinsModal'
import { CloseIcon } from '@/components/ui/icons'

export default function Panel() {
  const me = useMe()
  const movements = useMyMovements()
  const [requestOpen, setRequestOpen] = useState(false)
  const [sent, setSent] = useState(false)

  if (me.isPending || movements.isPending) {
    return <p className="text-ink-2">Cargando…</p>
  }
  if (me.isError || movements.isError) {
    return <p className="text-scesi">No se pudo cargar tu panel.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-stretch gap-4">
        <ProfileCard me={me.data} />
        <BalanceCard me={me.data} onRequest={() => setRequestOpen(true)} />
      </div>

      {sent && (
        <div
          role="status"
          className="border-input flex items-center justify-between gap-3 rounded-[10px] border bg-[#F4F4F4] px-4.5 py-3.5 text-[15px]"
        >
          <span>Solicitud enviada. La directiva la revisará y, si se aprueba, los SCC llegarán en un nuevo bloque.</span>
          <button
            type="button"
            onClick={() => setSent(false)}
            aria-label="Cerrar aviso"
            className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-lg hover:bg-black/5"
          >
            <CloseIcon />
          </button>
        </div>
      )}

      <HistoryTable movements={movements.data} />

      <RequestCoinsModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        onSent={() => {
          setRequestOpen(false)
          setSent(true)
        }}
      />
    </div>
  )
}
