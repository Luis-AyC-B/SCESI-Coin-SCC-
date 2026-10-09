import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// TODO: reemplazar el mock por la API real (api('/ranks'), api(`/ranks/${codigo}/claim`))
import { claimRank, getMyClaims, getRanks } from './mock'

export function useRanks() {
  return useQuery({ queryKey: ['ranks'], queryFn: getRanks, staleTime: Infinity })
}

export function useMyClaims() {
  return useQuery({ queryKey: ['me', 'claims'], queryFn: getMyClaims })
}

export function useClaimRank() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (codigo: string) => claimRank(codigo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  })
}
