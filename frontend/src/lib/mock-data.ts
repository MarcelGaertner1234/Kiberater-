/**
 * Mock Data for Development
 * Zentrale Sammlung von Test-Daten für alle Komponenten
 */

export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@techstart.de',
  company: 'TechStart GmbH',
  role: 'Geschäftsführer',
  plan: 'Professional',
  avatar: 'JD',
  joinedAt: '2024-01-15',
}

export const mockDashboardData = {
  user: mockUser,
  stats: {
    assessmentScore: 75,
    completedProjects: 12,
    activeRoadmaps: 3,
    upcomingTasks: 8,
  },
  recentProjects: [
    {
      id: 1,
      title: 'Customer Service Chatbot',
      status: 'In Progress',
      progress: 65,
      dueDate: '2024-02-15',
      team: ['JD', 'MS', 'TW'],
    },
    {
      id: 2,
      title: 'Sales Process Automation',
      status: 'Planning',
      progress: 25,
      dueDate: '2024-03-01',
      team: ['JD', 'AM'],
    },
    {
      id: 3,
      title: 'Data Analytics Dashboard',
      status: 'Done',
      progress: 100,
      dueDate: '2024-01-30',
      team: ['JD', 'MS', 'TW', 'LK'],
    },
  ],
  upcomingTasks: [
    {
      id: 1,
      title: 'Berater-Gespräch: Chatbot Review',
      date: 'Heute, 14:00',
      type: 'meeting',
    },
    {
      id: 2,
      title: 'Datenmodell finalisieren',
      date: 'Morgen',
      type: 'task',
    },
    {
      id: 3,
      title: 'Team Training: KI Grundlagen',
      date: 'Freitag, 10:00',
      type: 'training',
    },
  ],
}

export const mockNotifications = [
  {
    id: 1,
    title: 'Neues Update verfügbar',
    message: 'Version 2.1 mit verbesserter KI-Assessment Analyse',
    type: 'info',
    read: false,
    createdAt: '2024-02-12T10:30:00Z',
  },
  {
    id: 2,
    title: 'Berater-Nachricht',
    message: 'Maria Schmidt hat auf Ihre Frage geantwortet',
    type: 'message',
    read: false,
    createdAt: '2024-02-12T09:15:00Z',
  },
  {
    id: 3,
    title: 'Projekt Meilenstein erreicht',
    message: 'Customer Service Bot - Phase 1 abgeschlossen',
    type: 'success',
    read: true,
    createdAt: '2024-02-11T16:45:00Z',
  },
]

export const mockProjects = [
  {
    id: 1,
    title: 'Customer Service Chatbot',
    description: 'KI-gestützter Chatbot für den Kundensupport',
    status: 'active',
    progress: 65,
    startDate: '2024-01-15',
    dueDate: '2024-03-15',
    budget: 25000,
    team: [
      { id: 'jd', name: 'John Doe', role: 'Project Lead', avatar: 'JD' },
      { id: 'ms', name: 'Maria Schmidt', role: 'AI Engineer', avatar: 'MS' },
      { id: 'tw', name: 'Tom Weber', role: 'Developer', avatar: 'TW' },
    ],
    milestones: [
      { id: 1, title: 'Requirements Analysis', completed: true, dueDate: '2024-01-30' },
      { id: 2, title: 'Prototype Development', completed: true, dueDate: '2024-02-15' },
      { id: 3, title: 'Testing & Optimization', completed: false, dueDate: '2024-02-28' },
      { id: 4, title: 'Production Deployment', completed: false, dueDate: '2024-03-15' },
    ],
  },
  {
    id: 2,
    title: 'Sales Process Automation',
    description: 'Automatisierung der Lead-Qualifizierung und Follow-up Prozesse',
    status: 'planning',
    progress: 25,
    startDate: '2024-02-01',
    dueDate: '2024-04-30',
    budget: 35000,
    team: [
      { id: 'jd', name: 'John Doe', role: 'Project Lead', avatar: 'JD' },
      { id: 'am', name: 'Anna Müller', role: 'Business Analyst', avatar: 'AM' },
    ],
    milestones: [
      { id: 1, title: 'Process Mapping', completed: true, dueDate: '2024-02-15' },
      { id: 2, title: 'AI Model Design', completed: false, dueDate: '2024-03-01' },
      { id: 3, title: 'Integration Development', completed: false, dueDate: '2024-03-31' },
      { id: 4, title: 'User Training & Rollout', completed: false, dueDate: '2024-04-30' },
    ],
  },
]

export const mockAssessmentData = {
  currentStep: 1,
  totalSteps: 5,
  responses: {
    step1: {
      industry: 'Technologie & Software',
      companySize: '51-200',
      revenue: '2m-10m',
      role: 'Geschäftsführer',
    },
    step2: {
      digitalizationLevel: 7,
      currentTools: ['CRM', 'ERP', 'Analytics'],
      dataQuality: 6,
      automationLevel: 4,
    },
    step3: {
      aiExperience: 'basic',
      aiUseCases: ['customer-service', 'sales-automation'],
      mainChallenges: ['Effizienz steigern', 'Kosten reduzieren'],
      timeframe: '3-6 months',
    },
    step4: {
      primaryGoals: ['Automatisierung', 'Datenanalyse'],
      successMetrics: ['ROI', 'Zeitersparnis', 'Kundenzufriedenheit'],
      budget: '50k-100k',
      commitment: 'high',
    },
  },
  results: {
    overallScore: 75,
    categoryScores: {
      dataReadiness: 80,
      techInfrastructure: 70,
      organizationalReadiness: 75,
      aiMaturity: 65,
    },
    recommendations: [
      {
        id: 1,
        title: 'Customer Service Automation',
        description: 'Implementierung eines KI-Chatbots für den Kundensupport',
        priority: 'high',
        effort: 'medium',
        impact: 'high',
        timeframe: '3-4 Monate',
        estimatedROI: '250%',
      },
      {
        id: 2,
        title: 'Sales Lead Scoring',
        description: 'Automatische Bewertung und Priorisierung von Verkaufschancen',
        priority: 'medium',
        effort: 'low',
        impact: 'medium',
        timeframe: '2-3 Monate',
        estimatedROI: '180%',
      },
      {
        id: 3,
        title: 'Predictive Analytics',
        description: 'Vorhersage von Kundenbedürfnissen und Markttrends',
        priority: 'low',
        effort: 'high',
        impact: 'high',
        timeframe: '6-8 Monate',
        estimatedROI: '320%',
      },
    ],
  },
}

export const mockLearningContent = [
  {
    id: 1,
    title: 'KI Grundlagen für Unternehmer',
    type: 'course',
    duration: '2 Stunden',
    difficulty: 'Beginner',
    progress: 100,
    thumbnail: '/images/course-ai-basics.jpg',
    description: 'Eine umfassende Einführung in künstliche Intelligenz für Geschäftsführer',
  },
  {
    id: 2,
    title: 'Chatbot Implementation Best Practices',
    type: 'video',
    duration: '45 Min',
    difficulty: 'Intermediate',
    progress: 60,
    thumbnail: '/images/video-chatbot.jpg',
    description: 'Schritt-für-Schritt Anleitung zur erfolgreichen Chatbot-Implementierung',
  },
  {
    id: 3,
    title: 'ROI Measurement Guide',
    type: 'document',
    duration: '15 Min',
    difficulty: 'Advanced',
    progress: 0,
    thumbnail: '/images/guide-roi.jpg',
    description: 'Methoden zur Messung des Return on Investment bei KI-Projekten',
  },
]

export const mockChatMessages = [
  {
    id: 1,
    senderId: 'consultant-1',
    senderName: 'Maria Schmidt',
    senderRole: 'Senior KI-Beraterin',
    message:
      'Hallo John! Wie läuft das Customer Service Bot Projekt? Haben Sie noch Fragen zur aktuellen Implementation?',
    timestamp: '2024-02-12T10:30:00Z',
    isConsultant: true,
  },
  {
    id: 2,
    senderId: 'user-1',
    senderName: 'John Doe',
    senderRole: 'Kunde',
    message:
      'Hi Maria! Das Projekt läuft gut. Ich hätte eine Frage zur Integration mit unserem bestehenden CRM-System. Können wir das diese Woche besprechen?',
    timestamp: '2024-02-12T11:15:00Z',
    isConsultant: false,
  },
  {
    id: 3,
    senderId: 'consultant-1',
    senderName: 'Maria Schmidt',
    senderRole: 'Senior KI-Beraterin',
    message:
      'Absolut! Ich habe Donnerstag um 14:00 Zeit. Soll ich einen Termin in Ihren Kalender eintragen? Wir können auch gerne einen Bildschirm teilen für die technischen Details.',
    timestamp: '2024-02-12T11:20:00Z',
    isConsultant: true,
  },
]

export const mockTeamMembers = [
  {
    id: 'jd',
    name: 'John Doe',
    email: 'john.doe@techstart.de',
    role: 'Admin',
    department: 'Management',
    joinedAt: '2024-01-15',
    avatar: 'JD',
    status: 'active',
  },
  {
    id: 'ms',
    name: 'Maria Schmidt',
    email: 'maria.schmidt@techstart.de',
    role: 'Member',
    department: 'IT',
    joinedAt: '2024-01-20',
    avatar: 'MS',
    status: 'active',
  },
  {
    id: 'tw',
    name: 'Tom Weber',
    email: 'tom.weber@techstart.de',
    role: 'Member',
    department: 'Development',
    joinedAt: '2024-01-25',
    avatar: 'TW',
    status: 'active',
  },
]

export const mockAnalytics = {
  overview: {
    totalProjects: 12,
    activeProjects: 3,
    completedProjects: 8,
    totalInvestment: 120000,
    estimatedROI: 280,
    timeSaved: 240, // hours per month
  },
  projectMetrics: [
    {
      project: 'Customer Service Bot',
      roi: 250,
      timeSaved: 120,
      costSavings: 15000,
      userSatisfaction: 4.5,
    },
    {
      project: 'Sales Automation',
      roi: 180,
      timeSaved: 80,
      costSavings: 8000,
      userSatisfaction: 4.2,
    },
  ],
  monthlyProgress: [
    { month: 'Jan', projects: 2, investment: 25000, savings: 5000 },
    { month: 'Feb', projects: 3, investment: 35000, savings: 12000 },
    { month: 'Mar', projects: 4, investment: 40000, savings: 18000 },
    { month: 'Apr', projects: 3, investment: 20000, savings: 23000 },
  ],
}
