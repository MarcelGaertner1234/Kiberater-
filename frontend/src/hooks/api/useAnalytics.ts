'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

// Types
export interface AnalyticsMetrics {
  kiReadinessScore: {
    current: number
    trend: Array<{ date: string; score: number }>
    benchmarkIndustry: number
  }
  projectProgress: {
    totalProjects: number
    completedProjects: number
    inProgressProjects: number
    avgCompletionTime: number
    progressByCategory: Array<{
      category: string
      completed: number
      total: number
      percentage: number
    }>
  }
  timeInvestment: {
    totalHours: number
    thisWeek: number
    lastWeek: number
    breakdown: Array<{
      category: string
      hours: number
      percentage: number
    }>
  }
  roiCalculation: {
    totalInvestment: number
    estimatedSavings: number
    roi: number
    paybackPeriod: number
    breakdown: Array<{
      project: string
      investment: number
      savings: number
      roi: number
    }>
  }
  teamEfficiency: {
    tasksCompletedThisWeek: number
    averageTaskCompletionTime: number
    teamMemberStats: Array<{
      id: string
      name: string
      tasksCompleted: number
      avgCompletionTime: number
      efficiency: number
    }>
  }
}

export interface ChartData {
  id: string
  type: 'line' | 'bar' | 'area' | 'pie' | 'radar'
  title: string
  data: any[]
  timeRange: TimeRange
  metrics: string[]
}

export interface TimeRange {
  start: string
  end: string
  period: 'day' | 'week' | 'month' | 'quarter' | 'year'
}

// API functions
const analyticsApi = {
  getMetrics: (timeRange?: TimeRange) => 
    apiClient.get<AnalyticsMetrics>('/analytics/metrics', timeRange ? { 
      start: timeRange.start, 
      end: timeRange.end,
      period: timeRange.period 
    } : {}),
  
  getKiReadinessTrend: (timeRange: TimeRange) =>
    apiClient.get<Array<{ date: string; score: number; category?: string }>>('/analytics/ki-readiness', {
      start: timeRange.start,
      end: timeRange.end
    }),
  
  getProjectProgressCharts: (timeRange?: TimeRange) =>
    apiClient.get<ChartData[]>('/analytics/project-progress', timeRange || {}),
  
  getTimeInvestmentData: (timeRange?: TimeRange) =>
    apiClient.get<Array<{ category: string; hours: number; date: string }>>('/analytics/time-investment', timeRange || {}),
  
  getRoiAnalysis: () =>
    apiClient.get<AnalyticsMetrics['roiCalculation']>('/analytics/roi'),
  
  getTeamEfficiency: (timeRange?: TimeRange) =>
    apiClient.get<AnalyticsMetrics['teamEfficiency']>('/analytics/team-efficiency', timeRange || {}),
  
  getBenchmarkData: () =>
    apiClient.get<Array<{ metric: string; ourValue: number; industryAverage: number; topPerformers: number }>>('/analytics/benchmark'),
  
  exportData: (format: 'csv' | 'pdf' | 'json', timeRange?: TimeRange) =>
    apiClient.get<Blob>('/analytics/export', {
      format,
      ...(timeRange || {})
    }),
}

// Analytics Hooks
export function useAnalyticsMetrics(timeRange?: TimeRange) {
  return useQuery({
    queryKey: ['analytics', 'metrics', timeRange],
    queryFn: () => analyticsApi.getMetrics(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useKiReadinessTrend(timeRange: TimeRange) {
  return useQuery({
    queryKey: ['analytics', 'ki-readiness', timeRange],
    queryFn: () => analyticsApi.getKiReadinessTrend(timeRange),
    enabled: !!(timeRange.start && timeRange.end),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useProjectProgressCharts(timeRange?: TimeRange) {
  return useQuery({
    queryKey: ['analytics', 'project-progress', timeRange],
    queryFn: () => analyticsApi.getProjectProgressCharts(timeRange),
    staleTime: 5 * 60 * 1000,
  })
}

export function useTimeInvestmentData(timeRange?: TimeRange) {
  return useQuery({
    queryKey: ['analytics', 'time-investment', timeRange],
    queryFn: () => analyticsApi.getTimeInvestmentData(timeRange),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export function useRoiAnalysis() {
  return useQuery({
    queryKey: ['analytics', 'roi'],
    queryFn: analyticsApi.getRoiAnalysis,
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

export function useTeamEfficiency(timeRange?: TimeRange) {
  return useQuery({
    queryKey: ['analytics', 'team-efficiency', timeRange],
    queryFn: () => analyticsApi.getTeamEfficiency(timeRange),
    staleTime: 10 * 60 * 1000,
  })
}

export function useBenchmarkData() {
  return useQuery({
    queryKey: ['analytics', 'benchmark'],
    queryFn: analyticsApi.getBenchmarkData,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}

// Custom Hook für Analytics Dashboard
export function useAnalytics(timeRange?: TimeRange) {
  const metrics = useAnalyticsMetrics(timeRange)
  const kiTrend = useKiReadinessTrend(timeRange || {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
    period: 'day'
  })
  const projectCharts = useProjectProgressCharts(timeRange)
  const timeInvestment = useTimeInvestmentData(timeRange)
  const roiAnalysis = useRoiAnalysis()
  const teamEfficiency = useTeamEfficiency(timeRange)
  const benchmark = useBenchmarkData()

  return {
    metrics: metrics.data,
    kiTrend: kiTrend.data,
    projectCharts: projectCharts.data,
    timeInvestment: timeInvestment.data,
    roiAnalysis: roiAnalysis.data,
    teamEfficiency: teamEfficiency.data,
    benchmark: benchmark.data,
    isLoading: metrics.isLoading || kiTrend.isLoading || projectCharts.isLoading || 
               timeInvestment.isLoading || roiAnalysis.isLoading || teamEfficiency.isLoading,
    isError: metrics.isError || kiTrend.isError || projectCharts.isError || 
             timeInvestment.isError || roiAnalysis.isError || teamEfficiency.isError,
    refetch: () => {
      metrics.refetch()
      kiTrend.refetch()
      projectCharts.refetch()
      timeInvestment.refetch()
      roiAnalysis.refetch()
      teamEfficiency.refetch()
      benchmark.refetch()
    }
  }
}

// Mock Data Generator für Entwicklung
export const generateMockAnalytics = (timeRange?: TimeRange): AnalyticsMetrics => {
  const days = timeRange ? 
    Math.ceil((new Date(timeRange.end).getTime() - new Date(timeRange.start).getTime()) / (1000 * 60 * 60 * 24)) :
    30

  return {
    kiReadinessScore: {
      current: 75,
      trend: Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        score: 60 + Math.floor(Math.random() * 20) + (i * 0.5) // Upward trend
      })),
      benchmarkIndustry: 68
    },
    projectProgress: {
      totalProjects: 15,
      completedProjects: 8,
      inProgressProjects: 5,
      avgCompletionTime: 21, // days
      progressByCategory: [
        { category: 'Data & Analytics', completed: 3, total: 5, percentage: 60 },
        { category: 'Process Automation', completed: 2, total: 4, percentage: 50 },
        { category: 'Customer Service', completed: 2, total: 3, percentage: 67 },
        { category: 'Marketing & Sales', completed: 1, total: 3, percentage: 33 }
      ]
    },
    timeInvestment: {
      totalHours: 1240,
      thisWeek: 42,
      lastWeek: 38,
      breakdown: [
        { category: 'Planung & Strategie', hours: 380, percentage: 31 },
        { category: 'Implementation', hours: 420, percentage: 34 },
        { category: 'Testing & QA', hours: 180, percentage: 15 },
        { category: 'Training & Adoption', hours: 160, percentage: 13 },
        { category: 'Monitoring & Support', hours: 100, percentage: 8 }
      ]
    },
    roiCalculation: {
      totalInvestment: 125000,
      estimatedSavings: 189000,
      roi: 51.2, // percentage
      paybackPeriod: 18, // months
      breakdown: [
        { project: 'Customer Service Chatbot', investment: 35000, savings: 72000, roi: 105.7 },
        { project: 'Sales Process Automation', investment: 28000, savings: 45000, roi: 60.7 },
        { project: 'Data Analytics Dashboard', investment: 42000, savings: 52000, roi: 23.8 },
        { project: 'Inventory Management', investment: 20000, savings: 20000, roi: 0 }
      ]
    },
    teamEfficiency: {
      tasksCompletedThisWeek: 24,
      averageTaskCompletionTime: 3.2, // days
      teamMemberStats: [
        { id: '1', name: 'John Doe', tasksCompleted: 8, avgCompletionTime: 2.8, efficiency: 95 },
        { id: '2', name: 'Maria Schmidt', tasksCompleted: 6, avgCompletionTime: 3.1, efficiency: 88 },
        { id: '3', name: 'Thomas Weber', tasksCompleted: 5, avgCompletionTime: 3.5, efficiency: 82 },
        { id: '4', name: 'Lisa Müller', tasksCompleted: 5, avgCompletionTime: 3.8, efficiency: 79 }
      ]
    }
  }
}