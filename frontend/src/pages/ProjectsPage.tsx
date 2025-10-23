import React, { useState } from 'react'
import { Plus, FolderOpen, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/shared/Button'
import { Spinner } from '@/components/shared/Spinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { CreateProjectModal } from '@/components/projects/CreateProjectModal'
import { useProjects, useDeleteProject } from '@/hooks/useProjects'

export const ProjectsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { data: projects, isLoading } = useProjects()
  const deleteProject = useDeleteProject()

  const handleDelete = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <motion.div
            className="glass rounded-3xl shadow-2xl p-8 mb-10 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center"
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="text-white" size={24} />
                  </motion.div>
                  <h1 className="text-4xl font-black text-gradient">
                    Your Projects
                  </h1>
                </div>
                <p className="text-gray-700 text-lg mb-4 flex items-center gap-2">
                  <Zap size={18} className="text-primary-500" />
                  <span>Create stunning prototypes with AI in seconds</span>
                </p>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-sm font-semibold text-gray-700">
                    {projects?.length || 0} Projects
                  </div>
                  {projects && projects.length > 0 && (
                    <div className="px-4 py-2 bg-primary-50/60 backdrop-blur-sm rounded-xl text-sm font-semibold text-primary-700">
                      {projects.reduce((acc, p) => acc + (p.generation_count || 0), 0)} Total Generations
                    </div>
                  )}
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus size={20} className="mr-2" />
                  New Project
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Spinner size="lg" />
                <p className="mt-4 text-gray-600 font-medium">Loading your projects...</p>
              </div>
            </div>
          ) : projects && projects.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard project={project} onDelete={handleDelete} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl p-12"
            >
              <EmptyState
                icon={<FolderOpen size={64} className="text-primary-500" />}
                title="No projects yet"
                description="Create your first project to start generating interactive prototypes with AI"
                action={
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={20} className="mr-2" />
                    Create Your First Project
                  </Button>
                }
              />
            </motion.div>
          )}
        </div>
      </div>

      <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </Layout>
  )
}
