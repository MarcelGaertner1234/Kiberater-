'use client'

import { NotionButton, NotionCard } from '@/components/ui'
import { DashboardStats, RecentActivity, ProgressOverview } from '@/components/dashboard'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useAuth } from '@/hooks/useAuth'
import {
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  MessageCircle,
  FileText,
  Calendar,
  ArrowRight,
  BarChart3,
  Users,
  Zap,
  Play,
  Settings,
  RefreshCw,
  Bell,
} from 'lucide-react'

export default function DashboardPage() {
  const styles = useNotionStyles()
  const { user } = useAuth()
  const { widgets, toggleWidget, refreshDashboard, refreshing } = useDashboardStore()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeWidget />
      
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className={styles.text('h2')}>Dashboard Übersicht</h2>
          {refreshing && (
            <RefreshCw className="w-4 h-4 text-notion-text-secondary dark:text-notion-dark-text-secondary animate-spin" />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <NotionButton
            variant="ghost"
            size="sm"
            leftIcon={<Settings className="w-4 h-4" />}
          >
            Widgets anpassen
          </NotionButton>
          <NotionButton
            variant="ghost"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={refreshDashboard}
            disabled={refreshing}
          >
            Aktualisieren
          </NotionButton>
        </div>
      </div>

      {/* Stats Section */}
      {widgets.stats.visible && (
        <div className="space-y-4">
          <DashboardStats />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Major Components */}
        <div className="lg:col-span-2 space-y-6">
          {widgets.projects.visible && <RecentProjects />}
          {widgets.charts.visible && <ProgressOverview />}
        </div>

        {/* Right Column - Sidebar Components */}
        <div className="space-y-6">
          <QuickActions />
          {widgets.activity.visible && <RecentActivity />}
          {widgets.tasks.visible && <UpcomingTasks />}
        </div>
      </div>
    </div>
  )
}

function WelcomeWidget() {
  const styles = useNotionStyles()
  const { user } = useAuth()
  
  // Mock user data fallback
  const currentUser = user || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'TechStart GmbH'
  }

  return (
    <NotionCard gradient className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-notion-blue/20 to-notion-purple/20 rounded-full -translate-y-16 translate-x-16"></div>

      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className={styles.text('h2', 'mb-2')}>Willkommen zurück, {currentUser.name}! 👋</h1>
            <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary mb-4">
              Hier ist Ihr KI-Fortschritt bei <strong>{currentUser.company || 'Ihrem Unternehmen'}</strong>
            </p>
            <div className="flex flex-wrap gap-3">
              <NotionButton variant="primary" leftIcon={<Target className="w-4 h-4" />}>
                KI-Assessment starten
              </NotionButton>
              <NotionButton variant="ghost" leftIcon={<Play className="w-4 h-4" />}>
                2-Min Tutorial ansehen
              </NotionButton>
              <NotionButton variant="ghost" leftIcon={<MessageCircle className="w-4 h-4" />}>
                Berater kontaktieren
              </NotionButton>
            </div>
          </div>

          <div className="mt-4 md:mt-0 space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-notion-green/10 text-notion-green text-sm font-medium">
              <div className="w-2 h-2 bg-notion-green rounded-full mr-2 animate-pulse"></div>
              Professional Plan aktiv
            </div>
            <div className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary text-right">
              Letzter Login: heute, 09:24
            </div>
          </div>
        </div>
      </div>
    </NotionCard>
  )
}



function RecentProjects() {
  const styles = useNotionStyles()

  // Mock data with more realistic project information
  const recentProjects = [
    {
      id: 1,
      title: 'Customer Service Chatbot',
      description: 'KI-basierter Chatbot für automatisierten Kundensupport',
      status: 'In Progress',
      progress: 68,
      dueDate: '2024-02-15',
      team: ['JD', 'MS', 'TW'],
      category: 'Customer Service',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Sales Process Automation',
      description: 'Automatisierung von Vertriebsprozessen mit KI',
      status: 'Planning',
      progress: 25,
      dueDate: '2024-03-01',
      team: ['JD', 'AM'],
      category: 'Sales & Marketing',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Data Analytics Dashboard',
      description: 'Intelligente Datenauswertung und Visualisierung',
      status: 'Done',
      progress: 100,
      dueDate: '2024-01-30',
      team: ['JD', 'MS', 'TW', 'LK'],
      category: 'Data & Analytics',
      priority: 'high',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'notion-green'
      case 'In Progress':
        return 'notion-blue'
      case 'Planning':
        return 'notion-yellow'
      default:
        return 'notion-gray'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'notion-red'
      case 'medium':
        return 'notion-yellow'
      case 'low':
        return 'notion-green'
      default:
        return 'notion-gray'
    }
  }

  return (
    <NotionCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className={styles.text('h3')}>Aktuelle KI-Projekte</h3>
        <NotionButton variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Alle Projekte anzeigen
        </NotionButton>
      </div>

      <div className="space-y-4">
        {recentProjects.map((project) => (
          <div
            key={project.id}
            className="p-4 border border-notion-border dark:border-notion-dark-border rounded-lg hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium group-hover:text-notion-blue transition-colors">
                    {project.title}
                  </h4>
                  <div
                    className={`w-2 h-2 rounded-full bg-${getPriorityColor(project.priority)}`}
                    title={`${project.priority} priority`}
                  />
                </div>
                <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary mb-2 line-clamp-1">
                  {project.description}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(project.status)}/10 text-${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                  <span className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                    📅 {new Date(project.dueDate).toLocaleDateString('de-DE')}
                  </span>
                  <span className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                    🏷️ {project.category}
                  </span>
                </div>
              </div>
              <div className="flex -space-x-2 ml-4">
                {project.team.map((member, index) => (
                  <div
                    key={index}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-notion-blue to-notion-purple flex items-center justify-center text-white text-xs font-medium border-2 border-notion-bg dark:border-notion-dark-bg transition-transform group-hover:scale-110"
                    title={`Team member ${member}`}
                  >
                    {member}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-${getStatusColor(project.status)} to-${getStatusColor(project.status)} transition-all duration-500 ease-out relative`}
                  style={{ width: `${project.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
                  Fortschritt
                </span>
                <span className="font-medium">{project.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-notion-border dark:border-notion-dark-border">
        <NotionButton 
          variant="ghost" 
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full"
        >
          Neues KI-Projekt erstellen
        </NotionButton>
      </div>
    </NotionCard>
  )
}

function QuickActions() {
  const styles = useNotionStyles()

  const actions = [
    {
      title: 'Neues KI-Projekt',
      description: 'Starten Sie ein neues KI-Projekt',
      icon: <Plus className="w-5 h-5" />,
      color: 'notion-blue',
      href: '/projects/new',
      badge: 'Beliebt',
    },
    {
      title: 'KI-Assessment',
      description: 'Bewerten Sie Ihren aktuellen KI-Reifegrad',
      icon: <Target className="w-5 h-5" />,
      color: 'notion-purple',
      href: '/assessment',
    },
    {
      title: 'Berater kontaktieren',
      description: 'Chat mit KI-Experten',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'notion-green',
      href: '/chat',
      badge: 'Live',
    },
    {
      title: 'Beratung buchen',
      description: '1:1 Strategiesitzung',
      icon: <Calendar className="w-5 h-5" />,
      color: 'notion-yellow',
      href: '/booking',
    },
    {
      title: 'Roadmap planen',
      description: 'Entwickeln Sie Ihre KI-Strategie',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'notion-red',
      href: '/roadmap',
    },
  ]

  return (
    <NotionCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className={styles.text('h3')}>Quick Actions</h3>
        <NotionButton variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </NotionButton>
      </div>
      
      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full p-3 text-left rounded-lg border border-notion-border dark:border-notion-dark-border hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-all duration-200 group hover:border-notion-blue/30 dark:hover:border-notion-blue/30"
          >
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-lg bg-${action.color}/10 text-${action.color} flex items-center justify-center mr-3 group-hover:scale-110 group-hover:bg-${action.color}/20 transition-all duration-200`}
              >
                {action.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium group-hover:text-notion-blue transition-colors">
                    {action.title}
                  </span>
                  {action.badge && (
                    <span className={`px-1.5 py-0.5 text-xs rounded font-medium ${
                      action.badge === 'Live' 
                        ? 'bg-notion-green/10 text-notion-green'
                        : 'bg-notion-blue/10 text-notion-blue'
                    }`}>
                      {action.badge}
                    </span>
                  )}
                </div>
                <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
                  {action.description}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-notion-text-secondary dark:text-notion-dark-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-notion-border dark:border-notion-dark-border">
        <div className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary text-center">
          💡 Tipp: Nutzen Sie Cmd+K für Schnellzugriff
        </div>
      </div>
    </NotionCard>
  )
}

function UpcomingTasks() {
  const styles = useNotionStyles()

  // Enhanced mock data with more details
  const upcomingTasks = [
    {
      id: 1,
      title: 'Berater-Gespräch: Chatbot Review',
      description: 'Wöchentlicher Review des Chatbot-Fortschritts',
      date: 'Heute, 14:00',
      type: 'meeting',
      priority: 'high',
      duration: '60 min',
    },
    {
      id: 2,
      title: 'Datenmodell finalisieren',
      description: 'Abschluss der Datenmodellierung für Analytics Dashboard',
      date: 'Morgen',
      type: 'task',
      priority: 'high',
      duration: '3h',
    },
    {
      id: 3,
      title: 'Team Training: KI Grundlagen',
      description: 'Schulung für neue Teammitglieder',
      date: 'Freitag, 10:00',
      type: 'training',
      priority: 'medium',
      duration: '2h',
    },
    {
      id: 4,
      title: 'Code Review: Sales Automation',
      description: 'Review der implementierten Automatisierungslogik',
      date: 'Nächste Woche',
      type: 'task',
      priority: 'medium',
      duration: '90 min',
    },
  ]

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="w-4 h-4" />
      case 'task':
        return <CheckCircle className="w-4 h-4" />
      case 'training':
        return <Zap className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'notion-blue'
      case 'task':
        return 'notion-green'
      case 'training':
        return 'notion-purple'
      default:
        return 'notion-gray'
    }
  }

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴'
      case 'medium':
        return '🟡'
      case 'low':
        return '🟢'
      default:
        return '⚪'
    }
  }

  return (
    <NotionCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className={styles.text('h3')}>Anstehende Tasks</h3>
        <NotionButton variant="ghost" size="sm">
          <Bell className="w-4 h-4" />
        </NotionButton>
      </div>
      
      <div className="space-y-3">
        {upcomingTasks.map((task, index) => (
          <div
            key={task.id}
            className="group p-3 rounded-lg hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-all duration-200 cursor-pointer border border-transparent hover:border-notion-border dark:hover:border-notion-dark-border"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-lg bg-${getTaskColor(task.type)}/10 text-${getTaskColor(task.type)} flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform`}
              >
                {getTaskIcon(task.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm group-hover:text-notion-blue transition-colors">
                        {task.title}
                      </h4>
                      <span className="text-xs">{getPriorityIndicator(task.priority)}</span>
                    </div>
                    <p className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary mb-2 line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                      <span>📅 {task.date}</span>
                      <span>⏱️ {task.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-notion-border dark:border-notion-dark-border space-y-2">
        <NotionButton variant="ghost" size="sm" className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
          Neue Aufgabe erstellen
        </NotionButton>
        <NotionButton variant="ghost" size="sm" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Alle Tasks anzeigen
        </NotionButton>
      </div>
    </NotionCard>
  )
}


