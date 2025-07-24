import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AssessmentState, Assessment, AssessmentQuestion, AssessmentAnswer, AssessmentResults } from '@/types/assessment.types'
import { apiClient } from '@/lib/api'

interface AssessmentStore extends AssessmentState {
  // Actions
  startAssessment: (type: 'READINESS' | 'MATURITY' | 'CUSTOM') => Promise<void>
  loadAssessment: (id: string) => Promise<void>
  saveAnswer: (questionId: string, value: any, comment?: string) => Promise<void>
  saveProgress: () => Promise<void>
  nextStep: () => void
  previousStep: () => void
  goToStep: (step: number) => void
  submitAssessment: () => Promise<void>
  getResults: (assessmentId: string) => Promise<AssessmentResults>
  loadQuestions: () => Promise<void>
  resetAssessment: () => void
  setCurrentAssessment: (assessment: Assessment | null) => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setError: (error: string | null) => void
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      // Initial State
      currentAssessment: null,
      questions: [],
      answers: {},
      currentStep: 1,
      totalSteps: 4,
      isLoading: false,
      isSaving: false,
      error: null,
      lastSaved: null,

      // Actions
      startAssessment: async (type) => {
        try {
          set({ isLoading: true, error: null })

          const response = await apiClient.post('/assessments', { type })
          const assessment = response.data

          // Load questions for this assessment type
          const questionsResponse = await apiClient.get(`/assessments/${assessment.id}/questions`)
          const questions = questionsResponse.data

          set({
            currentAssessment: assessment,
            questions,
            answers: {},
            currentStep: 1,
            totalSteps: Math.max(...questions.map((q: AssessmentQuestion) => q.step)),
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Assessment konnte nicht gestartet werden'
          })
          throw error
        }
      },

      loadAssessment: async (id) => {
        try {
          set({ isLoading: true, error: null })

          const [assessmentResponse, questionsResponse] = await Promise.all([
            apiClient.get(`/assessments/${id}`),
            apiClient.get(`/assessments/${id}/questions`)
          ])

          const assessment = assessmentResponse.data
          const questions = questionsResponse.data

          // Convert answers array to object for easier access
          const answersMap = assessment.answers.reduce((acc: Record<string, AssessmentAnswer>, answer: AssessmentAnswer) => {
            acc[answer.questionId] = answer
            return acc
          }, {})

          // Calculate current step based on answered questions
          const answeredQuestions = Object.keys(answersMap).length
          const totalQuestions = questions.length
          const stepsWithAnswers = questions
            .filter((q: AssessmentQuestion) => answersMap[q.id])
            .map((q: AssessmentQuestion) => q.step)
          const currentStep = stepsWithAnswers.length > 0 ? Math.max(...stepsWithAnswers) : 1

          set({
            currentAssessment: assessment,
            questions,
            answers: answersMap,
            currentStep,
            totalSteps: Math.max(...questions.map((q: AssessmentQuestion) => q.step)),
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Assessment konnte nicht geladen werden'
          })
          throw error
        }
      },

      saveAnswer: async (questionId, value, comment) => {
        const state = get()
        if (!state.currentAssessment) return

        try {
          set({ isSaving: true, error: null })

          const answer: AssessmentAnswer = {
            questionId,
            value,
            comment,
            answeredAt: new Date().toISOString()
          }

          // Optimistic update
          set({
            answers: {
              ...state.answers,
              [questionId]: answer
            }
          })

          // Save to server
          await apiClient.post(`/assessments/${state.currentAssessment.id}/answers`, answer)

          set({
            isSaving: false,
            lastSaved: new Date(),
            error: null
          })
        } catch (error: any) {
          set({
            isSaving: false,
            error: error.message || 'Antwort konnte nicht gespeichert werden'
          })
          throw error
        }
      },

      saveProgress: async () => {
        const state = get()
        if (!state.currentAssessment) return

        try {
          set({ isSaving: true, error: null })

          const progress = Object.keys(state.answers).length / state.questions.length * 100

          await apiClient.patch(`/assessments/${state.currentAssessment.id}`, {
            progress,
            answers: Object.values(state.answers)
          })

          set({
            currentAssessment: {
              ...state.currentAssessment,
              progress
            },
            isSaving: false,
            lastSaved: new Date(),
            error: null
          })
        } catch (error: any) {
          set({
            isSaving: false,
            error: error.message || 'Fortschritt konnte nicht gespeichert werden'
          })
          throw error
        }
      },

      nextStep: () => {
        const state = get()
        if (state.currentStep < state.totalSteps) {
          set({ currentStep: state.currentStep + 1 })
          // Auto-save progress
          state.saveProgress()
        }
      },

      previousStep: () => {
        const state = get()
        if (state.currentStep > 1) {
          set({ currentStep: state.currentStep - 1 })
        }
      },

      goToStep: (step) => {
        const state = get()
        if (step >= 1 && step <= state.totalSteps) {
          set({ currentStep: step })
        }
      },

      submitAssessment: async () => {
        const state = get()
        if (!state.currentAssessment) return

        try {
          set({ isLoading: true, error: null })

          // Final save before submission
          await state.saveProgress()

          // Submit assessment
          const response = await apiClient.post(`/assessments/${state.currentAssessment.id}/submit`)
          const completedAssessment = response.data

          set({
            currentAssessment: completedAssessment,
            isLoading: false,
            error: null
          })

          return completedAssessment
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Assessment konnte nicht abgeschlossen werden'
          })
          throw error
        }
      },

      getResults: async (assessmentId) => {
        try {
          set({ isLoading: true, error: null })

          const response = await apiClient.get(`/assessments/${assessmentId}/results`)
          const results = response.data

          set({
            isLoading: false,
            error: null
          })

          return results
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Ergebnisse konnten nicht geladen werden'
          })
          throw error
        }
      },

      loadQuestions: async () => {
        const state = get()
        if (!state.currentAssessment) return

        try {
          set({ isLoading: true, error: null })

          const response = await apiClient.get(`/assessments/${state.currentAssessment.id}/questions`)
          const questions = response.data

          set({
            questions,
            totalSteps: Math.max(...questions.map((q: AssessmentQuestion) => q.step)),
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Fragen konnten nicht geladen werden'
          })
          throw error
        }
      },

      resetAssessment: () => {
        set({
          currentAssessment: null,
          questions: [],
          answers: {},
          currentStep: 1,
          totalSteps: 4,
          isLoading: false,
          isSaving: false,
          error: null,
          lastSaved: null
        })
      },

      // Utility actions
      setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),
      setLoading: (isLoading) => set({ isLoading }),
      setSaving: (isSaving) => set({ isSaving }),
      setError: (error) => set({ error })
    }),
    {
      name: 'assessment-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentAssessment: state.currentAssessment,
        answers: state.answers,
        currentStep: state.currentStep,
        lastSaved: state.lastSaved
      })
    }
  )
)