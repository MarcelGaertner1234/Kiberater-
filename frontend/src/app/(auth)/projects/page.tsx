'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import {
  Plus,
  MoreHorizontal,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Filter,
  Search,
  Grid3X3,
  List,
} from 'lucide-react'

// Mock data for the kanban board
const initialData = {
  columns: {
    todo: {
      id: 'todo',
      title: 'Zu erledigen',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Bearbeitung',
      taskIds: ['task-4', 'task-5'],
    },
    review: {
      id: 'review',
      title: 'Review',
      taskIds: ['task-6'],
    },
    done: {
      id: 'done',
      title: 'Abgeschlossen',
      taskIds: ['task-7', 'task-8'],
    },
  },
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'KI-Assessment für Customer Service',
      description: 'Analyse der aktuellen Kundensupport-Prozesse',
      priority: 'high',
      assignees: ['JD'],
      dueDate: '2024-02-15',
      project: 'Customer Service Bot',
    },
    'task-2': {
      id: 'task-2',
      title: 'Datenmodell Design',
      description: 'Entwurf der Datenstruktur für das ML-Modell',
      priority: 'medium',
      assignees: ['MS', 'TW'],
      dueDate: '2024-02-18',
      project: 'Sales Automation',
    },
    'task-3': {
      id: 'task-3',
      title: 'Stakeholder Interview',
      description: 'Interviews mit Fachabteilungen führen',
      priority: 'low',
      assignees: ['AM'],
      dueDate: '2024-02-20',
      project: 'Data Analytics',
    },
    'task-4': {
      id: 'task-4',
      title: 'Prototyp entwickeln',
      description: 'Ersten funktionsfähigen Prototyp erstellen',
      priority: 'high',
      assignees: ['JD', 'TW'],
      dueDate: '2024-02-12',
      project: 'Customer Service Bot',
    },
    'task-5': {
      id: 'task-5',
      title: 'API Integration',
      description: 'Anbindung an bestehende CRM-Systeme',
      priority: 'medium',
      assignees: ['TW'],
      dueDate: '2024-02-16',
      project: 'Sales Automation',
    },
    'task-6': {
      id: 'task-6',
      title: 'Code Review',
      description: 'Überprüfung der Implementierung',
      priority: 'medium',
      assignees: ['MS'],
      dueDate: '2024-02-14',
      project: 'Customer Service Bot',
    },
    'task-7': {
      id: 'task-7',
      title: 'Deployment Setup',
      description: 'Produktive Umgebung einrichten',
      priority: 'low',
      assignees: ['JD'],
      dueDate: '2024-02-10',
      project: 'Data Analytics',
    },
    'task-8': {
      id: 'task-8',
      title: 'User Training',
      description: 'Schulung der Endnutzer durchführen',
      priority: 'medium',
      assignees: ['AM', 'MS'],
      dueDate: '2024-02-08',
      project: 'Data Analytics',
    },
  },
  columnOrder: ['todo', 'in-progress', 'review', 'done'],
}

export default function ProjectsPage() {
  const [data, setData] = useState(initialData)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [searchTerm, setSearchTerm] = useState('')
  const styles = useNotionStyles()

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const start = data.columns[source.droppableId]
    const finish = data.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      }

      setData(newData)
      return
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }

    setData(newData)
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-3 h-3" />
      case 'medium':
        return <Clock className="w-3 h-3" />
      case 'low':
        return <CheckCircle className="w-3 h-3" />
      default:
        return null
    }
  }

  const filteredTasks = Object.values(data.tasks).filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={styles.text('h1')}>Projekte</h1>
          <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
            Verwalten Sie Ihre KI-Projekte und Aufgaben
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NotionButton variant="ghost" size="sm">
            <Filter className="w-4 h-4" />
          </NotionButton>

          <div className="flex items-center border border-notion-border dark:border-notion-dark-border rounded-lg">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-notion-blue text-white'
                  : 'text-notion-text-secondary hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-notion-blue text-white'
                  : 'text-notion-text-secondary hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <NotionButton variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Neue Aufgabe
          </NotionButton>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-notion-text-secondary dark:text-notion-dark-text-secondary" />
        <input
          type="text"
          placeholder="Aufgaben durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-notion-border dark:border-notion-dark-border rounded-lg bg-notion-bg dark:bg-notion-dark-bg focus:outline-none focus:ring-2 focus:ring-notion-blue focus:border-transparent"
        />
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId]
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId])

              return (
                <div key={column.id} className="flex-shrink-0 w-80">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-notion-text dark:text-notion-dark-text">
                      {column.title}
                    </h3>
                    <span className="bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary text-notion-text-secondary dark:text-notion-dark-text-secondary px-2 py-1 rounded-full text-xs">
                      {tasks.length}
                    </span>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver
                            ? 'bg-notion-blue/5 border-2 border-notion-blue/20'
                            : 'bg-notion-bg-secondary/50 dark:bg-notion-dark-bg-secondary/50'
                        }`}
                      >
                        <div className="space-y-3">
                          {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`transition-all duration-200 ${
                                    snapshot.isDragging
                                      ? 'rotate-2 shadow-lg'
                                      : 'hover:-translate-y-0.5 hover:shadow-md'
                                  }`}
                                >
                                  <NotionCard className="cursor-grab active:cursor-grabbing">
                                    <div className="space-y-3">
                                      <div className="flex items-start justify-between">
                                        <h4 className="font-medium text-sm leading-snug">
                                          {task.title}
                                        </h4>
                                        <button className="text-notion-text-secondary hover:text-notion-text dark:text-notion-dark-text-secondary dark:hover:text-notion-dark-text">
                                          <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                      </div>

                                      <p className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary line-clamp-2">
                                        {task.description}
                                      </p>

                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${getPriorityColor(task.priority)}/10 text-${getPriorityColor(task.priority)}`}
                                          >
                                            {getPriorityIcon(task.priority)}
                                            {task.priority}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <div className="flex items-center text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(task.dueDate).toLocaleDateString('de-DE', {
                                              month: 'short',
                                              day: 'numeric',
                                            })}
                                          </div>

                                          <div className="flex -space-x-1">
                                            {task.assignees.map((assignee, i) => (
                                              <div
                                                key={i}
                                                className="w-6 h-6 rounded-full bg-gradient-to-br from-notion-blue to-notion-purple flex items-center justify-center text-white text-xs font-medium border-2 border-notion-bg dark:border-notion-dark-bg"
                                              >
                                                {assignee}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                                        {task.project}
                                      </div>
                                    </div>
                                  </NotionCard>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* Add Task Button */}
                  <button className="w-full mt-3 p-3 border-2 border-dashed border-notion-border dark:border-notion-dark-border rounded-lg text-notion-text-secondary dark:text-notion-dark-text-secondary hover:text-notion-text dark:hover:text-notion-dark-text hover:border-notion-blue transition-colors">
                    <Plus className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-sm">Aufgabe hinzufügen</span>
                  </button>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <NotionCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-notion-border dark:border-notion-dark-border">
                  <th className="text-left text-xs font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary uppercase tracking-wider py-3 px-4">
                    Aufgabe
                  </th>
                  <th className="text-left text-xs font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary uppercase tracking-wider py-3 px-4">
                    Projekt
                  </th>
                  <th className="text-left text-xs font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary uppercase tracking-wider py-3 px-4">
                    Priorität
                  </th>
                  <th className="text-left text-xs font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary uppercase tracking-wider py-3 px-4">
                    Zugewiesen
                  </th>
                  <th className="text-left text-xs font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary uppercase tracking-wider py-3 px-4">
                    Fällig
                  </th>
                  <th className="text-left text-xs font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const status = Object.keys(data.columns).find((columnId) =>
                    data.columns[columnId].taskIds.includes(task.id)
                  )

                  return (
                    <tr
                      key={task.id}
                      className="border-b border-notion-border dark:border-notion-dark-border hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-sm">{task.title}</div>
                          <div className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
                            {task.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{task.project}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${getPriorityColor(task.priority)}/10 text-${getPriorityColor(task.priority)}`}
                        >
                          {getPriorityIcon(task.priority)}
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex -space-x-1">
                          {task.assignees.map((assignee, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-notion-blue to-notion-purple flex items-center justify-center text-white text-xs font-medium border-2 border-notion-bg dark:border-notion-dark-bg"
                            >
                              {assignee}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(task.dueDate).toLocaleDateString('de-DE')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-notion-blue/10 text-notion-blue">
                          {data.columns[status!]?.title}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </NotionCard>
      )}
    </div>
  )
}
