import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.scheduledWorkflow.deleteMany()
  await prisma.activityLog.deleteMany()
  await prisma.advisorAssignment.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.message.deleteMany()
  await prisma.task.deleteMany()
  await prisma.project.deleteMany()
  await prisma.roadmap.deleteMany()
  await prisma.assessment.deleteMany()
  await prisma.authProvider.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  await prisma.user.create({
    data: {
      email: 'admin@ki-beratung.de',
      name: 'Admin User',
      passwordHash: hashedPassword,
      role: 'admin',
      emailVerified: true,
    },
  })

  const advisorUser = await prisma.user.create({
    data: {
      email: 'berater@ki-beratung.de',
      name: 'Max Berater',
      passwordHash: hashedPassword,
      role: 'advisor',
      emailVerified: true,
    },
  })

  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: hashedPassword,
      role: 'user',
      companyName: 'Test GmbH',
      companySize: 'medium',
      industry: 'Technologie',
      emailVerified: true,
    },
  })

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
      passwordHash: hashedPassword,
      role: 'user',
      companyName: 'Demo AG',
      companySize: 'large',
      industry: 'E-Commerce',
      emailVerified: true,
    },
  })

  // Create assessments
  const assessment1 = await prisma.assessment.create({
    data: {
      userId: testUser.id,
      type: 'detailed',
      responses: {
        industry: 'Technologie',
        companySize: 'medium',
        goals: ['efficiency', 'customer-experience'],
        useCases: ['customer-service', 'sales-marketing'],
      },
      score: 75,
      maturityLevel: 'intermediate',
      recommendations: {
        topUseCases: [
          {
            title: 'Customer Service Chatbot',
            impact: 'High',
            timeToImplement: '2-3 months',
            estimatedROI: '250%',
          },
          {
            title: 'Sales Lead Scoring',
            impact: 'Medium',
            timeToImplement: '1-2 months',
            estimatedROI: '180%',
          },
        ],
        nextSteps: [
          'Book consultation with AI expert',
          'Define pilot project scope',
          'Prepare data for AI implementation',
        ],
      },
      completedAt: new Date(),
    },
  })

  // Create subscriptions
  await prisma.subscription.create({
    data: {
      userId: testUser.id,
      plan: 'professional',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      stripeSubscriptionId: 'sub_test123',
      stripeCustomerId: 'cus_test123',
    },
  })

  await prisma.subscription.create({
    data: {
      userId: demoUser.id,
      plan: 'enterprise',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      stripeSubscriptionId: 'sub_demo456',
      stripeCustomerId: 'cus_demo456',
    },
  })

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      userId: testUser.id,
      title: 'Customer Service AI Implementation',
      description: 'Implement AI-powered chatbot for customer support',
      status: 'active',
      startDate: new Date(),
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    },
  })

  await prisma.project.create({
    data: {
      userId: demoUser.id,
      title: 'Sales Process Automation',
      description: 'Automate lead scoring and sales predictions',
      status: 'planning',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days
    },
  })

  // Create tasks
  await prisma.task.createMany({
    data: [
      {
        projectId: project1.id,
        title: 'Define chatbot use cases',
        description: 'Identify and document all customer service scenarios',
        status: 'done',
        position: 1,
      },
      {
        projectId: project1.id,
        title: 'Select AI platform',
        description: 'Evaluate and choose the best AI platform for our needs',
        status: 'done',
        position: 2,
      },
      {
        projectId: project1.id,
        title: 'Design conversation flows',
        description: 'Create detailed conversation flows for main use cases',
        status: 'in_progress',
        position: 3,
      },
      {
        projectId: project1.id,
        title: 'Implement pilot version',
        description: 'Build MVP version with core functionality',
        status: 'todo',
        position: 4,
      },
    ],
  })

  // Create messages between users and advisors
  await prisma.message.createMany({
    data: [
      {
        senderId: testUser.id,
        recipientId: advisorUser.id,
        content: 'Wie kann KI unserem Kundenservice helfen?',
      },
      {
        senderId: advisorUser.id,
        recipientId: testUser.id,
        content: 'KI kann Ihren Kundenservice auf verschiedene Weise verbessern:\n\n1. **24/7 Verfügbarkeit**: Ein KI-Chatbot kann rund um die Uhr Kundenanfragen beantworten.\n\n2. **Sofortige Antworten**: Häufige Fragen werden sofort beantwortet, ohne Wartezeit.\n\n3. **Kostenreduktion**: Bis zu 70% der Standardanfragen können automatisiert werden.\n\n4. **Skalierbarkeit**: Beliebig viele Anfragen gleichzeitig bearbeiten.\n\n5. **Konsistente Qualität**: Immer freundlich und präzise Antworten.\n\nMöchten Sie konkrete Beispiele für Ihre Branche?',
      },
      {
        senderId: demoUser.id,
        recipientId: advisorUser.id,
        content: 'Was sind die ersten Schritte für eine KI-Implementation?',
      },
      {
        senderId: advisorUser.id,
        recipientId: demoUser.id,
        content: 'Die ersten Schritte für eine erfolgreiche KI-Implementation sind:\n\n1. **Assessment durchführen**: Analysieren Sie Ihre aktuellen Prozesse und identifizieren Sie KI-Potenziale.\n\n2. **Use Cases priorisieren**: Wählen Sie 1-2 konkrete Anwendungsfälle mit hohem ROI.\n\n3. **Datenqualität prüfen**: Stellen Sie sicher, dass Sie die benötigten Daten in guter Qualität haben.\n\n4. **Pilot-Projekt starten**: Beginnen Sie klein mit einem überschaubaren Projekt.\n\n5. **Team vorbereiten**: Schulen Sie Ihre Mitarbeiter und schaffen Sie Akzeptanz.\n\n6. **Erfolg messen**: Definieren Sie klare KPIs und messen Sie den Fortschritt.\n\nIch empfehle, mit unserem kostenlosen Assessment zu beginnen!',
      },
    ],
  })

  // Create roadmap for test user
  await prisma.roadmap.create({
    data: {
      userId: testUser.id,
      title: 'KI-Transformation Roadmap 2024',
      description: 'Strategische Roadmap für die Einführung von KI im Unternehmen',
      milestones: [
        {
          title: 'Foundation & Assessment',
          description: 'Grundlagen schaffen und Ist-Zustand analysieren',
          duration: '4 Wochen',
          status: 'completed',
          tasks: [
            'KI-Assessment abgeschlossen',
            'Stakeholder Interviews',
            'Datenqualität evaluiert',
            'Use Cases priorisiert',
          ],
        },
        {
          title: 'Pilot Projekt',
          description: 'Ersten KI Use Case implementieren',
          duration: '8 Wochen',
          status: 'in-progress',
          tasks: [
            'Technologie-Stack definiert',
            'MVP entwickelt',
            'Testing & Validierung',
            'Pilot Launch',
          ],
        },
        {
          title: 'Scale & Optimize',
          description: 'Erfolgreiche Lösung skalieren',
          duration: '12 Wochen',
          status: 'planned',
          tasks: [
            'Produktionsumgebung',
            'Team Training',
            'Prozessintegration',
            'Full Rollout',
          ],
        },
      ],
      estimatedDurationWeeks: 24,
    },
  })

  // Create advisor assignment
  await prisma.advisorAssignment.create({
    data: {
      userId: testUser.id,
      advisorId: advisorUser.id,
      status: 'active',
      notes: 'Initial consultation completed. Focus on chatbot implementation.',
    },
  })

  // Create some activity logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: testUser.id,
        action: 'assessment_completed',
        entityType: 'assessment',
        entityId: assessment1.id,
        metadata: { score: 75 },
      },
      {
        userId: testUser.id,
        action: 'subscription_created',
        entityType: 'subscription',
        metadata: { plan: 'professional' },
      },
      {
        userId: testUser.id,
        action: 'project_created',
        entityType: 'project',
        entityId: project1.id,
        metadata: { title: 'Customer Service AI Implementation' },
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📧 Test accounts created:')
  console.log('  Admin: admin@ki-beratung.de (password: password123)')
  console.log('  Advisor: berater@ki-beratung.de (password: password123)')
  console.log('  User 1: test@example.com (password: password123)')
  console.log('  User 2: demo@example.com (password: password123)')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })