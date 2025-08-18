'use client'

import { useEffect, useState } from 'react'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'
import { useMoodCheckIns, useStudents } from '@/users/counselors/state'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

interface DistressMetrics {
  overallScore: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  trend: 'improving' | 'worsening' | 'stable'
  trendPercentage: number
}

export function DistressScoreWidget() {
  const { isWidgetEnabled } = useDashboardSettings()
  const students = useStudents()
  const moodCheckIns = useMoodCheckIns()
  const [distressMetrics, setDistressMetrics] = useState<DistressMetrics>({
    overallScore: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    trend: 'stable',
    trendPercentage: 0,
  })

  useEffect(() => {
    // Calculate distress metrics from students and mood check-ins
    if (students && students.length > 0) {
      // Count students by risk level
      const critical = students.filter((s) => s.riskLevel === 'CRITICAL').length
      const high = students.filter((s) => s.riskLevel === 'HIGH').length
      const medium = students.filter((s) => s.riskLevel === 'MEDIUM').length
      const low = students.filter((s) => s.riskLevel === 'LOW').length

      // Calculate overall distress score (weighted average)
      const totalStudents = students.length
      const weightedScore = (critical * 10 + high * 7 + medium * 4 + low * 1) / totalStudents
      const overallScore = Math.round(weightedScore * 10) / 10

      // Analyze trend from recent mood check-ins
      let trend: 'improving' | 'worsening' | 'stable' = 'stable'
      let trendPercentage = 0

      if (moodCheckIns.length > 5) {
        const recentAvg =
          moodCheckIns.slice(0, 5).reduce((sum, m) => sum + (m.riskScore || 5), 0) / 5
        const olderAvg =
          moodCheckIns.slice(5, 10).reduce((sum, m) => sum + (m.riskScore || 5), 0) /
          Math.min(5, moodCheckIns.slice(5, 10).length)

        if (olderAvg > 0) {
          const change = ((recentAvg - olderAvg) / olderAvg) * 100
          trendPercentage = Math.abs(Math.round(change))
          if (change > 5) trend = 'worsening'
          else if (change < -5) trend = 'improving'
        }
      }

      setDistressMetrics({
        overallScore,
        criticalCount: critical,
        highCount: high,
        mediumCount: medium,
        lowCount: low,
        trend,
        trendPercentage,
      })
    }
  }, [students, moodCheckIns])

  if (!isWidgetEnabled('distress-score')) {
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-red-600'
    if (score >= 4) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getTrendIcon = () => {
    if (distressMetrics.trend === 'worsening') {
      return <TrendingUp className="h-4 w-4 text-red-500" />
    }
    if (distressMetrics.trend === 'improving') {
      return <TrendingDown className="h-4 w-4 text-green-500" />
    }
    return null
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-[0.875rem] text-[#0F141A] ${interMedium.className}`}>
            Overall Distress Score
          </CardTitle>
          {(distressMetrics.criticalCount > 0 || distressMetrics.highCount > 0) && (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-[2rem] ${getScoreColor(distressMetrics.overallScore)} ${interBold.className}`}
              >
                {distressMetrics.overallScore.toFixed(1)}
              </span>
              <span className={`text-[0.75rem] text-[#667582] ${interRegular.className}`}>/10</span>
            </div>
            {distressMetrics.trend !== 'stable' && (
              <div className="mt-1 flex items-center gap-2">
                {getTrendIcon()}
                <span
                  className={`text-[0.75rem] ${
                    distressMetrics.trend === 'worsening' ? 'text-red-500' : 'text-green-500'
                  } ${interRegular.className}`}
                >
                  {distressMetrics.trendPercentage}%{' '}
                  {distressMetrics.trend === 'improving' ? 'improvement' : 'increase'}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1 border-t border-gray-100 pt-2">
            {distressMetrics.criticalCount > 0 && (
              <div className="flex items-center justify-between">
                <span className={`text-[0.75rem] text-[#667582] ${interRegular.className}`}>
                  Critical
                </span>
                <span
                  className={`text-[0.875rem] font-semibold text-red-600 ${interMedium.className}`}
                >
                  {distressMetrics.criticalCount} students
                </span>
              </div>
            )}
            {distressMetrics.highCount > 0 && (
              <div className="flex items-center justify-between">
                <span className={`text-[0.75rem] text-[#667582] ${interRegular.className}`}>
                  High Risk
                </span>
                <span className={`text-[0.875rem] text-orange-600 ${interMedium.className}`}>
                  {distressMetrics.highCount} students
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className={`text-[0.75rem] text-[#667582] ${interRegular.className}`}>
                Moderate/Low
              </span>
              <span className={`text-[0.875rem] text-[#121417] ${interMedium.className}`}>
                {distressMetrics.mediumCount + distressMetrics.lowCount} students
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
