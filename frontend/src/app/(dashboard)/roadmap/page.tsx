'use client'

import { useState } from 'react'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { 
  Milestone,
  Calendar,
  ChevronRight,
  CheckCircle,
  Clock,
  Target,
  Zap,
  TrendingUp,
  Users,
  FileText,
  AlertCircle,
  Play,
  Pause,
  MoreVertical,
  Download,
  Share2,
  Edit,
  Flag
} from 'lucide-react'

interface RoadmapPhase {
  id: string
  title: string
  description: string
  duration: string
  status: 'completed' | 'in-progress' | 'upcoming' | 'blocked'
  progress: number
  startDate: string
  endDate: string
  milestones: Array<{
    id: string
    title: string
    completed: boolean
    dueDate: string
  }>
  deliverables: string[]
  risks?: string[]
}

const roadmapData: RoadmapPhase[] = [
  {
    id: '1',
    title: 'Foundation & Assessment',
    description: 'Grundlagen schaffen und Ist-Zustand analysieren',
    duration: '4 Wochen',
    status: 'completed',
    progress: 100,
    startDate: '2024-01-01',
    endDate: '2024-01-28',
    milestones: [
      { id: 'm1', title: 'KI-Assessment abgeschlossen', completed: true, dueDate: '2024-01-07' },
      { id: 'm2', title: 'Stakeholder Interviews', completed: true, dueDate: '2024-01-14' },
      { id: 'm3', title: 'Datenqualität evaluiert', completed: true, dueDate: '2024-01-21' },
      { id: 'm4', title: 'Use Cases priorisiert', completed: true, dueDate: '2024-01-28' }
    ],
    deliverables: [
      'KI-Readiness Report',
      'Use Case Katalog',
      'Stakeholder Map',
      'Datenqualitätsbericht'
    ]
  },
  {
    id: '2',
    title: 'Pilot Projekt',
    description: 'Ersten KI Use Case implementieren und validieren',
    duration: '8 Wochen',
    status: 'in-progress',
    progress: 65,
    startDate: '2024-01-29',
    endDate: '2024-03-24',
    milestones: [
      { id: 'm5', title: 'Technologie-Stack definiert', completed: true, dueDate: '2024-02-04' },
      { id: 'm6', title: 'MVP entwickelt', completed: true, dueDate: '2024-02-18' },
      { id: 'm7', title: 'Testing & Validierung', completed: false, dueDate: '2024-03-10' },
      { id: 'm8', title: 'Pilot Launch', completed: false, dueDate: '2024-03-24' }
    ],
    deliverables: [
      'MVP Chatbot',
      'Test-Ergebnisse',
      'Performance Metriken',
      'Lessons Learned'
    ],
    risks: [
      'Datenintegration komplexer als erwartet',
      'Zusätzliche Compliance-Anforderungen'
    ]
  },
  {
    id: '3',
    title: 'Scale & Optimize',
    description: 'Erfolgreiche Lösung skalieren und optimieren',
    duration: '12 Wochen',
    status: 'upcoming',
    progress: 0,
    startDate: '2024-03-25',
    endDate: '2024-06-16',
    milestones: [
      { id: 'm9', title: 'Produktionsumgebung', completed: false, dueDate: '2024-04-07' },
      { id: 'm10', title: 'Team Training', completed: false, dueDate: '2024-04-21' },
      { id: 'm11', title: 'Prozessintegration', completed: false, dueDate: '2024-05-19' },
      { id: 'm12', title: 'Full Rollout', completed: false, dueDate: '2024-06-16' }
    ],
    deliverables: [
      'Produktionssystem',
      'Trainingsmaterialien',
      'SOP Dokumentation',
      'KPI Dashboard'
    ]
  },
  {
    id: '4',
    title: 'Advanced Implementation',
    description: 'Weitere Use Cases und fortgeschrittene Features',
    duration: '16 Wochen',
    status: 'upcoming',
    progress: 0,
    startDate: '2024-06-17',
    endDate: '2024-10-06',
    milestones: [
      { id: 'm13', title: 'Use Case 2: Predictive Analytics', completed: false, dueDate: '2024-07-14' },
      { id: 'm14', title: 'Use Case 3: Process Automation', completed: false, dueDate: '2024-08-11' },
      { id: 'm15', title: 'Integration Platform', completed: false, dueDate: '2024-09-08' },
      { id: 'm16', title: 'KI Center of Excellence', completed: false, dueDate: '2024-10-06' }
    ],
    deliverables: [
      'Analytics Dashboard',
      'Automation Workflows',
      'Integration APIs',
      'CoE Framework'
    ]
  }
]

export default function RoadmapPage() {
  const styles = useNotionStyles()
  const [selectedPhase, setSelectedPhase] = useState<string>(roadmapData[1].id)
  const [viewMode, setViewMode] = useState<'timeline' | 'kanban'>('timeline')

  const getStatusColor = (status: RoadmapPhase['status']) => {
    switch (status) {
      case 'completed': return 'notion-green'
      case 'in-progress': return 'notion-blue'
      case 'upcoming': return 'notion-gray'
      case 'blocked': return 'notion-red'
    }
  }

  const getStatusIcon = (status: RoadmapPhase['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'in-progress': return <Play className="w-4 h-4" />
      case 'upcoming': return <Clock className="w-4 h-4" />
      case 'blocked': return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status: RoadmapPhase['status']) => {
    switch (status) {
      case 'completed': return 'Abgeschlossen'
      case 'in-progress': return 'In Bearbeitung'
      case 'upcoming': return 'Geplant'
      case 'blocked': return 'Blockiert'
    }
  }

  const selectedPhaseData = roadmapData.find(phase => phase.id === selectedPhase)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={styles.text('h1')}>KI-Roadmap</h1>
          <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
            Ihr Weg zur erfolgreichen KI-Implementation
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center border border-notion-border dark:border-notion-dark-border rounded-lg">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 text-sm rounded-l-lg transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-notion-blue text-white'
                  : 'text-notion-text-secondary hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-sm rounded-r-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-notion-blue text-white'
                  : 'text-notion-text-secondary hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover'
              }`}
            >
              Kanban
            </button>
          </div>

          <NotionButton variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </NotionButton>
          <NotionButton variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </NotionButton>
          <NotionButton variant="primary" size="sm" leftIcon={<Edit className="w-4 h-4" />}>
            Roadmap anpassen
          </NotionButton>
        </div>
      </div>

      {/* Progress Overview */}
      <NotionCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Gesamtfortschritt</h3>
          <span className="text-2xl font-bold text-notion-blue">41%</span>
        </div>
        <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-3 mb-4">
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-notion-blue to-notion-purple transition-all duration-500"
            style={{ width: '41%' }}
          ></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-notion-green">1</div>
            <div className="text-sm text-notion-text-secondary">Abgeschlossen</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-notion-blue">1</div>
            <div className="text-sm text-notion-text-secondary">In Bearbeitung</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-notion-gray">2</div>
            <div className="text-sm text-notion-text-secondary">Geplant</div>
          </div>
          <div>
            <div className="text-2xl font-bold">40</div>
            <div className="text-sm text-notion-text-secondary">Wochen Total</div>
          </div>
        </div>
      </NotionCard>

      {viewMode === 'timeline' ? (
        <div className="flex gap-6">
          {/* Timeline View */}
          <div className="flex-1">
            <div className="space-y-4">
              {roadmapData.map((phase, index) => (
                <div
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase.id)}
                  className={`relative cursor-pointer transition-all ${
                    selectedPhase === phase.id ? 'scale-[1.02]' : ''
                  }`}
                >
                  <NotionCard 
                    className={`${
                      selectedPhase === phase.id 
                        ? 'ring-2 ring-notion-blue shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start">
                      {/* Timeline Connector */}
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white bg-${getStatusColor(phase.status)}`}>
                          {getStatusIcon(phase.status)}
                        </div>
                        {index < roadmapData.length - 1 && (
                          <div className={`w-0.5 h-24 mt-2 bg-${
                            phase.status === 'completed' ? 'notion-green' : 'notion-border'
                          }`}></div>
                        )}
                      </div>

                      {/* Phase Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{phase.title}</h3>
                            <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
                              {phase.description}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full bg-${getStatusColor(phase.status)}/10 text-${getStatusColor(phase.status)}`}>
                            {getStatusLabel(phase.status)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-notion-text-secondary mb-3">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {phase.duration}
                          </span>
                          <span className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {phase.milestones.filter(m => m.completed).length}/{phase.milestones.length} Meilensteine
                          </span>
                          {phase.risks && (
                            <span className="flex items-center text-notion-yellow">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {phase.risks.length} Risiken
                            </span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {phase.status === 'in-progress' && (
                          <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-notion-blue transition-all duration-500"
                              style={{ width: `${phase.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>

                      <ChevronRight className={`w-5 h-5 ml-4 text-notion-text-secondary transition-transform ${
                        selectedPhase === phase.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </NotionCard>
                </div>
              ))}
            </div>
          </div>

          {/* Phase Details */}
          {selectedPhaseData && (
            <div className="w-96">
              <NotionCard className="sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{selectedPhaseData.title}</h3>
                  <button className="p-1 hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Date Range */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-notion-text-secondary">Zeitraum:</span>
                    <span className="font-medium">
                      {new Date(selectedPhaseData.startDate).toLocaleDateString('de-DE')} - 
                      {new Date(selectedPhaseData.endDate).toLocaleDateString('de-DE')}
                    </span>
                  </div>

                  {/* Milestones */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <Milestone className="w-4 h-4 mr-2" />
                      Meilensteine
                    </h4>
                    <div className="space-y-2">
                      {selectedPhaseData.milestones.map((milestone) => (
                        <div key={milestone.id} className="flex items-start">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 mr-3 ${
                            milestone.completed 
                              ? 'bg-notion-green border-notion-green' 
                              : 'border-notion-border dark:border-notion-dark-border'
                          }`}>
                            {milestone.completed && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${milestone.completed ? 'line-through text-notion-text-secondary' : ''}`}>
                              {milestone.title}
                            </p>
                            <p className="text-xs text-notion-text-secondary">
                              {new Date(milestone.dueDate).toLocaleDateString('de-DE')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Deliverables
                    </h4>
                    <div className="space-y-1">
                      {selectedPhaseData.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-notion-blue rounded-full mr-2"></div>
                          {deliverable}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks */}
                  {selectedPhaseData.risks && selectedPhaseData.risks.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center text-notion-yellow">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Risiken & Herausforderungen
                      </h4>
                      <div className="space-y-2">
                        {selectedPhaseData.risks.map((risk, index) => (
                          <div key={index} className="p-3 bg-notion-yellow/10 border border-notion-yellow/20 rounded-lg">
                            <p className="text-sm">{risk}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-notion-border dark:border-notion-dark-border">
                    <div className="flex gap-2">
                      <NotionButton variant="primary" size="sm" className="flex-1">
                        <Flag className="w-4 h-4 mr-2" />
                        Status Update
                      </NotionButton>
                      <NotionButton variant="ghost" size="sm" className="flex-1">
                        <Users className="w-4 h-4 mr-2" />
                        Team View
                      </NotionButton>
                    </div>
                  </div>
                </div>
              </NotionCard>
            </div>
          )}
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-4 gap-6">
          {roadmapData.map((phase) => (
            <NotionCard key={phase.id} className="h-fit">
              <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 border-${getStatusColor(phase.status)}`}>
                <h3 className="font-semibold">{phase.title}</h3>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs bg-${getStatusColor(phase.status)}`}>
                  {phase.milestones.filter(m => m.completed).length}
                </span>
              </div>

              <div className="space-y-3">
                {phase.milestones.map((milestone) => (
                  <div 
                    key={milestone.id}
                    className={`p-3 rounded-lg border transition-all ${
                      milestone.completed 
                        ? 'bg-notion-green/5 border-notion-green/20' 
                        : 'border-notion-border dark:border-notion-dark-border hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className={`text-sm font-medium ${milestone.completed ? 'line-through' : ''}`}>
                        {milestone.title}
                      </p>
                      {milestone.completed && <CheckCircle className="w-4 h-4 text-notion-green" />}
                    </div>
                    <p className="text-xs text-notion-text-secondary">
                      {new Date(milestone.dueDate).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                ))}
              </div>

              {phase.status === 'in-progress' && (
                <div className="mt-4 pt-4 border-t border-notion-border dark:border-notion-dark-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Fortschritt</span>
                    <span className="text-sm font-medium">{phase.progress}%</span>
                  </div>
                  <div className="w-full bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-notion-blue"
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </NotionCard>
          ))}
        </div>
      )}
    </div>
  )
}