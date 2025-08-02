"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoodCheckInForm } from "@/features/mood/components/mood-check-in-form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { MoodHistoryChart } from "@/features/mood/components/mood-history-chart"
import { UpcomingSessions } from "@/features/sessions/components/upcoming-sessions"
import { RecentMessages } from "@/features/messaging/components/recent-messages"
import type { User } from "@/features/auth/types"
import { fetchMoodCheckIns, fetchUpcomingSessions, fetchScreenTimeStats, fetchStudentStats } from "@/shared/service/api"
import { MoodCheckIn } from "@/shared/types/mood"
// import ScreenTimeMonitor from "@/features/screen-time/lib/screen-time-monitor"
// import { useToast } from "@/shared/hooks/use-toast"

interface StudentDashboardProps {
  user: User
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const [showMoodForm, setShowMoodForm] = useState(false)
  const [moodCheckIns, setMoodCheckIns] = useState<MoodCheckIn[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [screenTimeStats, setScreenTimeStats] = useState({
    dailyAverage: 0,
    weeklyTotal: 0,
    todayTotal: 0,
    threshold: 8 * 60 * 60 * 1000
  })
  type NextSession = {
    counselorName: string
    date: string
    type: string
  } | null

  const [studentStats, setStudentStats] = useState<{
    weeklyCheckIns: number
    totalCheckIns: number
    averageMood: string
    moodEmoji: string
    nextSession: NextSession
  }>({
    weeklyCheckIns: 0,
    totalCheckIns: 7,
    averageMood: 'Good',
    moodEmoji: '🙂',
    nextSession: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [checkIns, sessions, screenTime, stats] = await Promise.all([
          fetchMoodCheckIns(user.id),
          fetchUpcomingSessions(user.id),
          fetchScreenTimeStats(user.id),
          fetchStudentStats(user.id)
        ])
        setMoodCheckIns(checkIns.data ?? [])
        setUpcomingSessions(sessions.data)
        setScreenTimeStats(screenTime.data)
        setStudentStats(stats.data)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user.id])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Good Afternoon, {user.name}!</h1>
        <p className="text-blue-100">
          Welcome back to your portal account! You can start by using the menu dashboard to navigate the portal
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mood Check-in Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>How do you feel today?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Record your mood</p>
            <div className="flex gap-2 mb-4">
              <span className="text-2xl">😊</span>
              <span className="text-2xl">🙂</span>
              <span className="text-2xl">😐</span>
              <span className="text-2xl">😞</span>
              <span className="text-2xl">😰</span>
            </div>
            <Dialog open={showMoodForm} onOpenChange={setShowMoodForm}>
              <DialogTrigger asChild>
                <Button className="w-full">Record Mood</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <MoodCheckInForm userName={user.name} onSuccess={() => setShowMoodForm(false)} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Loading...</span>
                  <span className="font-medium">--</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Check-ins</span>
                  <span className="font-medium">{studentStats.weeklyCheckIns}/{studentStats.totalCheckIns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Mood</span>
                  <span className="font-medium">{studentStats.averageMood} {studentStats.moodEmoji}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Screen Time</span>
                  <span className="font-medium">
                    {screenTimeStats.dailyAverage > 0 
                      ? `${(screenTimeStats.dailyAverage / (60 * 60 * 1000)).toFixed(1)}h/day`
                      : 'No data'
                    }
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Next Session</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <p className="font-medium">Loading...</p>
                <p className="text-sm text-muted-foreground">--</p>
              </div>
            ) : studentStats.nextSession ? (
              <div className="space-y-2">
                <p className="font-medium">{studentStats.nextSession.counselorName}</p>
                <p className="text-sm text-muted-foreground">{studentStats.nextSession.date}</p>
                <p className="text-sm text-muted-foreground">{studentStats.nextSession.type}</p>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  View Details
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  Schedule Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MoodHistoryChart userId={user.id} />
          <UpcomingSessions userId={user.id} />
        </div>
        <div>
          <RecentMessages userId={user.id} />
        </div>
      </div>
    </div>
  )
}
