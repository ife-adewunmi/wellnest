'use client'

import { useState, useEffect } from 'react'
import { useUserStore } from '@/features/users/state'
import { useReportsActions, useAvailableStudents, useReportsLoading } from '../state/reports'
// import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { ReportFilters } from '@/users/counselors/types'
import { ReportsFilterPlaceholders } from '../enums/reports'

interface ReportsFiltersProps {
  onGenerate: (
    filters: ReportFilters & {
      gender?: string
      exportType?: string
      includeMoodHistory?: boolean
      includeScreenTime?: boolean
      includeDistressScore?: boolean
    },
  ) => void
  isGenerating?: boolean
}

export function ReportsFilters({ onGenerate, isGenerating }: ReportsFiltersProps) {
  const { user } = useUserStore()
  const availableStudents = useAvailableStudents()
  const isLoading = useReportsLoading()
  const { fetchAvailableStudents } = useReportsActions()

  const [filters, setFilters] = useState({
    startDate: (() => {
      const date = new Date()
      date.setMonth(date.getMonth() - 5) // 5 months ago to match screenshot
      return date.toISOString().split('T')[0]
    })(),
    endDate: (() => {
      const date = new Date()
      date.setMonth(date.getMonth() + 3) // 3 months ahead to match screenshot
      return date.toISOString().split('T')[0]
    })(),
    studentId: '',
    department: '',
    level: '',
    gender: '',
    exportType: '.xlsx',
    includeMoodHistory: true,
    includeScreenTime: true,
    includeDistressScore: true,
  })

  useEffect(() => {
    if (user?.id && availableStudents.length === 0) {
      fetchAvailableStudents(user.id)
    }
  }, [user?.id, availableStudents.length, fetchAvailableStudents])

  const handleFilterChange = (key: string, value: string | boolean) => {
    if (key === 'studentId' && typeof value === 'string') {
      // When a specific student is selected, auto-populate department and level
      if (value && value !== ReportsFilterPlaceholders.ALL_STUDENTS) {
        const selectedStudent = availableStudents.find((s) => s.id === value)
        if (selectedStudent) {
          setFilters((prev) => ({
            ...prev,
            [key]: value,
            department: selectedStudent.department,
            level: selectedStudent.level,
          }))
          return
        }
      } else if (value === ReportsFilterPlaceholders.ALL_STUDENTS) {
        // Reset department and level when "All students" is selected
        setFilters((prev) => ({
          ...prev,
          [key]: '',
          department: '',
          level: '',
        }))
        return
      }
    }

    // Convert placeholder values back to empty strings for the actual filter
    const actualValue =
      value === ReportsFilterPlaceholders.ALL_STUDENTS ||
      value === ReportsFilterPlaceholders.ALL_DEPARTMENTS ||
      value === ReportsFilterPlaceholders.ALL_LEVELS
        ? ''
        : value

    setFilters((prev) => ({ ...prev, [key]: actualValue }))
  }

  const handleGenerate = () => {
    onGenerate(filters)
  }

  const departments = [...new Set(availableStudents.map((s) => s.department))].filter(Boolean)
  const levels = [...new Set(availableStudents.map((s) => s.level))].filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-600">
            Generate, preview, and export individual or aggregate student well-being reports
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || isLoading || !filters.startDate || !filters.endDate}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? 'Generating Report...' : 'Download Report'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* First Row: Department, Student, Level */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={filters.department || ReportsFilterPlaceholders.ALL_DEPARTMENTS}
              onValueChange={(value) => handleFilterChange('department', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ReportsFilterPlaceholders.ALL_DEPARTMENTS}>
                  All departments
                </SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Student</Label>
            <Select
              value={filters.studentId || ReportsFilterPlaceholders.ALL_STUDENTS}
              onValueChange={(value) => handleFilterChange('studentId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ReportsFilterPlaceholders.ALL_STUDENTS}>All students</SelectItem>
                {availableStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.studentId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Level</Label>
            <Select
              value={filters.level || ReportsFilterPlaceholders.ALL_LEVELS}
              onValueChange={(value) => handleFilterChange('level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ReportsFilterPlaceholders.ALL_LEVELS}>All levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second Row: Gender, Start Date, End Date, Export Type */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              value={filters.gender || 'all'}
              onValueChange={(value) => handleFilterChange('gender', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Export Type</Label>
            <Select
              value={filters.exportType}
              onValueChange={(value) => handleFilterChange('exportType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=".xlsx">.xlsx</SelectItem>
                <SelectItem value=".csv">.csv</SelectItem>
                <SelectItem value=".pdf">.pdf</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Checkboxes for report components */}
        <div className="flex items-center gap-8">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mood-history"
              checked={filters.includeMoodHistory}
              onCheckedChange={(checked) =>
                handleFilterChange('includeMoodHistory', checked as boolean)
              }
            />
            <Label htmlFor="mood-history">Mood History</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="screen-time"
              checked={filters.includeScreenTime}
              onCheckedChange={(checked) =>
                handleFilterChange('includeScreenTime', checked as boolean)
              }
            />
            <Label htmlFor="screen-time">Screen Time</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="distress-score"
              checked={filters.includeDistressScore}
              onCheckedChange={(checked) =>
                handleFilterChange('includeDistressScore', checked as boolean)
              }
            />
            <Label htmlFor="distress-score">Distress Score</Label>
          </div>
        </div>
      </div>
    </div>
  )
}
