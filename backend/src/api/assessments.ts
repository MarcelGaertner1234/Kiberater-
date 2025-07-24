import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { ApiError } from '../utils/ApiError'
import { prisma } from '../utils/prisma'

const router = Router()

// Get all assessments for user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    
    const assessments = await prisma.assessment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ success: true, data: assessments })
  } catch (error) {
    throw error
  }
})

// Get single assessment
router.get('/:id', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    
    const assessment = await prisma.assessment.findFirst({
      where: { id, userId },
    })

    if (!assessment) {
      throw new ApiError(404, 'Assessment not found')
    }

    res.json({ success: true, data: assessment })
  } catch (error) {
    throw error
  }
})

// Create assessment
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { 
      type,
      responses,
      score,
      maturityLevel,
      recommendations
    } = req.body

    const assessment = await prisma.assessment.create({
      data: {
        userId,
        type: type || 'quick',
        responses: responses || {},
        score,
        maturityLevel,
        recommendations: recommendations || {},
        completedAt: new Date(),
      },
    })

    res.json({ success: true, data: assessment })
  } catch (error) {
    throw error
  }
})

// Update assessment
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    
    const assessment = await prisma.assessment.findFirst({
      where: { id, userId },
    })

    if (!assessment) {
      throw new ApiError(404, 'Assessment not found')
    }

    const updated = await prisma.assessment.update({
      where: { id },
      data: req.body,
    })

    res.json({ success: true, data: updated })
  } catch (error) {
    throw error
  }
})

export default router