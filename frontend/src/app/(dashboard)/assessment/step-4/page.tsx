'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { 
  ArrowLeft, 
  CheckCircle, 
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  Info,
  Download,
  Send,
  Sparkles
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
}

const challenges: Challenge[] = [
  {
    id: 'data-privacy',
    title: 'Datenschutz & Compliance',
    description: 'DSGVO-Konformität, Datensicherheit, Compliance-Anforderungen',
    impact: 'high'
  },
  {
    id: 'integration',
    title: 'System-Integration',
    description: 'Integration in bestehende IT-Landschaft, API-Anbindungen',
    impact: 'medium'
  },
  {
    id: 'roi-measurement',
    title: 'ROI-Messung',
    description: 'Erfolgsmessung, KPI-Definition, Business Case Validierung',
    impact: 'medium'
  },
  {
    id: 'change-management',
    title: 'Change Management',
    description: 'Mitarbeiter-Akzeptanz, Schulungen, Prozessanpassungen',
    impact: 'high'
  },
  {
    id: 'expertise',
    title: 'Fehlendes Know-how',
    description: 'KI-Expertise, technisches Verständnis, Best Practices',
    impact: 'high'
  },
  {
    id: 'budget-constraints',
    title: 'Budget-Beschränkungen',
    description: 'Finanzierung, Kosten-Nutzen-Verhältnis, Investitionssicherheit',
    impact: 'medium'
  }
]

export default function AssessmentStep4Page() {
  const router = useRouter()
  const styles = useNotionStyles()

  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([])
  const [timeline, setTimeline] = useState('')
  const [budget, setBudget] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [contactPreference, setContactPreference] = useState<'email' | 'phone' | 'video'>('email')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if previous steps data exists
    const assessmentData = localStorage.getItem('assessmentData')
    if (!assessmentData) {
      router.push('/assessment')
      return
    }
    
    const data = JSON.parse(assessmentData)
    if (!data.step1 || !data.step2 || !data.step3) {
      router.push('/assessment')
    }
  }, [router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!timeline) {
      newErrors.timeline = 'Bitte wählen Sie einen Zeitrahmen'
    }
    if (!budget) {
      newErrors.budget = 'Bitte wählen Sie ein Budget'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChallengeToggle = (id: string) => {
    setSelectedChallenges(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    // Store final data
    const existingData = JSON.parse(localStorage.getItem('assessmentData') || '{}')
    const finalData = {
      ...existingData,
      step4: {
        challenges: selectedChallenges,
        timeline,
        budget,
        additionalInfo,
        contactPreference
      },
      completedAt: new Date().toISOString()
    }

    localStorage.setItem('assessmentData', JSON.stringify(finalData))

    // In a real app, this would send to the backend
    // await api.submitAssessment(finalData)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Redirect to results page
    router.push('/assessment/results')
  }

  const handleBack = () => {
    router.push('/assessment/step-3')
  }

  const getImpactColor = (impact: Challenge['impact']) => {
    switch (impact) {
      case 'high': return 'notion-red'
      case 'medium': return 'notion-yellow'
      case 'low': return 'notion-green'
    }
  }

  const getImpactLabel = (impact: Challenge['impact']) => {
    switch (impact) {
      case 'high': return 'Hoher Einfluss'
      case 'medium': return 'Mittlerer Einfluss'
      case 'low': return 'Geringer Einfluss'
    }
  }

  return (
    <NotionCard className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-notion-blue to-notion-purple rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className={styles.text('h2', 'mb-2')}>Fast geschafft!</h2>
        <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
          Noch ein paar Details für Ihre personalisierte KI-Strategie.
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
          <div className="w-16 h-1 bg-notion-green"></div>
          <div className="w-8 h-8 rounded-full bg-notion-green flex items-center justify-center text-white text-sm font-medium">
            ✓
          </div>
          <div className="w-16 h-1 bg-notion-blue"></div>
          <div className="w-8 h-8 rounded-full bg-notion-blue flex items-center justify-center text-white text-sm font-medium">
            4
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Challenges Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Welche Herausforderungen sehen Sie bei der KI-Einführung?
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                onClick={() => handleChallengeToggle(challenge.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedChallenges.includes(challenge.id)
                    ? 'border-notion-blue bg-notion-blue/5'
                    : 'border-notion-border dark:border-notion-dark-border hover:border-notion-blue/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{challenge.title}</h4>
                    <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
                      {challenge.description}
                    </p>
                  </div>
                  <span className={`ml-3 text-xs px-2 py-1 rounded-full bg-${getImpactColor(challenge.impact)}/10 text-${getImpactColor(challenge.impact)}`}>
                    {getImpactLabel(challenge.impact)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Wann möchten Sie mit der KI-Implementation starten? *
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'immediate', label: 'Sofort', icon: <Sparkles className="w-4 h-4" /> },
              { value: '1-3months', label: '1-3 Monate', icon: <Calendar className="w-4 h-4" /> },
              { value: '3-6months', label: '3-6 Monate', icon: <Calendar className="w-4 h-4" /> },
              { value: '6months+', label: '6+ Monate', icon: <Calendar className="w-4 h-4" /> }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeline(option.value)}
                className={`p-3 border rounded-lg text-center transition-all ${
                  timeline === option.value
                    ? 'border-notion-blue bg-notion-blue text-white'
                    : 'border-notion-border dark:border-notion-dark-border hover:border-notion-blue'
                }`}
              >
                <div className="flex flex-col items-center">
                  {option.icon}
                  <span className="text-sm mt-1">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
          {errors.timeline && (
            <p className="text-notion-red text-sm mt-2">{errors.timeline}</p>
          )}
        </div>

        {/* Budget Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Welches Budget planen Sie für KI-Initiativen ein? *
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { value: '<50k', label: '< €50k' },
              { value: '50-100k', label: '€50-100k' },
              { value: '100-250k', label: '€100-250k' },
              { value: '250-500k', label: '€250-500k' },
              { value: '500k+', label: '> €500k' },
              { value: 'unsure', label: 'Noch unklar' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setBudget(option.value)}
                className={`p-3 border rounded-lg text-center transition-all ${
                  budget === option.value
                    ? 'border-notion-blue bg-notion-blue text-white'
                    : 'border-notion-border dark:border-notion-dark-border hover:border-notion-blue'
                }`}
              >
                <DollarSign className="w-4 h-4 mx-auto mb-1" />
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>
          {errors.budget && (
            <p className="text-notion-red text-sm mt-2">{errors.budget}</p>
          )}
        </div>

        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Gibt es noch etwas, das wir wissen sollten?
          </h3>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Z.B. spezielle Anforderungen, bereits laufende Projekte, bevorzugte Technologien..."
            rows={4}
            className="w-full px-4 py-3 text-sm border border-notion-border dark:border-notion-dark-border rounded-lg bg-notion-bg dark:bg-notion-dark-bg focus:outline-none focus:ring-2 focus:ring-notion-blue focus:border-transparent resize-none"
          />
        </div>

        {/* Contact Preference */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Wie möchten Sie kontaktiert werden?
          </h3>
          <div className="flex gap-3">
            {[
              { value: 'email', label: 'E-Mail', icon: <Send className="w-4 h-4" /> },
              { value: 'phone', label: 'Telefon', icon: <Users className="w-4 h-4" /> },
              { value: 'video', label: 'Video-Call', icon: <Calendar className="w-4 h-4" /> }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setContactPreference(option.value as any)}
                className={`flex-1 p-3 border rounded-lg text-center transition-all ${
                  contactPreference === option.value
                    ? 'border-notion-blue bg-notion-blue text-white'
                    : 'border-notion-border dark:border-notion-dark-border hover:border-notion-blue'
                }`}
              >
                <div className="flex flex-col items-center">
                  {option.icon}
                  <span className="text-sm mt-1">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-notion-green/5 border border-notion-green/20 rounded-lg">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-notion-green mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-notion-green mb-1">
                Was passiert als Nächstes?
              </h4>
              <p className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                Nach dem Absenden erhalten Sie innerhalb von 24 Stunden Ihre personalisierte 
                KI-Strategie mit konkreten Handlungsempfehlungen, ROI-Prognosen und einem 
                maßgeschneiderten Implementierungsplan.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-notion-border dark:border-notion-dark-border">
          <NotionButton
            variant="ghost"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            disabled={isSubmitting}
          >
            Zurück
          </NotionButton>
          <NotionButton
            variant="primary"
            onClick={handleSubmit}
            rightIcon={isSubmitting ? undefined : <CheckCircle className="w-4 h-4" />}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Wird gesendet...' : 'Assessment abschließen'}
          </NotionButton>
        </div>
      </div>
    </NotionCard>
  )
}