'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, Download } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/custom-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useStudents, useStudentsLoading } from '@/users/counselors/state'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import {
  exportStudentsToCSV,
  StudentTableWrapper,
  StudentTableContainer,
  StudentTableHead,
  StudentTableBody,
} from '../common/student-table'

export function StudentsTable() {
  const router = useRouter()
  const students = useStudents()
  const isLoading = useStudentsLoading()

  // State for filters and search
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterRisk, setFilterRisk] = React.useState<string>('All')
  const [showAll, setShowAll] = React.useState(false)
  const [sortBy, setSortBy] = React.useState<'name' | 'lastCheckIn' | 'riskLevel'>('name')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc')

  // Filter students based on search and filters
  const filteredStudents = React.useMemo(() => {
    let filtered = [...students]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.currentMood?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply risk level filter
    if (filterRisk !== 'All') {
      filtered = filtered.filter((student) => {
        if (filterRisk === 'At-Risk') {
          return student.riskLevel === 'HIGH' || student.riskLevel === 'CRITICAL'
        }
        return student.riskLevel === filterRisk.toUpperCase()
      })
    }

    // Sort students
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '')
          break
        case 'lastCheckIn':
          const dateA = a.lastCheckIn ? new Date(a.lastCheckIn).getTime() : 0
          const dateB = b.lastCheckIn ? new Date(b.lastCheckIn).getTime() : 0
          comparison = dateA - dateB
          break
        case 'riskLevel':
          const riskOrder: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
          comparison =
            (riskOrder[a.riskLevel || 'LOW'] || 0) - (riskOrder[b.riskLevel || 'LOW'] || 0)
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [students, searchTerm, filterRisk, sortBy, sortOrder])

  // Display students (paginated or all)
  const displayedStudents = showAll ? filteredStudents : filteredStudents.slice(0, 10)

  // Handle export
  const handleExport = () => {
    exportStudentsToCSV(filteredStudents)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by name, ID, or mood..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-full border-gray-200 bg-gray-50 py-3 pr-4 pl-12 text-base focus:bg-white"
        />
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Level Filter */}
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-[120px] rounded-full bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Risks</SelectItem>
              <SelectItem value="At-Risk">At-Risk</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Options */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[140px] rounded-full bg-gray-50">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="lastCheckIn">Last Check-in</SelectItem>
              <SelectItem value="riskLevel">Risk Level</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="rounded-full"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-2 rounded-full"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {displayedStudents.length} of {filteredStudents.length} students
      </div>

      {/* Table */}
      <StudentTableWrapper>
        <StudentTableContainer>
          <table className="min-w-full divide-y divide-gray-200">
            <StudentTableHead />
            <StudentTableBody students={displayedStudents} isLoading={isLoading} />
          </table>
        </StudentTableContainer>
      </StudentTableWrapper>

      {/* No Results */}
      {filteredStudents.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          <p>No students found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
