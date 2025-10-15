import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { ChatMessage } from '@/types'

interface ChatHistoryResponse {
  messages: ChatMessage[]
  total: number
}

export const useChatHistory = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['chat', projectId],
    queryFn: async () => {
      if (!projectId) return { messages: [], total: 0 }
      const response = await api.get<ChatHistoryResponse>(`/chat/projects/${projectId}`)
      return response.data
    },
    enabled: !!projectId,
  })
}
