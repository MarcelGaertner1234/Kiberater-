import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { ApiError } from '../utils/ApiError'
import { prisma } from '../utils/prisma'

const router = Router()

// Get all projects for user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    res.json({ success: true, data: projects })
  } catch (error) {
    throw error
  }
})

// Get single project
router.get('/:id', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    
    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        tasks: true,
      },
    })

    if (!project) {
      throw new ApiError(404, 'Project not found')
    }

    res.json({ success: true, data: project })
  } catch (error) {
    throw error
  }
})

// Create project
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { title, description, priority, startDate, dueDate } = req.body

    const project = await prisma.project.create({
      data: {
        title,
        description,
        priority: priority || 'medium',
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
        status: 'planning',
      },
    })

    res.json({ success: true, data: project })
  } catch (error) {
    throw error
  }
})

// Update project
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    
    const project = await prisma.project.findFirst({
      where: { id, userId },
    })

    if (!project) {
      throw new ApiError(404, 'Project not found')
    }

    const updated = await prisma.project.update({
      where: { id },
      data: req.body,
    })

    res.json({ success: true, data: updated })
  } catch (error) {
    throw error
  }
})

export default router