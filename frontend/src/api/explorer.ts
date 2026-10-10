import { useQuery } from '@tanstack/react-query'
// TODO: reemplazar el mock por la API real (/explorer/stats, /explorer/blocks, /explorer/blocks/:n, /explorer/search?q=)
import { getBlock, getExplorerStats, getLatestBlocks, searchExplorer } from './mock'

export function useExplorerStats() {
  return useQuery({ queryKey: ['explorer', 'stats'], queryFn: getExplorerStats })
}

export function useLatestBlocks() {
  return useQuery({ queryKey: ['explorer', 'blocks'], queryFn: () => getLatestBlocks() })
}

export function useBlock(numero: number | null) {
  return useQuery({
    queryKey: ['explorer', 'block', numero],
    queryFn: () => getBlock(numero!),
    enabled: numero !== null,
  })
}

export function useExplorerSearch(q: string) {
  return useQuery({
    queryKey: ['explorer', 'search', q],
    queryFn: () => searchExplorer(q),
    enabled: q.trim().length > 0,
  })
}
