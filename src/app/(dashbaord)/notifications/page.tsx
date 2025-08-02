"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchNotifications } from "@/shared/service/api"

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
        const result = await fetchNotifications("counselor")
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
            <div className="text-center py-8">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You have no notifications
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.date}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="text-xs font-semibold text-primary">
                      New
                    </span>
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

