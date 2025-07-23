import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { ApiError } from '../utils/ApiError'

const prisma = new PrismaClient()

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
      }
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Missing or invalid authorization header')
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    if (decoded.type !== 'access') {
      throw new ApiError(401, 'Invalid token type')
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        deletedAt: true,
      }
    })
    
    if (!user) {
      throw new ApiError(401, 'User not found')
    }
    
    if (user.deletedAt) {
      throw new ApiError(403, 'Account has been deactivated')
    }
    
    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    }
    
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid or expired token'))
    } else {
      next(error)
    }
  }
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'))
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'))
    }
    
    next()
  }
}

/**
 * Optional authentication - doesn't fail if no token provided
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next() // Continue without authentication
    }
    
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    if (decoded.type === 'access') {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          deletedAt: true,
        }
      })
      
      if (user && !user.deletedAt) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      }
    }
    
    next()
  } catch (error) {
    // Continue without authentication on error
    next()
  }
}