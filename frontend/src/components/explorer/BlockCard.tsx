import { formatDate, shortHash } from '@/lib/format'
import type { Bloque } from '@/types'

interface Props {
  bloque: Bloque
  latest: boolean
  selected: boolean
  onSelect: () => void
}

export default function BlockCard({ bloque, latest, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Ver bloque #${bloque.numero}`}
      className={`rounded-card flex min-w-0 flex-[1_1_240px] cursor-pointer flex-col gap-2 border p-4.5 text-left ${
        latest ? 'bg-ink border-ink text-white' : 'border-border text-ink bg-white hover:bg-[#F7F7F7]'
      } ${selected ? 'ring-scesi ring-2 ring-offset-2' : ''}`}
    >
      <span className="flex items-center justify-between">
        <span className="font-mono text-lg font-medium">#{bloque.numero}</span>
        <span className="text-[13px] opacity-80">{formatDate(bloque.fecha)}</span>
      </span>
      <span className="font-mono text-[13px] [overflow-wrap:anywhere] opacity-85">hash {shortHash(bloque.hash)}</span>
      <span className="font-mono text-[13px] [overflow-wrap:anywhere] opacity-75">
        prev {shortHash(bloque.hashPrevio)}
      </span>
      <span className="text-[13px]">
        {bloque.txs.length} tx · firmado por {bloque.firmante}
      </span>
    </button>
  )
}
