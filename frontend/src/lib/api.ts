import { useState, useEffect } from 'react'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface ApiMutationState {
  loading: boolean
  error: string | null
}

// GET Hook
export function useApi<T>(url: string, options?: RequestInit): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        const token = getAuthToken()
        const response = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options?.headers
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setState({ data, loading: false, error: null })
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    fetchData()
  }, [url])

  return state
}

// Mutation Hook
export function useApiMutation<TData = any, TVariables = any>(
  url: string,
  options?: {
    method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    onSuccess?: (data: TData) => void
    onError?: (error: string) => void
  }
) {
  const [state, setState] = useState<ApiMutationState>({
    loading: false,
    error: null
  })

  const mutate = async (variables?: TVariables) => {
    try {
      setState({ loading: true, error: null })
      
      const token = getAuthToken()
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: options?.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: variables ? JSON.stringify(variables) : undefined
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setState({ loading: false, error: null })
      
      if (options?.onSuccess) {
        options.onSuccess(data)
      }
      
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState({ loading: false, error: errorMessage })
      
      if (options?.onError) {
        options.onError(errorMessage)
      }
      
      throw error
    }
  }

  return {
    mutate,
    loading: state.loading,
    error: state.error
  }
}

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
}

// Helper function to set auth token
export function setAuthToken(token: string, remember: boolean = false) {
  if (typeof window === 'undefined') return
  
  if (remember) {
    localStorage.setItem('authToken', token)
    sessionStorage.removeItem('authToken')
  } else {
    sessionStorage.setItem('authToken', token)
    localStorage.removeItem('authToken')
  }
}

// Helper function to remove auth token
export function removeAuthToken() {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('authToken')
  sessionStorage.removeItem('authToken')
}