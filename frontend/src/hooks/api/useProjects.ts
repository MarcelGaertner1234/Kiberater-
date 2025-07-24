import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores'
import { Project, ProjectTask, ProjectMilestone } from '@/types/api.types'
import { apiClient } from '@/lib/api'
import { PaginatedResponse, PaginationParams } from '@/types/api.types'

export const useProjects = () => {
  const queryClient = useQueryClient()

  // Get Projects with Pagination
  const useProjectsList = (params?: PaginationParams) => {
    return useQuery({
      queryKey: ['projects', params],
      queryFn: async () => {
        const response = await apiClient.get<PaginatedResponse<Project>>('/projects', { params })
        return response.data
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
    })
  }

  // Get Project by ID
  const useProjectById = (id?: string) => {
    return useQuery({
      queryKey: ['project', id],
      queryFn: async () => {
        const response = await apiClient.get<Project>(`/projects/${id}`)
        return response.data
      },
      enabled: !!id,
      staleTime: 2 * 60 * 1000,
    })
  }

  // Create Project Mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      const response = await apiClient.post<Project>('/projects', projectData)
      return response.data
    },
    onSuccess: (newProject) => {
      toast.success('Projekt erstellt', `${newProject.title} wurde erfolgreich erstellt`)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: any) => {
      toast.error('Projekt konnte nicht erstellt werden', error.message)
    }
  })

  // Update Project Mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Project> }) => {
      const response = await apiClient.patch<Project>(`/projects/${id}`, data)
      return response.data
    },
    onSuccess: (updatedProject) => {
      toast.success('Projekt aktualisiert', 'Ihre Änderungen wurden gespeichert')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', updatedProject.id] })
    },
    onError: (error: any) => {
      toast.error('Projekt konnte nicht aktualisiert werden', error.message)
    }
  })

  // Delete Project Mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/projects/${id}`)
    },
    onSuccess: () => {
      toast.success('Projekt gelöscht', 'Das Projekt wurde erfolgreich entfernt')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: any) => {
      toast.error('Projekt konnte nicht gelöscht werden', error.message)
    }
  })

  // Duplicate Project Mutation
  const duplicateProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post<Project>(`/projects/${id}/duplicate`)
      return response.data
    },
    onSuccess: (newProject) => {
      toast.success('Projekt dupliziert', `Eine Kopie wurde als "${newProject.title}" erstellt`)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: any) => {
      toast.error('Projekt konnte nicht dupliziert werden', error.message)
    }
  })

  // Archive Project Mutation
  const archiveProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<Project>(`/projects/${id}/archive`)
      return response.data
    },
    onSuccess: () => {
      toast.success('Projekt archiviert', 'Das Projekt wurde archiviert')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: any) => {
      toast.error('Projekt konnte nicht archiviert werden', error.message)
    }
  })

  // Project Tasks Hooks
  const useProjectTasks = (projectId?: string) => {
    return useQuery({
      queryKey: ['project-tasks', projectId],
      queryFn: async () => {
        const response = await apiClient.get<ProjectTask[]>(`/projects/${projectId}/tasks`)
        return response.data
      },
      enabled: !!projectId,
      staleTime: 1 * 60 * 1000, // 1 minute
    })
  }

  // Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: async ({ projectId, taskData }: { projectId: string; taskData: Partial<ProjectTask> }) => {
      const response = await apiClient.post<ProjectTask>(`/projects/${projectId}/tasks`, taskData)
      return response.data
    },
    onSuccess: () => {
      toast.success('Aufgabe erstellt', 'Die neue Aufgabe wurde hinzugefügt')
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] })
    },
    onError: (error: any) => {
      toast.error('Aufgabe konnte nicht erstellt werden', error.message)
    }
  })

  // Update Task Mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ projectId, taskId, data }: { projectId: string; taskId: string; data: Partial<ProjectTask> }) => {
      const response = await apiClient.patch<ProjectTask>(`/projects/${projectId}/tasks/${taskId}`, data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Aufgabe aktualisiert', 'Die Änderungen wurden gespeichert')
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] })
    },
    onError: (error: any) => {
      toast.error('Aufgabe konnte nicht aktualisiert werden', error.message)
    }
  })

  // Delete Task Mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async ({ projectId, taskId }: { projectId: string; taskId: string }) => {
      await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`)
    },
    onSuccess: () => {
      toast.success('Aufgabe gelöscht', 'Die Aufgabe wurde entfernt')
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] })
    },
    onError: (error: any) => {
      toast.error('Aufgabe konnte nicht gelöscht werden', error.message)
    }
  })

  // Project Milestones Hooks
  const useProjectMilestones = (projectId?: string) => {
    return useQuery({
      queryKey: ['project-milestones', projectId],
      queryFn: async () => {
        const response = await apiClient.get<ProjectMilestone[]>(`/projects/${projectId}/milestones`)
        return response.data
      },
      enabled: !!projectId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  // Create Milestone Mutation
  const createMilestoneMutation = useMutation({
    mutationFn: async ({ projectId, milestoneData }: { projectId: string; milestoneData: Partial<ProjectMilestone> }) => {
      const response = await apiClient.post<ProjectMilestone>(`/projects/${projectId}/milestones`, milestoneData)
      return response.data
    },
    onSuccess: () => {
      toast.success('Meilenstein erstellt', 'Der neue Meilenstein wurde hinzugefügt')
      queryClient.invalidateQueries({ queryKey: ['project-milestones'] })
    },
    onError: (error: any) => {
      toast.error('Meilenstein konnte nicht erstellt werden', error.message)
    }
  })

  // Complete Milestone Mutation
  const completeMilestoneMutation = useMutation({
    mutationFn: async ({ projectId, milestoneId }: { projectId: string; milestoneId: string }) => {
      const response = await apiClient.patch<ProjectMilestone>(`/projects/${projectId}/milestones/${milestoneId}/complete`)
      return response.data
    },
    onSuccess: () => {
      toast.success('Meilenstein abgeschlossen', 'Glückwunsch zum erreichten Meilenstein!')
      queryClient.invalidateQueries({ queryKey: ['project-milestones'] })
    },
    onError: (error: any) => {
      toast.error('Meilenstein konnte nicht abgeschlossen werden', error.message)
    }
  })

  // Project Analytics
  const useProjectAnalytics = (projectId?: string) => {
    return useQuery({
      queryKey: ['project-analytics', projectId],
      queryFn: async () => {
        const response = await apiClient.get(`/projects/${projectId}/analytics`)
        return response.data
      },
      enabled: !!projectId,
      staleTime: 10 * 60 * 1000, // 10 minutes
    })
  }

  return {
    // Project CRUD
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    duplicateProject: duplicateProjectMutation.mutate,
    archiveProject: archiveProjectMutation.mutate,

    // Task Management
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,

    // Milestone Management
    createMilestone: createMilestoneMutation.mutate,
    completeMilestone: completeMilestoneMutation.mutate,

    // Mutation States
    isCreatingProject: createProjectMutation.isPending,
    isUpdatingProject: updateProjectMutation.isPending,
    isDeletingProject: deleteProjectMutation.isPending,
    isDuplicatingProject: duplicateProjectMutation.isPending,
    isArchivingProject: archiveProjectMutation.isPending,

    isCreatingTask: createTaskMutation.isPending,
    isUpdatingTask: updateTaskMutation.isPending,
    isDeletingTask: deleteTaskMutation.isPending,

    isCreatingMilestone: createMilestoneMutation.isPending,
    isCompletingMilestone: completeMilestoneMutation.isPending,

    // Hook Factories
    useProjectsList,
    useProjectById,
    useProjectTasks,
    useProjectMilestones,
    useProjectAnalytics
  }
}