import { useQuery } from '@tanstack/react-query'
// TODO: reemplazar el mock por la API real (api('/ranking?mode=individual|area'))
import { getAreaRanking, getIndividualRanking } from './mock'

export function useIndividualRanking() {
  return useQuery({ queryKey: ['ranking', 'individual'], queryFn: getIndividualRanking })
}

export function useAreaRanking() {
  return useQuery({ queryKey: ['ranking', 'area'], queryFn: getAreaRanking })
}
