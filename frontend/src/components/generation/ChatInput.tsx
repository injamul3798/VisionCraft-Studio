import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/shared/Button'

interface ChatInputProps {
  onSubmit: (prompt: string) => void
  isLoading: boolean
  placeholder?: string
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isLoading, placeholder }) => {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return
    onSubmit(prompt.trim())
    setPrompt('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholder || 'Describe what you want to create...'}
        className="flex-1 input resize-none"
        rows={3}
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit(e)
          }
        }}
      />
      <Button type="submit" disabled={!prompt.trim() || isLoading} isLoading={isLoading}>
        <Send size={20} />
      </Button>
    </form>
  )
}
