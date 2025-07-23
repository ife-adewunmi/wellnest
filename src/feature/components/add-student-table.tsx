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
import { Header } from '@/shared/components/dashboard-header'

interface Student {
  id: string
  studentId: string
  lastCheckIn: string
  riskLevel: 'High' | 'Medium' | 'Low'
  mood: string
  screenTime: string
}

export function StudentTable() {
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
        return 'py-[8px] w-[86px] text-[12px] bg-[#FED7D7B2] rounded-full'
      case 'Medium':
        return 'py-[8px] w-[86px] text-[12px] bg-[#FEFCBFB2] rounded-full'
      case 'Low':
        return 'py-[8px] w-[86px] text-[12px] bg-[#C6F6D5B2] rounded-full'
      default:
        return 'py-[8px] w-[86px] text-[12px] bg-[#FED7D7B2] rounded-full'
    }
  }

  const handleAddStudent = () => {
    console.log('Add student clicked')
    // Add your logic here
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

  return (
    <div className="pb-[7.43vh]">
      <Header />
      <div className="flex w-full justify-center pt-[4.44vh]">
        <div className="w-full max-w-[1152px]">
          {/* Header */}
          <div className="flex flex-row items-center justify-between py-[1rem]">
            <h1 className="text-[1.5rem] font-bold text-[#121417]">Students Table</h1>
            <Button
              onClick={handleAddStudent}
              className="flex cursor-pointer items-center gap-[8px] rounded-full bg-[#3182CE] px-[1.5rem] py-[10px] text-white hover:bg-[#2C5AA0]"
            >
              <Plus className="h-[18px] w-[18px]" />
              Add Student
            </Button>
          </div>

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
              className={`w-full rounded-full border-none bg-[#E2E8F0] px-[3.5rem] py-[19px] text-[18px] placeholder:text-[#A0AEC0] ${interRegular.className}`}
            />
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Select value={filterAll} onValueChange={setFilterAll}>
                <SelectTrigger className="flex items-center gap-[8px] rounded-full bg-[#EDF2F7] px-[1.25rem] py-[8px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="flex items-center gap-[8px] rounded-full bg-[#EDF2F7] px-[1.25rem] py-[8px]">
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
                <SelectTrigger className="flex items-center gap-[8px] rounded-full bg-[#EDF2F7] px-[1.25rem] py-[8px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monitored">Monitored</SelectItem>
                  <SelectItem value="Not Monitored">Not Monitored</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDepartments} onValueChange={setFilterDepartments}>
                <SelectTrigger className="flex items-center gap-[8px] rounded-full bg-[#EDF2F7] px-[1.25rem] py-[8px]">
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

            <div className="flex items-center gap-[8px]">
              <div className="flex items-center gap-[8px] rounded-full bg-[#EDF2F7] px-[1.25rem] py-[8px]">
                <CalendarIcon className="h-[24px] w-[24px] text-gray-500" />
                <span className={` ${interMedium.className} text-[0.875rem] text-[#1A202C]`}>
                  Range: June 1, 2025 - June 30, 2025
                </span>
              </div>
              <Button
                onClick={handleExport}
                className={`flex items-center gap-[8px] rounded-full border-none bg-[#EDF2F7] px-[24px] py-[8px] text-[#1A202C] ${interMedium.className}`}
              >
                <Download className="h-4 w-4" color="#1A202C" />
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-[2.5rem]">
            <div
              className={`overflow-x-auto rounded-[12px] border border-[#CBD5E0] ${showAll ? 'max-h-96 overflow-y-auto' : ''}`}
            >
              <table className="w-full rounded-[12px] border border-[#CBD5E0]">
                <thead>
                  <tr className="border-b border-[#CBD5E0]">
                    <th
                      className={`py-[12px] pl-[2rem] text-left ${interRegular.className} text-[0.875rem] text-[#121417]`}
                    >
                      Student ID
                    </th>
                    <th
                      className={`py-[12px] text-left ${interRegular.className} text-[0.875rem] text-[#121417]`}
                    >
                      Last check-in
                    </th>
                    <th
                      className={`py-[12px] text-left ${interRegular.className} pl-[11px] text-[0.875rem] text-[#121417]`}
                    >
                      Risk level
                    </th>
                    <th
                      className={`py-[12px] text-left ${interRegular.className} text-[0.875rem] text-[#121417]`}
                    >
                      Mood
                    </th>
                    <th
                      className={`py-[12px] text-left ${interRegular.className} text-[0.875rem] text-[#121417]`}
                    >
                      Screen time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedStudents.map((student) => (
                    <tr key={student.id} className="border-b border-[#CBD5E0]">
                      <td
                        className={`py-[1.625rem] pl-[2rem] ${interRegular.className} text-[0.875rem] text-[#121417]`}
                      >
                        {student.studentId}
                      </td>
                      <td
                        className={`py-[1.625rem] ${interRegular.className} text-[0.875rem] text-[#61758A]`}
                      >
                        {student.lastCheckIn}
                      </td>
                      <td className="">
                        <span
                          className={`flex justify-center ${interMedium.className} ${getRiskLevelColor(student.riskLevel)} text-[0.875rem] text-[#121417]`}
                        >
                          {student.riskLevel}
                        </span>
                      </td>
                      <td
                        className={`py-[1.625rem] ${interRegular.className} text-[0.875rem] text-[#61758A]`}
                      >
                        {student.mood}
                      </td>
                      <td
                        className={`py-[1.625rem] ${interRegular.className} text-[0.875rem] text-[#61758A]`}
                      >
                        {student.screenTime}
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
      </div>
    </div>
  )
}
