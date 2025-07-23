import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { hash, compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { ApiError } from '../../utils/ApiError'
import { createClient } from '@supabase/supabase-js'
import { logger } from '../../utils/logger'

const router = Router()
const prisma = new PrismaClient()

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  companyName: z.string().optional(),
  companySize: z.enum(['freelancer', 'startup', 'small', 'medium', 'large']).optional(),
  industry: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Helper functions
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  )
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
  
  return { accessToken, refreshToken }
}

// POST /api/v1/auth/register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      throw new ApiError(400, 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits')
    }
    
    // Hash password
    const passwordHash = await hash(validatedData.password, 10)
    
    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        passwordHash,
        companyName: validatedData.companyName,
        companySize: validatedData.companySize,
        industry: validatedData.industry,
        role: 'user',
        locale: 'de',
        timezone: 'Europe/Berlin',
      },
      select: {
        id: true,
        email: true,
        name: true,
        companyName: true,
        companySize: true,
        industry: true,
        role: true,
        locale: true,
        timezone: true,
        emailVerified: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
      }
    })
    
    // Create user in Supabase Auth
    try {
      const { data: supabaseUser, error } = await supabase.auth.admin.createUser({
        email: validatedData.email,
        password: validatedData.password,
        email_confirm: true,
        user_metadata: {
          name: validatedData.name,
          prisma_user_id: user.id,
        }
      })
      
      if (error) {
        logger.error('Supabase user creation failed:', error)
        // Continue without Supabase for now
      }
    } catch (supabaseError) {
      logger.error('Supabase connection error:', supabaseError)
      // Continue without Supabase for now
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id)
    
    // Trigger onboarding webhook
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(`${process.env.N8N_WEBHOOK_URL}/user-registered`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET || ''
        },
        body: JSON.stringify({
          event: 'user.registered',
          userId: user.id,
          email: user.email,
          name: user.name,
          timestamp: new Date().toISOString()
        })
      }).catch(error => {
        logger.error('Failed to trigger onboarding webhook:', error)
      })
    }
    
    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'user_registered',
        entityType: 'user',
        entityId: user.id,
        metadata: {
          method: 'email',
          ip: req.ip,
          userAgent: req.get('user-agent')
        }
      }
    })
    
    res.status(201).json({
      success: true,
      message: 'Benutzer erfolgreich erstellt',
      data: {
        user,
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 3600
        }
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Validation failed', error.errors))
    } else {
      next(error)
    }
  }
})

// POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        emailVerified: true,
        deletedAt: true,
      }
    })
    
    if (!user || !user.passwordHash) {
      throw new ApiError(401, 'Ungültige E-Mail oder Passwort')
    }
    
    if (user.deletedAt) {
      throw new ApiError(403, 'Dieses Konto wurde deaktiviert')
    }
    
    // Verify password
    const isPasswordValid = await compare(validatedData.password, user.passwordHash)
    
    if (!isPasswordValid) {
      throw new ApiError(401, 'Ungültige E-Mail oder Passwort')
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id)
    
    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'user_login',
        entityType: 'user',
        entityId: user.id,
        metadata: {
          ip: req.ip,
          userAgent: req.get('user-agent')
        }
      }
    })
    
    // Get full user data
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        companyName: true,
        companySize: true,
        industry: true,
        role: true,
        avatarUrl: true,
        locale: true,
        timezone: true,
        emailVerified: true,
        onboardingCompleted: true,
        subscription: {
          select: {
            plan: true,
            status: true,
            currentPeriodEnd: true,
          }
        }
      }
    })
    
    res.json({
      success: true,
      message: 'Erfolgreich angemeldet',
      data: {
        user: userData,
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 3600
        }
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, 'Validation failed', error.errors))
    } else {
      next(error)
    }
  }
})

// POST /api/v1/auth/refresh
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body
    
    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token is required')
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any
    
    if (decoded.type !== 'refresh') {
      throw new ApiError(401, 'Invalid token type')
    }
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId)
    
    res.json({
      success: true,
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn: 3600
        }
      }
    })
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid refresh token'))
    } else {
      next(error)
    }
  }
})

// POST /api/v1/auth/logout
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a production app, you might want to:
    // 1. Invalidate the refresh token in a blacklist
    // 2. Clear any server-side sessions
    // 3. Log the logout event
    
    const userId = (req as any).user?.id
    
    if (userId) {
      await prisma.activityLog.create({
        data: {
          userId,
          action: 'user_logout',
          entityType: 'user',
          entityId: userId,
          metadata: {
            ip: req.ip,
            userAgent: req.get('user-agent')
          }
        }
      })
    }
    
    res.json({
      success: true,
      message: 'Erfolgreich abgemeldet'
    })
    
  } catch (error) {
    next(error)
  }
})

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    
    if (!email) {
      throw new ApiError(400, 'E-Mail-Adresse ist erforderlich')
    }
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'Wenn ein Konto mit dieser E-Mail existiert, haben wir Ihnen Anweisungen zum Zurücksetzen des Passworts gesendet.'
    })
    
    if (user) {
      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id, type: 'password_reset' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      )
      
      // TODO: Send reset email via SendGrid
      // This would be handled by n8n workflow in production
      logger.info('Password reset requested for:', email)
    }
    
  } catch (error) {
    next(error)
  }
})

// POST /api/v1/auth/oauth-register
router.post('/oauth-register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, image, provider, providerId } = req.body
    
    if (!email || !provider || !providerId) {
      throw new ApiError(400, 'Missing required fields')
    }
    
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          avatarUrl: image,
          role: 'user',
          locale: 'de',
          timezone: 'Europe/Berlin',
          emailVerified: true, // OAuth users are pre-verified
          authProviders: {
            create: {
              provider,
              providerUserId: providerId,
            }
          }
        }
      })
      
      // Trigger onboarding
      if (process.env.N8N_WEBHOOK_URL) {
        fetch(`${process.env.N8N_WEBHOOK_URL}/user-registered`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET || ''
          },
          body: JSON.stringify({
            event: 'user.registered',
            userId: user.id,
            email: user.email,
            name: user.name,
            timestamp: new Date().toISOString()
          })
        }).catch(error => {
          logger.error('Failed to trigger onboarding webhook:', error)
        })
      }
    } else {
      // Update existing user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          authProviders: {
            upsert: {
              where: {
                provider_providerUserId: {
                  provider,
                  providerUserId: providerId,
                }
              },
              create: {
                provider,
                providerUserId: providerId,
              },
              update: {
                provider,
                providerUserId: providerId,
              }
            }
          }
        }
      })
    }
    
    res.json({
      success: true,
      data: { userId: user.id }
    })
    
  } catch (error) {
    next(error)
  }
})

// POST /api/v1/auth/reset-password
router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body
    
    if (!token || !password) {
      throw new ApiError(400, 'Token und neues Passwort sind erforderlich')
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    if (decoded.type !== 'password_reset') {
      throw new ApiError(401, 'Ungültiger Token')
    }
    
    // Validate new password
    const passwordValidation = registerSchema.shape.password.safeParse(password)
    if (!passwordValidation.success) {
      throw new ApiError(400, 'Passwort erfüllt nicht die Anforderungen', passwordValidation.error.errors)
    }
    
    // Hash new password
    const passwordHash = await hash(password, 10)
    
    // Update user password
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { passwordHash }
    })
    
    res.json({
      success: true,
      message: 'Passwort erfolgreich zurückgesetzt'
    })
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Ungültiger oder abgelaufener Token'))
    } else {
      next(error)
    }
  }
})

export default router