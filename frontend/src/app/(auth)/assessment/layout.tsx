'use client'

import { usePathname } from 'next/navigation'
import { NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { CheckCircle, Circle } from 'lucide-react'

const assessmentSteps = [
  { id: 1, title: 'Unternehmen', path: '/assessment' },
  { id: 2, title: 'Digitalisierung', path: '/assessment/step-2' },
  { id: 3, title: 'KI-Bereitschaft', path: '/assessment/step-3' },
  { id: 4, title: 'Ziele', path: '/assessment/step-4' },
  { id: 5, title: 'Ergebnis', path: '/assessment/complete' }
]

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const styles = useNotionStyles()

  const getCurrentStep = () => {
    if (pathname === '/assessment') return 1
    if (pathname.includes('/complete')) return 5
    const stepMatch = pathname.match(/step-(\d+)/)
    return stepMatch ? parseInt(stepMatch[1]) : 1
  }

  const currentStep = getCurrentStep()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className={styles.text('h1', 'text-center mb-6')}>
          KI-Assessment
        </h1>
        <p className="text-center text-notion-text-secondary dark:text-notion-dark-text-secondary mb-8">
          Finden Sie heraus, wie KI Ihr Unternehmen transformieren kann
        </p>

        {/* Progress Bar */}
        <NotionCard className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Fortschritt</span>
            <span className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
              Schritt {currentStep} von {assessmentSteps.length}
            </span>
          </div>
          
          <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-2 mb-6">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-notion-blue to-notion-purple transition-all duration-500"
              style={{ width: `${(currentStep / assessmentSteps.length) * 100}%` }}
            ></div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {assessmentSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.id <= currentStep 
                    ? 'bg-notion-blue text-white' 
                    : 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary text-notion-text-secondary dark:text-notion-dark-text-secondary'
                }`}>
                  {step.id < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <span className={`text-xs mt-2 transition-colors duration-300 ${
                  step.id <= currentStep 
                    ? 'text-notion-text dark:text-notion-dark-text' 
                    : 'text-notion-text-secondary dark:text-notion-dark-text-secondary'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </NotionCard>
      </div>

      {children}
    </div>
  )
}