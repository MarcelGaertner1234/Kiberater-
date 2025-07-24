'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

// Types
export interface Project {
  id: string
  title: string
  description: string
  status: 'planning' | 'in_progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  progress: number
  dueDate: string
  createdAt: string
  updatedAt: string
  team: Array<{
    id: string
    name: string
    role: string
    avatar?: string
  }>
  tags: string[]
  metadata?: any
}

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'backlog' | 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assigneeId?: string
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  dueDate?: string
  createdAt: string
  updatedAt: string
  position: number
  tags: string[]
  estimatedHours?: number
  actualHours?: number
}

export interface KanbanColumn {
  id: string
  title: string
  tasks: Task[]
  color?: string
  limit?: number
}

export interface ProjectStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalTasks: number
  completedTasks: number
  averageCompletionTime: number
  teamEfficiency: number
}

// API functions
const projectsApi = {
  getProjects: () => apiClient.get<Project[]>('/projects'),
  getProject: (id: string) => apiClient.get<Project>(`/projects/${id}`),
  createProject: (data: Partial<Project>) => apiClient.post<Project>('/projects', data),
  updateProject: (id: string, data: Partial<Project>) => apiClient.put<Project>(`/projects/${id}`, data),
  deleteProject: (id: string) => apiClient.delete(`/projects/${id}`),
  
  getTasks: (projectId?: string) => 
    apiClient.get<Task[]>('/tasks', projectId ? { projectId } : {}),
  getTask: (id: string) => apiClient.get<Task>(`/tasks/${id}`),
  createTask: (data: Partial<Task>) => apiClient.post<Task>('/tasks', data),
  updateTask: (id: string, data: Partial<Task>) => apiClient.put<Task>(`/tasks/${id}`, data),
  deleteTask: (id: string) => apiClient.delete(`/tasks/${id}`),
  moveTask: (id: string, newStatus: Task['status'], position: number) =>
    apiClient.patch<Task>(`/tasks/${id}/move`, { status: newStatus, position }),
  
  getKanbanBoard: (projectId: string) => apiClient.get<KanbanColumn[]>(`/projects/${projectId}/kanban`),
  getProjectStats: () => apiClient.get<ProjectStats>('/projects/stats'),
}

// Project Hooks
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectsApi.updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', id] })
    },
  })
}

// Task Hooks
export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: projectId ? ['tasks', 'project', projectId] : ['tasks'],
    queryFn: () => projectsApi.getTasks(projectId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => projectsApi.getTask(id),
    enabled: !!id,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: projectsApi.createTask,
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      if (task.projectId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', 'project', task.projectId] })
        queryClient.invalidateQueries({ queryKey: ['kanban', task.projectId] })
      }
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      projectsApi.updateTask(id, data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['tasks', task.id] })
      if (task.projectId) {
        queryClient.invalidateQueries({ queryKey: ['kanban', task.projectId] })
      }
    },
  })
}

export function useMoveTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status, position }: { id: string; status: Task['status']; position: number }) =>
      projectsApi.moveTask(id, status, position),
    onSuccess: (task) => {
      if (task.projectId) {
        queryClient.invalidateQueries({ queryKey: ['kanban', task.projectId] })
        queryClient.invalidateQueries({ queryKey: ['tasks', 'project', task.projectId] })
      }
    },
  })
}

// Kanban Board Hook
export function useKanbanBoard(projectId: string) {
  return useQuery({
    queryKey: ['kanban', projectId],
    queryFn: () => projectsApi.getKanbanBoard(projectId),
    enabled: !!projectId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useProjectStats() {
  return useQuery({
    queryKey: ['projects', 'stats'],
    queryFn: projectsApi.getProjectStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Mock Data Generator für Entwicklung
export const generateMockProjects = (count: number = 10): Project[] => {
  const statuses: Project['status'][] = ['planning', 'in_progress', 'review', 'completed']
  const priorities: Project['priority'][] = ['low', 'medium', 'high']
  
  return Array.from({ length: count }, (_, index) => ({
    id: `project-${index + 1}`,
    title: [
      'Customer Service Chatbot',
      'Sales Process Automation',
      'Data Analytics Dashboard',
      'Inventory Management System',
      'Marketing Campaign Optimizer',
      'HR Recruitment Assistant',
      'Financial Report Generator',
      'Quality Control System',
      'Supply Chain Tracker',
      'Customer Feedback Analyzer'
    ][index] || `Projekt ${index + 1}`,
    description: `Beschreibung für Projekt ${index + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    progress: Math.floor(Math.random() * 100),
    dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    team: [
      { id: '1', name: 'John Doe', role: 'Project Manager' },
      { id: '2', name: 'Maria Schmidt', role: 'Developer' },
      { id: '3', name: 'Thomas Weber', role: 'Designer' }
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    tags: ['KI', 'Automation', 'Dashboard'].slice(0, Math.floor(Math.random() * 3) + 1),
  }))
}

export const generateMockTasks = (projectId: string, count: number = 20): Task[] => {
  const statuses: Task['status'][] = ['backlog', 'todo', 'in_progress', 'done']
  const priorities: Task['priority'][] = ['low', 'medium', 'high']
  
  return Array.from({ length: count }, (_, index) => ({
    id: `task-${projectId}-${index + 1}`,
    projectId,
    title: [
      'Datenmodell definieren',
      'API Endpoints erstellen',
      'Frontend Interface designen',
      'Tests schreiben',
      'Dokumentation erstellen',
      'Code Review durchführen',
      'Deployment vorbereiten',
      'User Testing',
      'Performance Optimierung',
      'Security Audit'
    ][index % 10],
    description: `Detaillierte Beschreibung für Task ${index + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    assignee: Math.random() > 0.3 ? {
      id: `user-${Math.floor(Math.random() * 3) + 1}`,
      name: ['John Doe', 'Maria Schmidt', 'Thomas Weber'][Math.floor(Math.random() * 3)],
    } : undefined,
    dueDate: Math.random() > 0.5 ? 
      new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString() : 
      undefined,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    position: index,
    tags: ['Frontend', 'Backend', 'Testing', 'Documentation'].slice(0, Math.floor(Math.random() * 2) + 1),
    estimatedHours: Math.floor(Math.random() * 16) + 1,
    actualHours: Math.floor(Math.random() * 20),
  }))
}