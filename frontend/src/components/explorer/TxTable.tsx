import { shortHash } from '@/lib/format'
import type { TxCadena } from '@/types'

interface Props {
  title: string
  txs: TxCadena[]
  emptyText: string
  onSelectBlock?: (numero: number) => void // si se pasa, muestra la columna Bloque
}

export default function TxTable({ title, txs, emptyText, onSelectBlock }: Props) {
  return (
    <section className="rounded-card border-border border bg-white p-6">
      <h2 className="m-0 mb-3 text-xl font-semibold">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="text-ink-2 text-left text-[13px]">
              {onSelectBlock && <th className="py-2 pr-3 font-medium">Bloque</th>}
              <th className="py-2 pr-3 font-medium">Tx</th>
              <th className="px-3 py-2 font-medium">Tipo</th>
              <th className="px-3 py-2 font-medium">De</th>
              <th className="px-3 py-2 font-medium">Para</th>
              <th className="px-3 py-2 text-right font-medium">Monto</th>
              <th className="py-2 pl-3 font-medium">Motivo</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => {
              const emision = t.tipo === 'EMISIÓN'
              return (
                <tr key={t.hash} className="border-divider border-t">
                  {onSelectBlock && (
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        onClick={() => onSelectBlock(t.bloque)}
                        className="text-scesi hover:text-scesi-hover min-h-11 cursor-pointer border-none bg-transparent p-0 font-mono"
                      >
                        #{t.bloque}
                      </button>
                    </td>
                  )}
                  <td className="text-scesi py-3 pr-3 font-mono" title={t.hash}>
                    {shortHash(t.hash)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded px-2 py-[3px] font-mono text-[13px] ${
                        emision ? 'bg-scesi-tint text-scesi' : 'bg-divider text-ink'
                      }`}
                    >
                      {t.tipo}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{t.de}</td>
                  <td className="p-3 font-mono">{t.para}</td>
                  <td className="p-3 text-right font-mono whitespace-nowrap">
                    {t.monto !== null ? `${t.monto} SCC` : '—'}
                  </td>
                  <td className="text-ink-2 py-3 pl-3">{t.motivo}</td>
                </tr>
              )
            })}
            {txs.length === 0 && (
              <tr className="border-divider border-t">
                <td colSpan={onSelectBlock ? 7 : 6} className="text-ink-2 py-6 text-center">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
