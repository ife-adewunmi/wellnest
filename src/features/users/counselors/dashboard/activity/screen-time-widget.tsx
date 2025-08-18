'use client'

import { useEffect, useState } from 'react'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'
import { useMetrics, useStudents } from '@/features/users/counselors/state'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ScreenTimeMetrics {
  avgDailyMinutes: number
  avgWeeklyMinutes: number
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
  highRiskStudents: number
}

export function ScreenTimeWidget() {
  const { isWidgetEnabled } = useDashboardSettings()
  const students = useStudents()
  const metrics = useMetrics()
  const [screenTimeMetrics, setScreenTimeMetrics] = useState<ScreenTimeMetrics>({
    avgDailyMinutes: 0,
    avgWeeklyMinutes: 0,
    trend: 'stable',
    trendPercentage: 0,
    highRiskStudents: 0,
  })

  useEffect(() => {
    // Calculate screen time metrics from students data
    if (students && students.length > 0) {
      const totalScreenTime = students.reduce(
        (sum, student) => sum + (student.screenTimeToday || 0),
        0,
      )
      const avgDaily = Math.round(totalScreenTime / students.length)
      const avgWeekly = avgDaily * 7

      // Count high risk students (>6 hours daily)
      const highRisk = students.filter((s) => (s.screenTimeToday || 0) > 360).length

      // Get trend from metrics if available
      const screenTimeMetric = metrics.find((m) => m.title === 'Avg. Screen Time')
      let trend: 'up' | 'down' | 'stable' = 'stable'
      let trendPercentage = 0

      if (screenTimeMetric?.change) {
        const change = parseInt(screenTimeMetric.change.replace('%', ''))
        trendPercentage = Math.abs(change)
        if (change > 0) trend = 'up'
        else if (change < 0) trend = 'down'
      }

      setScreenTimeMetrics({
        avgDailyMinutes: avgDaily,
        avgWeeklyMinutes: avgWeekly,
        trend,
        trendPercentage,
        highRiskStudents: highRisk,
      })
    }
  }, [students, metrics])

  if (!isWidgetEnabled('screen-time')) {
    return null
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getTrendIcon = () => {
    switch (screenTimeMetrics.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className={`text-[0.875rem] text-[#0F141A] ${interMedium.className}`}>
          Average Screen Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-[1.5rem] text-[#121417] ${interBold.className}`}>
                {formatTime(screenTimeMetrics.avgDailyMinutes)}
              </span>
              <span className={`text-[0.75rem] text-[#667582] ${interRegular.className}`}>
                /day
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              {getTrendIcon()}
              <span
                className={`text-[0.75rem] ${screenTimeMetrics.trend === 'up' ? 'text-red-500' : screenTimeMetrics.trend === 'down' ? 'text-green-500' : 'text-gray-500'} ${interRegular.className}`}
              >
                {screenTimeMetrics.trendPercentage}% vs last week
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <div className="flex items-center justify-between">
              <span className={`text-[0.75rem] text-[#667582] ${interRegular.className}`}>
                Weekly Average
              </span>
              <span className={`text-[0.875rem] text-[#121417] ${interMedium.className}`}>
                {formatTime(screenTimeMetrics.avgWeeklyMinutes)}
              </span>
            </div>
            {screenTimeMetrics.highRiskStudents > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[0.75rem] text-[#667582] ${interRegular.className}`}>
                  High Usage ({'>'}6h)
                </span>
                <span className={`text-[0.875rem] text-red-600 ${interMedium.className}`}>
                  {screenTimeMetrics.highRiskStudents} students
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
