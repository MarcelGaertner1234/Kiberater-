/**
 * API Hooks - Zentrale Exports
 * React Query basierte API Hooks für die KI-Beratungsplattform
 */

export { useAuth } from './useAuth'
export { useAssessment } from './useAssessment'
export { useDashboard } from './useDashboard'
export { useProjects } from './useProjects'
export { useRoadmap } from './useRoadmap'
export { useAnalytics } from './useAnalytics'

// Type exports
export type { 
  DashboardStats, 
  DashboardActivity,
  DashboardData 
} from './useDashboard'

export type { 
  Project, 
  Task, 
  ProjectStats,
  KanbanColumn 
} from './useProjects'

export type { 
  Roadmap, 
  Milestone, 
  RoadmapTimeline 
} from './useRoadmap'

export type { 
  AnalyticsMetrics, 
  ChartData,
  TimeRange 
} from './useAnalytics'