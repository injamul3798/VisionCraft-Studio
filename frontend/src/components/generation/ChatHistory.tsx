import React, { useEffect, useRef } from 'react'
import { User, Bot } from 'lucide-react'
import { useChatHistory } from '@/hooks/useChatHistory'
import { Spinner } from '@/components/shared/Spinner'

interface ChatHistoryProps {
  projectId: string
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ projectId }) => {
  const { data, isLoading } = useChatHistory(projectId)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data?.messages])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spinner size="sm" />
      </div>
    )
  }

  if (!data || data.messages.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        Start a conversation to generate your first prototype
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${message.role === 'user' ? '' : 'bg-gray-50 -mx-4 px-4 py-3'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-secondary-100 text-secondary-600'
            }`}
          >
            {message.role === 'user' ? <User size={18} /> : <Bot size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 mb-1">
              {message.role === 'user' ? 'You' : 'VisionCraft AI'}
            </div>
            <div className="text-sm text-gray-900 whitespace-pre-wrap break-words">{message.content}</div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
