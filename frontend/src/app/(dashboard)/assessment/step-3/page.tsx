'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { 
  ArrowLeft, 
  ArrowRight, 
  Gauge, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'

const readinessQuestions = [
  {
    id: 'data-quality',
    category: 'Daten & Infrastruktur',
    question: 'Wie bewerten Sie die Qualität und Verfügbarkeit Ihrer Unternehmensdaten?',
    options: [
      { value: 1, label: 'Sehr schlecht - Daten sind unstrukturiert und schwer zugänglich' },
      { value: 2, label: 'Schlecht - Einige Daten vorhanden, aber nicht standardisiert' },
      { value: 3, label: 'Mittel - Daten teilweise strukturiert und zugänglich' },
      { value: 4, label: 'Gut - Meiste Daten sind strukturiert und leicht zugänglich' },
      { value: 5, label: 'Sehr gut - Alle Daten sind sauber, strukturiert und zentral verfügbar' }
    ]
  },
  {
    id: 'it-infrastructure',
    category: 'Daten & Infrastruktur',
    question: 'Wie modern ist Ihre IT-Infrastruktur?',
    options: [
      { value: 1, label: 'Veraltet - Legacy-Systeme dominieren' },
      { value: 2, label: 'Teilweise veraltet - Mix aus alt und neu' },
      { value: 3, label: 'Durchschnittlich - Grundlegende Modernisierung vorhanden' },
      { value: 4, label: 'Modern - Cloud-Dienste und moderne Tools im Einsatz' },
      { value: 5, label: 'State-of-the-art - Vollständig cloud-basiert und API-first' }
    ]
  },
  {
    id: 'team-skills',
    category: 'Team & Kultur',
    question: 'Wie hoch ist das technische Know-how in Ihrem Team bezüglich KI/ML?',
    options: [
      { value: 1, label: 'Kein Know-how - Niemand hat KI-Erfahrung' },
      { value: 2, label: 'Gering - Einzelne haben Grundkenntnisse' },
      { value: 3, label: 'Mittel - Einige Mitarbeiter mit soliden Kenntnissen' },
      { value: 4, label: 'Hoch - Dediziertes Team mit KI-Expertise' },
      { value: 5, label: 'Sehr hoch - KI-Experten und Data Scientists im Haus' }
    ]
  },
  {
    id: 'change-readiness',
    category: 'Team & Kultur',
    question: 'Wie offen ist Ihre Organisation für Veränderungen?',
    options: [
      { value: 1, label: 'Sehr resistent - Starke Widerstände gegen Neuerungen' },
      { value: 2, label: 'Skeptisch - Veränderungen werden zögerlich angenommen' },
      { value: 3, label: 'Neutral - Veränderungen werden akzeptiert, aber nicht gefördert' },
      { value: 4, label: 'Offen - Aktive Unterstützung für Innovation' },
      { value: 5, label: 'Sehr offen - Innovation ist Teil der Unternehmenskultur' }
    ]
  },
  {
    id: 'budget',
    category: 'Ressourcen',
    question: 'Welches Budget steht für KI-Initiativen zur Verfügung?',
    options: [
      { value: 1, label: 'Kein dediziertes Budget' },
      { value: 2, label: 'Kleines Budget (<50k EUR/Jahr)' },
      { value: 3, label: 'Mittleres Budget (50-200k EUR/Jahr)' },
      { value: 4, label: 'Großes Budget (200-500k EUR/Jahr)' },
      { value: 5, label: 'Sehr großes Budget (>500k EUR/Jahr)' }
    ]
  },
  {
    id: 'leadership-support',
    category: 'Ressourcen',
    question: 'Wie stark ist die Unterstützung der Geschäftsführung für KI-Projekte?',
    options: [
      { value: 1, label: 'Keine Unterstützung - KI hat keine Priorität' },
      { value: 2, label: 'Gering - KI wird toleriert, aber nicht gefördert' },
      { value: 3, label: 'Mittel - Grundsätzliche Zustimmung vorhanden' },
      { value: 4, label: 'Stark - Aktive Förderung von KI-Initiativen' },
      { value: 5, label: 'Sehr stark - KI ist strategische Priorität' }
    ]
  }
]

export default function AssessmentStep3Page() {
  const router = useRouter()
  const styles = useNotionStyles()

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check if previous steps data exists
    const assessmentData = localStorage.getItem('assessmentData')
    if (!assessmentData) {
      router.push('/assessment')
      return
    }
    
    const data = JSON.parse(assessmentData)
    if (!data.step1 || !data.step2) {
      router.push('/assessment')
    }
  }, [router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    readinessQuestions.forEach(question => {
      if (!answers[question.id]) {
        newErrors[question.id] = 'Bitte beantworten Sie diese Frage'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const calculateReadinessScore = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    const maxScore = readinessQuestions.length * 5
    return Math.round((totalScore / maxScore) * 100)
  }

  const handleNext = () => {
    if (validateForm()) {
      const readinessScore = calculateReadinessScore()
      
      // Store form data
      const existingData = JSON.parse(localStorage.getItem('assessmentData') || '{}')
      localStorage.setItem('assessmentData', JSON.stringify({
        ...existingData,
        step3: {
          answers,
          readinessScore
        }
      }))
      router.push('/assessment/step-4')
    }
  }

  const handleBack = () => {
    router.push('/assessment/step-2')
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'notion-green'
    if (score >= 3) return 'notion-yellow'
    return 'notion-red'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 4) return <CheckCircle className="w-4 h-4" />
    if (score >= 3) return <AlertCircle className="w-4 h-4" />
    return <XCircle className="w-4 h-4" />
  }

  // Group questions by category
  const questionsByCategory = readinessQuestions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = []
    }
    acc[question.category].push(question)
    return acc
  }, {} as Record<string, typeof readinessQuestions>)

  return (
    <NotionCard className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-notion-blue to-notion-purple rounded-full flex items-center justify-center mx-auto mb-4">
          <Gauge className="w-8 h-8 text-white" />
        </div>
        <h2 className={styles.text('h2', 'mb-2')}>KI-Readiness Check</h2>
        <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
          Bewerten Sie die KI-Bereitschaft Ihres Unternehmens.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-notion-green flex items-center justify-center text-white text-sm font-medium">
            ✓
          </div>
          <div className="w-16 h-1 bg-notion-green"></div>
          <div className="w-8 h-8 rounded-full bg-notion-green flex items-center justify-center text-white text-sm font-medium">
            ✓
          </div>
          <div className="w-16 h-1 bg-notion-blue"></div>
          <div className="w-8 h-8 rounded-full bg-notion-blue flex items-center justify-center text-white text-sm font-medium">
            3
          </div>
          <div className="w-16 h-1 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary"></div>
          <div className="w-8 h-8 rounded-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary flex items-center justify-center text-notion-text-secondary text-sm">
            4
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(questionsByCategory).map(([category, questions]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-2 h-2 bg-notion-blue rounded-full mr-2"></span>
              {category}
            </h3>
            <div className="space-y-6 pl-4">
              {questions.map((question) => (
                <div key={question.id}>
                  <p className="font-medium mb-3">{question.question} *</p>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                          answers[question.id] === option.value
                            ? 'border-notion-blue bg-notion-blue/5'
                            : 'border-notion-border dark:border-notion-dark-border hover:border-notion-blue/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={answers[question.id] === option.value}
                          onChange={() => handleAnswerChange(question.id, option.value)}
                          className="w-4 h-4 mt-0.5 text-notion-blue focus:ring-notion-blue"
                        />
                        <div className="ml-3 flex-1">
                          <span className="text-sm">{option.label}</span>
                          {answers[question.id] === option.value && (
                            <span className={`ml-2 inline-flex items-center text-xs text-${getScoreColor(option.value)}`}>
                              {getScoreIcon(option.value)}
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors[question.id] && (
                    <p className="text-notion-red text-sm mt-2">{errors[question.id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Live Score Preview */}
        {Object.keys(answers).length > 0 && (
          <div className="mt-8 p-4 bg-notion-blue/5 border border-notion-blue/20 rounded-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-notion-blue mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-notion-blue mb-1">
                  Aktueller KI-Readiness Score
                </h4>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-notion-blue">
                    {calculateReadinessScore()}%
                  </div>
                  <span className="ml-2 text-sm text-notion-text-secondary">
                    ({Object.keys(answers).length}/{readinessQuestions.length} Fragen beantwortet)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

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
            Weiter zu Schritt 4
          </NotionButton>
        </div>
      </div>
    </NotionCard>
  )
}