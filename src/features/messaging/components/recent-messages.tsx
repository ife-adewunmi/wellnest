'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send } from 'lucide-react'

interface RecentMessagesProps {
  userId: string
}

export function RecentMessages({ userId }: RecentMessagesProps) {
  // Mock data - replace with actual data fetching
  const messages = [
    {
      id: 1,
      sender: 'Dr. Sarah Johnson',
      message: 'How are you feeling today? I noticed your last check-in showed some concerns.',
      time: '2 hours ago',
      unread: true,
      avatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: 2,
      sender: 'Wellness Team',
      message: 'Reminder: Your next session is scheduled for tomorrow at 2:00 PM.',
      time: '1 day ago',
      unread: false,
      avatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: 3,
      sender: 'Dr. Mike Wilson',
      message: 'Great progress in our last session! Keep up the good work.',
      time: '3 days ago',
      unread: false,
      avatar: '/placeholder.svg?height=32&width=32',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Messages
        </CardTitle>
        <CardDescription>Messages from your counselors and support team</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3 rounded-lg border p-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.avatar || '/placeholder.svg'} alt={message.sender} />
              <AvatarFallback>
                {message.sender
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{message.sender}</p>
                <div className="flex items-center gap-2">
                  {message.unread && (
                    <Badge variant="destructive" className="h-2 w-2 p-0" children={undefined} />
                  )}
                  <span className="text-muted-foreground text-xs">{message.time}</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{message.message}</p>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full bg-transparent">
          <Send className="mr-2 h-4 w-4" />
          View All Messages
        </Button>
      </CardContent>
    </Card>
  )
}
