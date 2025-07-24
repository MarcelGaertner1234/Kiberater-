import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'

// Types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'de',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request Interceptor - JWT Token hinzufügen
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(this.transformError(error))
      }
    )

    // Response Interceptor - Fehlerbehandlung
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        // 401 Unauthorized - Token abgelaufen
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            await this.refreshToken()
            if (this.token) {
              originalRequest.headers.Authorization = `Bearer ${this.token}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            this.clearToken()
            window.location.href = '/login'
            return Promise.reject(this.transformError(refreshError as AxiosError))
          }
        }

        return Promise.reject(this.transformError(error))
      }
    )
  }

  private transformError(error: AxiosError): ApiError {
    const defaultMessage = 'Ein unerwarteter Fehler ist aufgetreten'
    
    if (!error.response) {
      return {
        message: 'Netzwerkfehler - Bitte überprüfen Sie Ihre Internetverbindung',
        status: 0,
        code: 'NETWORK_ERROR'
      }
    }

    const status = error.response.status
    const data = error.response.data as any

    // Deutsche Fehlermeldungen
    const errorMessages: Record<number, string> = {
      400: 'Ungültige Anfrage - Bitte überprüfen Sie Ihre Eingaben',
      401: 'Nicht berechtigt - Bitte melden Sie sich an',
      403: 'Zugriff verweigert - Unzureichende Berechtigungen',
      404: 'Ressource nicht gefunden',
      409: 'Konflikt - Die Ressource existiert bereits',
      422: 'Validierungsfehler - Bitte überprüfen Sie Ihre Eingaben',
      429: 'Zu viele Anfragen - Bitte versuchen Sie es später erneut',
      500: 'Serverfehler - Bitte versuchen Sie es später erneut',
      503: 'Service nicht verfügbar - Bitte versuchen Sie es später erneut'
    }

    return {
      message: data?.message || errorMessages[status] || defaultMessage,
      status,
      code: data?.code,
      details: data?.details
    }
  }

  // Token Management
  setToken(token: string) {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('Kein Refresh Token verfügbar')
    }

    const response = await axios.post(`${this.client.defaults.baseURL}/auth/refresh`, {
      refreshToken
    })

    const { token, refreshToken: newRefreshToken } = response.data.data
    this.setToken(token)
    localStorage.setItem('refresh_token', newRefreshToken)
  }

  // HTTP Methods
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put(url, data)
    return response.data
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.patch(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete(url)
    return response.data
  }

  // File Upload
  async upload<T>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
    return response.data
  }
}

// Singleton Instance
export const apiClient = new ApiClient()

// Initialize token from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token')
  if (token) {
    apiClient.setToken(token)
  }
}