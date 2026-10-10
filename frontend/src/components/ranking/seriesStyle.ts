// Paleta del proyecto: el resaltado va en rojo y el resto en negro/grises.
// Los grises se distinguen por luminosidad y, a partir del 4º, también por trazo punteado.
const GREYS = ['#1E1E1E', '#5A5A5A', '#8A8A8A']
const HIGHLIGHT = '#C1363D'

export interface SeriesStyle {
  color: string
  dash?: string
  highlight: boolean
}

/** El estilo sigue a la entidad (orden alfabético), no a su posición en el ranking. */
export function seriesStyles(keys: string[], highlightKey?: string): Map<string, SeriesStyle> {
  const map = new Map<string, SeriesStyle>()
  ;[...keys]
    .filter((k) => k !== highlightKey)
    .sort((a, b) => a.localeCompare(b))
    .forEach((k, i) => map.set(k, { color: GREYS[i % GREYS.length], dash: i >= GREYS.length ? '6 4' : undefined, highlight: false }))
  if (highlightKey !== undefined) map.set(highlightKey, { color: HIGHLIGHT, highlight: true })
  return map
}
