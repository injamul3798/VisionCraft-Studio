import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { GenerateHTMLInput, StreamEvent } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const useStreamingGeneration = () => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedContent, setStreamedContent] = useState('')
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const generateHTML = useCallback(
    async (
      input: GenerateHTMLInput,
      onChunk?: (chunk: string) => void,
      onComplete?: (generationId: string) => void
    ) => {
      setIsStreaming(true)
      setStreamedContent('')
      setGenerationId(null)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/generations/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error('No reader available')
        }

        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          // Decode the chunk
          buffer += decoder.decode(value, { stream: true })

          // Process complete lines (SSE format)
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              try {
                const event: StreamEvent = JSON.parse(data)

                switch (event.type) {
                  case 'generation_id':
                    if (event.id) {
                      setGenerationId(event.id)
                    }
                    break

                  case 'chunk':
                    if (event.content) {
                      setStreamedContent((prev) => prev + event.content)
                      onChunk?.(event.content)
                    }
                    break

                  case 'complete':
                    if (event.generation_id) {
                      // Invalidate queries to refresh data
                      queryClient.invalidateQueries({ queryKey: ['generations'] })
                      queryClient.invalidateQueries({ queryKey: ['chat'] })
                      onComplete?.(event.generation_id)
                    }
                    break

                  case 'error':
                    setError(event.message || 'An error occurred')
                    break
                }
              } catch (e) {
                console.error('Failed to parse SSE data:', e)
              }
            }
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Streaming error:', err)
      } finally {
        setIsStreaming(false)
      }
    },
    [queryClient]
  )

  const reset = useCallback(() => {
    setStreamedContent('')
    setGenerationId(null)
    setError(null)
    setIsStreaming(false)
  }, [])

  return {
    generateHTML,
    isStreaming,
    streamedContent,
    generationId,
    error,
    reset,
  }
}
