import { PrismaClient } from '@prisma/client'

// Create a single instance of PrismaClient
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Middleware to soft delete
prisma.$use(async (params, next) => {
  // Check for delete operations on models with soft delete
  if (params.model && ['User', 'Project', 'Task'].includes(params.model)) {
    if (params.action === 'delete') {
      // Change to update with deletedAt
      params.action = 'update'
      params.args['data'] = { deletedAt: new Date() }
    }
    
    if (params.action === 'deleteMany') {
      // Change to updateMany with deletedAt
      params.action = 'updateMany'
      if (params.args.data !== undefined) {
        params.args.data['deletedAt'] = new Date()
      } else {
        params.args['data'] = { deletedAt: new Date() }
      }
    }
    
    // Exclude soft deleted records from find operations
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.args.where = {
        ...params.args.where,
        deletedAt: null,
      }
    }
    
    if (params.action === 'findMany') {
      if (params.args.where !== undefined) {
        if (params.args.where.deletedAt === undefined) {
          params.args.where = {
            ...params.args.where,
            deletedAt: null,
          }
        }
      } else {
        params.args['where'] = { deletedAt: null }
      }
    }
  }
  
  return next(params)
})