const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    const userCount = await prisma.user.count()
    console.log(`✅ Connected to Supabase! Users in DB: ${userCount}`)

    const users = await prisma.user.findMany()
    console.log('Users:', users.map(u => u.email))
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.error('Full error:', error.code)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()