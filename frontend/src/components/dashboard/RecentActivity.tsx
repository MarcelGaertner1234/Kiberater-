'use client'

import { useState } from 'react'
import { NotionCard, NotionButton } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { useDashboardActivity } from '@/hooks/api/useDashboard'
import { useDashboardStore } from '@/stores/dashboardStore'
import { cn } from '@/lib/design-system'
import {
  FolderOpen,
  Target,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Filter,
  Zap,
  CheckCircle,
  Plus,
  MessageCircle,
} from 'lucide-react'

interface ActivityItemProps {
  activity: {
    id: string
    type: 'project_created' | 'milestone_completed' | 'assessment_updated' | 'task_assigned'
    title: string
    description: string
    timestamp: string
    user?: {
      name: string
      avatar?: string
    }
    metadata?: any
  }
  isLast?: boolean
}

function ActivityItem({ activity, isLast }: ActivityItemProps) {
  const styles = useNotionStyles()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_created':
        return { icon: <FolderOpen className="w-4 h-4" />, color: 'notion-blue' }
      case 'milestone_completed':
        return { icon: <CheckCircle className="w-4 h-4" />, color: 'notion-green' }
      case 'assessment_updated':
        return { icon: <TrendingUp className="w-4 h-4" />, color: 'notion-purple' }
      case 'task_assigned':
        return { icon: <Users className="w-4 h-4" />, color: 'notion-yellow' }
      default:
        return { icon: <Zap className="w-4 h-4" />, color: 'notion-gray' }
    }
  }

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
      return `vor ${diffInMinutes} Min.`
    } else if (diffInHours < 24) {
      return `vor ${diffInHours}h`
    } else if (diffInHours < 48) {
      return 'gestern'
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `vor ${diffInDays} Tagen`
    }
  }

  const { icon, color } = getActivityIcon(activity.type)

  return (
    <div className="flex items-start gap-3 group hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover rounded-lg p-2 transition-colors duration-200">
      {/* Timeline */}
      <div className="flex flex-col items-center mt-1">
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300',
            `bg-${color}/10 text-${color} group-hover:bg-${color}/20 group-hover:scale-110`
          )}
        >
          {icon}
        </div>
        {!isLast && (
          <div className="w-px h-8 bg-notion-border dark:bg-notion-dark-border mt-2"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm group-hover:text-notion-blue transition-colors duration-200">
              {activity.title}
            </h4>
            <p className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary mt-1 line-clamp-2">
              {activity.description}
            </p>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
              {activity.user && (
                <>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-notion-blue to-notion-purple flex items-center justify-center text-white text-xs font-medium">
                      {activity.user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{activity.user.name}</span>
                  </div>
                  <span>•</span>
                </>
              )}
              <span>{getRelativeTime(activity.timestamp)}</span>
            </div>
          </div>
          
          <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-notion-bg-secondary dark:hover:bg-notion-dark-bg-secondary transition-all duration-200">
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface ActivityFilterProps {
  selectedTypes: string[]
  onTypesChange: (types: string[]) => void
}

function ActivityFilter({ selectedTypes, onTypesChange }: ActivityFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const activityTypes = [
    { id: 'project_created', label: 'Projekte erstellt', icon: <FolderOpen className="w-4 h-4" />, color: 'notion-blue' },
    { id: 'milestone_completed', label: 'Meilensteine erreicht', icon: <CheckCircle className="w-4 h-4" />, color: 'notion-green' },
    { id: 'assessment_updated', label: 'Assessment aktualisiert', icon: <TrendingUp className="w-4 h-4" />, color: 'notion-purple' },
    { id: 'task_assigned', label: 'Aufgaben zugewiesen', icon: <Users className="w-4 h-4" />, color: 'notion-yellow' },
  ]

  const toggleType = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      onTypesChange(selectedTypes.filter(t => t !== typeId))
    } else {
      onTypesChange([...selectedTypes, typeId])
    }
  }

  return (
    <div className="relative">
      <NotionButton
        variant="ghost"
        size="sm"
        leftIcon={<Filter className="w-4 h-4" />}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'transition-colors duration-200',
          isOpen && 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary'
        )}
      >
        Filter
        {selectedTypes.length < activityTypes.length && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-notion-blue/10 text-notion-blue rounded">
            {selectedTypes.length}
          </span>
        )}
      </NotionButton>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-notion-dark-bg border border-notion-border dark:border-notion-dark-border rounded-lg shadow-notion-lg dark:shadow-notion-dark-lg z-10">
          <div className="p-3">
            <div className="text-sm font-medium mb-3">Aktivitätstypen</div>
            <div className="space-y-2">
              {activityTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.id)}
                    onChange={() => toggleType(type.id)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                      selectedTypes.includes(type.id)
                        ? `border-${type.color} bg-${type.color}/10`
                        : 'border-notion-border dark:border-notion-dark-border'
                    )}
                  >
                    {selectedTypes.includes(type.id) && (
                      <CheckCircle className={`w-3 h-3 text-${type.color}`} />
                    )}
                  </div>
                  <div className={`text-${type.color} mr-2`}>{type.icon}</div>
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
            
            <div className="border-t border-notion-border dark:border-notion-dark-border mt-3 pt-3 flex gap-2">
              <NotionButton
                variant="ghost"
                size="sm"
                onClick={() => onTypesChange(activityTypes.map(t => t.id))}
                className="flex-1"
              >
                Alle
              </NotionButton>
              <NotionButton
                variant="ghost"
                size="sm"
                onClick={() => onTypesChange([])}
                className="flex-1"
              >
                Keine
              </NotionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function RecentActivity() {
  const styles = useNotionStyles()
  const { data: activities, isLoading, error } = useDashboardActivity()
  const { filters, setActivityTypes } = useDashboardStore()

  // Mock data fallback
  const mockActivities = [
    {
      id: '1',
      type: 'project_created' as const,
      title: 'Neues KI-Projekt gestartet',
      description: 'Customer Service Chatbot wurde erfolgreich erstellt und dem Team zugewiesen.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user: { name: 'John Doe' }
    },
    {
      id: '2',
      type: 'milestone_completed' as const,
      title: 'Meilenstein erreicht',
      description: 'Assessment Phase wurde erfolgreich abgeschlossen. Score verbessert auf 75%.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user: { name: 'Maria Schmidt' }
    },
    {
      id: '3',
      type: 'assessment_updated' as const,
      title: 'KI-Assessment aktualisiert',
      description: 'KI-Readiness Score wurde von 63% auf 75% verbessert (+12% Wachstum).',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      user: { name: 'Thomas Weber' }
    },
    {
      id: '4',
      type: 'task_assigned' as const,
      title: 'Neue Aufgabe zugewiesen',
      description: 'Team Training für KI-Tools wurde für nächste Woche geplant.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user: { name: 'Lisa Müller' }
    },
    {
      id: '5',
      type: 'project_created' as const,
      title: 'Projekt aktualisiert',
      description: 'Sales Process Automation: Fortschritt auf 85% erhöht.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user: { name: 'John Doe' }
    }
  ]

  const currentActivities = activities || mockActivities

  // Filter activities based on selected types
  const filteredActivities = currentActivities.filter(activity =>
    filters.activityTypes.includes(activity.type)
  )

  if (error) {
    return (
      <NotionCard>
        <div className="text-center p-6">
          <div className="text-notion-red mb-2">Fehler beim Laden der Aktivitäten</div>
          <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
            {error.message || 'Unbekannter Fehler'}
          </div>
        </div>
      </NotionCard>
    )
  }

  if (isLoading) {
    return (
      <NotionCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className={styles.text('h3')}>Letzte Aktivitäten</h3>
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </NotionCard>
    )
  }

  return (
    <NotionCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className={styles.text('h3')}>
          Letzte Aktivitäten
          {filteredActivities.length !== currentActivities.length && (
            <span className="ml-2 text-sm font-normal text-notion-text-secondary dark:text-notion-dark-text-secondary">
              ({filteredActivities.length} von {currentActivities.length})
            </span>
          )}
        </h3>
        
        <div className="flex items-center gap-2">
          <ActivityFilter
            selectedTypes={filters.activityTypes}
            onTypesChange={setActivityTypes}
          />
          <NotionButton 
            variant="ghost" 
            size="sm" 
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Alle anzeigen
          </NotionButton>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-notion-text-secondary dark:text-notion-dark-text-secondary" />
          </div>
          <div className="text-notion-text-secondary dark:text-notion-dark-text-secondary mb-2">
            Keine Aktivitäten für die ausgewählten Filter
          </div>
          <NotionButton
            variant="ghost"
            size="sm"
            onClick={() => setActivityTypes(['project_created', 'milestone_completed', 'assessment_updated', 'task_assigned'])}
          >
            Filter zurücksetzen
          </NotionButton>
        </div>
      ) : (
        <div className="space-y-1">
          {filteredActivities.slice(0, 8).map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isLast={index === Math.min(filteredActivities.length - 1, 7)}
            />
          ))}
        </div>
      )}
    </NotionCard>
  )
}