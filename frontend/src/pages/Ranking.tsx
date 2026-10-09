import { useState } from 'react'
import { useAreaRanking, useIndividualRanking } from '@/api/ranking'
import AreaTable from '@/components/ranking/AreaTable'
import IndividualTable from '@/components/ranking/IndividualTable'
import RankingChart from '@/components/ranking/RankingChart'
import { seriesStyles } from '@/components/ranking/seriesStyle'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { gestionActual } from '@/lib/format'

const CHART_TOP = 5

type Mode = 'individual' | 'area'
type View = 'chart' | 'table'

export default function Ranking() {
  const [mode, setMode] = useState<Mode>('individual')
  const [view, setView] = useState<View>('chart')
  const individual = useIndividualRanking()
  const areas = useAreaRanking()
  const query = mode === 'individual' ? individual : areas

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-ink-2 font-mono text-sm tracking-[0.08em] uppercase">
            {gestionActual()} · SCC ganados acumulados
          </div>
          <h1 className="mt-1.5 mb-0 text-[32px] font-semibold tracking-tight">Ranking</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <SegmentedControl
            label="Tipo de ranking"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'individual', label: 'Individual' },
              { value: 'area', label: 'Por áreas' },
            ]}
          />
          <SegmentedControl
            label="Vista"
            value={view}
            onChange={setView}
            options={[
              { value: 'chart', label: 'Gráfico' },
              { value: 'table', label: 'Tabla' },
            ]}
          />
        </div>
      </div>

      {query.isPending && <p className="text-ink-2">Cargando…</p>}
      {query.isError && <p className="text-scesi">No se pudo cargar el ranking.</p>}

      {mode === 'individual' && individual.data && (() => {
        const { meses, filas } = individual.data
        if (view === 'table') return <IndividualTable filas={filas} />
        // Más de 6 líneas en grises no se distinguen: el gráfico muestra el top 5 y a ti; la tabla, a todos
        const visibles = filas.filter((f) => f.posicion <= CHART_TOP || f.esYo)
        const styles = seriesStyles(
          visibles.map((f) => f.handle),
          visibles.find((f) => f.esYo)?.handle,
        )
        return (
          <RankingChart
            title={`Evolución individual · top ${CHART_TOP}`}
            meses={meses}
            series={visibles.map((f) => ({
              key: f.handle,
              name: f.esYo ? `${f.nombre} (tú)` : f.nombre,
              posicion: f.posicion,
              total: f.scc,
              values: f.serie,
              style: styles.get(f.handle)!,
            }))}
          />
        )
      })()}

      {mode === 'area' && areas.data && (() => {
        const { meses, filas } = areas.data
        const styles = seriesStyles(
          filas.map((f) => f.area),
          filas.find((f) => f.esMiArea)?.area,
        )
        if (view === 'table') return <AreaTable filas={filas} styles={styles} />
        return (
          <RankingChart
            title="Evolución por área"
            meses={meses}
            series={filas.map((f) => ({
              key: f.area,
              name: f.area,
              posicion: f.posicion,
              total: f.scc,
              values: f.serie,
              style: styles.get(f.area)!,
            }))}
          />
        )
      })()}
    </div>
  )
}
