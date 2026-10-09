import { Link } from 'react-router'
import type { Me } from '@/types'

const COUNT_LABELS: [codigo: string, label: string][] = [
  ['TALLER', 'Talleres'],
  ['ORGANIZACION', 'Eventos'],
  ['COMPETENCIA', 'Competencias'],
  ['PROYECTO', 'Proyectos'],
  ['INVESTIGACION', 'Investigaciones'],
  ['ASISTENCIA', 'Asistencias'],
]

export default function ProfileCard({ me }: { me: Me }) {
  const next = me.siguienteRango
  const pct = next ? Math.min(100, Math.round((me.scc / next.scc_requeridos) * 100)) : 100
  const canClaim = next !== null && me.scc >= next.scc_requeridos

  return (
    <section className="rounded-card border-border flex min-w-0 flex-[999_1_560px] flex-wrap items-center gap-6 border bg-white p-6">
      <div className="flex min-w-0 flex-[1_1_260px] items-center gap-4">
        <div
          aria-hidden="true"
          className="border-scesi bg-scesi-tint text-scesi flex size-22 flex-none items-center justify-center rounded-full border-[3px] font-mono text-3xl font-semibold"
        >
          {me.nombre[0]}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="text-scesi font-mono text-2xl font-semibold">{me.nombre}</div>
          <div className="text-[15px]">Área {me.area}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="bg-ink rounded px-3 py-1 text-sm font-bold tracking-[0.04em] text-white">
              {me.rango.nombre.toUpperCase()}
            </span>
            <span className="text-ink-2 font-mono text-sm">#{me.posicion} en la gestión</span>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="text-ink-2 flex justify-between text-sm">
            {next ? (
              <span>
                Próximo rango: <b className="text-ink">{next.nombre}</b>
              </span>
            ) : (
              <span>Rango máximo alcanzado</span>
            )}
            {next && (
              <span className="font-mono">
                {me.scc} / {next.scc_requeridos} SCC
              </span>
            )}
          </div>
          <div
            role="progressbar"
            aria-label="Progreso al próximo rango"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            className="bg-divider h-2 rounded"
          >
            <div className="bg-scesi h-2 rounded" style={{ width: `${pct}%` }} />
          </div>
          {canClaim && (
            <Link to="/premios" className="text-scesi hover:text-scesi-hover text-sm font-semibold">
              Ya puedes reclamar {next.nombre} →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {COUNT_LABELS.map(([codigo, label]) => (
            <div key={codigo}>
              <div className="font-mono text-xl font-semibold">
                {me.conteos.find((c) => c.actividad.codigo === codigo)?.cantidad ?? 0}
              </div>
              <div className="text-ink-2 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
