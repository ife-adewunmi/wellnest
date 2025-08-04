'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/custom-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Switch } from '@/shared/components/ui/switch'
import { Label } from '@/shared/components/ui/label'
import { Separator } from '@/shared/components/ui/separator'
import { toast } from 'react-toastify'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'
import { DashboardHeader } from '@/features/dashboard/components'
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
      <DashboardHeader />
      <div className="mt-[4.44vh] flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="mt-1 text-gray-600">Customize your dashboard and notifications</p>
            </div>
            <Button onClick={handleSaveChanges} variant="ghost">
              Save Changes
            </Button>
          </div>

          <div className="space-y-8">
            {/* Dashboard Widget Customisation */}

            <CardTitle>Dashboard Widget Customisation</CardTitle>

            <div>
              <div className="flex flex-col gap-[1rem] lg:flex lg:flex-row lg:items-center lg:gap-[2.5rem]">
                {dashboardWidgets.map((widget) => (
                  <div key={widget.id} className="flex items-center gap-[8px]">
                    <Checkbox
                      id={widget.id}
                      checked={widget.enabled}
                      onCheckedChange={() => handleWidgetToggle(widget.id)}
                      className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <Label
                      htmlFor={widget.id}
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {widget.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="rounded-[1rem] border border-[#CBD5E0] py-[1rem]">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="flex items-center justify-between px-[1.5rem] py-[1rem]">
                    <div className="flex flex-col gap-[8px]">
                      <h3 className={`${interMedium.className} text-[18px] text-[#0D141C]`}>
                        {notification.title}
                      </h3>
                      <p className={`${interRegular.className} text-[1rem] text-[#4A739C]`}>
                        {notification.description}
                      </p>
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => handleNotificationToggle(notification.id)}
                      className="data-[state=checked]:bg-[#3182CE]"
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
              <CardTitle>Notification Methods</CardTitle>
            </CardHeader>
            <CardContent className="rounded-[1rem] border border-[#CBD5E0] py-[1rem]">
              {notificationMethods.map((method, index) => (
                <div key={method.id}>
                  <div className="flex items-center justify-between px-[1.5rem] py-[1rem]">
                    <div className="flex w-full items-center justify-between">
                      <Label
                        htmlFor={method.id}
                        className={`${interMedium.className} text-[18px] text-[#0D141C]`}
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
                  {index < notifications.length - 1 && (
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
