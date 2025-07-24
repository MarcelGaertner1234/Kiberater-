'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

// Types
export interface DashboardStats {
  assessmentScore: number
  completedProjects: number
  activeRoadmaps: number
  upcomingTasks: number
  weeklyChange: {
    assessmentScore: number
    completedProjects: number
    activeRoadmaps: number
    upcomingTasks: number
  }
}

export interface DashboardActivity {
  id: string
  type: 'project_created' | 'milestone_completed' | 'assessment_updated' | 'task_assigned'
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  metadata?: any
}

export interface DashboardData {
  stats: DashboardStats
  recentActivity: DashboardActivity[]
  upcomingTasks: Array<{
    id: string
    title: string
    date: string
    type: 'meeting' | 'task' | 'training'
    priority: 'high' | 'medium' | 'low'
  }>
  progressData: Array<{
    phase: string
    progress: number
    status: 'completed' | 'in_progress' | 'pending'
  }>
}

// API functions
const dashboardApi = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats'),
  getActivity: () => apiClient.get<DashboardActivity[]>('/dashboard/activity'),
  getOverview: () => apiClient.get<DashboardData>('/dashboard/overview'),
}

// Hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: dashboardApi.getActivity,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: dashboardApi.getOverview,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

// Aggregate hook für alle Dashboard-Daten
export function useDashboard() {
  const stats = useDashboardStats()
  const activity = useDashboardActivity()
  const overview = useDashboardOverview()

  return {
    stats: stats.data,
    activity: activity.data,
    overview: overview.data,
    isLoading: stats.isLoading || activity.isLoading || overview.isLoading,
    isError: stats.isError || activity.isError || overview.isError,
    error: stats.error || activity.error || overview.error,
    refetch: () => {
      stats.refetch()
      activity.refetch()
      overview.refetch()
    }
  }
}

// Mock Data für Entwicklung
export const generateMockDashboardData = (): DashboardData => ({
  stats: {
    assessmentScore: 75,
    completedProjects: 12,
    activeRoadmaps: 3,
    upcomingTasks: 8,
    weeklyChange: {
      assessmentScore: 12,
      completedProjects: 3,
      activeRoadmaps: 1,
      upcomingTasks: -2,
    }
  },
  recentActivity: [
    {
      id: '1',
      type: 'project_created',
      title: 'Neues KI-Projekt',
      description: 'Customer Service Chatbot wurde erstellt',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
      user: { name: 'John Doe' }
    },
    {
      id: '2',
      type: 'milestone_completed',
      title: 'Meilenstein erreicht',
      description: 'Assessment Phase abgeschlossen',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
      user: { name: 'Maria Schmidt' }
    },
    {
      id: '3',
      type: 'assessment_updated',
      title: 'Assessment aktualisiert',
      description: 'KI-Readiness Score verbessert (+12%)',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1d ago
      user: { name: 'Thomas Weber' }
    },
    {
      id: '4',
      type: 'task_assigned',
      title: 'Neue Aufgabe',
      description: 'Team Training für KI-Tools geplant',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2d ago
      user: { name: 'Lisa Müller' }
    }
  ],
  upcomingTasks: [
    {
      id: '1',
      title: 'Berater-Gespräch: Chatbot Review',
      date: 'Heute, 14:00',
      type: 'meeting',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Datenmodell finalisieren',
      date: 'Morgen',
      type: 'task',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Team Training: KI Grundlagen',
      date: 'Freitag, 10:00',
      type: 'training',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Projekt Review Meeting',
      date: 'Nächste Woche',
      type: 'meeting',
      priority: 'low'
    }
  ],
  progressData: [
    { phase: 'Assessment', progress: 100, status: 'completed' },
    { phase: 'Strategieplanung', progress: 75, status: 'in_progress' },
    { phase: 'Implementation', progress: 45, status: 'in_progress' },
    { phase: 'Erfolgsmessung', progress: 0, status: 'pending' }
  ]
})