import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { prisma } from '../utils/prisma'

const router = Router()

// Get user analytics
router.get('/user', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    
    // Get various analytics data
    const [
      assessmentCount,
      projectCount,
      completedProjects,
      totalProgress,
      recentActivity
    ] = await Promise.all([
      // Total assessments
      prisma.assessment.count({ where: { userId } }),
      
      // Total projects
      prisma.project.count({ where: { userId } }),
      
      // Completed projects
      prisma.project.count({ 
        where: { userId, status: 'completed' } 
      }),
      
      // Learning progress
      prisma.userProgress.aggregate({
        where: { userId },
        _avg: { progress: true },
      }),
      
      // Recent activity
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    const analytics = {
      assessments: {
        total: assessmentCount,
      },
      projects: {
        total: projectCount,
        completed: completedProjects,
        completionRate: projectCount > 0 
          ? Math.round((completedProjects / projectCount) * 100) 
          : 0,
      },
      learning: {
        averageProgress: Math.round(totalProgress._avg.progress || 0),
      },
      recentActivity,
    }

    res.json({ success: true, data: analytics })
  } catch (error) {
    throw error
  }
})

// Get project analytics
router.get('/projects/:id', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    
    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id, userId },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    // Get project analytics
    const [
      taskStats,
      milestoneStats,
      timelineProgress
    ] = await Promise.all([
      // Task statistics
      prisma.task.groupBy({
        by: ['status'],
        where: { projectId: id },
        _count: true,
      }),
      
      // Milestone statistics
      prisma.milestone.groupBy({
        by: ['status'],
        where: { projectId: id },
        _count: true,
      }),
      
      // Timeline progress
      prisma.milestone.findMany({
        where: { projectId: id },
        orderBy: { dueDate: 'asc' },
        select: {
          name: true,
          status: true,
          dueDate: true,
        },
      }),
    ])

    const analytics = {
      tasks: taskStats.reduce((acc, stat) => {
        acc[stat.status] = stat._count
        return acc
      }, {} as Record<string, number>),
      milestones: milestoneStats.reduce((acc, stat) => {
        acc[stat.status] = stat._count
        return acc
      }, {} as Record<string, number>),
      timeline: timelineProgress,
    }

    res.json({ success: true, data: analytics })
  } catch (error) {
    throw error
  }
})

export default router