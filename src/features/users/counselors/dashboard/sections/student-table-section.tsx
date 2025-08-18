'use client'

import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'
import {
  StudentTableWrapper,
  StudentTableHeader,
  StudentTableContainer,
  StudentTableHead,
  StudentTableBody,
  StudentTableFooter,
  type StudentTableData,
} from '../student-table'

interface StudentTableSectionProps {
  students: StudentTableData[]
  isLoading?: boolean
}

export function StudentTableSection({ students, isLoading }: StudentTableSectionProps) {
  const { isWidgetEnabled } = useDashboardSettings()
  const maxRows = 5

  if (!isWidgetEnabled('student-table')) {
    return null
  }

  return (
    <StudentTableWrapper>
      <StudentTableHeader />

      <StudentTableContainer>
        <table className="min-w-full divide-y divide-gray-200">
          <StudentTableHead />
          <StudentTableBody students={students} isLoading={isLoading} maxRows={maxRows} />
        </table>

        <StudentTableFooter totalStudents={students.length} displayedStudents={maxRows} />
      </StudentTableContainer>
    </StudentTableWrapper>
  )
}
