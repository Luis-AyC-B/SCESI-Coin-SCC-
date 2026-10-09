import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { NuevaPeticion } from '@/types'
// TODO: reemplazar el mock por la API real (api('/me'), api('/me/transactions'), api('/requests'))
import { createRequest, getActivities, getMe, getMyMovements } from './mock'

export function useMe() {
  return useQuery({ queryKey: ['me'], queryFn: getMe })
}

export function useMyMovements() {
  return useQuery({ queryKey: ['me', 'movements'], queryFn: getMyMovements })
}

export function useActivities() {
  return useQuery({ queryKey: ['activities'], queryFn: getActivities, staleTime: Infinity })
}

export function useCreateRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: NuevaPeticion) => createRequest(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  })
}
