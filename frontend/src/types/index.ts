export interface Project {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
  generation_count?: number
}

export interface Generation {
  id: string
  project_id: string
  html_content?: string
  status: 'generating' | 'completed' | 'failed'
  version: number
  created_at: string
  preview?: string
}

export interface ChatMessage {
  id: string
  project_id: string
  generation_id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface CreateProjectInput {
  name: string
  description?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
}

export interface GenerateHTMLInput {
  project_id: string
  user_prompt: string
}

export interface StreamEvent {
  type: 'generation_id' | 'chunk' | 'complete' | 'error'
  id?: string
  content?: string
  generation_id?: string
  message?: string
}
