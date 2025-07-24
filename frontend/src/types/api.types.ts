// Base API Types
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  avatar?: string
  role: 'USER' | 'ADMIN' | 'CONSULTANT'
  isEmailVerified: boolean
  preferences?: UserPreferences
  subscription?: Subscription
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  language: 'de' | 'en'
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
  dashboard: {
    layout: 'grid' | 'list'
    widgets: string[]
  }
}

export interface Subscription {
  id: string
  plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE'
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'EXPIRED'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  firstName?: string
  lastName?: string
  company?: string
  acceptTerms: boolean
  newsletter?: boolean
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresAt: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  password: string
  confirmPassword: string
}

// Assessment Types
export interface Assessment {
  id: string
  userId: string
  title: string
  description?: string
  type: 'READINESS' | 'MATURITY' | 'CUSTOM'
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'
  progress: number
  answers: AssessmentAnswer[]
  results?: AssessmentResults
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface AssessmentQuestion {
  id: string
  category: string
  subcategory?: string
  question: string
  description?: string
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SCALE' | 'TEXT' | 'BOOLEAN'
  options?: AssessmentOption[]
  required: boolean
  weight: number
  order: number
}

export interface AssessmentOption {
  id: string
  text: string
  value: number
  description?: string
}

export interface AssessmentAnswer {
  questionId: string
  value: any
  comment?: string
  answeredAt: string
}

export interface AssessmentResults {
  totalScore: number
  maxScore: number
  percentage: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  categories: CategoryResult[]
  recommendations: Recommendation[]
  nextSteps: NextStep[]
}

export interface CategoryResult {
  category: string
  score: number
  maxScore: number
  percentage: number
  level: string
  strengths: string[]
  weaknesses: string[]
}

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  category: string
  estimatedEffort: string
  estimatedImpact: 'LOW' | 'MEDIUM' | 'HIGH'
  resources: Resource[]
}

export interface NextStep {
  id: string
  title: string
  description: string
  order: number
  estimatedDuration: string
  dependencies: string[]
}

export interface Resource {
  type: 'ARTICLE' | 'VIDEO' | 'COURSE' | 'TOOL' | 'TEMPLATE'
  title: string
  description: string
  url: string
  thumbnail?: string
  duration?: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
}

// Project Types
export interface Project {
  id: string
  userId: string
  title: string
  description: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  category: string
  tags: string[]
  assignees: ProjectAssignee[]
  timeline: ProjectTimeline
  budget?: ProjectBudget
  risks: ProjectRisk[]
  milestones: ProjectMilestone[]
  tasks: ProjectTask[]
  createdAt: string
  updatedAt: string
  startDate?: string
  endDate?: string
  completedAt?: string
}

export interface ProjectAssignee {
  userId: string
  role: 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER'
  user: Pick<User, 'id' | 'name' | 'email' | 'avatar'>
}

export interface ProjectTimeline {
  phases: ProjectPhase[]
  totalDuration: number
  unit: 'DAYS' | 'WEEKS' | 'MONTHS'
}

export interface ProjectPhase {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
  dependencies: string[]
}

export interface ProjectBudget {
  total: number
  allocated: number
  spent: number
  currency: 'EUR' | 'USD'
  breakdown: BudgetItem[]
}

export interface BudgetItem {
  category: string
  planned: number
  actual: number
  description: string
}

export interface ProjectRisk {
  id: string
  title: string
  description: string
  probability: 'LOW' | 'MEDIUM' | 'HIGH'
  impact: 'LOW' | 'MEDIUM' | 'HIGH'
  mitigation: string
  status: 'IDENTIFIED' | 'MITIGATED' | 'ACCEPTED' | 'CLOSED'
}

export interface ProjectMilestone {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE'
  completedAt?: string
}

export interface ProjectTask {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  assigneeId?: string
  dueDate?: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  tags: string[]
  dependencies: string[]
  subtasks: ProjectSubtask[]
}

export interface ProjectSubtask {
  id: string
  title: string
  completed: boolean
  completedAt?: string
}

// Content Types
export interface ContentItem {
  id: string
  type: 'ARTICLE' | 'VIDEO' | 'COURSE' | 'TEMPLATE' | 'TOOL' | 'CASE_STUDY'
  title: string
  description: string
  content?: string
  url?: string
  thumbnail?: string
  author: string
  publishedAt: string
  updatedAt: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  category: string
  tags: string[]
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration?: string
  views: number
  rating: number
  ratingCount: number
  isPremium: boolean
}

// Analytics Types
export interface AnalyticsData {
  overview: OverviewMetrics
  assessments: AssessmentMetrics
  projects: ProjectMetrics
  content: ContentMetrics
  users: UserMetrics
}

export interface OverviewMetrics {
  totalUsers: number
  activeUsers: number
  completedAssessments: number
  activeProjects: number
  contentViews: number
  period: string
}

export interface AssessmentMetrics {
  totalCompleted: number
  averageScore: number
  topCategories: CategoryMetric[]
  completionRate: number
  averageTime: number
}

export interface CategoryMetric {
  category: string
  averageScore: number
  completions: number
}

export interface ProjectMetrics {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  onTimeCompletion: number
  averageDuration: number
  statusDistribution: StatusDistribution[]
}

export interface StatusDistribution {
  status: string
  count: number
  percentage: number
}

export interface ContentMetrics {
  totalContent: number
  totalViews: number
  popularContent: PopularContent[]
  engagementRate: number
}

export interface PopularContent {
  id: string
  title: string
  views: number
  rating: number
}

export interface UserMetrics {
  newUsers: number
  activeUsers: number
  retentionRate: number
  subscriptionDistribution: SubscriptionDistribution[]
}

export interface SubscriptionDistribution {
  plan: string
  count: number
  percentage: number
}

// Webhook Types
export interface WebhookEvent {
  id: string
  event: string
  data: any
  timestamp: string
  processed: boolean
}

// File Upload Types
export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  url?: string
  error?: string
}

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}