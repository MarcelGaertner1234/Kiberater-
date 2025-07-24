'use client'

import { toast as hotToast, ToastOptions as HotToastOptions } from 'react-hot-toast'
import { cn } from '@/lib/design-system'

interface ToastOptions extends Partial<HotToastOptions> {
  duration?: number
  position?: 'top-right' | 'top-center' | 'bottom-center'
  action?: {
    label: string
    onClick: () => void
  }
}

// Custom toast component
const NotionToastComponent = ({
  message,
  type,
  action,
  onDismiss,
}: {
  message: string
  type: 'success' | 'error' | 'info' | 'loading'
  action?: ToastOptions['action']
  onDismiss?: () => void
}) => {
  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    loading: (
      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
    ),
  }

  const styles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    loading: 'bg-white dark:bg-gray-800 border-notion-border dark:border-notion-dark-border text-notion-text dark:text-notion-dark-text',
  }

  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-notion border shadow-notion-md max-w-md',
      'animate-in slide-in-from-top-5 duration-300',
      styles[type]
    )}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      
      <div className="flex-1 text-notion-sm font-medium">
        {message}
      </div>
      
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'px-3 py-1 text-notion-xs font-medium rounded transition-colors duration-200',
            'hover:bg-black/10 dark:hover:bg-white/10'
          )}
        >
          {action.label}
        </button>
      )}
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

// Toast API
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <NotionToastComponent
          message={message}
          type="success"
          action={options?.action}
          onDismiss={() => hotToast.dismiss(t.id)}
        />
      ),
      {
        duration: options?.duration || 4000,
        position: options?.position || 'top-right',
        ...options,
      }
    )
  },

  error: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <NotionToastComponent
          message={message}
          type="error"
          action={options?.action}
          onDismiss={() => hotToast.dismiss(t.id)}
        />
      ),
      {
        duration: options?.duration || 6000,
        position: options?.position || 'top-right',
        ...options,
      }
    )
  },

  info: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <NotionToastComponent
          message={message}
          type="info"
          action={options?.action}
          onDismiss={() => hotToast.dismiss(t.id)}
        />
      ),
      {
        duration: options?.duration || 4000,
        position: options?.position || 'top-right',
        ...options,
      }
    )
  },

  loading: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <NotionToastComponent
          message={message}
          type="loading"
          action={options?.action}
          onDismiss={() => hotToast.dismiss(t.id)}
        />
      ),
      {
        duration: Infinity,
        position: options?.position || 'top-right',
        ...options,
      }
    )
  },

  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string
      success: string
      error: string
    },
    options?: ToastOptions
  ) => {
    return hotToast.promise(
      promise,
      {
        loading: msgs.loading,
        success: msgs.success,
        error: msgs.error,
      },
      {
        position: options?.position || 'top-right',
        ...options,
      }
    )
  },

  dismiss: (toastId?: string) => {
    hotToast.dismiss(toastId)
  },

  remove: (toastId?: string) => {
    hotToast.remove(toastId)
  },
}

// Provider component (to be used in app layout)
export { Toaster } from 'react-hot-toast'

// Default toaster config
export const NotionToaster = () => (
  <Toaster
    position="top-right"
    reverseOrder={false}
    gutter={8}
    containerClassName=""
    containerStyle={{}}
    toastOptions={{
      className: '',
      duration: 4000,
      style: {
        background: 'transparent',
        padding: 0,
        margin: 0,
        boxShadow: 'none',
      },
    }}
  />
)