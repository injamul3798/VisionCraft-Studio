import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, History as HistoryIcon, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-white font-semibold">Loading project...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="glass rounded-3xl p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
            <p className="text-gray-600 mb-6">The project you are looking for does not exist.</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Go Back to Projects
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-73px)]">
        {/* Project header with glassmorphism */}
        <motion.div
          className="glass border-b border-white/20 px-6 py-4 flex items-center justify-between shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-white/50 hover:bg-white transition-all text-gray-700 hover:text-primary-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Sparkles size={18} className="text-primary-500" />
                {project.name}
              </h2>
              {project.description && (
                <p className="text-sm text-gray-600">{project.description}</p>
              )}
            </div>
          </div>
          <motion.button
            onClick={toggleHistoryPanel}
            className={'flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-semibold ' + (historyPanelOpen ? 'bg-primary-500 text-white shadow-lg' : 'bg-white/50 hover:bg-white text-gray-700')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HistoryIcon size={18} />
            <span className="text-sm">History</span>
          </motion.button>
        </motion.div>

        {/* Main workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Chat Panel */}
          <motion.div
            className="w-1/3 border-r border-white/20 flex flex-col glass"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
              {projectId && <ChatHistory projectId={projectId} />}
            </div>
            <div className="border-t border-white/20 p-4 bg-white/50 backdrop-blur-sm">
              <ChatInput
                onSubmit={handleGenerate}
                isLoading={isStreaming}
                placeholder="Describe what you want to create..."
              />
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 p-3 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl text-sm text-red-600 font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right: Preview Panel */}
          <div className="flex-1 flex">
            <motion.div
              className="flex-1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <PreviewPane htmlContent={currentHTML} isGenerating={isStreaming} />
            </motion.div>

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
