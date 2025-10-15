import React from 'react'
import { Folder, Trash2, Calendar, FileCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      onDelete(project.id)
    }
  }

  return (
    <Link
      to={`/projects/${project.id}/generate`}
      className="card hover:shadow-md transition-shadow duration-200 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Folder className="text-primary-600" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-primary-600 transition-colors">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{project.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              {project.generation_count !== undefined && (
                <div className="flex items-center gap-1">
                  <FileCode size={14} />
                  <span>{project.generation_count} generations</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Link>
  )
}
