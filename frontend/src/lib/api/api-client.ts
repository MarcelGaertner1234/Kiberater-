'use client'

/**
 * API Client für die KI-Beratungsplattform
 * Zentraler Client für alle Backend-Kommunikation
 */

export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error: ApiError = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        }
        
        try {
          const errorBody = await response.json()
          error.message = errorBody.message || error.message
          error.code = errorBody.code
          error.details = errorBody.details
        } catch (e) {
          // Keep default error message if JSON parsing fails
        }
        
        throw error
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error // Re-throw API errors
      }
      
      // Network or other errors
      throw {
        message: error instanceof Error ? error.message : 'Network error',
        status: 0,
      } as ApiError
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint
    
    return this.request<T>(url, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // File upload
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    })
  }

  // Set auth token
  setAuthToken(token: string | null) {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  // Get current auth token
  getAuthToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken()
  }
}

export const apiClient = new ApiClient()

// Mock API für Entwicklung (wenn Backend nicht verfügbar)
export const useMockApi = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL

// Mock-Implementierung für Entwicklung
if (useMockApi) {
  console.warn('🚧 Using Mock API - Backend responses will be simulated')
  
  // Override apiClient methods for mock responses
  const originalGet = apiClient.get.bind(apiClient)
  
  apiClient.get = async function<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    // Simuliere Network Delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
    
    // Mock responses basierend auf endpoint
    if (endpoint.includes('/dashboard/stats')) {
      return {
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
      } as T
    }
    
    if (endpoint.includes('/dashboard/activity')) {
      return [
        {
          id: '1',
          type: 'project_created',
          title: 'Mock Activity',
          description: 'This is a mock activity',
          timestamp: new Date().toISOString(),
          user: { name: 'Mock User' }
        }
      ] as T
    }
    
    // Fallback zu echtem API call
    try {
      return await originalGet(endpoint, params)
    } catch (error) {
      console.warn(`Mock API: ${endpoint} not implemented, returning empty response`)
      return {} as T
    }
  }
}