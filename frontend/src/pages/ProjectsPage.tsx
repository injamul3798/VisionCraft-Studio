import React, { useState } from 'react'
import { Plus, FolderOpen } from 'lucide-react'
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
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">Create and manage your VisionCraft projects</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            New Project
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FolderOpen size={48} />}
            title="No projects yet"
            description="Create your first project to start generating interactive prototypes"
            action={
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={20} className="mr-2" />
                Create Project
              </Button>
            }
          />
        )}

        <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      </div>
    </Layout>
  )
}
