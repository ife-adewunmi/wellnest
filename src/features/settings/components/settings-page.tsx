'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/custom-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Switch } from '@/shared/components/ui/switch'
import { Label } from '@/shared/components/ui/label'
import { toast } from 'react-toastify'
import { Header } from '@/features/users/counselors/components/header'
import { interMedium, interRegular } from '@/shared/styles/fonts'
import { DashboardWidget } from '@/features'

interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
}

interface NotificationMethod {
  id: string
  label: string
  enabled: boolean
}

export default function SettingsPage() {
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([
    { id: 'mood-tracker', label: 'Mood tracker', enabled: true },
    { id: 'screen-time', label: 'Screen time tracker', enabled: true },
    { id: 'distress-score', label: 'Overall distress score', enabled: true },
    { id: 'notification-widget', label: 'Notification widget', enabled: true },
    { id: 'upcoming-sessions', label: 'Upcoming Sessions', enabled: true },
    { id: 'student-table', label: 'Student table', enabled: true },
  ])

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'mood-drop',
      title: 'Mood Drop',
      description: "Receive notifications when a student's mood drops significantly.",
      enabled: true,
    },
    {
      id: 'risk-level',
      title: 'Risk Level Change',
      description: "Get notified when a student's risk level changes.",
      enabled: true,
    },
    {
      id: 'missed-checkin',
      title: 'Missed Check-in',
      description: 'Receive alerts for students who miss their scheduled check-ins.',
      enabled: true,
    },
  ])

  const [notificationMethods, setNotificationMethods] = useState<NotificationMethod[]>([
    { id: 'push', label: 'Push Notification', enabled: true },
    { id: 'email', label: 'Email Notification', enabled: true },
    { id: 'sms', label: 'SMS Notification', enabled: true },
  ])

  const handleWidgetToggle = (widgetId: string) => {
    setDashboardWidgets((prev) =>
      prev.map((widget) =>
        widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget,
      ),
    )
  }

  const handleNotificationToggle = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, enabled: !notification.enabled }
          : notification,
      ),
    )
  }

  const handleMethodToggle = (methodId: string) => {
    setNotificationMethods((prev) =>
      prev.map((method) =>
        method.id === methodId ? { ...method, enabled: !method.enabled } : method,
      ),
    )
  }

  const handleSaveChanges = () => {
    // Settings are automatically saved via context and localStorage
    toast.success(
      'Your dashboard preferences have been updated successfully. Changes will be visible on the dashboard.',
    )
  }

  return (
    <div className="flex flex-col">
      <Header />
      <div className="mt-4 flex flex-col items-center justify-center sm:mt-6 lg:mt-[4.44vh]">
        <div className="mx-auto w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Settings</h1>
              <p className="mt-1 text-sm text-gray-600 sm:text-base">
                Customize your dashboard and notifications
              </p>
            </div>
            <div>
              <Button onClick={handleSaveChanges} variant="ghost">
                Save Changes
              </Button>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Dashboard Widget Customisation */}

            <CardTitle>Dashboard Widget Customisation</CardTitle>

            <div>
              <div className="flex flex-col gap-4 sm:gap-6 lg:flex lg:flex-row lg:items-center lg:gap-8 xl:gap-10">
                {dashboardWidgets.map((widget) => (
                  <div key={widget.id} className="flex items-center gap-2 sm:gap-3">
                    <Checkbox
                      id={widget.id}
                      checked={widget.enabled}
                      onCheckedChange={() => handleWidgetToggle(widget.id)}
                      className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label
                      htmlFor={widget.id}
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-base"
                    >
                      {widget.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="rounded-lg border border-[#CBD5E0] py-3 sm:rounded-xl sm:py-4">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="flex items-start justify-between px-4 py-3 sm:items-center sm:px-6 sm:py-4">
                    <div className="flex flex-1 flex-col gap-1 pr-4 sm:gap-2">
                      <h3
                        className={`${interMedium.className} text-base text-[#0D141C] sm:text-lg lg:text-xl`}
                      >
                        {notification.title}
                      </h3>
                      <p
                        className={`${interRegular.className} text-sm leading-relaxed text-[#4A739C] sm:text-base`}
                      >
                        {notification.description}
                      </p>
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => handleNotificationToggle(notification.id)}
                      className="flex-shrink-0 data-[state=checked]:bg-[#3182CE]"
                    />
                  </div>
                  {index < notifications.length - 1 && (
                    <div className="h-[1px] w-full bg-[#CBD5E0]"></div>
                  )}
                </div>
              ))}
            </CardContent>

            {/* Notification Methods */}

            <CardHeader>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">Notification Methods</CardTitle>
            </CardHeader>
            <CardContent className="rounded-lg border border-[#CBD5E0] py-3 sm:rounded-xl sm:py-4">
              {notificationMethods.map((method, index) => (
                <div key={method.id}>
                  <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex w-full items-center justify-between">
                      <Label
                        htmlFor={method.id}
                        className={`${interMedium.className} text-base text-[#0D141C] sm:text-lg lg:text-xl`}
                      >
                        {method.label}
                      </Label>
                      <Switch
                        id={method.id}
                        checked={method.enabled}
                        onCheckedChange={() => handleMethodToggle(method.id)}
                        className="data-[state=checked]:bg-[#3182CE]"
                      />
                    </div>
                  </div>
                  {index < notificationMethods.length - 1 && (
                    <div className="h-[1px] w-full bg-[#CBD5E0]"></div>
                  )}
                </div>
              ))}
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  )
}
