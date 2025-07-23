import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { ApiError } from '../utils/ApiError'

/**
 * Middleware to authenticate webhook requests
 * Validates webhook signature to ensure requests come from trusted sources
 */
export function authenticateWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['x-webhook-signature'] as string
    const secret = process.env.N8N_WEBHOOK_SECRET
    
    if (!secret) {
      throw new ApiError(500, 'Webhook secret not configured')
    }
    
    if (!signature) {
      throw new ApiError(401, 'Missing webhook signature')
    }
    
    // Calculate expected signature
    const payload = JSON.stringify(req.body)
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    // Compare signatures
    const signatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
    
    if (!signatureValid) {
      throw new ApiError(401, 'Invalid webhook signature')
    }
    
    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Alternative webhook authentication using API key
 */
export function authenticateWebhookApiKey(req: Request, res: Response, next: NextFunction) {
  try {
    const apiKey = req.headers['x-api-key'] as string
    const validApiKey = process.env.WEBHOOK_API_KEY
    
    if (!validApiKey) {
      throw new ApiError(500, 'Webhook API key not configured')
    }
    
    if (!apiKey) {
      throw new ApiError(401, 'Missing API key')
    }
    
    if (apiKey !== validApiKey) {
      throw new ApiError(401, 'Invalid API key')
    }
    
    next()
  } catch (error) {
    next(error)
  }
}