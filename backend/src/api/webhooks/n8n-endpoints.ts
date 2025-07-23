import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { ApiError } from '../../utils/ApiError'
import { authenticateWebhook } from '../../middleware/webhookAuth'
import { logger } from '../../utils/logger'

const router = Router()
const prisma = new PrismaClient()

// Validation Schemas
const userRegisteredSchema = z.object({
  event: z.literal('user.registered'),
  userId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  timestamp: z.string().datetime().optional()
})

const scheduleFollowupSchema = z.object({
  userId: z.string().uuid(),
  followupType: z.enum(['day_3', 'day_7', 'day_14', 'custom']),
  scheduleFor: z.string().datetime(),
  workflowId: z.string(),
  locale: z.enum(['de', 'en']).optional(),
  metadata: z.record(z.any()).optional()
})

// Webhook endpoint for user registration events
router.post('/webhooks/user-registered', authenticateWebhook, async (req: Request, res: Response) => {
  try {
    // Validate webhook payload
    const validatedData = userRegisteredSchema.parse(req.body)
    
    logger.info('User registration webhook received', {
      userId: validatedData.userId,
      event: validatedData.event
    })
    
    // Trigger n8n workflow
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (!n8nWebhookUrl) {
      throw new ApiError(500, 'n8n webhook URL not configured')
    }
    
    // Forward to n8n
    const response = await fetch(`${n8nWebhookUrl}/user-registered`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET || ''
      },
      body: JSON.stringify(validatedData)
    })
    
    if (!response.ok) {
      throw new ApiError(502, 'Failed to trigger n8n workflow')
    }
    
    res.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, 'Invalid webhook payload', error.errors)
    }
    throw error
  }
})

// API endpoint for scheduling follow-up workflows
router.post('/workflows/schedule-followup', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validatedData = scheduleFollowupSchema.parse(req.body)
    
    // Create scheduled workflow entry
    const scheduledWorkflow = await prisma.scheduledWorkflow.create({
      data: {
        userId: validatedData.userId,
        workflowId: validatedData.workflowId,
        type: validatedData.followupType,
        scheduledFor: new Date(validatedData.scheduleFor),
        metadata: validatedData.metadata || {},
        status: 'pending'
      }
    })
    
    logger.info('Follow-up workflow scheduled', {
      userId: validatedData.userId,
      type: validatedData.followupType,
      scheduledFor: validatedData.scheduleFor
    })
    
    res.json({
      success: true,
      data: {
        id: scheduledWorkflow.id,
        scheduled: true,
        scheduledFor: scheduledWorkflow.scheduledFor
      }
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, 'Invalid request data', error.errors)
    }
    throw error
  }
})

// Webhook for assessment completion
router.post('/webhooks/assessment-completed', authenticateWebhook, async (req: Request, res: Response) => {
  const assessmentCompletedSchema = z.object({
    event: z.literal('assessment.completed'),
    userId: z.string().uuid(),
    assessmentId: z.string().uuid(),
    score: z.number().min(0).max(100),
    maturityLevel: z.enum(['beginner', 'intermediate', 'advanced']),
    timestamp: z.string().datetime().optional()
  })
  
  try {
    const validatedData = assessmentCompletedSchema.parse(req.body)
    
    // Forward to n8n
    const response = await fetch(`${process.env.N8N_WEBHOOK_URL}/assessment-completed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET || ''
      },
      body: JSON.stringify(validatedData)
    })
    
    if (!response.ok) {
      throw new ApiError(502, 'Failed to trigger n8n workflow')
    }
    
    res.json({ success: true })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, 'Invalid webhook payload', error.errors)
    }
    throw error
  }
})

// Webhook for payment events
router.post('/webhooks/payment-event', authenticateWebhook, async (req: Request, res: Response) => {
  const paymentEventSchema = z.object({
    event: z.enum(['payment.succeeded', 'payment.failed', 'subscription.updated', 'subscription.cancelled']),
    userId: z.string().uuid(),
    subscriptionId: z.string(),
    amount: z.number().optional(),
    currency: z.string().optional(),
    timestamp: z.string().datetime().optional()
  })
  
  try {
    const validatedData = paymentEventSchema.parse(req.body)
    
    // Forward to n8n
    const response = await fetch(`${process.env.N8N_WEBHOOK_URL}/payment-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET || ''
      },
      body: JSON.stringify(validatedData)
    })
    
    if (!response.ok) {
      throw new ApiError(502, 'Failed to trigger n8n workflow')
    }
    
    res.json({ success: true })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, 'Invalid webhook payload', error.errors)
    }
    throw error
  }
})

// Get scheduled workflows (admin only)
router.get('/workflows/scheduled', async (req: Request, res: Response) => {
  const { userId, status = 'pending', limit = 20, page = 1 } = req.query
  
  const where: any = { status }
  if (userId) where.userId = userId
  
  const skip = (Number(page) - 1) * Number(limit)
  
  const [workflows, total] = await Promise.all([
    prisma.scheduledWorkflow.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { scheduledFor: 'asc' },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    }),
    prisma.scheduledWorkflow.count({ where })
  ])
  
  res.json({
    success: true,
    data: workflows,
    meta: {
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  })
})

// Update scheduled workflow status
router.put('/workflows/scheduled/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { status, executedAt } = req.body
  
  const workflow = await prisma.scheduledWorkflow.update({
    where: { id },
    data: {
      status,
      executedAt: executedAt ? new Date(executedAt) : undefined
    }
  })
  
  res.json({
    success: true,
    data: workflow
  })
})

export default router