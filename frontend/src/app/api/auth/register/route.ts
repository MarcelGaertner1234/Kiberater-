import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().optional(),
  companySize: z.enum(['freelancer', 'startup', 'small', 'medium', 'large']).optional(),
  industry: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits' },
        { status: 400 }
      )
    }

    // Hash password on server
    const passwordHash = await hash(data.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        companyName: data.companyName,
        companySize: data.companySize,
        industry: data.industry,
        role: 'user',
        locale: 'de',
        timezone: 'Europe/Berlin',
        emailVerified: false,
        onboardingCompleted: false,
      },
    })

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'Benutzer erfolgreich erstellt',
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Ungültige Eingabedaten', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}