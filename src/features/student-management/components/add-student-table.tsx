'use client'

import * as React from 'react'
import { Search, Plus, Download, CalendarIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui/custom-button'
import { Input } from '@/shared/components/ui/custom-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { interMedium, interRegular } from '@/shared/styles/fonts'
import { Header } from '@/features/users/counselors/components/header'
import { useViewContext } from '@/context/view-context'
import { Profile } from './student-profile'

interface Student {
  id: string
  studentId: string
  lastCheckIn: string
  riskLevel: 'High' | 'Medium' | 'Low'
  mood: string
  screenTime: string
}

export function StudentTable() {
  const { currentView, setCurrentView } = useViewContext()
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null)

  const allStudents: Student[] = [
    {
      id: '1',
      studentId: 'CSC/20/19283',
      lastCheckIn: '1 week',
      riskLevel: 'High',
      mood: 'Happy',
      screenTime: '2 hours',
    },
    {
      id: '2',
      studentId: 'BOT/21/7547',
      lastCheckIn: '2 days',
      riskLevel: 'Medium',
      mood: 'Neutral',
      screenTime: '4 hours',
    },
    {
      id: '3',
      studentId: 'MCB/25/17293',
      lastCheckIn: '3 weeks',
      riskLevel: 'High',
      mood: 'Sad',
      screenTime: '1 hour',
    },
    {
      id: '4',
      studentId: 'BCH/20/92822',
      lastCheckIn: 'Yesterday',
      riskLevel: 'Medium',
      mood: 'Angry',
      screenTime: '5 hours',
    },
    {
      id: '5',
      studentId: 'APH/20/8222',
      lastCheckIn: '1 hour',
      riskLevel: 'Low',
      mood: 'Neutral',
      screenTime: '3 hours',
    },
    {
      id: '6',
      studentId: 'EEE/24/87932',
      lastCheckIn: '30 minutes',
      riskLevel: 'Low',
      mood: 'Happy',
      screenTime: '2 hours',
    },
    {
      id: '7',
      studentId: 'PHY/22/45678',
      lastCheckIn: '2 hours',
      riskLevel: 'Medium',
      mood: 'Worried',
      screenTime: '6 hours',
    },
    {
      id: '8',
      studentId: 'CHE/21/98765',
      lastCheckIn: '4 days',
      riskLevel: 'High',
      mood: 'Depressed',
      screenTime: '8 hours',
    },
    {
      id: '9',
      studentId: 'BIO/23/11223',
      lastCheckIn: '6 hours',
      riskLevel: 'Low',
      mood: 'Content',
      screenTime: '1.5 hours',
    },
    {
      id: '10',
      studentId: 'MAT/22/33445',
      lastCheckIn: '3 hours',
      riskLevel: 'Medium',
      mood: 'Happy',
      screenTime: '2.5 hours',
    },
    {
      id: '11',
      studentId: 'ENG/21/55667',
      lastCheckIn: '5 days',
      riskLevel: 'High',
      mood: 'Stressed',
      screenTime: '7 hours',
    },
    {
      id: '12',
      studentId: 'HIS/23/77889',
      lastCheckIn: '1 day',
      riskLevel: 'Low',
      mood: 'Calm',
      screenTime: '1 hour',
    },
    {
      id: '13',
      studentId: 'GEO/24/99001',
      lastCheckIn: '2 weeks',
      riskLevel: 'High',
      mood: 'Anxious',
      screenTime: '9 hours',
    },
    {
      id: '14',
      studentId: 'ART/22/11223',
      lastCheckIn: '4 hours',
      riskLevel: 'Medium',
      mood: 'Creative',
      screenTime: '3 hours',
    },
    {
      id: '15',
      studentId: 'MUS/21/44556',
      lastCheckIn: '6 hours',
      riskLevel: 'Low',
      mood: 'Joyful',
      screenTime: '2 hours',
    },
  ]

  const [showAll, setShowAll] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterAll, setFilterAll] = React.useState('All')
  const [filterRisk, setFilterRisk] = React.useState('At-Risk')
  const [filterMonitored, setFilterMonitored] = React.useState('Monitored')
  const [filterDepartments, setFilterDepartments] = React.useState('All departments')

  // Filter students based on search term
  const filteredStudents = allStudents.filter(
    (student) =>
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.riskLevel.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Show first 10 items by default, all items when showAll is true
  const displayedStudents = showAll ? filteredStudents : filteredStudents.slice(0, 10)

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'py-1 sm:py-2 w-16 sm:w-20 lg:w-[86px] text-xs sm:text-sm bg-[#FED7D7B2] rounded-full'
      case 'Medium':
        return 'py-1 sm:py-2 w-16 sm:w-20 lg:w-[86px] text-xs sm:text-sm bg-[#FEFCBFB2] rounded-full'
      case 'Low':
        return 'py-1 sm:py-2 w-16 sm:w-20 lg:w-[86px] text-xs sm:text-sm bg-[#C6F6D5B2] rounded-full'
      default:
        return 'py-1 sm:py-2 w-16 sm:w-20 lg:w-[86px] text-xs sm:text-sm bg-[#FED7D7B2] rounded-full'
    }
  }

  const handleAddStudent = () => {
    console.log('Add student clicked')
    // Add your logic here
  }

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student)
    setCurrentView('profile')
  }

  const handleExport = () => {
    // Prepare the data for export
    const dataToExport = filteredStudents.map((student) => ({
      'Student ID': student.studentId,
      'Last Check-in': student.lastCheckIn,
      'Risk Level': student.riskLevel,
      Mood: student.mood,
      'Screen Time': student.screenTime,
    }))

    // Convert to CSV format
    const headers = Object.keys(dataToExport[0])
    const csvContent = [
      headers.join(','), // Header row
      ...dataToExport.map((row) =>
        headers.map((header) => `"${row[header as keyof typeof row]}"`).join(','),
      ),
    ].join('\n')

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `students-data-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const renderStudentsTable = () => (
    <div className="mx-auto mt-[4rem] w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
      {/* Header */}

      {/* Search Input */}
      <div className="relative mt-[2.3125rem] mb-[2rem]">
        {/* Search icon */}
        <Search className="absolute top-1/2 left-[28px] h-[18px] w-[18px] -translate-y-1/2 transform text-gray-400" />

        {/* Input */}
        <Input
          type="text"
          placeholder="Search students"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full rounded-full border-none bg-[#E2E8F0] px-[3.5rem] py-[14px] text-[18px] placeholder:text-[#A0AEC0] lg:py-[19px] ${interRegular.className}`}
        />
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col items-center justify-between gap-[1rem] lg:flex-row lg:gap-0">
        <div className="flex flex-wrap items-center gap-[8px]">
          <Select value={filterAll} onValueChange={setFilterAll}>
            <SelectTrigger
              className={`${interMedium.className} flex h-auto w-[80px] items-center justify-between rounded-full border-none bg-[#EDF2F7] px-[1.25rem] py-[8px] text-[13px] whitespace-nowrap`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger
              className={`${interMedium.className} flex h-auto w-[90px] items-center justify-between rounded-full border-none bg-[#EDF2F7] px-[1.25rem] py-[8px] text-[13px] whitespace-nowrap`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="At-Risk">At-Risk</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterMonitored} onValueChange={setFilterMonitored}>
            <SelectTrigger
              className={`${interMedium.className} flex h-auto w-[110px] items-center justify-between rounded-full border-none bg-[#EDF2F7] px-[1.25rem] py-[8px] text-[13px] whitespace-nowrap`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monitored">Monitored</SelectItem>
              <SelectItem value="Not Monitored">Not Monitored</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDepartments} onValueChange={setFilterDepartments}>
            <SelectTrigger
              className={`${interMedium.className} flex h-auto w-[140px] items-center justify-between rounded-full border-none bg-[#EDF2F7] px-[1.25rem] py-[8px] text-[13px] whitespace-nowrap`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All departments">All departments</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-[8px]">
          <div className="flex items-center gap-[8px] rounded-full bg-[#EDF2F7] px-[1.25rem] py-[8px]">
            <CalendarIcon className="h-[24px] w-[24px] text-gray-500" />
            <span className={`${interMedium.className} text-[0.875rem] text-[#1A202C]`}>
              Range: June 1, 2025 - June 30, 2025
            </span>
          </div>
          <Button
            onClick={handleExport}
            className={`flex items-center gap-[8px] rounded-full border-none bg-[#EDF2F7] px-[24px] py-[8px] text-[#1A202C] hover:bg-[#E2E8F0] ${interMedium.className}`}
          >
            <Download className="h-4 w-4" color="#1A202C" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-[2.5rem]">
        <div
          className={`overflow-x-auto rounded-lg border border-[#CBD5E0] sm:rounded-xl ${showAll ? 'max-h-64 overflow-y-auto sm:max-h-80 lg:max-h-96' : ''}`}
        >
          <table className="w-full min-w-[640px] rounded-lg border border-[#CBD5E0] sm:rounded-xl">
            <thead>
              <tr className="border-b border-[#CBD5E0] bg-gray-50">
                <th
                  className={`py-2 pl-4 text-left sm:py-3 sm:pl-6 lg:py-[12px] lg:pl-8 ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                >
                  Student ID
                </th>
                <th
                  className={`px-2 py-2 text-left sm:px-3 sm:py-3 lg:py-[12px] ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                >
                  Last check-in
                </th>
                <th
                  className={`px-2 py-2 text-left sm:px-3 sm:py-3 lg:py-[12px] ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                >
                  Risk level
                </th>
                <th
                  className={`px-2 py-2 text-left sm:px-3 sm:py-3 lg:py-[12px] ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                >
                  Mood
                </th>
                <th
                  className={`px-2 py-2 pr-4 text-left sm:px-3 sm:py-3 sm:pr-6 lg:py-[12px] lg:pr-8 ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                >
                  Screen time
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className={`cursor-pointer border-b border-[#CBD5E0] transition-colors hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                  onClick={() => handleStudentClick(student)}
                >
                  <td
                    className={`py-3 pl-4 sm:py-4 sm:pl-6 lg:py-[1.625rem] lg:pl-8 ${interRegular.className} text-xs font-medium text-[#121417] sm:text-sm lg:text-[0.875rem]`}
                  >
                    {student.studentId}
                  </td>
                  <td
                    className={`px-2 py-3 sm:px-3 sm:py-4 lg:py-[1.625rem] ${interRegular.className} text-xs text-[#61758A] sm:text-sm lg:text-[0.875rem]`}
                  >
                    {student.lastCheckIn}
                  </td>
                  <td className="px-2 py-3 sm:px-3 sm:py-4 lg:py-[1.625rem]">
                    <span
                      className={`flex justify-center ${interMedium.className} ${getRiskLevelColor(student.riskLevel)} text-xs text-[#121417] sm:text-sm`}
                    >
                      {student.riskLevel}
                    </span>
                  </td>
                  <td
                    className={`px-2 py-3 sm:px-3 sm:py-4 lg:py-[1.625rem] ${interRegular.className} text-xs text-[#61758A] sm:text-sm lg:text-[0.875rem]`}
                  >
                    {student.mood}
                  </td>
                  <td
                    className={`px-2 py-3 pr-4 sm:px-3 sm:py-4 sm:pr-6 lg:py-[1.625rem] lg:pr-8 ${interRegular.className} text-xs text-[#61758A] sm:text-sm lg:text-[0.875rem]`}
                  >
                    {student.screenTime}
                  </td>
                  <td className="px-2 py-3 pr-4 sm:px-3 sm:py-4 sm:pr-6 lg:py-[1.625rem] lg:pr-8">
                    <Button variant="destructive" onClick={() => handleViewDetails(student.id)}>
                      View details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show More/Less Button */}
      {/* {filteredStudents.length > 10 && (
        <div className="flex justify-center ">
          <Button
            variant="ghost"
            className="font-medium text-[#4A5568] text-[14px]"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : `View all (${filteredStudents.length})`}
          </Button>
        </div>
      )} */}
    </div>
  )

  return (
    <div>
      <Header />
      <div className="flex w-full justify-center pt-[4.44vh]">
        {/* Conditionally render based on currentView */}
        {currentView === 'students' ? renderStudentsTable() : <Profile student={selectedStudent} />}
      </div>
    </div>
  )
}
