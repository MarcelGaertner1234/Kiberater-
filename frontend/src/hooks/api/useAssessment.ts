import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAssessmentStore, toast } from '@/stores'
import { Assessment, AssessmentResults, AssessmentQuestion } from '@/types/assessment.types'
import { apiClient } from '@/lib/api'
import { PaginatedResponse, PaginationParams } from '@/types/api.types'

export const useAssessment = () => {
  const queryClient = useQueryClient()
  const {
    currentAssessment,
    questions,
    answers,
    currentStep,
    totalSteps,
    isLoading,
    isSaving,
    error,
    lastSaved,
    startAssessment: startAssessmentStore,
    loadAssessment: loadAssessmentStore,
    saveAnswer: saveAnswerStore,
    saveProgress: saveProgressStore,
    nextStep,
    previousStep,
    goToStep,
    submitAssessment: submitAssessmentStore,
    getResults: getResultsStore,
    resetAssessment
  } = useAssessmentStore()

  // Start Assessment Mutation
  const startAssessmentMutation = useMutation({
    mutationFn: async (type: 'READINESS' | 'MATURITY' | 'CUSTOM') => {
      await startAssessmentStore(type)
    },
    onSuccess: () => {
      toast.success('Assessment gestartet', 'Lassen Sie uns Ihre KI-Reife bewerten')
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
    },
    onError: (error: any) => {
      toast.error('Assessment konnte nicht gestartet werden', error.message)
    }
  })

  // Load Assessment Mutation
  const loadAssessmentMutation = useMutation({
    mutationFn: async (id: string) => {
      await loadAssessmentStore(id)
    },
    onSuccess: () => {
      toast.info('Assessment geladen', 'Sie können dort weitermachen, wo Sie aufgehört haben')
    },
    onError: (error: any) => {
      toast.error('Assessment konnte nicht geladen werden', error.message)
    }
  })

  // Save Answer Mutation
  const saveAnswerMutation = useMutation({
    mutationFn: async ({ questionId, value, comment }: { questionId: string; value: any; comment?: string }) => {
      await saveAnswerStore(questionId, value, comment)
    },
    onSuccess: () => {
      // Silent success - no toast needed for auto-save
    },
    onError: (error: any) => {
      toast.error('Antwort konnte nicht gespeichert werden', error.message)
    }
  })

  // Submit Assessment Mutation
  const submitAssessmentMutation = useMutation({
    mutationFn: async () => {
      return await submitAssessmentStore()
    },
    onSuccess: (completedAssessment) => {
      toast.success('Assessment abgeschlossen', 'Ihre Ergebnisse werden generiert...')
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
      queryClient.invalidateQueries({ queryKey: ['assessment-results', completedAssessment.id] })
    },
    onError: (error: any) => {
      toast.error('Assessment konnte nicht abgeschlossen werden', error.message)
    }
  })

  // Get Assessment Results
  const getResultsMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      return await getResultsStore(assessmentId)
    },
    onError: (error: any) => {
      toast.error('Ergebnisse konnten nicht geladen werden', error.message)
    }
  })

  // List User Assessments
  const assessmentsQuery = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Assessment>>('/assessments')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Get Assessment by ID
  const useAssessmentById = (id?: string) => {
    return useQuery({
      queryKey: ['assessment', id],
      queryFn: async () => {
        const response = await apiClient.get<Assessment>(`/assessments/${id}`)
        return response.data
      },
      enabled: !!id,
      staleTime: 2 * 60 * 1000, // 2 minutes
    })
  }

  // Get Assessment Results by ID
  const useAssessmentResults = (assessmentId?: string) => {
    return useQuery({
      queryKey: ['assessment-results', assessmentId],
      queryFn: async () => {
        const response = await apiClient.get<AssessmentResults>(`/assessments/${assessmentId}/results`)
        return response.data
      },
      enabled: !!assessmentId,
      staleTime: 10 * 60 * 1000, // 10 minutes - results don't change often
    })
  }

  // Get Assessment Questions
  const useAssessmentQuestions = (assessmentId?: string) => {
    return useQuery({
      queryKey: ['assessment-questions', assessmentId],
      queryFn: async () => {
        const response = await apiClient.get<AssessmentQuestion[]>(`/assessments/${assessmentId}/questions`)
        return response.data
      },
      enabled: !!assessmentId,
      staleTime: 30 * 60 * 1000, // 30 minutes - questions rarely change
    })
  }

  // Delete Assessment Mutation
  const deleteAssessmentMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/assessments/${id}`)
    },
    onSuccess: () => {
      toast.success('Assessment gelöscht', 'Das Assessment wurde erfolgreich entfernt')
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
    },
    onError: (error: any) => {
      toast.error('Assessment konnte nicht gelöscht werden', error.message)
    }
  })

  // Duplicate Assessment Mutation
  const duplicateAssessmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post<Assessment>(`/assessments/${id}/duplicate`)
      return response.data
    },
    onSuccess: (newAssessment) => {
      toast.success('Assessment dupliziert', 'Eine Kopie wurde erstellt')
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
      return newAssessment
    },
    onError: (error: any) => {
      toast.error('Assessment konnte nicht dupliziert werden', error.message)
    }
  })

  // Calculate progress
  const getProgress = () => {
    if (!questions.length) return 0
    const answeredQuestions = Object.keys(answers).length
    return Math.round((answeredQuestions / questions.length) * 100)
  }

  // Get current step questions
  const getCurrentStepQuestions = () => {
    return questions.filter(q => q.step === currentStep)
  }

  // Check if current step is complete
  const isCurrentStepComplete = () => {
    const currentStepQuestions = getCurrentStepQuestions()
    return currentStepQuestions.every(q => 
      answers[q.id] && 
      (!q.required || (answers[q.id].value !== null && answers[q.id].value !== undefined))
    )
  }

  // Auto-save answer
  const saveAnswer = (questionId: string, value: any, comment?: string) => {
    // Optimistic update in store
    useAssessmentStore.getState().answers[questionId] = {
      questionId,
      value,
      comment,
      answeredAt: new Date().toISOString()
    }
    
    // Debounced save to server
    saveAnswerMutation.mutate({ questionId, value, comment })
  }

  // Navigate with validation
  const goToNextStep = () => {
    if (isCurrentStepComplete()) {
      nextStep()
    } else {
      toast.warning('Bitte beantworten Sie alle Pflichtfragen', 'Einige Fragen sind noch nicht beantwortet')
    }
  }

  return {
    // State
    currentAssessment,
    questions,
    answers,
    currentStep,
    totalSteps,
    isLoading: isLoading || startAssessmentMutation.isPending || loadAssessmentMutation.isPending,
    isSaving: isSaving || saveAnswerMutation.isPending,
    error,
    lastSaved,

    // Actions
    startAssessment: startAssessmentMutation.mutate,
    loadAssessment: loadAssessmentMutation.mutate,
    saveAnswer,
    saveProgress: saveProgressStore,
    nextStep: goToNextStep,
    previousStep,
    goToStep,
    submitAssessment: submitAssessmentMutation.mutate,
    getResults: getResultsMutation.mutate,
    deleteAssessment: deleteAssessmentMutation.mutate,
    duplicateAssessment: duplicateAssessmentMutation.mutate,
    resetAssessment,

    // Queries
    assessments: assessmentsQuery.data,
    isLoadingAssessments: assessmentsQuery.isLoading,

    // Mutation states
    isStarting: startAssessmentMutation.isPending,
    isLoading: loadAssessmentMutation.isPending,
    isSubmitting: submitAssessmentMutation.isPending,
    isDeleting: deleteAssessmentMutation.isPending,
    isDuplicating: duplicateAssessmentMutation.isPending,
    isGettingResults: getResultsMutation.isPending,

    // Helpers
    getProgress,
    getCurrentStepQuestions,
    isCurrentStepComplete,
    hasAnswered: (questionId: string) => !!answers[questionId],
    getAnswer: (questionId: string) => answers[questionId]?.value,
    getComment: (questionId: string) => answers[questionId]?.comment,
    canGoNext: () => currentStep < totalSteps && isCurrentStepComplete(),
    canGoPrevious: () => currentStep > 1,
    canSubmit: () => getProgress() === 100,

    // Hook factories
    useAssessmentById,
    useAssessmentResults,
    useAssessmentQuestions
  }
}