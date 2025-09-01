'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/features/users/state'
import {
  useInterventionsActions,
  useSessionHistory,
  useInterventionsLoading,
  useInterventionsError,
} from '../state/interventions'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Calendar, Clock, User, History } from 'lucide-react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

export function SessionHistory() {
  const { user } = useUserStore()
  const sessionHistory = useSessionHistory()
  const isLoading = useInterventionsLoading()
  const error = useInterventionsError()
  const { fetchSessionHistory, clearError } = useInterventionsActions()

  useEffect(() => {
    if (user?.id) {
      fetchSessionHistory(user.id)
    }
  }, [user?.id])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default'
      case 'cancelled':
        return 'destructive'
      case 'no_show':
        return 'destructive'
      case 'rescheduled':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading session history...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Session History ({sessionHistory.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessionHistory.length === 0 ? (
          <div className="py-8 text-center">
            <History className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">No completed sessions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessionHistory.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border p-4"
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
