import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

// Special configuration for Supabase Pooler
const connectionString = process.env.DATABASE_URL!

// Configure the connection pool
const pool = new Pool({
  connectionString,
  max: 1, // Limit connections for pgbouncer
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Create PrismaClient with special config for pooling
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['error', 'warn'] 
      : ['error'],
    datasources: {
      db: {
        url: connectionString,
      },
    },
    // Important: For pgbouncer compatibility
    adapter: undefined,
  })
}

declare global {
  var prismaGlobal: PrismaClient | undefined
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

// Don't use $connect() with pgbouncer
// Connection will be established on first query