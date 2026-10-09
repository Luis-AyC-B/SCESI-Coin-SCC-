import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { NuevoOtorgamiento, NuevoPremio } from '@/types'
// TODO: reemplazar el mock por la API real (/admin/requests, /admin/grants, /admin/ranks…)
import {
  approveRequest,
  createRank,
  getDecisions,
  getMembers,
  getPendingRequests,
  getRecentClaims,
  grantCoins,
  rejectRequest,
} from './mock'

export function usePendingRequests() {
  return useQuery({ queryKey: ['admin', 'pending'], queryFn: getPendingRequests })
}

export function useDecisions() {
  return useQuery({ queryKey: ['admin', 'decisions'], queryFn: getDecisions })
}

export function useRecentClaims() {
  return useQuery({ queryKey: ['admin', 'claims'], queryFn: () => getRecentClaims() })
}

export function useMembers() {
  return useQuery({ queryKey: ['members'], queryFn: getMembers })
}

// Toda acción de la directiva cambia saldos, rangos, ranking o explorador: se invalida todo
function useAdminMutation<T>(fn: (vars: T) => Promise<void>) {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: () => queryClient.invalidateQueries() })
}

export const useApproveRequest = () =>
  useAdminMutation(({ id, monto }: { id: number; monto: number }) => approveRequest(id, monto))
export const useRejectRequest = () =>
  useAdminMutation(({ id, motivo }: { id: number; motivo: string }) => rejectRequest(id, motivo))
export const useGrantCoins = () => useAdminMutation((data: NuevoOtorgamiento) => grantCoins(data))
export const useCreateRank = () => useAdminMutation((data: NuevoPremio) => createRank(data))
