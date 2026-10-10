import { useState, type FormEvent } from 'react'
import { useBlock, useExplorerSearch, useExplorerStats, useLatestBlocks } from '@/api/explorer'
import BlockCard from '@/components/explorer/BlockCard'
import TxTable from '@/components/explorer/TxTable'
import { CloseIcon } from '@/components/ui/icons'
import { inputClass } from '@/components/ui/styles'

export default function Explorador() {
  const stats = useExplorerStats()
  const latest = useLatestBlocks()
  const [selected, setSelected] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')

  const head = latest.data?.[0]?.numero ?? null
  const blockNumber = selected ?? head
  const block = useBlock(blockNumber)
  const search = useExplorerSearch(query)

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    setQuery(draft.trim())
  }

  function selectBlock(numero: number) {
    setSelected(numero)
    setQuery('')
    setDraft('')
  }

  if (stats.isPending || latest.isPending) return <p className="text-ink-2">Cargando…</p>
  if (stats.isError || latest.isError) return <p className="text-scesi">No se pudo cargar el explorador.</p>

  const s = stats.data
  const cards = [
    { label: 'Altura de la cadena', value: `#${s.altura}` },
    { label: 'SCC emitidos (gestión)', value: s.sccEmitidosGestion.toLocaleString('es') },
    { label: 'Premios otorgados', value: String(s.premiosOtorgados) },
    { label: 'Nodos validadores', value: `${s.validadoresActivos} / ${s.validadoresTotales}` },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-ink-2 font-mono text-sm tracking-[0.08em] uppercase">Red privada PoA</div>
          <h1 className="mt-1.5 mb-0 text-[32px] font-semibold tracking-tight">Explorador</h1>
        </div>
        <form onSubmit={handleSearch} role="search" className="flex min-w-0 flex-[0_1_420px] flex-col gap-1">
          <label htmlFor="explorer-q" className="text-ink-2 text-sm">
            Buscar bloque, transacción o miembro
          </label>
          <div className="flex gap-2">
            <input
              id="explorer-q"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`#${s.altura}, 0x3b7e… o nombre`}
              className={`${inputClass} font-mono text-sm`}
            />
            <button
              type="submit"
              className="bg-ink min-h-11 flex-none cursor-pointer rounded-lg border-none px-4 text-sm font-semibold text-white hover:bg-black"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card border-border border bg-white p-5">
            <div className="text-ink-2 text-sm">{c.label}</div>
            <div className="mt-1.5 font-mono text-[28px] font-medium">{c.value}</div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="m-0 mb-3.5 text-xl font-semibold">Últimos bloques</h2>
        <div className="flex flex-wrap items-stretch gap-4">
          {latest.data.map((b) => (
            <BlockCard
              key={b.numero}
              bloque={b}
              latest={b.numero === head}
              selected={!query && b.numero === blockNumber}
              onSelect={() => selectBlock(b.numero)}
            />
          ))}
        </div>
      </section>

      {query ? (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setDraft('')
            }}
            className="text-ink-2 hover:text-ink flex min-h-11 cursor-pointer items-center gap-1.5 self-start border-none bg-transparent p-0 text-sm"
          >
            <CloseIcon size={16} /> Limpiar búsqueda
          </button>
          <TxTable
            title={`Resultados para «${query}»`}
            txs={search.data ?? []}
            emptyText={search.isPending ? 'Buscando…' : 'No se encontró nada.'}
            onSelectBlock={selectBlock}
          />
        </div>
      ) : (
        <TxTable
          title={`Transacciones del bloque #${blockNumber}`}
          txs={block.data?.txs ?? []}
          emptyText={block.isPending ? 'Cargando…' : 'Bloque no encontrado.'}
        />
      )}
    </div>
  )
}
