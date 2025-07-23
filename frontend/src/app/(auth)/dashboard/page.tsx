'use client'

import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
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
  Play
} from 'lucide-react'

// Mock data for development
const mockDashboardData = {
  user: {
    name: "John Doe",
    company: "TechStart GmbH",
    plan: "Professional"
  },
  stats: {
    assessmentScore: 75,
    completedProjects: 12,
    activeRoadmaps: 3,
    upcomingTasks: 8
  },
  recentProjects: [
    {
      id: 1,
      title: "Customer Service Chatbot",
      status: "In Progress",
      progress: 65,
      dueDate: "2024-02-15",
      team: ["JD", "MS", "TW"]
    },
    {
      id: 2,
      title: "Sales Process Automation",
      status: "Planning",
      progress: 25,
      dueDate: "2024-03-01",
      team: ["JD", "AM"]
    },
    {
      id: 3,
      title: "Data Analytics Dashboard",
      status: "Done",
      progress: 100,
      dueDate: "2024-01-30",
      team: ["JD", "MS", "TW", "LK"]
    }
  ],
  upcomingTasks: [
    {
      id: 1,
      title: "Berater-Gespräch: Chatbot Review",
      date: "Heute, 14:00",
      type: "meeting"
    },
    {
      id: 2,
      title: "Datenmodell finalisieren",
      date: "Morgen",
      type: "task"
    },
    {
      id: 3,
      title: "Team Training: KI Grundlagen",
      date: "Freitag, 10:00",
      type: "training"
    }
  ]
}

export default function DashboardPage() {
  const styles = useNotionStyles()

  return (
    <div className="space-y-6">
      <WelcomeWidget />
      <StatsCards />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentProjects />
          <ProgressChart />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <UpcomingTasks />
        </div>
      </div>
    </div>
  )
}

function WelcomeWidget() {
  const { user } = mockDashboardData
  const styles = useNotionStyles()

  return (
    <NotionCard gradient className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-notion-blue/20 to-notion-purple/20 rounded-full -translate-y-16 translate-x-16"></div>
      
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className={styles.text('h2', 'mb-2')}>
              Willkommen zurück, {user.name}! 👋
            </h1>
            <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary mb-4">
              Hier ist Ihr KI-Fortschritt bei <strong>{user.company}</strong>
            </p>
            <div className="flex flex-wrap gap-3">
              <NotionButton variant="primary" leftIcon={<Target className="w-4 h-4" />}>
                KI-Assessment starten
              </NotionButton>
              <NotionButton variant="ghost" leftIcon={<Play className="w-4 h-4" />}>
                2-Min Tutorial ansehen
              </NotionButton>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-notion-green/10 text-notion-green text-sm font-medium">
              <div className="w-2 h-2 bg-notion-green rounded-full mr-2 animate-pulse"></div>
              {user.plan} Plan aktiv
            </div>
          </div>
        </div>
      </div>
    </NotionCard>
  )
}

function StatsCards() {
  const { stats } = mockDashboardData
  const styles = useNotionStyles()

  const statsData = [
    {
      label: "KI-Readiness Score",
      value: `${stats.assessmentScore}%`,
      change: { value: 12, type: 'increase' as const },
      icon: <Target className="w-6 h-6" />,
      color: "notion-blue"
    },
    {
      label: "Abgeschlossene Projekte",
      value: stats.completedProjects,
      change: { value: 3, type: 'increase' as const },
      icon: <CheckCircle className="w-6 h-6" />,
      color: "notion-green"
    },
    {
      label: "Aktive Roadmaps",
      value: stats.activeRoadmaps,
      change: { value: 1, type: 'increase' as const },
      icon: <BarChart3 className="w-6 h-6" />,
      color: "notion-purple"
    },
    {
      label: "Anstehende Tasks",
      value: stats.upcomingTasks,
      change: { value: 2, type: 'decrease' as const },
      icon: <Clock className="w-6 h-6" />,
      color: "notion-yellow"
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <NotionCard key={index} className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${stat.color}/10 text-${stat.color} mb-3`}>
            {stat.icon}
          </div>
          <div className="text-2xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary mb-2">
            {stat.label}
          </div>
          <div className={`flex items-center justify-center text-xs ${
            stat.change.type === 'increase' ? 'text-notion-green' : 'text-notion-red'
          }`}>
            <TrendingUp className={`w-3 h-3 mr-1 ${stat.change.type === 'decrease' ? 'rotate-180' : ''}`} />
            {stat.change.type === 'increase' ? '+' : '-'}{stat.change.value} diese Woche
          </div>
        </NotionCard>
      ))}
    </div>
  )
}

function RecentProjects() {
  const { recentProjects } = mockDashboardData
  const styles = useNotionStyles()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'notion-green'
      case 'In Progress': return 'notion-blue'
      case 'Planning': return 'notion-yellow'
      default: return 'notion-gray'
    }
  }

  return (
    <NotionCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className={styles.text('h3')}>Aktuelle Projekte</h3>
        <NotionButton variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
          Alle anzeigen
        </NotionButton>
      </div>

      <div className="space-y-4">
        {recentProjects.map((project) => (
          <div key={project.id} className="p-4 border border-notion-border dark:border-notion-dark-border rounded-lg hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium mb-1">{project.title}</h4>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(project.status)}/10 text-${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                    Fällig: {new Date(project.dueDate).toLocaleDateString('de-DE')}
                  </span>
                </div>
              </div>
              <div className="flex -space-x-2">
                {project.team.map((member, index) => (
                  <div key={index} className="w-6 h-6 rounded-full bg-gradient-to-br from-notion-blue to-notion-purple flex items-center justify-center text-white text-xs font-medium border-2 border-notion-bg dark:border-notion-dark-bg">
                    {member}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r from-${getStatusColor(project.status)} to-${getStatusColor(project.status)}`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
              <span>Fortschritt</span>
              <span>{project.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </NotionCard>
  )
}

function QuickActions() {
  const actions = [
    {
      title: "Neues Projekt",
      description: "KI-Projekt starten",
      icon: <Plus className="w-5 h-5" />,
      color: "notion-blue",
      href: "/projects/new"
    },
    {
      title: "Berater kontaktieren",
      description: "Frage stellen",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "notion-green",
      href: "/chat"
    },
    {
      title: "Termin buchen",
      description: "1:1 Beratung",
      icon: <Calendar className="w-5 h-5" />,
      color: "notion-purple",
      href: "/calendar"
    }
  ]

  return (
    <NotionCard>
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full p-3 text-left rounded-lg border border-notion-border dark:border-notion-dark-border hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors group"
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg bg-${action.color}/10 text-${action.color} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <div>
                <div className="font-medium">{action.title}</div>
                <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
                  {action.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </NotionCard>
  )
}

function UpcomingTasks() {
  const { upcomingTasks } = mockDashboardData

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4" />
      case 'task': return <CheckCircle className="w-4 h-4" />
      case 'training': return <Zap className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'notion-blue'
      case 'task': return 'notion-green'
      case 'training': return 'notion-purple'
      default: return 'notion-gray'
    }
  }

  return (
    <NotionCard>
      <h3 className="text-lg font-semibold mb-4">Anstehende Tasks</h3>
      <div className="space-y-3">
        {upcomingTasks.map((task) => (
          <div key={task.id} className="flex items-start p-3 rounded-lg hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors cursor-pointer">
            <div className={`w-8 h-8 rounded-lg bg-${getTaskColor(task.type)}/10 text-${getTaskColor(task.type)} flex items-center justify-center mr-3 mt-0.5`}>
              {getTaskIcon(task.type)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{task.title}</div>
              <div className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                {task.date}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <NotionButton variant="ghost" size="sm" className="w-full mt-4">
        Alle Tasks anzeigen
      </NotionButton>
    </NotionCard>
  )
}

function ProgressChart() {
  // This would normally use a chart library like recharts
  return (
    <NotionCard>
      <h3 className="text-lg font-semibold mb-4">KI-Implementation Progress</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Assessment</span>
          <span className="text-sm font-medium">100%</span>
        </div>
        <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-2">
          <div className="h-2 rounded-full bg-notion-green" style={{ width: '100%' }}></div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Strategieplanung</span>
          <span className="text-sm font-medium">75%</span>
        </div>
        <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-2">
          <div className="h-2 rounded-full bg-notion-blue" style={{ width: '75%' }}></div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Implementation</span>
          <span className="text-sm font-medium">45%</span>
        </div>
        <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-2">
          <div className="h-2 rounded-full bg-notion-yellow" style={{ width: '45%' }}></div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Erfolgsmessung</span>
          <span className="text-sm font-medium">0%</span>
        </div>
        <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-2">
          <div className="h-2 rounded-full bg-notion-red" style={{ width: '5%' }}></div>
        </div>
      </div>
    </NotionCard>
  )
}