"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/custom-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/shared/components/ui/label"
import { Separator } from "@/shared/components/ui/seperator"
import { toast } from "react-toastify"
import { DashboardHeader } from "@/features/dashboard/components"
import { interMedium, interRegular } from "@/shared/styles/fonts"

interface DashboardWidget {
  id: string
  label: string
  enabled: boolean
}

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
    { id: "mood-tracker", label: "Mood tracker", enabled: true },
    { id: "screen-time", label: "Screen time tracker", enabled: true },
    { id: "distress-score", label: "Overall distress score", enabled: true },
    { id: "notification-widget", label: "Notification widget", enabled: true },
    { id: "upcoming-sessions", label: "Upcoming Sessions", enabled: true },
    { id: "student-table", label: "Student table", enabled: true },
  ])

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "mood-drop",
      title: "Mood Drop",
      description: "Receive notifications when a student's mood drops significantly.",
      enabled: true,
    },
    {
      id: "risk-level",
      title: "Risk Level Change",
      description: "Get notified when a student's risk level changes.",
      enabled: true,
    },
    {
      id: "missed-checkin",
      title: "Missed Check-in",
      description: "Receive alerts for students who miss their scheduled check-ins.",
      enabled: true,
    },
  ])

  const [notificationMethods, setNotificationMethods] = useState<NotificationMethod[]>([
    { id: "push", label: "Push Notification", enabled: true },
    { id: "email", label: "Email Notification", enabled: true },
    { id: "sms", label: "SMS Notification", enabled: true },
  ])

  const handleWidgetToggle = (widgetId: string) => {
    setDashboardWidgets((prev) =>
      prev.map((widget) => (widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget)),
    )
  }

  const handleNotificationToggle = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, enabled: !notification.enabled } : notification,
      ),
    )
  }

  const handleMethodToggle = (methodId: string) => {
    setNotificationMethods((prev) =>
      prev.map((method) => (method.id === methodId ? { ...method, enabled: !method.enabled } : method)),
    )
  }

  const handleSaveChanges = () => {
    // Simulate saving changes
    toast.success("Your preferences have been updated successfully.")
  }

  return (
     <div className="flex flex-col">
            <DashboardHeader />
            <div className="flex justify-center flex-col items-center mt-[4.44vh]">
       <div className="w-full max-w-[1152px]  min-w-[320px] lg:min-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 ">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Customize your dashboard and notifications</p>
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
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor={widget.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {widget.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          

          {/* Notifications */}
            <CardHeader>
              <CardTitle >Notifications</CardTitle>
            </CardHeader>
            <CardContent className="border border-[#CBD5E0] rounded-[1rem] py-[1rem] ">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="flex items-center justify-between py-[1rem] px-[1.5rem]">
                    <div className="flex flex-col gap-[8px]">
                      <h3 className={`${interMedium.className} text-[18px] text-[#0D141C]`}>{notification.title}</h3>
                      <p className={`${interRegular.className} text-[1rem] text-[#4A739C]`}>{notification.description}</p>
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => handleNotificationToggle(notification.id)}
                      className="data-[state=checked]:bg-[#3182CE]"
                    />
                  </div>
                  {index < notifications.length - 1 && <div className="w-full h-[1px] bg-[#CBD5E0]"></div>}
                  
                </div>
              ))}
            </CardContent>
         

          {/* Notification Methods */}
         
            <CardHeader>
              <CardTitle >Notification Methods</CardTitle>
            </CardHeader>
            <CardContent className="border border-[#CBD5E0] rounded-[1rem] py-[1rem] ">

              {notificationMethods.map((method, index) => (
                <div key={method.id}>
                 <div className="flex items-center justify-between py-[1rem] px-[1.5rem]">

                  <div className="flex items-center w-full justify-between">
                    <Label htmlFor={method.id} className={`${interMedium.className} text-[18px] text-[#0D141C]`}>
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
                                  {index < notifications.length - 1 && <div className="w-full h-[1px] bg-[#CBD5E0]"></div>}

                </div>
              ))}
            </CardContent>
     
        </div>
      </div>
    </div>
    </div>
  )
}