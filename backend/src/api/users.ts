import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { ApiError } from '../utils/ApiError'
import { prisma } from '../utils/prisma'

const router = Router()

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        companySize: true,
        industry: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    res.json({ success: true, data: user })
  } catch (error) {
    throw error
  }
})

// Update user profile
router.patch('/me', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { name, companyName, companySize, industry } = req.body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        companyName,
        companySize,
        industry,
      },
    })

    res.json({ success: true, data: user })
  } catch (error) {
    throw error
  }
})

export default router