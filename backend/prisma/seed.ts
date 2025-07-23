import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // 1. Admin User
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ki-beratung.de',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'admin',
      emailVerified: true,
      onboardingCompleted: true,
    }
  })

  console.log('✅ Admin user created:', admin.email)

  // 2. Test User
  const testPassword = await bcrypt.hash('Test123!', 10)
  const testUser = await prisma.user.create({
    data: {
      email: 'test@ki-beratung.de',
      name: 'Test User',
      passwordHash: testPassword,
      role: 'user',
      companyName: 'Test GmbH',
      companySize: 'small',
      industry: 'technology',
      emailVerified: true,
      onboardingCompleted: false,
    }
  })

  console.log('✅ Test user created:', testUser.email)

  // 3. Sample Assessment für Test User
  const sampleAssessment = await prisma.assessment.create({
    data: {
      userId: testUser.id,
      type: 'quick',
      responses: {
        questions: [
          {
            id: 'q1',
            question: 'Wie groß ist Ihr Unternehmen?',
            answer: '10-50 Mitarbeiter',
            score: 3
          },
          {
            id: 'q2', 
            question: 'Haben Sie bereits KI-Technologien im Einsatz?',
            answer: 'Nein, aber geplant',
            score: 2
          }
        ],
        completion_time_seconds: 240,
        version: '1.0'
      },
      score: 65,
      maturityLevel: 'beginner',
      recommendations: [
        'KI-Strategie entwickeln',
        'Mitarbeiter schulen',
        'Pilotprojekt starten'
      ],
      completedAt: new Date()
    }
  })

  console.log('✅ Sample assessment created')

  // 4. Sample Roadmap für Test User
  const sampleRoadmap = await prisma.roadmap.create({
    data: {
      userId: testUser.id,
      assessmentId: sampleAssessment.id,
      title: 'KI-Transformation Roadmap',
      description: 'Schrittweise Einführung von KI-Technologien',
      milestones: {
        milestones: [
          {
            id: 'm1',
            title: 'KI-Strategie definieren',
            description: 'Ziele und Use Cases identifizieren',
            week: 1,
            status: 'completed',
            tasks: ['Ist-Analyse', 'Zieldefinition']
          },
          {
            id: 'm2',
            title: 'Team aufbauen',
            description: 'KI-Experten einstellen oder schulen',
            week: 4,
            status: 'active',
            tasks: ['Stellenausschreibungen', 'Schulungsplan']
          }
        ]
      },
      estimatedDurationWeeks: 12,
      status: 'active'
    }
  })

  console.log('✅ Sample roadmap created')

  // 5. Sample Project
  const sampleProject = await prisma.project.create({
    data: {
      userId: testUser.id,
      roadmapId: sampleRoadmap.id,
      title: 'Chatbot Pilotprojekt',
      description: 'Entwicklung eines einfachen Kundenservice-Chatbots',
      status: 'planning',
      priority: 'high',
      startDate: new Date('2024-02-01'),
      dueDate: new Date('2024-05-01')
    }
  })

  console.log('✅ Sample project created')

  // 6. Sample Tasks
  await prisma.task.createMany({
    data: [
      {
        projectId: sampleProject.id,
        title: 'Anforderungen definieren',
        description: 'Funktionale und technische Anforderungen sammeln',
        status: 'done',
        position: 1,
        assigneeId: testUser.id,
        completedAt: new Date()
      },
      {
        projectId: sampleProject.id,
        title: 'Technologie-Stack auswählen',
        description: 'Geeignete KI-Framework und Tools evaluieren',
        status: 'in_progress',
        position: 2,
        assigneeId: testUser.id
      },
      {
        projectId: sampleProject.id,
        title: 'MVP entwickeln',
        description: 'Ersten funktionsfähigen Chatbot-Prototyp erstellen',
        status: 'todo',
        position: 3
      }
    ]
  })

  console.log('✅ Sample tasks created')

  console.log('\n🎉 Database seeding completed successfully!')
  console.log('\nLogin credentials:')
  console.log('Admin: admin@ki-beratung.de / Admin123!')
  console.log('Test User: test@ki-beratung.de / Test123!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })