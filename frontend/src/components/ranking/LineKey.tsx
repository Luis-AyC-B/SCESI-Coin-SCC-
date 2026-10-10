import type { SeriesStyle } from './seriesStyle'

export default function LineKey({ style }: { style: SeriesStyle }) {
  return (
    <svg width="18" height="4" aria-hidden="true" className="flex-none">
      <line x1="1" y1="2" x2="17" y2="2" stroke={style.color} strokeWidth={style.highlight ? 3 : 2} strokeDasharray={style.dash ? '4 3' : undefined} strokeLinecap="round" />
    </svg>
  )
}
