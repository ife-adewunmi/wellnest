'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared-components/ui/card'
import { fetchNotifications } from '@/shared/service/api'

interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true)
      try {
        const result = await fetchNotifications('counselor')
        setNotifications(result.data as Notification[])
      } catch (error) {
        console.error('Error loading notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">All your recent notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">You have no notifications</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-muted-foreground text-sm">{notification.message}</p>
                    <p className="text-muted-foreground mt-1 text-xs">{notification.date}</p>
                  </div>
                  {!notification.read && (
                    <span className="text-primary text-xs font-semibold">New</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
