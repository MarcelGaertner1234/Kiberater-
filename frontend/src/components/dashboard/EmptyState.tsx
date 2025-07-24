import { NotionButton } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { Plus, FolderOpen, Target, Map, BookOpen, MessageCircle } from 'lucide-react'

interface EmptyStateProps {
  type: 'projects' | 'assessments' | 'roadmaps' | 'learning' | 'messages'
  title?: string
  description?: string
  buttonText?: string
  onAction?: () => void
}

const emptyStateConfig = {
  projects: {
    icon: <FolderOpen className="w-12 h-12 text-notion-text-secondary dark:text-notion-dark-text-secondary" />,
    title: 'Noch keine Projekte',
    description: 'Starten Sie mit Ihrem ersten KI-Projekt und verwandeln Sie Ideen in Realität.',
    buttonText: 'Projekt erstellen',
    buttonIcon: <Plus className="w-4 h-4" />
  },
  assessments: {
    icon: <Target className="w-12 h-12 text-notion-text-secondary dark:text-notion-dark-text-secondary" />,
    title: 'Noch kein Assessment durchgeführt',
    description: 'Ermitteln Sie Ihren KI-Reifegrad mit unserem kostenlosen 5-Minuten Assessment.',
    buttonText: 'Assessment starten',
    buttonIcon: <Target className="w-4 h-4" />
  },
  roadmaps: {
    icon: <Map className="w-12 h-12 text-notion-text-secondary dark:text-notion-dark-text-secondary" />,
    title: 'Noch keine Roadmaps erstellt',
    description: 'Entwickeln Sie eine maßgeschneiderte KI-Strategie für Ihr Unternehmen.',
    buttonText: 'Roadmap erstellen',
    buttonIcon: <Plus className="w-4 h-4" />
  },
  learning: {
    icon: <BookOpen className="w-12 h-12 text-notion-text-secondary dark:text-notion-dark-text-secondary" />,
    title: 'Beginnen Sie Ihre Lernreise',
    description: 'Entdecken Sie unsere Kurse, Guides und Best Practices für erfolgreiche KI-Implementierung.',
    buttonText: 'Lerninhalte erkunden',
    buttonIcon: <BookOpen className="w-4 h-4" />
  },
  messages: {
    icon: <MessageCircle className="w-12 h-12 text-notion-text-secondary dark:text-notion-dark-text-secondary" />,
    title: 'Noch keine Nachrichten',
    description: 'Kontaktieren Sie unsere KI-Experten für persönliche Beratung und Support.',
    buttonText: 'Chat starten',
    buttonIcon: <MessageCircle className="w-4 h-4" />
  }
}

export function EmptyState({ 
  type, 
  title, 
  description, 
  buttonText, 
  onAction 
}: EmptyStateProps) {
  const styles = useNotionStyles()
  const config = emptyStateConfig[type]
  
  const finalTitle = title || config.title
  const finalDescription = description || config.description
  const finalButtonText = buttonText || config.buttonText

  return (
    <div className="text-center py-12 px-6">
      <div className="mb-6 flex justify-center">
        {config.icon}
      </div>
      <h3 className={styles.text('h3', 'mb-3')}>
        {finalTitle}
      </h3>
      <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary mb-6 max-w-md mx-auto')}>
        {finalDescription}
      </p>
      <NotionButton 
        variant="primary" 
        leftIcon={config.buttonIcon}
        onClick={onAction}
      >
        {finalButtonText}
      </NotionButton>
    </div>
  )
}