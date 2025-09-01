'use client'

import { useEffect, useState } from 'react'
import { useUserStore } from '@/features/users/state'
import {
  useInterventionsActions,
  useUpcomingSessions,
  useInterventionsLoading,
  useInterventionsError,
} from '../state/interventions'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Calendar, Clock, User, MoreHorizontal, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

interface SessionsTableProps {
  onCreateSession?: () => void
}

export function SessionsTable({ onCreateSession }: SessionsTableProps) {
  const { user } = useUserStore()
  const upcomingSessions = useUpcomingSessions()
  const isLoading = useInterventionsLoading()
  const error = useInterventionsError()
  const { fetchUpcomingSessions, updateSessionStatus, clearError } = useInterventionsActions()

  const [updatingSession, setUpdatingSession] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchUpcomingSessions(user.id)
    }
  }, [user?.id])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error])

  const handleStatusUpdate = async (sessionId: string, status: string) => {
    setUpdatingSession(sessionId)
    try {
      const success = await updateSessionStatus(sessionId, status)
      if (success) {
        toast.success('Session status updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update session status')
    } finally {
      setUpdatingSession(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'completed':
        return 'default'
      case 'cancelled':
        return 'destructive'
      case 'no_show':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading sessions...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Sessions ({upcomingSessions.length})
        </CardTitle>
        {onCreateSession && (
          <Button onClick={onCreateSession} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Session
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {upcomingSessions.length === 0 ? (
          <div className="py-8 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="mb-4 text-gray-500">No upcoming sessions scheduled</p>
            {onCreateSession && (
              <Button onClick={onCreateSession} variant="outline">
                Schedule Your First Session
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{session.title}</h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {session.studentName} ({session.studentId})
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(session.scheduledAt), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(session.scheduledAt), 'HH:mm')} ({session.duration} min)
                        </div>
                      </div>
                      {session.notes && (
                        <p className="mt-1 text-sm text-gray-600">{session.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(session.status)}>
                        {session.status.replace('_', ' ')}
                      </Badge>
                      <div className="flex gap-1">
                        {session.status === 'SCHEDULED' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(session.id, 'IN_PROGRESS')}
                              disabled={updatingSession === session.id}
                            >
                              Start
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(session.id, 'CANCELLED')}
                              disabled={updatingSession === session.id}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {session.status === 'IN_PROGRESS' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(session.id, 'COMPLETED')}
                            disabled={updatingSession === session.id}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
