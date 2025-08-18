import { RiskLevel, MoodType } from '@/shared/types/common.types'

export interface StudentTableData {
  id: string
  studentId: string
  name: string
  lastCheckIn?: Date | string
  riskLevel: RiskLevel
  currentMood?: MoodType
  screenTimeToday?: number // in minutes
  avatar?: string
  // Additional optional fields for flexibility
  email?: string
  department?: string
  faculty?: string
  level?: string
  phoneNumber?: string
  [key: string]: any // Allow additional custom fields
}

export interface StudentTableSectionProps {
  students: StudentTableData[]
  isLoading?: boolean
  onStudentClick?: (student: StudentTableData) => void
  showSearch?: boolean
  showFilters?: boolean
  showExport?: boolean
  maxRows?: number
}

export interface StudentTableHeaderProps {
  title?: string
  description?: string
  viewAllHref?: string
  showSearch?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  showFilters?: boolean
  showExport?: boolean
  onExport?: () => void
  customActions?: React.ReactNode
}

export interface StudentTableContainerProps {
  children: React.ReactNode
  className?: string
}

export interface StudentTableBodyProps {
  students: StudentTableData[]
  isLoading?: boolean
  maxRows?: number
  onStudentClick?: (student: StudentTableData) => void
  enableRowClick?: boolean
  emptyMessage?: string
}

export interface StudentTableRowProps {
  student: StudentTableData
  onClick?: (student: StudentTableData) => void
  enableClick?: boolean
}

export interface StudentTableFooterProps {
  totalStudents: number
  displayedStudents: number
  viewAllHref?: string
  onShowMore?: () => void
  showingAll?: boolean
}

export interface StudentTableFilters {
  searchTerm?: string
  riskLevel?: string
  department?: string
  sortBy?: 'name' | 'lastCheckIn' | 'riskLevel'
  sortOrder?: 'asc' | 'desc'
}
