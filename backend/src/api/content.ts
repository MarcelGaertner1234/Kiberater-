import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { ApiError } from '../utils/ApiError'
import { prisma } from '../utils/prisma'

const router = Router()

// Get all content
router.get('/', async (req, res) => {
  try {
    const { type, category } = req.query
    
    const where: any = { published: true }
    if (type) where.type = type
    if (category) where.category = category
    
    const content = await prisma.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        category: true,
        difficulty: true,
        duration: true,
        thumbnail: true,
        createdAt: true,
      },
    })

    res.json({ success: true, data: content })
  } catch (error) {
    throw error
  }
})

// Get single content
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const content = await prisma.content.findFirst({
      where: { id, published: true },
    })

    if (!content) {
      throw new ApiError(404, 'Content not found')
    }

    res.json({ success: true, data: content })
  } catch (error) {
    throw error
  }
})

// Track content progress (authenticated)
router.post('/:id/progress', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    const { progress, completed } = req.body

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_contentId: { userId, contentId: id },
      },
      create: {
        userId,
        contentId: id,
        progress: progress || 0,
        completed: completed || false,
      },
      update: {
        progress: progress || 0,
        completed: completed || false,
        lastAccessed: new Date(),
      },
    })

    res.json({ success: true, data: userProgress })
  } catch (error) {
    throw error
  }
})

export default router