import { PrismaClient } from '@prisma/client'

// Singleton pattern for PrismaClient to avoid multiple instances
const globalForPrisma = global as unknown as { 
  prisma: PrismaClient | undefined 
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['error', 'warn'] // Reduced logging to avoid prepared statement issues
      : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Don't call $connect() when using pgbouncer
// The connection will be established automatically on first use

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

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