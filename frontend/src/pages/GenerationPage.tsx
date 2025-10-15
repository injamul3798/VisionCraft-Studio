import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, History as HistoryIcon } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { ChatInput } from '@/components/generation/ChatInput'
import { PreviewPane } from '@/components/generation/PreviewPane'
import { ChatHistory } from '@/components/generation/ChatHistory'
import { HistoryPanel } from '@/components/generation/HistoryPanel'
import { Spinner } from '@/components/shared/Spinner'
import { useProject } from '@/hooks/useProjects'
import { useStreamingGeneration } from '@/hooks/useStreamingGeneration'
import { useUIStore } from '@/stores/uiStore'
import type { Generation } from '@/types'

export const GenerationPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading: projectLoading } = useProject(projectId)
  const { generateHTML, isStreaming, streamedContent, error } = useStreamingGeneration()

  const [currentHTML, setCurrentHTML] = useState('')
  const [selectedGenerationId, setSelectedGenerationId] = useState<string | null>(null)

  const { historyPanelOpen, toggleHistoryPanel } = useUIStore()

  useEffect(() => {
    if (streamedContent) {
      setCurrentHTML(streamedContent)
    }
  }, [streamedContent])

  const handleGenerate = async (prompt: string) => {
    if (!projectId) return

    await generateHTML(
      {
        project_id: projectId,
        user_prompt: prompt,
      },
      undefined,
      (generationId) => {
        setSelectedGenerationId(generationId)
      }
    )
  }

  const handleSelectGeneration = (generation: Generation) => {
    if (generation.html_content) {
      setCurrentHTML(generation.html_content)
      setSelectedGenerationId(generation.id)
    }
  }

  if (projectLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Spinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
            <p className="text-gray-600">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-73px)]">
        {/* Project header */}
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="font-semibold text-gray-900">{project.name}</h2>
              {project.description && <p className="text-sm text-gray-600">{project.description}</p>}
            </div>
          </div>
          <button
            onClick={toggleHistoryPanel}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              historyPanelOpen ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
            }`}
          >
            <HistoryIcon size={20} />
            <span className="text-sm font-medium">History</span>
          </button>
        </div>

        {/* Main workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Chat */}
          <div className="w-1/3 border-r flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
              {projectId && <ChatHistory projectId={projectId} />}
            </div>
            <div className="border-t p-4">
              <ChatInput
                onSubmit={handleGenerate}
                isLoading={isStreaming}
                placeholder="Describe what you want to create, or ask for changes..."
              />
              {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div className="flex-1 flex">
            <div className="flex-1">
              <PreviewPane htmlContent={currentHTML} isGenerating={isStreaming} />
            </div>

            {/* History Panel */}
            {projectId && (
              <HistoryPanel
                projectId={projectId}
                currentGenerationId={selectedGenerationId}
                onSelectGeneration={handleSelectGeneration}
                onClose={toggleHistoryPanel}
                isOpen={historyPanelOpen}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
