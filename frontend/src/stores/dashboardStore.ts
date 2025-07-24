import { create } from 'zustand'
import { subscribeWithSelector, devtools } from 'zustand/middleware'
import { DashboardData } from '@/hooks/api/useDashboard'

// Types
export interface DashboardState {
  // Data
  overview: DashboardData | null
  selectedTimeRange: {
    start: string
    end: string
    period: 'day' | 'week' | 'month' | 'quarter' | 'year'
  }
  
  // UI State
  isLoading: boolean
  error: string | null
  refreshing: boolean
  
  // Widget States
  widgets: {
    stats: { visible: boolean; loading: boolean }
    activity: { visible: boolean; loading: boolean }
    projects: { visible: boolean; loading: boolean }
    charts: { visible: boolean; loading: boolean }
    tasks: { visible: boolean; loading: boolean }
  }
  
  // Filters & Settings
  filters: {
    showCompletedTasks: boolean
    showOnlyHighPriority: boolean
    activityTypes: string[]
  }
  
  // Performance
  lastRefreshed: number
  updateFrequency: number // in milliseconds
}

export interface DashboardActions {
  // Data Actions
  setOverview: (overview: DashboardData) => void
  setTimeRange: (timeRange: DashboardState['selectedTimeRange']) => void
  
  // Loading Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setRefreshing: (refreshing: boolean) => void
  
  // Widget Actions
  toggleWidget: (widget: keyof DashboardState['widgets']) => void
  setWidgetLoading: (widget: keyof DashboardState['widgets'], loading: boolean) => void
  
  // Filter Actions
  updateFilters: (filters: Partial<DashboardState['filters']>) => void
  toggleTasksFilter: (filter: 'showCompletedTasks' | 'showOnlyHighPriority') => void
  setActivityTypes: (types: string[]) => void
  
  // Utility Actions
  refreshDashboard: () => void
  resetDashboard: () => void
  updateLastRefreshed: () => void
}

// Initial State
const initialState: DashboardState = {
  overview: null,
  selectedTimeRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
    period: 'day'
  },
  
  isLoading: false,
  error: null,
  refreshing: false,
  
  widgets: {
    stats: { visible: true, loading: false },
    activity: { visible: true, loading: false },
    projects: { visible: true, loading: false },
    charts: { visible: true, loading: false },
    tasks: { visible: true, loading: false },
  },
  
  filters: {
    showCompletedTasks: false,
    showOnlyHighPriority: false,
    activityTypes: ['project_created', 'milestone_completed', 'assessment_updated', 'task_assigned'],
  },
  
  lastRefreshed: Date.now(),
  updateFrequency: 5 * 60 * 1000, // 5 minutes
}

// Store
export const useDashboardStore = create<DashboardState & DashboardActions>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      // Data Actions
      setOverview: (overview) => set({ overview }, false, 'setOverview'),
      
      setTimeRange: (timeRange) => 
        set({ selectedTimeRange: timeRange }, false, 'setTimeRange'),
      
      // Loading Actions
      setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),
      
      setError: (error) => set({ error }, false, 'setError'),
      
      setRefreshing: (refreshing) => set({ refreshing }, false, 'setRefreshing'),
      
      // Widget Actions
      toggleWidget: (widget) =>
        set((state) => ({
          widgets: {
            ...state.widgets,
            [widget]: {
              ...state.widgets[widget],
              visible: !state.widgets[widget].visible
            }
          }
        }), false, `toggleWidget-${widget}`),
      
      setWidgetLoading: (widget, loading) =>
        set((state) => ({
          widgets: {
            ...state.widgets,
            [widget]: {
              ...state.widgets[widget],
              loading
            }
          }
        }), false, `setWidgetLoading-${widget}`),
      
      // Filter Actions
      updateFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters }
        }), false, 'updateFilters'),
      
      toggleTasksFilter: (filter) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [filter]: !state.filters[filter]
          }
        }), false, `toggleTasksFilter-${filter}`),
      
      setActivityTypes: (types) =>
        set((state) => ({
          filters: { ...state.filters, activityTypes: types }
        }), false, 'setActivityTypes'),
      
      // Utility Actions
      refreshDashboard: () => {
        set({ refreshing: true, error: null }, false, 'refreshDashboard-start')
        // This would trigger React Query refetch in the component
        setTimeout(() => {
          set({ refreshing: false, lastRefreshed: Date.now() }, false, 'refreshDashboard-end')
        }, 1000)
      },
      
      resetDashboard: () => set(initialState, false, 'resetDashboard'),
      
      updateLastRefreshed: () => set({ lastRefreshed: Date.now() }, false, 'updateLastRefreshed'),
    })),
    {
      name: 'dashboard-store',
      serialize: {
        options: {
          map: true,
        },
      },
    }
  )
)

// Selectors for better performance
export const selectDashboardOverview = (state: DashboardState & DashboardActions) => state.overview
export const selectVisibleWidgets = (state: DashboardState & DashboardActions) => 
  Object.entries(state.widgets).filter(([_, widget]) => widget.visible).map(([key]) => key)
export const selectActiveFilters = (state: DashboardState & DashboardActions) => state.filters
export const selectTimeRange = (state: DashboardState & DashboardActions) => state.selectedTimeRange

// Auto-refresh subscription (would be used in a component)
export const subscribeToAutoRefresh = () => {
  return useDashboardStore.subscribe(
    (state) => state.lastRefreshed,
    (lastRefreshed) => {
      const store = useDashboardStore.getState()
      const timeSinceRefresh = Date.now() - lastRefreshed
      
      if (timeSinceRefresh >= store.updateFrequency) {
        store.refreshDashboard()
      }
    }
  )
}