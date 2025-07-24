'use client'

import { useState } from 'react'
import { NotionCard, NotionButton } from '@/components/ui'
import { NotionChart } from '@/lib/components/charts/NotionChart'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { useDashboardOverview } from '@/hooks/api/useDashboard'
import { useAnalyticsMetrics } from '@/hooks/api/useAnalytics'
import { useDashboardStore } from '@/stores/dashboardStore'
import { cn } from '@/lib/design-system'
import {
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  Zap,
  Download,
  RefreshCw,
  Filter,
  ChevronDown,
} from 'lucide-react'

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
  loading?: boolean
  className?: string
}

function ChartCard({ title, description, children, actions, loading, className }: ChartCardProps) {
  const styles = useNotionStyles()

  return (
    <NotionCard className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={styles.text('h4', 'mb-1')}>{title}</h3>
          {description && (
            <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      
      {loading ? (
        <div className="h-64 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-lg animate-pulse" />
      ) : (
        children
      )}
    </NotionCard>
  )
}

function TimeRangeSelector() {
  const { selectedTimeRange, setTimeRange } = useDashboardStore()
  const [isOpen, setIsOpen] = useState(false)

  const timeRanges = [
    { label: 'Letzte 7 Tage', value: 'week', period: 'day' as const },
    { label: 'Letzte 30 Tage', value: 'month', period: 'day' as const },
    { label: 'Letzte 3 Monate', value: 'quarter', period: 'week' as const },
    { label: 'Letztes Jahr', value: 'year', period: 'month' as const },
  ]

  const currentRange = timeRanges.find(r => r.period === selectedTimeRange.period) || timeRanges[1]

  const handleRangeChange = (range: typeof timeRanges[0]) => {
    const now = new Date()
    let start: Date

    switch (range.value) {
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'quarter':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    setTimeRange({
      start: start.toISOString(),
      end: now.toISOString(),
      period: range.period
    })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <NotionButton
        variant="ghost"
        size="sm"
        rightIcon={<ChevronDown className="w-4 h-4" />}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'transition-colors duration-200',
          isOpen && 'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary'
        )}
      >
        <Calendar className="w-4 h-4 mr-2" />
        {currentRange.label}
      </NotionButton>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-notion-dark-bg border border-notion-border dark:border-notion-dark-border rounded-lg shadow-notion-lg dark:shadow-notion-dark-lg z-10">
          <div className="p-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handleRangeChange(range)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                  range.period === selectedTimeRange.period
                    ? 'bg-notion-blue/10 text-notion-blue'
                    : 'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function ProgressOverview() {
  const styles = useNotionStyles()
  const { data: overview, isLoading, error } = useDashboardOverview()
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsMetrics()
  const { refreshDashboard } = useDashboardStore()

  // Mock data für Charts
  const mockProgressData = [
    { phase: 'Assessment', progress: 100, status: 'completed', targetDate: '2024-01-15' },
    { phase: 'Strategieplanung', progress: 75, status: 'in_progress', targetDate: '2024-02-28' },
    { phase: 'Implementation', progress: 45, status: 'in_progress', targetDate: '2024-05-30' },
    { phase: 'Erfolgsmessung', progress: 0, status: 'pending', targetDate: '2024-08-15' }
  ]

  const mockTrendData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toISOString().split('T')[0],
      score: 50 + Math.floor(Math.random() * 30) + (i * 0.8), // Upward trend
      projects: Math.floor(Math.random() * 5) + 8,
      tasks: Math.floor(Math.random() * 10) + 15
    }
  })

  const mockCategoryData = [
    { category: 'Data & Analytics', completed: 3, total: 5, hours: 120 },
    { category: 'Process Automation', completed: 2, total: 4, hours: 89 },
    { category: 'Customer Service', completed: 2, total: 3, hours: 67 },
    { category: 'Marketing & Sales', completed: 1, total: 3, hours: 45 }
  ]

  const mockTimeInvestment = [
    { name: 'Planung', value: 31, hours: 380 },
    { name: 'Implementation', value: 34, hours: 420 },
    { name: 'Testing', value: 15, hours: 180 },
    { name: 'Training', value: 13, hours: 160 },
    { name: 'Support', value: 8, hours: 100 }
  ]

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10b981' // green
    if (progress >= 50) return '#f59e0b' // yellow
    if (progress >= 20) return '#3b82f6' // blue
    return '#ef4444' // red
  }

  if (error) {
    return (
      <NotionCard className="text-center p-8">
        <div className="text-notion-red mb-4">
          <BarChart3 className="w-12 h-12 mx-auto mb-2" />
          <div className="text-lg font-medium">Fehler beim Laden der Fortschrittsdaten</div>
        </div>
        <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary mb-4">
          {error.message || 'Unbekannter Fehler'}
        </div>
        <NotionButton onClick={refreshDashboard} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Erneut versuchen
        </NotionButton>
      </NotionCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header mit Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={styles.text('h2', 'mb-1')}>Fortschritts-Übersicht</h2>
          <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
            Visualisierung Ihrer KI-Implementierung und Meilensteine
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <TimeRangeSelector />
          <NotionButton
            variant="ghost"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export
          </NotionButton>
          <NotionButton
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={refreshDashboard}
          >
            Aktualisieren
          </NotionButton>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* KI-Readiness Trend */}
        <ChartCard
          title="KI-Readiness Entwicklung"
          description="Fortschritt Ihres KI-Reifegrades über Zeit"
          loading={isLoading}
          actions={
            <NotionButton variant="ghost" size="sm" leftIcon={<TrendingUp className="w-4 h-4" />}>
              Details
            </NotionButton>
          }
        >
          <NotionChart
            type="area"
            data={mockTrendData}
            dataKey={['score']}
            xDataKey="date"
            height={280}
            colors={['#529cca']}
            showGrid={true}
            showLegend={false}
          />
        </ChartCard>

        {/* Projekt Fortschritt */}
        <ChartCard
          title="Projekt-Fortschritt"
          description="Status aller laufenden KI-Projekte"
          loading={isLoading}
        >
          <div className="space-y-4">
            {mockProgressData.map((phase, index) => {
              const color = getProgressColor(phase.progress)
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{phase.phase}</span>
                    <span className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
                      {phase.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${phase.progress}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}40`
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                    <span>Ziel: {new Date(phase.targetDate).toLocaleDateString('de-DE')}</span>
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      phase.status === 'completed' && 'bg-notion-green/10 text-notion-green',
                      phase.status === 'in_progress' && 'bg-notion-blue/10 text-notion-blue',
                      phase.status === 'pending' && 'bg-notion-gray/10 text-notion-gray'
                    )}>
                      {phase.status === 'completed' && 'Abgeschlossen'}
                      {phase.status === 'in_progress' && 'In Bearbeitung'}
                      {phase.status === 'pending' && 'Ausstehend'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>

        {/* Kategorie-Performance */}
        <ChartCard
          title="Performance nach Kategorie"
          description="Fortschritt in verschiedenen KI-Bereichen"
          loading={isLoading || analyticsLoading}
        >
          <NotionChart
            type="bar"
            data={mockCategoryData.map(cat => ({
              category: cat.category,
              'Abgeschlossen': cat.completed,
              'Geplant': cat.total - cat.completed,
              percentage: Math.round((cat.completed / cat.total) * 100)
            }))}
            dataKey={['Abgeschlossen', 'Geplant']}
            xDataKey="category"
            height={280}
            colors={['#10b981', '#e5e7eb']}
            stacked={true}
          />
        </ChartCard>

        {/* Zeit-Investment */}
        <ChartCard
          title="Zeit-Investment Verteilung"
          description="Aufwand nach Aktivitätsbereichen"
          loading={isLoading || analyticsLoading}
        >
          <NotionChart
            type="pie"
            data={mockTimeInvestment}
            dataKey="value"
            xDataKey="name"
            height={280}
            colors={['#529cca', '#6ba085', '#e07c7c', '#dfab01', '#a47bb3']}
            showLegend={true}
          />
        </ChartCard>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <NotionCard className="text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-notion-blue/10 text-notion-blue mx-auto mb-3">
            <Target className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold mb-1">4 von 4</div>
          <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary mb-2">
            Phasen gestartet
          </div>
          <div className="text-xs text-notion-green">✓ Alle Phasen aktiv</div>
        </NotionCard>

        <NotionCard className="text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-notion-green/10 text-notion-green mx-auto mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold mb-1">55%</div>
          <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary mb-2">
            Gesamt-Fortschritt
          </div>
          <div className="text-xs text-notion-blue">+12% diese Woche</div>
        </NotionCard>

        <NotionCard className="text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-notion-purple/10 text-notion-purple mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold mb-1">3.2 Mo</div>
          <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary mb-2">
            Geschätzte Restzeit
          </div>
          <div className="text-xs text-notion-yellow">Im Zeitplan</div>
        </NotionCard>
      </div>
    </div>
  )
}