'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared-components/ui/card'
import { Button } from '@/shared-components/ui/button'
import { Badge } from '@/shared-components/ui/badge'
import { Calendar, Clock, Video } from 'lucide-react'

interface UpcomingSessionsProps {
  userId: string
}

export function UpcomingSessions({ userId }: UpcomingSessionsProps) {
  // Mock data - replace with actual data fetching
  const sessions = [
    {
      id: 1,
      title: 'Individual Counseling',
      counselor: 'Dr. Sarah Johnson',
      date: 'Tomorrow',
      time: '2:00 PM',
      duration: '50 minutes',
      type: 'video',
      status: 'confirmed',
    },
    {
      id: 2,
      title: 'Group Therapy',
      counselor: 'Dr. Mike Wilson',
      date: 'Friday',
      time: '10:00 AM',
      duration: '90 minutes',
      type: 'in-person',
      status: 'pending',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Sessions
        </CardTitle>
        <CardDescription>Your scheduled counseling sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{session.title}</h4>
              <Badge variant={session.status === 'confirmed' ? 'default' : 'secondary'}>
                {session.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">with {session.counselor}</p>
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {session.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {session.time}
              </div>
              <div className="flex items-center gap-1">
                {session.type === 'video' ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
                {session.duration}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
              <Button size="sm">Join Session</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
