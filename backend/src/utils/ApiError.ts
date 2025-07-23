export class ApiError extends Error {
  public statusCode: number
  public details?: any
  public code?: string

  constructor(statusCode: number, message: string, details?: any, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    this.code = code
    this.name = 'ApiError'
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
      stack: this.stack,
    }
  }
}