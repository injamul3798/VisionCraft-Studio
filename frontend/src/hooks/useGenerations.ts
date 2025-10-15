import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Generation } from '@/types'

export const useGenerations = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['generations', projectId],
    queryFn: async () => {
      if (!projectId) return []
      const response = await api.get<Generation[]>(`/generations/projects/${projectId}/generations`)
      return response.data
    },
    enabled: !!projectId,
  })
}

export const useGeneration = (generationId: string | undefined) => {
  return useQuery({
    queryKey: ['generation', generationId],
    queryFn: async () => {
      if (!generationId) return null
      const response = await api.get<Generation>(`/generations/${generationId}`)
      return response.data
    },
    enabled: !!generationId,
  })
}

export const useDeleteGeneration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/generations/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generations'] })
    },
  })
}
