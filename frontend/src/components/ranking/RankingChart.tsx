import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps, type TooltipValueType } from 'recharts'

type TooltipProps = TooltipContentProps<TooltipValueType, string | number>
import LineKey from './LineKey'
import type { SeriesStyle } from './seriesStyle'

export interface ChartSeries {
  key: string
  name: string
  posicion: number
  total: number
  values: number[]
  style: SeriesStyle
}

interface Props {
  title: string
  meses: string[]
  series: ChartSeries[]
}

export default function RankingChart({ title, meses, series }: Props) {
  const data = meses.map((mes, i) => ({ mes, ...Object.fromEntries(series.map((s) => [s.key, s.values[i]])) }))
  // la serie resaltada se dibuja al final para quedar encima
  const drawOrder = [...series].sort((a, b) => Number(a.style.highlight) - Number(b.style.highlight))
  const byKey = new Map(series.map((s) => [s.key, s]))

  return (
    <section className="rounded-card border-border flex flex-col gap-4 border bg-white p-6">
      <h2 className="m-0 text-xl font-semibold">{title}</h2>
      <div className="overflow-x-auto">
        <div className="h-[380px] min-w-[640px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 12, right: 24, bottom: 4, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#E3E3E3" />
              <XAxis
                dataKey="mes"
                tickLine={false}
                axisLine={{ stroke: '#D2D2D2' }}
                tick={{ fill: '#3D3D3D', fontSize: 12 }}
                padding={{ left: 24, right: 24 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={44}
                tick={{ fill: '#3D3D3D', fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }}
              />
              <Tooltip
                cursor={{ stroke: '#3D3D3D', strokeWidth: 1 }}
                content={(props) => <ChartTooltip {...props} byKey={byKey} />}
              />
              {drawOrder.map((s) => (
                <Line
                  key={s.key}
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.style.color}
                  strokeWidth={s.style.highlight ? 3 : 2}
                  strokeDasharray={s.style.dash}
                  dot={{ r: 4, fill: '#FFFFFF', strokeWidth: 2, strokeDasharray: '' }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#FFFFFF', fill: s.style.color }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Leyenda">
        {series.map((s) => (
          <li
            key={s.key}
            className={`border-divider flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
              s.style.highlight ? 'bg-scesi-tint' : 'bg-white'
            }`}
          >
            <LineKey style={s.style} />
            <span className="font-mono font-semibold">#{s.posicion}</span>
            <span className={s.style.highlight ? 'font-bold' : 'font-medium'}>{s.name}</span>
            <span className="text-ink-2 font-mono">{s.total} SCC</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
  byKey,
}: TooltipProps & { byKey: Map<string, ChartSeries> }) {
  if (!active || !payload?.length) return null
  const rows = payload
    .map((p) => ({ serie: byKey.get(String(p.dataKey)), value: Number(p.value) }))
    .filter((r) => r.serie)
    .sort((a, b) => b.value - a.value)

  return (
    <div className="border-border rounded-lg border bg-white px-3 py-2.5 text-sm shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <div className="text-ink-2 mb-1.5 font-semibold">{label}</div>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {rows.map(({ serie, value }) => (
          <li key={serie!.key} className="flex items-center gap-2">
            <LineKey style={serie!.style} />
            <span className="text-ink w-8 text-right font-mono font-semibold">{value}</span>
            <span className="text-ink-2">{serie!.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
