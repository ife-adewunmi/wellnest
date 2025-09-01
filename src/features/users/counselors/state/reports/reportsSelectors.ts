import { useCallback } from 'react'
import { ReportsState, useReportsStore } from './reportsStore'

// Data selectors - using useCallback to prevent infinite re-renders
export const useAvailableStudents = () =>
  useReportsStore(useCallback((state: ReportsState) => state.availableStudents, []))

export const useStudentReport = () =>
  useReportsStore(useCallback((state: ReportsState) => state.studentReport, []))

export const useStudentsReports = () =>
  useReportsStore(useCallback((state: ReportsState) => state.studentsReports, []))

// Status selectors
export const useReportsLoading = () =>
  useReportsStore(useCallback((state: ReportsState) => state.isLoading, []))

export const useReportsGenerating = () =>
  useReportsStore(useCallback((state: ReportsState) => state.isGenerating, []))

export const useReportsError = () =>
  useReportsStore(useCallback((state: ReportsState) => state.error, []))

export const useReportsLastFetched = () =>
  useReportsStore(useCallback((state: ReportsState) => state.lastFetched, []))

// Action selectors - create a stable selector function outside component
const actionsSelector = (state: ReportsState) => state

export const useReportsActions = () => {
  const store = useReportsStore(actionsSelector)
  return useCallback(
    () => ({
      fetchAvailableStudents: store.fetchAvailableStudents,
      generateStudentReport: store.generateStudentReport,
      generateStudentsSummaryReport: store.generateStudentsSummaryReport,
      exportReport: store.exportReport,
      clearError: store.clearError,
      reset: store.reset,
    }),
    [store],
  )()
}
