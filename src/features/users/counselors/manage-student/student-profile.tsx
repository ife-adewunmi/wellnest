'use client'

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { formatDistanceToNow } from 'date-fns'
import { getRiskLevelColor, getMoodEmoji, formatScreenTime } from '../common/student-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Phone, Mail, GraduationCap, Calendar, AlertCircle, Clock } from 'lucide-react'

// Import chart components
import { MoodHistoryChart } from '@/features/users/counselors/dashboard/analysis/mood-history-widget'
import { ScreenTimeWidget } from '@/features/users/counselors/dashboard/activity/screen-time-widget'
import { UpcomingSessions } from './upcoming-sessions'
import { navigateTo } from '@/shared/state/navigation'
import { Endpoints } from '@/shared/enums/endpoints'
// Store imports removed - now using prop data
import { CounselorNotes } from '@/features/notes/components/councilor-note'
import { SocialMedia } from '@/features/social-media/components'
import { StudentDetail } from '@/features/users/counselors/types/student.types'
import { RiskLevel, MoodType } from '@/shared/types/common.types'

interface EnhancedStudentProfileProps {
  student?: StudentDetail | null
  onBack?: () => void
  onRefresh?: () => void
  isRefreshing?: boolean
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'academic', label: 'Academic' },
  { id: 'sessions', label: 'Sessions' },
] as const

type TabId = (typeof tabs)[number]['id']

export const EnhancedStudentProfile = ({
  student,
  onBack,
  onRefresh,
  isRefreshing = false,
}: EnhancedStudentProfileProps) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigateTo(router, Endpoints.COUNSELORS.MANAGE_STUDENT)
    }
  }

  // No student data - This should be handled by the container
  if (!student) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-500">No student data available</p>
          <div className="space-x-2">
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" disabled={isRefreshing}>
                {isRefreshing ? <LoadingSpinner size="small" /> : 'Try Again'}
              </Button>
            )}
            <Button onClick={handleBack} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
      <div className="bg-white">
        {/* Error banner handled by container */}

        {/* Header Section with Student Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Left side - Avatar and Basic Info */}
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="flex-shrink-0">
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name || 'Student'}
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar size={128} type="user" />
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {student.name || `${student.firstName} ${student.lastName}`}
                    </h1>
                    <p className="text-sm text-gray-500">{student.studentId}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={getRiskLevelColor(student.riskLevel || ('LOW' as RiskLevel))}>
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Risk: {student.riskLevel || 'Low'}
                    </Badge>

                    <Badge variant="outline">
                      <span className="mr-1">
                        {getMoodEmoji((student.currentMood as MoodType) || ('NEUTRAL' as MoodType))}
                      </span>
                      {student.currentMood || 'Neutral'}
                    </Badge>

                    {student.screenTimeToday !== undefined && student.screenTimeToday !== null && (
                      <Badge variant="outline">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatScreenTime(student.screenTimeToday)}
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-gray-600">
                    Last check-in:{' '}
                    {student.lastCheckIn
                      ? formatDistanceToNow(new Date(student.lastCheckIn), { addSuffix: true })
                      : 'Never'}
                  </div>
                </div>
              </div>

              {/* Right side - Contact Info */}
              <div className="space-y-2 text-sm">
                {student.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{student.email}</span>
                  </div>
                )}
                {student.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{student.phoneNumber}</span>
                  </div>
                )}
                {student.department && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span>{student.department}</span>
                  </div>
                )}
                {student.level && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Level {student.level}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="mb-6 flex space-x-1 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-sm">{student.gender || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Faculty</label>
                  <p className="text-sm">{student.faculty || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Admission Year</label>
                  <p className="text-sm">{student.admissionYear || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nationality</label>
                  <p className="text-sm">{student.nationality || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">State of Origin</label>
                  <p className="text-sm">{student.stateOfOrigin || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Home Address</label>
                  <p className="text-sm">{student.homeAddress || 'Not specified'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            {student.emergencyContact && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-sm">{student.emergencyContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Relationship</label>
                    <p className="text-sm">{student.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm">{student.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm">{student.emergencyContact.email || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Session Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{student.totalSessions || 0}</p>
                    <p className="text-sm text-gray-500">Total Sessions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {student.upcomingSessions || 0}
                    </p>
                    <p className="text-sm text-gray-500">Upcoming</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{student.riskScore || 0}</p>
                    <p className="text-sm text-gray-500">Risk Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {student.hasActiveCounselor ? 'Yes' : 'No'}
                    </p>
                    <p className="text-sm text-gray-500">Active Counselor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'wellness' && (
          <div className="space-y-6">
            {/* Mood History Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mood History</CardTitle>
                <CardDescription>Track mood patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <MoodHistoryChart />
              </CardContent>
            </Card>

            {/* Screen Time Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Screen Time Analysis</CardTitle>
                <CardDescription>Daily screen time patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ScreenTimeWidget />
              </CardContent>
            </Card>

            {/* Social Media Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Media Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <SocialMedia />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'academic' && (
          <div className="space-y-6">
            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Academic Details</CardTitle>
              </CardHeader>
              <CardContent>
                {student.academicInfo ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">GPA</label>
                      <p className="text-sm">{student.academicInfo.gpa || 'Not available'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Academic Standing</label>
                      <p className="text-sm">
                        {student.academicInfo.academicStanding || 'Not available'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Current Courses</label>
                      <p className="text-sm">
                        {student.academicInfo.currentCourses?.join(', ') || 'Not available'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No academic information available</p>
                )}
              </CardContent>
            </Card>

            {/* Counselor Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Counselor Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <CounselorNotes />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
                <CardDescription>Scheduled counseling sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingSessions />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Button onClick={handleBack} variant="outline">
            Back to Students
          </Button>

          <div className="flex gap-2">
            {/* <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="small" /> : 'Refresh Data'}
            </Button> */}
            <Button onClick={() => router.push(`/messages?studentId=${student.id}`)}>
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
