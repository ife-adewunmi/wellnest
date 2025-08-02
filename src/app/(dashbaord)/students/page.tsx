'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Filter, MoreHorizontal } from 'lucide-react'
import { fetchStudentsList } from '@/shared/service/api'

interface Student {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'at-risk'
  lastCheckIn: string
  riskLevel: 'low' | 'medium' | 'high'
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStudents() {
      setLoading(true)
      try {
        const result = await fetchStudentsList()
        setStudents(result.data as Student[])
        setFilteredStudents(result.data as Student[])
      } catch (error) {
        console.error('Error loading students:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStudents()
  }, [])

  useEffect(() => {
    let filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== 'all') {
      filtered = filtered.filter((student) => student.status === statusFilter)
    }

    setFilteredStudents(filtered)
  }, [searchTerm, statusFilter, students])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'at-risk':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage and monitor your students</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="at-risk">At Risk</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No students found matching your criteria
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <span className="text-primary font-medium">{student.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-muted-foreground text-sm">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                    <Badge className={getRiskColor(student.riskLevel)}>
                      {student.riskLevel} risk
                    </Badge>
                    <div className="text-muted-foreground text-sm">
                      Last check-in: {student.lastCheckIn}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
