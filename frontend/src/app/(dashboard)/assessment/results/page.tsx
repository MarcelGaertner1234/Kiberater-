'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { 
  Trophy, 
  Download, 
  Calendar,
  MessageCircle,
  TrendingUp,
  Target,
  Zap,
  Brain,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react'

interface AssessmentResults {
  readinessScore: number
  recommendedPlan: 'starter' | 'professional' | 'enterprise'
  topUseCases: Array<{
    title: string
    impact: string
    timeToImplement: string
    estimatedROI: string
  }>
  nextSteps: string[]
  strengths: string[]
  improvements: string[]
}

export default function AssessmentResultsPage() {
  const router = useRouter()
  const styles = useNotionStyles()
  const [results, setResults] = useState<AssessmentResults | null>(null)

  useEffect(() => {
    // Get assessment data
    const assessmentData = localStorage.getItem('assessmentData')
    if (!assessmentData) {
      router.push('/assessment')
      return
    }

    const data = JSON.parse(assessmentData)
    if (!data.step1 || !data.step2 || !data.step3 || !data.step4) {
      router.push('/assessment')
      return
    }

    // Calculate results based on assessment data
    const readinessScore = data.step3.readinessScore

    // Determine recommended plan
    let recommendedPlan: AssessmentResults['recommendedPlan'] = 'starter'
    if (readinessScore >= 70 && data.step4.budget !== '<50k') {
      recommendedPlan = 'enterprise'
    } else if (readinessScore >= 40) {
      recommendedPlan = 'professional'
    }

    // Generate top use cases based on selected areas
    const topUseCases = data.step2.useCases.slice(0, 3).map((useCase: string) => ({
      title: getUseCaseTitle(useCase),
      impact: 'Hoch',
      timeToImplement: '2-3 Monate',
      estimatedROI: '250-400%'
    }))

    // Determine strengths and improvements
    const strengths = []
    const improvements = []

    Object.entries(data.step3.answers).forEach(([key, value]) => {
      if (typeof value === 'number') {
        if (value >= 4) {
          strengths.push(getReadinessLabel(key))
        } else if (value <= 2) {
          improvements.push(getReadinessLabel(key))
        }
      }
    })

    setResults({
      readinessScore,
      recommendedPlan,
      topUseCases,
      nextSteps: [
        'Kostenlose Beratung mit KI-Experten buchen',
        'Detaillierte Roadmap erhalten',
        'Pilot-Projekt definieren',
        'Team-Training planen'
      ],
      strengths,
      improvements
    })
  }, [router])

  const getUseCaseTitle = (id: string): string => {
    const titles: Record<string, string> = {
      'customer-service': 'Kundenservice Automatisierung',
      'sales-marketing': 'Sales & Marketing Optimierung',
      'operations': 'Prozessautomatisierung',
      'analytics': 'Predictive Analytics',
      'product': 'Produktentwicklung mit KI',
      'hr': 'HR Automatisierung',
      'finance': 'Finance Automation',
      'it-security': 'KI-gestützte Security'
    }
    return titles[id] || 'KI Use Case'
  }

  const getReadinessLabel = (id: string): string => {
    const labels: Record<string, string> = {
      'data-quality': 'Datenqualität',
      'it-infrastructure': 'IT-Infrastruktur',
      'team-skills': 'Team Know-how',
      'change-readiness': 'Change Readiness',
      'budget': 'Budget-Verfügbarkeit',
      'leadership-support': 'Management Support'
    }
    return labels[id] || id
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'notion-green'
    if (score >= 40) return 'notion-yellow'
    return 'notion-red'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Sehr gut vorbereitet'
    if (score >= 40) return 'Gut vorbereitet mit Verbesserungspotenzial'
    return 'Vorbereitung empfohlen'
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-notion-blue mx-auto mb-4"></div>
          <p className="text-notion-text-secondary">Ergebnisse werden berechnet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <NotionCard gradient className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-notion-blue to-notion-purple rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className={styles.text('h1', 'mb-4')}>
          Ihre KI-Readiness Analyse ist fertig!
        </h1>
        <p className="text-xl text-notion-text-secondary dark:text-notion-dark-text-secondary mb-8 max-w-2xl mx-auto">
          Basierend auf Ihren Angaben haben wir eine maßgeschneiderte KI-Strategie für Ihr Unternehmen entwickelt.
        </p>

        {/* Score Display */}
        <div className="inline-flex items-center justify-center p-8 bg-white dark:bg-notion-dark-bg rounded-2xl shadow-lg">
          <div className="text-center">
            <p className="text-sm text-notion-text-secondary mb-2">Ihr KI-Readiness Score</p>
            <div className={`text-6xl font-bold text-${getScoreColor(results.readinessScore)} mb-2`}>
              {results.readinessScore}%
            </div>
            <p className={`text-sm font-medium text-${getScoreColor(results.readinessScore)}`}>
              {getScoreLabel(results.readinessScore)}
            </p>
          </div>
        </div>
      </NotionCard>

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        <NotionCard>
          <h3 className={styles.text('h3', 'mb-4 flex items-center')}>
            <CheckCircle className="w-5 h-5 text-notion-green mr-2" />
            Ihre Stärken
          </h3>
          <ul className="space-y-3">
            {results.strengths.map((strength, index) => (
              <li key={index} className="flex items-center">
                <div className="w-2 h-2 bg-notion-green rounded-full mr-3"></div>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </NotionCard>

        <NotionCard>
          <h3 className={styles.text('h3', 'mb-4 flex items-center')}>
            <Target className="w-5 h-5 text-notion-yellow mr-2" />
            Verbesserungspotenziale
          </h3>
          <ul className="space-y-3">
            {results.improvements.map((improvement, index) => (
              <li key={index} className="flex items-center">
                <div className="w-2 h-2 bg-notion-yellow rounded-full mr-3"></div>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </NotionCard>
      </div>

      {/* Top Use Cases */}
      <NotionCard>
        <h3 className={styles.text('h3', 'mb-6')}>
          Ihre Top 3 KI-Anwendungsfälle
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {results.topUseCases.map((useCase, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-notion-blue/10 text-notion-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">{useCase.title}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-notion-text-secondary">Impact:</span>
                  <span className="font-medium">{useCase.impact}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-notion-text-secondary">Zeit:</span>
                  <span className="font-medium">{useCase.timeToImplement}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-notion-text-secondary">ROI:</span>
                  <span className="font-medium text-notion-green">{useCase.estimatedROI}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </NotionCard>

      {/* Recommended Plan */}
      <NotionCard gradient className="text-center">
        <h3 className={styles.text('h3', 'mb-4')}>
          Empfohlener Plan für Sie
        </h3>
        <div className="inline-flex items-center justify-center p-6 bg-white dark:bg-notion-dark-bg rounded-xl mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-notion-blue mb-2">
              {results.recommendedPlan === 'enterprise' ? 'Enterprise' : 
               results.recommendedPlan === 'professional' ? 'Professional' : 'Starter'}
            </p>
            <p className="text-4xl font-bold">
              €{results.recommendedPlan === 'enterprise' ? '499' : 
                results.recommendedPlan === 'professional' ? '199' : '49'}
              <span className="text-lg font-normal text-notion-text-secondary">/Monat</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register">
            <NotionButton variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Jetzt starten
            </NotionButton>
          </Link>
          <Link href="/pricing">
            <NotionButton variant="secondary" size="lg">
              Alle Pläne vergleichen
            </NotionButton>
          </Link>
        </div>
      </NotionCard>

      {/* Next Steps */}
      <NotionCard>
        <h3 className={styles.text('h3', 'mb-6')}>
          Ihre nächsten Schritte
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {results.nextSteps.map((step, index) => (
            <div key={index} className="flex items-center p-4 border border-notion-border dark:border-notion-dark-border rounded-lg">
              <div className="w-8 h-8 bg-notion-blue/10 text-notion-blue rounded-full flex items-center justify-center mr-4 font-bold">
                {index + 1}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </NotionCard>

      {/* CTA Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <NotionCard clickable className="text-center group">
          <Download className="w-8 h-8 text-notion-blue mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold mb-2">Report herunterladen</h4>
          <p className="text-sm text-notion-text-secondary mb-4">
            Detaillierte PDF-Analyse mit allen Empfehlungen
          </p>
          <NotionButton variant="ghost" size="sm" className="w-full">
            PDF Download
          </NotionButton>
        </NotionCard>

        <NotionCard clickable className="text-center group">
          <Calendar className="w-8 h-8 text-notion-green mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold mb-2">Beratung buchen</h4>
          <p className="text-sm text-notion-text-secondary mb-4">
            30 Min kostenloses Strategiegespräch
          </p>
          <NotionButton variant="ghost" size="sm" className="w-full">
            Termin vereinbaren
          </NotionButton>
        </NotionCard>

        <NotionCard clickable className="text-center group">
          <MessageCircle className="w-8 h-8 text-notion-purple mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="font-semibold mb-2">Mit Experten chatten</h4>
          <p className="text-sm text-notion-text-secondary mb-4">
            Direkt Fragen zu Ihren Ergebnissen stellen
          </p>
          <NotionButton variant="ghost" size="sm" className="w-full">
            Chat starten
          </NotionButton>
        </NotionCard>
      </div>

      {/* Trust Signals */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center space-x-8 text-sm text-notion-text-secondary">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            <span>DSGVO-konform</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>24h Antwortzeit</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>Keine versteckten Kosten</span>
          </div>
        </div>
      </div>
    </div>
  )
}