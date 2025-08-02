"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface DashboardWidget {
  id: string
  label: string
  enabled: boolean
}

interface DashboardSettingsContextType {
  dashboardWidgets: DashboardWidget[]
  setDashboardWidgets: React.Dispatch<React.SetStateAction<DashboardWidget[]>>
  isWidgetEnabled: (widgetId: string) => boolean
  toggleWidget: (widgetId: string) => void
}

const DashboardSettingsContext = createContext<DashboardSettingsContextType | undefined>(undefined)

const STORAGE_KEY = 'dashboard-widget-settings'

const defaultWidgets: DashboardWidget[] = [
  { id: "mood-tracker", label: "Mood tracker", enabled: true },
  { id: "screen-time", label: "Screen time tracker", enabled: true },
  { id: "distress-score", label: "Overall distress score", enabled: true },
  { id: "notification-widget", label: "Notification widget", enabled: true },
  { id: "upcoming-sessions", label: "Upcoming Sessions", enabled: true },
  { id: "student-table", label: "Student table", enabled: true },
]

export function DashboardSettingsProvider({ children }: { children: React.ReactNode }) {
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>(defaultWidgets)

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsedSettings = JSON.parse(saved)
          setDashboardWidgets(parsedSettings)
        } catch (error) {
          console.error('Failed to parse dashboard settings:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboardWidgets))
    }
  }, [dashboardWidgets])

  const isWidgetEnabled = (widgetId: string): boolean => {
    const widget = dashboardWidgets.find(w => w.id === widgetId)
    return widget?.enabled ?? false
  }

  const toggleWidget = (widgetId: string) => {
    setDashboardWidgets(prev =>
      prev.map(widget =>
        widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
      )
    )
  }

  return (
    <DashboardSettingsContext.Provider
      value={{
        dashboardWidgets,
        setDashboardWidgets,
        isWidgetEnabled,
        toggleWidget,
      }}
    >
      {children}
    </DashboardSettingsContext.Provider>
  )
}

export function useDashboardSettings() {
  const context = useContext(DashboardSettingsContext)
  if (context === undefined) {
    throw new Error('useDashboardSettings must be used within a DashboardSettingsProvider')
  }
  return context
}
