import { shortWallet } from '@/lib/format'
import type { Me } from '@/types'

export default function BalanceCard({ me, onRequest }: { me: Me; onRequest: () => void }) {
  return (
    <section className="rounded-card bg-ink flex min-w-0 flex-[1_1_280px] flex-col justify-between gap-3 p-6 text-white">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#B5B5B5]">SCC ganados</span>
        <span className="font-mono text-[13px] text-[#B5B5B5]">{shortWallet(me.wallet)}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-5xl font-medium tracking-tight">{me.scc}</span>
        <span className="text-scesi-light font-mono text-base">SCC</span>
      </div>
      <button
        type="button"
        onClick={onRequest}
        className="bg-scesi hover:bg-scesi-hover min-h-12 cursor-pointer rounded-lg border-none text-[15px] font-semibold text-white"
      >
        Solicitar coins
      </button>
    </section>
  )
}
