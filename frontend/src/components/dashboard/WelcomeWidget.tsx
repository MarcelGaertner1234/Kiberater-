import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { Target, Play } from 'lucide-react'

interface WelcomeWidgetProps {
  userName?: string
  company?: string
  plan?: string
  progressPercentage?: number
}

export function WelcomeWidget({ 
  userName = 'Benutzer', 
  company = 'Ihrem Unternehmen',
  plan = 'Professional',
  progressPercentage = 15 
}: WelcomeWidgetProps) {
  const styles = useNotionStyles()

  return (
    <NotionCard gradient className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-notion-blue/20 to-notion-purple/20 rounded-full -translate-y-16 translate-x-16"></div>

      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className={styles.text('h2', 'mb-2')}>Willkommen zurück, {userName}! 👋</h1>
            <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary mb-4">
              Ihre KI-Transformation bei <strong>{company}</strong> ist zu {progressPercentage}% abgeschlossen
            </p>
            <div className="flex flex-wrap gap-3">
              <NotionButton variant="primary" leftIcon={<Target className="w-4 h-4" />}>
                Assessment fortsetzen
              </NotionButton>
              <NotionButton variant="ghost" leftIcon={<Play className="w-4 h-4" />}>
                2-Min Tutorial ansehen
              </NotionButton>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-notion-green/10 text-notion-green text-sm font-medium">
              <div className="w-2 h-2 bg-notion-green rounded-full mr-2 animate-pulse"></div>
              {plan} Plan aktiv
            </div>
          </div>
        </div>
      </div>
    </NotionCard>
  )
}