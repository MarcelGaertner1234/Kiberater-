'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { 
  ArrowLeft, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  Users, 
  Brain, 
  Zap,
  FileText,
  MessageSquare,
  BarChart,
  ShoppingCart,
  Package,
  Cpu
} from 'lucide-react'

const aiUseCases = [
  {
    id: 'customer-service',
    title: 'Kundenservice & Support',
    description: 'Chatbots, Ticket-Automatisierung, FAQ-Systeme',
    icon: <MessageSquare className="w-6 h-6" />,
    examples: ['24/7 Kundensupport', 'Automatische Ticket-Kategorisierung', 'Sentiment-Analyse']
  },
  {
    id: 'sales-marketing',
    title: 'Vertrieb & Marketing',
    description: 'Lead-Scoring, Personalisierung, Kampagnen-Optimierung',
    icon: <TrendingUp className="w-6 h-6" />,
    examples: ['Predictive Lead Scoring', 'Content-Personalisierung', 'Kampagnen-ROI Vorhersage']
  },
  {
    id: 'operations',
    title: 'Betriebsabläufe & Prozesse',
    description: 'Prozessautomatisierung, Qualitätskontrolle, Ressourcenplanung',
    icon: <Zap className="w-6 h-6" />,
    examples: ['Workflow-Automatisierung', 'Predictive Maintenance', 'Ressourcen-Optimierung']
  },
  {
    id: 'analytics',
    title: 'Datenanalyse & Insights',
    description: 'Business Intelligence, Forecasting, Anomalie-Erkennung',
    icon: <BarChart className="w-6 h-6" />,
    examples: ['Umsatzprognosen', 'Kundenverhalten-Analyse', 'Risiko-Bewertung']
  },
  {
    id: 'product',
    title: 'Produktentwicklung',
    description: 'Innovationsmanagement, Qualitätssicherung, User Research',
    icon: <Package className="w-6 h-6" />,
    examples: ['Feature-Priorisierung', 'A/B Test Analyse', 'User Feedback Clustering']
  },
  {
    id: 'hr',
    title: 'Personal & HR',
    description: 'Recruiting, Mitarbeiter-Engagement, Skills-Management',
    icon: <Users className="w-6 h-6" />,
    examples: ['CV-Screening', 'Mitarbeiter-Zufriedenheit', 'Skill-Gap Analyse']
  },
  {
    id: 'finance',
    title: 'Finanzen & Controlling',
    description: 'Rechnungsverarbeitung, Fraud Detection, Budgetierung',
    icon: <FileText className="w-6 h-6" />,
    examples: ['Automatische Rechnungsverarbeitung', 'Betrugs-Erkennung', 'Cash-Flow Vorhersage']
  },
  {
    id: 'it-security',
    title: 'IT & Sicherheit',
    description: 'Cyber Security, System-Monitoring, Incident Response',
    icon: <Cpu className="w-6 h-6" />,
    examples: ['Anomalie-Erkennung', 'Automatische Threat Response', 'Log-Analyse']
  }
]

const aiGoals = [
  { id: 'efficiency', label: 'Effizienzsteigerung & Kostensenkung', icon: <Target /> },
  { id: 'customer-experience', label: 'Kundenerfahrung verbessern', icon: <Users /> },
  { id: 'innovation', label: 'Innovation & neue Geschäftsmodelle', icon: <Brain /> },
  { id: 'decision-making', label: 'Bessere Entscheidungsfindung', icon: <BarChart /> },
  { id: 'competitive', label: 'Wettbewerbsvorteile sichern', icon: <TrendingUp /> },
  { id: 'scalability', label: 'Skalierbarkeit erhöhen', icon: <Zap /> }
]

export default function AssessmentStep2Page() {
  const router = useRouter()
  const styles = useNotionStyles()

  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check if step 1 data exists
    const step1Data = localStorage.getItem('assessmentData')
    if (!step1Data) {
      router.push('/assessment')
    }
  }, [router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (selectedUseCases.length === 0) {
      newErrors.useCases = 'Bitte wählen Sie mindestens einen Anwendungsfall'
    }
    if (selectedGoals.length === 0) {
      newErrors.goals = 'Bitte wählen Sie mindestens ein Ziel'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUseCaseToggle = (id: string) => {
    setSelectedUseCases(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
    if (errors.useCases) {
      setErrors({ ...errors, useCases: '' })
    }
  }

  const handleGoalToggle = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
    if (errors.goals) {
      setErrors({ ...errors, goals: '' })
    }
  }

  const handleNext = () => {
    if (validateForm()) {
      // Store form data
      const existingData = JSON.parse(localStorage.getItem('assessmentData') || '{}')
      localStorage.setItem('assessmentData', JSON.stringify({
        ...existingData,
        step2: {
          useCases: selectedUseCases,
          goals: selectedGoals
        }
      }))
      router.push('/assessment/step-3')
    }
  }

  const handleBack = () => {
    router.push('/assessment')
  }

  return (
    <NotionCard className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-notion-blue to-notion-purple rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className={styles.text('h2', 'mb-2')}>Wo sehen Sie KI-Potenzial?</h2>
        <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
          Wählen Sie die Bereiche, in denen KI Ihrem Unternehmen helfen könnte.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-notion-green flex items-center justify-center text-white text-sm font-medium">
            ✓
          </div>
          <div className="w-16 h-1 bg-notion-blue"></div>
          <div className="w-8 h-8 rounded-full bg-notion-blue flex items-center justify-center text-white text-sm font-medium">
            2
          </div>
          <div className="w-16 h-1 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary"></div>
          <div className="w-8 h-8 rounded-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary flex items-center justify-center text-notion-text-secondary text-sm">
            3
          </div>
          <div className="w-16 h-1 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary"></div>
          <div className="w-8 h-8 rounded-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary flex items-center justify-center text-notion-text-secondary text-sm">
            4
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Use Cases Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            In welchen Bereichen möchten Sie KI einsetzen? *
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {aiUseCases.map((useCase) => (
              <div
                key={useCase.id}
                onClick={() => handleUseCaseToggle(useCase.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedUseCases.includes(useCase.id)
                    ? 'border-notion-blue bg-notion-blue/5'
                    : 'border-notion-border dark:border-notion-dark-border hover:border-notion-blue/50'
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                    selectedUseCases.includes(useCase.id)
                      ? 'bg-notion-blue text-white'
                      : 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary text-notion-text-secondary'
                  }`}>
                    {useCase.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{useCase.title}</h4>
                    <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary mb-2">
                      {useCase.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {useCase.examples.map((example, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.useCases && (
            <p className="text-notion-red text-sm mt-2">{errors.useCases}</p>
          )}
        </div>

        {/* Goals Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Was sind Ihre Hauptziele mit KI? *
          </h3>
          <div className="space-y-3">
            {aiGoals.map((goal) => (
              <label
                key={goal.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedGoals.includes(goal.id)
                    ? 'border-notion-blue bg-notion-blue/5'
                    : 'border-notion-border dark:border-notion-dark-border hover:border-notion-blue/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedGoals.includes(goal.id)}
                  onChange={() => handleGoalToggle(goal.id)}
                  className="w-5 h-5 text-notion-blue rounded border-notion-border focus:ring-notion-blue"
                />
                <div className="ml-3 flex items-center">
                  <span className="text-notion-text-secondary mr-2">{goal.icon}</span>
                  <span>{goal.label}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.goals && (
            <p className="text-notion-red text-sm mt-2">{errors.goals}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-notion-border dark:border-notion-dark-border">
          <NotionButton
            variant="ghost"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Zurück
          </NotionButton>
          <NotionButton
            variant="primary"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Weiter zu Schritt 3
          </NotionButton>
        </div>
      </div>
    </NotionCard>
  )
}