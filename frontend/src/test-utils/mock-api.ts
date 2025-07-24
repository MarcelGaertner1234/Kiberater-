import { User, Assessment, Project } from '@/types/api.types'

// Mock Data Factories
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  avatar: null,
  role: 'USER',
  isEmailVerified: true,
  preferences: {
    language: 'de',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    dashboard: {
      layout: 'grid',
      widgets: ['assessments', 'projects', 'analytics'],
    },
  },
  subscription: {
    id: 'sub-1',
    plan: 'FREE',
    status: 'ACTIVE',
    currentPeriodStart: '2024-01-01T00:00:00Z',
    currentPeriodEnd: '2024-12-31T23:59:59Z',
    cancelAtPeriodEnd: false,
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockAssessment = (overrides: Partial<Assessment> = {}): Assessment => ({
  id: 'assessment-1',
  userId: 'user-1',
  title: 'KI-Readiness Assessment',
  description: 'Bewertung der KI-Bereitschaft Ihres Unternehmens',
  type: 'READINESS',
  status: 'IN_PROGRESS',
  progress: 45,
  answers: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T12:00:00Z',
  ...overrides,
})

export const createMockProject = (overrides: Partial<Project> = {}): Project => ({
  id: 'project-1',
  userId: 'user-1',
  title: 'KI-Implementierung Phase 1',
  description: 'Erste Phase der KI-Integration in das Unternehmen',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  category: 'AI_IMPLEMENTATION',
  tags: ['ki', 'automatisierung', 'effizienz'],
  assignees: [],
  timeline: {
    phases: [],
    totalDuration: 12,
    unit: 'WEEKS',
  },
  risks: [],
  milestones: [],
  tasks: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T12:00:00Z',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-03-31T23:59:59Z',
  ...overrides,
})

// Mock API Responses
export const mockApiResponses = {
  auth: {
    login: {
      data: {
        user: createMockUser(),
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: '2024-12-31T23:59:59Z',
      },
      message: 'Login erfolgreich',
      success: true,
    },
    register: {
      data: {
        user: createMockUser(),
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: '2024-12-31T23:59:59Z',
      },
      message: 'Registrierung erfolgreich',
      success: true,
    },
    profile: {
      data: createMockUser(),
      message: 'Profil geladen',
      success: true,
    },
  },
  assessments: {
    list: {
      data: {
        data: [createMockAssessment()],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
      message: 'Assessments geladen',
      success: true,
    },
    create: {
      data: createMockAssessment({ status: 'DRAFT', progress: 0 }),
      message: 'Assessment erstellt',
      success: true,
    },
    get: {
      data: createMockAssessment(),
      message: 'Assessment geladen',
      success: true,
    },
  },
  projects: {
    list: {
      data: {
        data: [createMockProject()],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
      message: 'Projekte geladen',
      success: true,
    },
    create: {
      data: createMockProject({ status: 'PLANNING', progress: 0 }),
      message: 'Projekt erstellt',
      success: true,
    },
    get: {
      data: createMockProject(),
      message: 'Projekt geladen',
      success: true,
    },
  },
}

// Mock API Client
export const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  upload: jest.fn(),
  setToken: jest.fn(),
  clearToken: jest.fn(),
}

// API Mock Setup Function
export const setupApiMocks = () => {
  // Auth endpoints
  mockApiClient.post.mockImplementation((url, data) => {
    if (url === '/auth/login') {
      if (data.email === 'test@example.com' && data.password === 'password123') {
        return Promise.resolve(mockApiResponses.auth.login)
      }
      return Promise.reject(new Error('Ungültige Anmeldedaten'))
    }
    
    if (url === '/auth/register') {
      return Promise.resolve(mockApiResponses.auth.register)
    }
    
    if (url.startsWith('/assessments')) {
      return Promise.resolve(mockApiResponses.assessments.create)
    }
    
    if (url.startsWith('/projects')) {
      return Promise.resolve(mockApiResponses.projects.create)
    }
    
    return Promise.resolve({ data: {}, message: 'Success', success: true })
  })

  mockApiClient.get.mockImplementation((url) => {
    if (url === '/auth/profile' || url === '/auth/me') {
      return Promise.resolve(mockApiResponses.auth.profile)
    }
    
    if (url === '/assessments') {
      return Promise.resolve(mockApiResponses.assessments.list)
    }
    
    if (url.startsWith('/assessments/')) {
      return Promise.resolve(mockApiResponses.assessments.get)
    }
    
    if (url === '/projects') {
      return Promise.resolve(mockApiResponses.projects.list)
    }
    
    if (url.startsWith('/projects/')) {
      return Promise.resolve(mockApiResponses.projects.get)
    }
    
    return Promise.resolve({ data: {}, message: 'Success', success: true })
  })

  mockApiClient.patch.mockImplementation((url, data) => {
    return Promise.resolve({ data, message: 'Updated', success: true })
  })

  mockApiClient.delete.mockImplementation((url) => {
    return Promise.resolve({ data: null, message: 'Deleted', success: true })
  })
}

// Mock API Client Module
jest.mock('@/lib/api', () => ({
  apiClient: mockApiClient,
}))

// Reset mocks function
export const resetApiMocks = () => {
  jest.clearAllMocks()
  setupApiMocks()
}