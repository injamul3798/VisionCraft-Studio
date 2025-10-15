import React from 'react'
import { Clock, X, Eye } from 'lucide-react'
import { useGenerations } from '@/hooks/useGenerations'
import { Spinner } from '@/components/shared/Spinner'
import type { Generation } from '@/types'

interface HistoryPanelProps {
  projectId: string
  currentGenerationId: string | null
  onSelectGeneration: (generation: Generation) => void
  onClose: () => void
  isOpen: boolean
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  projectId,
  currentGenerationId,
  onSelectGeneration,
  onClose,
  isOpen,
}) => {
  const { data: generations, isLoading } = useGenerations(projectId)

  if (!isOpen) return null

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-gray-600" />
          <h3 className="font-semibold">History</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : generations && generations.length > 0 ? (
          <div className="p-2 space-y-2">
            {generations.map((generation) => (
              <button
                key={generation.id}
                onClick={() => onSelectGeneration(generation)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  generation.id === currentGenerationId
                    ? 'bg-primary-50 border-primary-300'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">Version {generation.version}</span>
                    <span
                      className={`badge ${
                        generation.status === 'completed'
                          ? 'badge-success'
                          : generation.status === 'failed'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {generation.status}
                    </span>
                  </div>
                  {generation.id === currentGenerationId && <Eye size={16} className="text-primary-600" />}
                </div>
                <p className="text-xs text-gray-500">{new Date(generation.created_at).toLocaleString()}</p>
                {generation.preview && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{generation.preview}...</p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
            No generations yet
          </div>
        )}
      </div>
    </div>
  )
}
