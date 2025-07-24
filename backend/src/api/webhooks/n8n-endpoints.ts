import { Router } from 'express'
import { ApiError } from '../../utils/ApiError'
import { logger } from '../../utils/logger'

const router = Router()

// Webhook endpoint for n8n workflows
router.post('/webhooks/n8n/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params
    const { headers, body } = req

    // Log webhook received
    logger.info('Webhook received', {
      workflowId,
      headers: headers,
      body: body,
    })

    // Verify webhook signature if needed
    const signature = headers['x-n8n-signature']
    if (signature) {
      // TODO: Implement signature verification
    }

    // Process webhook based on workflow ID
    switch (workflowId) {
      case 'assessment-completed':
        // Handle assessment completion
        break
      case 'project-updated':
        // Handle project updates
        break
      case 'user-registered':
        // Handle new user registration
        break
      default:
        logger.warn(`Unknown workflow ID: ${workflowId}`)
    }

    // Send success response
    res.json({ 
      success: true, 
      message: 'Webhook processed',
      workflowId,
    })
  } catch (error) {
    logger.error('Webhook processing error', error)
    throw new ApiError(500, 'Webhook processing failed')
  }
})

// Health check for n8n
router.get('/webhooks/n8n/health', (_req, res) => {
  res.json({ 
    success: true, 
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
})

export default router