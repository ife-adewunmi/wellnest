'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared-components/ui/card'
import { Button } from '@/shared-components/ui/button'
import { Badge } from '@/shared-components/ui/badge'
import { Calendar, Clock, User, Plus } from 'lucide-react'
import { fetchUpcomingSessions } from '@/shared/service/api'

interface Session {
  id: string
  counselorName: string
  date: string
  time: string
  type: 'individual' | 'group'
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

export default function StudentSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSessions() {
      setLoading(true)
      try {
        const result = await fetchUpcomingSessions('student')
        setSessions(result.data as Session[])
      } catch (error) {
        console.error('Error loading sessions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSessions()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'individual':
        return 'bg-blue-100 text-blue-800'
      case 'group':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const upcomingSessions = sessions.filter((s) => s.status === 'scheduled')
  const pastSessions = sessions.filter((s) => s.status === 'completed')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sessions</h1>
          <p className="text-muted-foreground">View your counseling sessions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Request Session
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Upcoming</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{upcomingSessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{pastSessions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Total Sessions</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading sessions...</div>
          ) : upcomingSessions.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No upcoming sessions scheduled
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <User className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{session.counselorName}</h3>
                      <p className="text-muted-foreground text-sm">
                        {session.date} at {session.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getTypeColor(session.type)}>{session.type}</Badge>
                    <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                    <Button variant="outline" size="sm">
                      Join Session
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Past Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {pastSessions.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">No past sessions</div>
          ) : (
            <div className="space-y-4">
              {pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <User className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{session.counselorName}</h3>
                      <p className="text-muted-foreground text-sm">
                        {session.date} at {session.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getTypeColor(session.type)}>{session.type}</Badge>
                    <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                    <Button variant="outline" size="sm">
                      View Notes
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
