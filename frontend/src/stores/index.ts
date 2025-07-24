/**
 * Zustand Stores - Zentrale Exports
 * State Management für die KI-Beratungsplattform
 */

export { useDashboardStore } from './dashboardStore'
export { useProjectStore } from './projectStore'
export { useRoadmapStore } from './roadmapStore'
export { useUiStore } from './uiStore'
export { useAuthStore } from './authStore'
export { useAssessmentStore } from './assessmentStore'

// Type exports
export type { 
  DashboardState,
  DashboardActions
} from './dashboardStore'

export type { 
  ProjectState,
  ProjectActions
} from './projectStore'

export type { 
  RoadmapState,
  RoadmapActions
} from './roadmapStore'