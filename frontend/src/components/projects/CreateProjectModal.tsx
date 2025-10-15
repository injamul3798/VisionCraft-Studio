import React, { useState } from 'react'
import { Modal } from '@/components/shared/Modal'
import { Input } from '@/components/shared/Input'
import { Textarea } from '@/components/shared/Textarea'
import { Button } from '@/components/shared/Button'
import { useCreateProject } from '@/hooks/useProjects'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const createProject = useCreateProject()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createProject.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      })
      setName('')
      setDescription('')
      onClose()
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Project"
          required
          autoFocus
        />
        <Textarea
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project..."
          rows={3}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createProject.isPending}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  )
}
