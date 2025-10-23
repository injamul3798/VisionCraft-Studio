import React from 'react'
import { Folder, Trash2, Calendar, FileCode, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    if (confirm('Are you sure you want to delete "' + project.name + '"?')) {
      onDelete(project.id)
    }
  }

  return (
    <Link to={'/projects/' + project.id + '/generate'}>
      <motion.div
        className="glass rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 group relative overflow-hidden"
        whileHover={{ scale: 1.02, y: -4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <Folder className="text-white" size={26} />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-1.5 truncate group-hover:text-gradient transition-all">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 p-1.5 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
                <Calendar size={13} />
                <span className="font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              {project.generation_count !== undefined && (
                <div className="flex items-center gap-1.5 bg-primary-50/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
                  <Sparkles size={13} className="text-primary-600" />
                  <span className="font-medium text-primary-700">{project.generation_count} generations</span>
                </div>
              )}
            </div>
            
            <motion.div
              className="flex items-center gap-1 text-sm font-semibold text-primary-600 opacity-0 group-hover:opacity-100"
              initial={{ x: -10 }}
              animate={{ x: 0 }}
            >
              <span>Open</span>
              <ArrowRight size={16} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
