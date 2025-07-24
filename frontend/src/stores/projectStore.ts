import { create } from 'zustand'
import { subscribeWithSelector, devtools } from 'zustand/middleware'
import { Project, Task, KanbanColumn } from '@/hooks/api/useProjects'

// Types
export interface ProjectState {
  // Data
  projects: Project[]
  currentProject: Project | null
  tasks: Task[]
  kanbanColumns: KanbanColumn[]
  
  // UI State
  isLoading: boolean
  error: string | null
  
  // Kanban State
  kanbanView: 'board' | 'list' | 'calendar'
  selectedTask: Task | null
  draggedTask: Task | null
  
  // Filters & Search
  filters: {
    status: Project['status'][]
    priority: Project['priority'][]
    search: string
    assignee: string[]
    tags: string[]
    dueDateRange: {
      start: string | null
      end: string | null
    }
  }
  
  // Task Filters
  taskFilters: {
    status: Task['status'][]
    priority: Task['priority'][]
    assignee: string[]
    search: string
  }
  
  // UI Preferences
  preferences: {
    showCompletedTasks: boolean
    showTaskDetails: boolean
    autoRefresh: boolean
    defaultView: 'board' | 'list' | 'calendar'
    compactMode: boolean
  }
}

export interface ProjectActions {
  // Project Actions
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  removeProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  
  // Task Actions
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  moveTask: (taskId: string, newStatus: Task['status'], newPosition: number) => void
  
  // Kanban Actions
  setKanbanColumns: (columns: KanbanColumn[]) => void
  setKanbanView: (view: ProjectState['kanbanView']) => void
  setSelectedTask: (task: Task | null) => void
  setDraggedTask: (task: Task | null) => void
  
  // Filter Actions
  updateFilters: (filters: Partial<ProjectState['filters']>) => void
  updateTaskFilters: (filters: Partial<ProjectState['taskFilters']>) => void
  resetFilters: () => void
  setSearch: (search: string) => void
  
  // UI Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updatePreferences: (preferences: Partial<ProjectState['preferences']>) => void
  
  // Utility Actions
  resetProject: () => void
  bulkUpdateTasks: (taskIds: string[], updates: Partial<Task>) => void
}

// Initial State
const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  tasks: [],
  kanbanColumns: [],
  
  isLoading: false,
  error: null,
  
  kanbanView: 'board',
  selectedTask: null,
  draggedTask: null,
  
  filters: {
    status: [],
    priority: [],
    search: '',
    assignee: [],
    tags: [],
    dueDateRange: {
      start: null,
      end: null
    }
  },
  
  taskFilters: {
    status: [],
    priority: [],
    assignee: [],
    search: ''
  },
  
  preferences: {
    showCompletedTasks: false,
    showTaskDetails: true,
    autoRefresh: true,
    defaultView: 'board',
    compactMode: false
  }
}

// Store
export const useProjectStore = create<ProjectState & ProjectActions>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      // Project Actions
      setProjects: (projects) => set({ projects }, false, 'setProjects'),
      
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project]
        }), false, 'addProject'),
      
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
          currentProject: state.currentProject?.id === id 
            ? { ...state.currentProject, ...updates }
            : state.currentProject
        }), false, 'updateProject'),
      
      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter(p => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject
        }), false, 'removeProject'),
      
      setCurrentProject: (project) => set({ currentProject: project }, false, 'setCurrentProject'),
      
      // Task Actions
      setTasks: (tasks) => set({ tasks }, false, 'setTasks'),
      
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task]
        }), false, 'addTask'),
      
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
          selectedTask: state.selectedTask?.id === id 
            ? { ...state.selectedTask, ...updates }
            : state.selectedTask
        }), false, 'updateTask'),
      
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter(t => t.id !== id),
          selectedTask: state.selectedTask?.id === id ? null : state.selectedTask
        }), false, 'removeTask'),
      
      moveTask: (taskId, newStatus, newPosition) =>
        set((state) => {
          const task = state.tasks.find(t => t.id === taskId)
          if (!task) return state
          
          const updatedTask = { ...task, status: newStatus, position: newPosition }
          return {
            tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t)
          }
        }, false, 'moveTask'),
      
      // Kanban Actions
      setKanbanColumns: (columns) => set({ kanbanColumns: columns }, false, 'setKanbanColumns'),
      
      setKanbanView: (view) => set({ kanbanView: view }, false, 'setKanbanView'),
      
      setSelectedTask: (task) => set({ selectedTask: task }, false, 'setSelectedTask'),
      
      setDraggedTask: (task) => set({ draggedTask: task }, false, 'setDraggedTask'),
      
      // Filter Actions
      updateFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters }
        }), false, 'updateFilters'),
      
      updateTaskFilters: (filters) =>
        set((state) => ({
          taskFilters: { ...state.taskFilters, ...filters }
        }), false, 'updateTaskFilters'),
      
      resetFilters: () =>
        set({
          filters: initialState.filters,
          taskFilters: initialState.taskFilters
        }, false, 'resetFilters'),
      
      setSearch: (search) =>
        set((state) => ({
          filters: { ...state.filters, search }
        }), false, 'setSearch'),
      
      // UI Actions
      setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),
      
      setError: (error) => set({ error }, false, 'setError'),
      
      updatePreferences: (preferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences }
        }), false, 'updatePreferences'),
      
      // Utility Actions
      resetProject: () => set(initialState, false, 'resetProject'),
      
      bulkUpdateTasks: (taskIds, updates) =>
        set((state) => ({
          tasks: state.tasks.map(t => 
            taskIds.includes(t.id) ? { ...t, ...updates } : t
          )
        }), false, 'bulkUpdateTasks'),
    })),
    {
      name: 'project-store',
      serialize: {
        options: {
          map: true,
        },
      },
    }
  )
)

// Selectors
export const selectFilteredProjects = (state: ProjectState & ProjectActions) => {
  const { projects, filters } = state
  
  return projects.filter(project => {
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(project.status)) {
      return false
    }
    
    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(project.priority)) {
      return false
    }
    
    // Search filter
    if (filters.search && !project.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    // Tags filter
    if (filters.tags.length > 0 && !filters.tags.some(tag => project.tags.includes(tag))) {
      return false
    }
    
    return true
  })
}

export const selectFilteredTasks = (state: ProjectState & ProjectActions) => {
  const { tasks, taskFilters, preferences } = state
  
  return tasks.filter(task => {
    // Completed tasks filter
    if (!preferences.showCompletedTasks && task.status === 'done') {
      return false
    }
    
    // Status filter
    if (taskFilters.status.length > 0 && !taskFilters.status.includes(task.status)) {
      return false
    }
    
    // Priority filter
    if (taskFilters.priority.length > 0 && !taskFilters.priority.includes(task.priority)) {
      return false
    }
    
    // Search filter
    if (taskFilters.search && !task.title.toLowerCase().includes(taskFilters.search.toLowerCase())) {
      return false
    }
    
    return true
  })
}

export const selectKanbanColumns = (state: ProjectState & ProjectActions) => {
  const filteredTasks = selectFilteredTasks(state)
  
  // Group tasks by status
  const columns = [
    { id: 'backlog', title: 'Backlog', tasks: [], color: '#64748b' },
    { id: 'todo', title: 'To Do', tasks: [], color: '#3b82f6' },
    { id: 'in_progress', title: 'In Progress', tasks: [], color: '#f59e0b' },
    { id: 'done', title: 'Done', tasks: [], color: '#10b981' }
  ]
  
  filteredTasks.forEach(task => {
    const column = columns.find(c => c.id === task.status)
    if (column) {
      column.tasks.push(task)
    }
  })
  
  return columns
}