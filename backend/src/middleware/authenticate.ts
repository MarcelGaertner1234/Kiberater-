import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export async function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null

    if (!token) {
      return next(new ApiError(401, 'No authentication token provided'))
    }

    // Verify token
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const decoded = jwt.verify(token, secret) as any

    // Add user to request
    req.user = {
      id: decoded.userId || decoded.id,
      email: decoded.email,
      role: decoded.role || 'user',
    }

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid authentication token'))
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Authentication token expired'))
    }
    return next(error)
  }
}