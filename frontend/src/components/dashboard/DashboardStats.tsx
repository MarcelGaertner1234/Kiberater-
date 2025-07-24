'use client'

import { NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { useDashboardStats } from '@/hooks/api/useDashboard'
import { cn } from '@/lib/design-system'
import {
  Target,
  CheckCircle,
  BarChart3,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    label?: string
  }
  icon: React.ReactNode
  color: string
  loading?: boolean
}

function StatCard({ title, value, change, icon, color, loading }: StatCardProps) {
  const styles = useNotionStyles()

  if (loading) {
    return (
      <NotionCard className="animate-pulse">
        <div className="text-center">
          <div className={`w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-3`} />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </NotionCard>
    )
  }

  return (
    <NotionCard className="text-center hover:scale-105 transition-transform duration-300 group">
      <div
        className={cn(
          'inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all duration-300',
          `bg-${color}/10 text-${color} group-hover:bg-${color}/20 group-hover:scale-110`
        )}
      >
        {icon}
      </div>
      
      <div className="text-2xl font-bold mb-1 transition-colors duration-300 group-hover:text-notion-blue">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      
      <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary mb-2">
        {title}
      </div>
      
      {change && (
        <div
          className={cn(
            'flex items-center justify-center text-xs transition-all duration-300',
            change.type === 'increase' ? 'text-notion-green' : 'text-notion-red',
            'group-hover:scale-105'
          )}
        >
          {change.type === 'increase' ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {change.type === 'increase' ? '+' : ''}
          {change.value}
          {change.label && <span className="ml-1">{change.label}</span>}
        </div>
      )}
    </NotionCard>
  )
}

interface CircularProgressProps {
  value: number
  maxValue?: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showValue?: boolean
  label?: string
  className?: string
}

export function CircularProgress({
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 8,
  color = '#529cca',
  backgroundColor = '#e5e7eb',
  showValue = true,
  label,
  className
}: CircularProgressProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
            className="dark:stroke-gray-700"
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(82, 156, 202, 0.3))'
            }}
          />
        </svg>
        
        {/* Center content */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-notion-text dark:text-notion-dark-text">
                {Math.round(value)}
              </div>
              <div className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                von {maxValue}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {label && (
        <div className="mt-2 text-sm text-center text-notion-text-secondary dark:text-notion-dark-text-secondary">
          {label}
        </div>
      )}
    </div>
  )
}

export function DashboardStats() {
  const styles = useNotionStyles()
  const { data: stats, isLoading, error } = useDashboardStats()

  if (error) {
    return (
      <NotionCard className="text-center p-6">
        <div className="text-notion-red mb-2">Fehler beim Laden der Statistiken</div>
        <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
          {error.message || 'Unbekannter Fehler'}
        </div>
      </NotionCard>
    )
  }

  // Mock data fallback
  const mockStats = {
    assessmentScore: 75,
    completedProjects: 12,
    activeRoadmaps: 3,
    upcomingTasks: 8,
    weeklyChange: {
      assessmentScore: 12,
      completedProjects: 3,
      activeRoadmaps: 1,
      upcomingTasks: -2,
    }
  }

  const currentStats = stats || mockStats

  const statsData = [
    {
      title: 'KI-Readiness Score',
      value: `${currentStats.assessmentScore}%`,
      change: {
        value: currentStats.weeklyChange.assessmentScore,
        type: currentStats.weeklyChange.assessmentScore >= 0 ? 'increase' as const : 'decrease' as const,
        label: 'diese Woche'
      },
      icon: <Target className="w-6 h-6" />,
      color: 'notion-blue',
    },
    {
      title: 'Abgeschlossene Projekte',
      value: currentStats.completedProjects,
      change: {
        value: currentStats.weeklyChange.completedProjects,
        type: currentStats.weeklyChange.completedProjects >= 0 ? 'increase' as const : 'decrease' as const,
        label: 'diese Woche'
      },
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'notion-green',
    },
    {
      title: 'Aktive Roadmaps',
      value: currentStats.activeRoadmaps,
      change: {
        value: currentStats.weeklyChange.activeRoadmaps,
        type: currentStats.weeklyChange.activeRoadmaps >= 0 ? 'increase' as const : 'decrease' as const,
        label: 'diese Woche'
      },
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'notion-purple',
    },
    {
      title: 'Anstehende Tasks',
      value: currentStats.upcomingTasks,
      change: {
        value: Math.abs(currentStats.weeklyChange.upcomingTasks),
        type: currentStats.weeklyChange.upcomingTasks < 0 ? 'decrease' as const : 'increase' as const,
        label: 'diese Woche'
      },
      icon: <Clock className="w-6 h-6" />,
      color: 'notion-yellow',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Featured Assessment Score with Circular Progress */}
      <div className="grid lg:grid-cols-3 gap-6">
        <NotionCard className="text-center lg:col-span-1" gradient>
          <h3 className="text-lg font-semibold mb-4">KI-Readiness Assessment</h3>
          <CircularProgress
            value={currentStats.assessmentScore}
            maxValue={100}
            size={140}
            strokeWidth={12}
            color="#529cca"
            label="Ihr aktueller KI-Reifegrad"
            className="mb-4"
          />
          <div className="flex justify-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-notion-green">+{currentStats.weeklyChange.assessmentScore}%</div>
              <div className="text-notion-text-secondary dark:text-notion-dark-text-secondary">diese Woche</div>
            </div>
            <div className="text-center">
              <div className="font-medium">68%</div>
              <div className="text-notion-text-secondary dark:text-notion-dark-text-secondary">Branchendurchschnitt</div>
            </div>
          </div>
        </NotionCard>

        {/* Additional Quick Stats */}
        <NotionCard className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Weitere Kennzahlen</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-notion-blue/10 text-notion-blue mx-auto mb-2">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold">5</div>
              <div className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">Team Mitglieder</div>
            </div>
            
            <div className="text-center p-3 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-notion-green/10 text-notion-green mx-auto mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold">89%</div>
              <div className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">Effizienz</div>
            </div>
            
            <div className="text-center p-3 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-notion-purple/10 text-notion-purple mx-auto mb-2">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold">24</div>
              <div className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">Meilensteine</div>
            </div>
            
            <div className="text-center p-3 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-notion-yellow/10 text-notion-yellow mx-auto mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold">156h</div>
              <div className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">Investiert</div>
            </div>
          </div>
        </NotionCard>
      </div>
    </div>
  )
}