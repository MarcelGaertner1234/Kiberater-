import { Assessment, Project, User, AssessmentQuestion, AssessmentResults } from '@/types/api.types'

// User Factory
export const userFactory = {
  build: (overrides: Partial<User> = {}): User => ({
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    email: 'test@example.com',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    avatar: null,
    role: 'USER',
    isEmailVerified: true,
    preferences: {
      language: 'de',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
      dashboard: {
        layout: 'grid',
        widgets: ['assessments', 'projects'],
      },
    },
    subscription: {
      id: 'sub-1',
      plan: 'FREE',
      status: 'ACTIVE',
      currentPeriodStart: '2024-01-01T00:00:00Z',
      currentPeriodEnd: '2024-12-31T23:59:59Z',
      cancelAtPeriodEnd: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  admin: (overrides: Partial<User> = {}): User => 
    userFactory.build({ role: 'ADMIN', ...overrides }),

  consultant: (overrides: Partial<User> = {}): User => 
    userFactory.build({ role: 'CONSULTANT', ...overrides }),

  premium: (overrides: Partial<User> = {}): User => 
    userFactory.build({
      subscription: {
        id: 'sub-premium',
        plan: 'PREMIUM',
        status: 'ACTIVE',
        currentPeriodStart: '2024-01-01T00:00:00Z',
        currentPeriodEnd: '2024-12-31T23:59:59Z',
        cancelAtPeriodEnd: false,
      },
      ...overrides,
    }),
}

// Assessment Factory
export const assessmentFactory = {
  build: (overrides: Partial<Assessment> = {}): Assessment => ({
    id: `assessment-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'user-1',
    title: 'KI-Readiness Assessment',
    description: 'Bewertung der KI-Bereitschaft',
    type: 'READINESS',
    status: 'DRAFT',
    progress: 0,
    answers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  inProgress: (overrides: Partial<Assessment> = {}): Assessment =>
    assessmentFactory.build({
      status: 'IN_PROGRESS',
      progress: 45,
      answers: [
        {
          questionId: 'q1',
          value: 'Ja',
          answeredAt: new Date().toISOString(),
        },
      ],
      ...overrides,
    }),

  completed: (overrides: Partial<Assessment> = {}): Assessment =>
    assessmentFactory.build({
      status: 'COMPLETED',
      progress: 100,
      completedAt: new Date().toISOString(),
      results: {
        totalScore: 85,
        maxScore: 100,
        percentage: 85,
        level: 'ADVANCED',
        categories: [],
        recommendations: [],
        nextSteps: [],
      },
      ...overrides,
    }),

  maturity: (overrides: Partial<Assessment> = {}): Assessment =>
    assessmentFactory.build({
      type: 'MATURITY',
      title: 'KI-Maturity Assessment',
      ...overrides,
    }),
}

// Assessment Question Factory
export const questionFactory = {
  build: (overrides: Partial<AssessmentQuestion> = {}): AssessmentQuestion => ({
    id: `question-${Math.random().toString(36).substr(2, 9)}`,
    category: 'Technology',
    question: 'Wie bewerten Sie Ihre aktuelle IT-Infrastruktur?',
    description: 'Bitte bewerten Sie die Bereitschaft Ihrer IT-Systeme für KI-Integration.',
    type: 'SINGLE_CHOICE',
    options: [
      { id: 'opt1', text: 'Sehr gut', value: 5 },
      { id: 'opt2', text: 'Gut', value: 4 },
      { id: 'opt3', text: 'Mittel', value: 3 },
      { id: 'opt4', text: 'Schlecht', value: 2 },
      { id: 'opt5', text: 'Sehr schlecht', value: 1 },
    ],
    required: true,
    weight: 1,
    order: 1,
    ...overrides,
  }),

  multipleChoice: (overrides: Partial<AssessmentQuestion> = {}): AssessmentQuestion =>
    questionFactory.build({
      type: 'MULTIPLE_CHOICE',
      question: 'Welche KI-Technologien nutzen Sie bereits?',
      options: [
        { id: 'opt1', text: 'Machine Learning', value: 1 },
        { id: 'opt2', text: 'Natural Language Processing', value: 1 },
        { id: 'opt3', text: 'Computer Vision', value: 1 },
        { id: 'opt4', text: 'Robotics', value: 1 },
      ],
      ...overrides,
    }),

  scale: (overrides: Partial<AssessmentQuestion> = {}): AssessmentQuestion =>
    questionFactory.build({
      type: 'SCALE',
      question: 'Wie wichtig ist KI für Ihre Geschäftsstrategie?',
      options: Array.from({ length: 10 }, (_, i) => ({
        id: `scale-${i + 1}`,
        text: (i + 1).toString(),
        value: i + 1,
      })),
      ...overrides,
    }),

  text: (overrides: Partial<AssessmentQuestion> = {}): AssessmentQuestion =>
    questionFactory.build({
      type: 'TEXT',
      question: 'Beschreiben Sie Ihre größten Herausforderungen bei der KI-Implementierung.',
      options: undefined,
      ...overrides,
    }),
}

// Project Factory
export const projectFactory = {
  build: (overrides: Partial<Project> = {}): Project => ({
    id: `project-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'user-1',
    title: 'KI-Implementierung',
    description: 'Implementierung von KI-Lösungen im Unternehmen',
    status: 'PLANNING',
    priority: 'MEDIUM',
    category: 'AI_IMPLEMENTATION',
    tags: ['ki', 'automatisierung'],
    assignees: [],
    timeline: {
      phases: [],
      totalDuration: 12,
      unit: 'WEEKS',
    },
    risks: [],
    milestones: [],
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    ...overrides,
  }),

  inProgress: (overrides: Partial<Project> = {}): Project =>
    projectFactory.build({
      status: 'IN_PROGRESS',
      milestones: [
        {
          id: 'milestone-1',
          title: 'Anforderungsanalyse',
          description: 'Analyse der KI-Anforderungen',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          completedAt: new Date().toISOString(),
        },
      ],
      tasks: [
        {
          id: 'task-1',
          title: 'Stakeholder-Interviews',
          description: 'Durchführung von Interviews mit Stakeholdern',
          status: 'DONE',
          priority: 'HIGH',
          completedAt: new Date().toISOString(),
          tags: ['research', 'stakeholder'],
          dependencies: [],
          subtasks: [],
        },
      ],
      ...overrides,
    }),

  completed: (overrides: Partial<Project> = {}): Project =>
    projectFactory.build({
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      ...overrides,
    }),

  highPriority: (overrides: Partial<Project> = {}): Project =>
    projectFactory.build({
      priority: 'HIGH',
      ...overrides,
    }),
}

// Assessment Results Factory
export const resultsFactory = {
  build: (overrides: Partial<AssessmentResults> = {}): AssessmentResults => ({
    totalScore: 75,
    maxScore: 100,
    percentage: 75,
    level: 'INTERMEDIATE',
    categories: [
      {
        category: 'Technology',
        score: 80,
        maxScore: 100,
        percentage: 80,
        level: 'Advanced',
        strengths: ['Moderne IT-Infrastruktur', 'Cloud-Readiness'],
        weaknesses: ['Datenqualität', 'Integration'],
      },
      {
        category: 'Strategy',
        score: 70,
        maxScore: 100,
        percentage: 70,
        level: 'Intermediate',
        strengths: ['Klare Vision', 'Management Support'],
        weaknesses: ['Ressourcenplanung', 'Zeitplan'],
      },
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Datenqualität verbessern',
        description: 'Implementierung von Datenqualitätsprozessen',
        priority: 'HIGH',
        category: 'Technology',
        estimatedEffort: '3-6 Monate',
        estimatedImpact: 'HIGH',
        resources: [],
      },
    ],
    nextSteps: [
      {
        id: 'step-1',
        title: 'Datenaudit durchführen',
        description: 'Bewertung der aktuellen Datenqualität',
        order: 1,
        estimatedDuration: '2 Wochen',
        dependencies: [],
      },
    ],
    ...overrides,
  }),

  beginner: (overrides: Partial<AssessmentResults> = {}): AssessmentResults =>
    resultsFactory.build({
      totalScore: 35,
      percentage: 35,
      level: 'BEGINNER',
      ...overrides,
    }),

  expert: (overrides: Partial<AssessmentResults> = {}): AssessmentResults =>
    resultsFactory.build({
      totalScore: 95,
      percentage: 95,
      level: 'EXPERT',
      ...overrides,
    }),
}

// Utility Functions
export const createMockApiResponse = <T>(data: T) => ({
  data,
  message: 'Success',
  success: true,
})

export const createMockPaginatedResponse = <T>(items: T[], page = 1, limit = 10) => ({
  data: items,
  pagination: {
    total: items.length,
    page,
    limit,
    totalPages: Math.ceil(items.length / limit),
    hasNext: page * limit < items.length,
    hasPrev: page > 1,
  },
})