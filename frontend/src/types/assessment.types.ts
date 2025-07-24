export interface AssessmentState {
  currentAssessment: Assessment | null
  questions: AssessmentQuestion[]
  answers: Record<string, AssessmentAnswer>
  currentStep: number
  totalSteps: number
  isLoading: boolean
  isSaving: boolean
  error: string | null
  lastSaved: Date | null
}

export interface Assessment {
  id: string
  userId: string
  title: string
  description?: string
  type: AssessmentType
  status: AssessmentStatus
  progress: number
  answers: AssessmentAnswer[]
  results?: AssessmentResults
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export type AssessmentType = 'READINESS' | 'MATURITY' | 'CUSTOM'
export type AssessmentStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'

export interface AssessmentQuestion {
  id: string
  step: number
  category: string
  subcategory?: string
  question: string
  description?: string
  type: QuestionType
  options?: AssessmentOption[]
  required: boolean
  weight: number
  order: number
  condition?: QuestionCondition
}

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SCALE' | 'TEXT' | 'BOOLEAN' | 'MATRIX'

export interface QuestionCondition {
  questionId: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
}

export interface AssessmentOption {
  id: string
  text: string
  value: number
  description?: string
  icon?: string
  color?: string
}

export interface AssessmentAnswer {
  questionId: string
  value: any
  comment?: string
  confidence?: number
  answeredAt: string
}

export interface AssessmentResults {
  id: string
  assessmentId: string
  totalScore: number
  maxScore: number
  percentage: number
  level: MaturityLevel
  categories: CategoryResult[]
  recommendations: Recommendation[]
  nextSteps: NextStep[]
  reportUrl?: string
  createdAt: string
}

export type MaturityLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export interface CategoryResult {
  category: string
  subcategory?: string
  score: number
  maxScore: number
  percentage: number
  level: MaturityLevel
  rank: number
  strengths: string[]
  weaknesses: string[]
  insights: string[]
}

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: Priority
  category: string
  subcategory?: string
  estimatedEffort: EffortLevel
  estimatedImpact: ImpactLevel
  timeframe: Timeframe
  resources: Resource[]
  prerequisites: string[]
  kpis: string[]
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type EffortLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type ImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type Timeframe = 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM'

export interface NextStep {
  id: string
  title: string
  description: string
  order: number
  category: string
  estimatedDuration: string
  dependencies: string[]
  resources: Resource[]
  kpis: string[]
}

export interface Resource {
  type: ResourceType
  title: string
  description: string
  url: string
  thumbnail?: string
  duration?: string
  level: MaturityLevel
  isPremium: boolean
  rating?: number
  tags: string[]
}

export type ResourceType = 'ARTICLE' | 'VIDEO' | 'COURSE' | 'TOOL' | 'TEMPLATE' | 'BOOK' | 'PODCAST' | 'WEBINAR'

export interface AssessmentTemplate {
  id: string
  name: string
  description: string
  type: AssessmentType
  category: string
  estimatedDuration: number
  questionCount: number
  isPublic: boolean
  isPremium: boolean
  author: string
  version: string
  tags: string[]
  questions: AssessmentQuestion[]
}

export interface AssessmentProgress {
  assessmentId: string
  currentStep: number
  totalSteps: number
  answeredQuestions: number
  totalQuestions: number
  percentage: number
  estimatedTimeRemaining: number
  lastActivity: string
}

export interface AssessmentValidation {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  questionId: string
  field: string
  message: string
  type: 'required' | 'format' | 'range' | 'dependency'
}

export interface ValidationWarning {
  questionId: string
  message: string
  type: 'completion' | 'confidence' | 'consistency'
}