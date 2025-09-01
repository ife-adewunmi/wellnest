'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { StudentReportData } from '@/users/counselors/types'
import { FileText, Download, TrendingUp, Calendar, Clock, Brain } from 'lucide-react'
import { format } from 'date-fns'

interface ReportsDisplayProps {
  reports: StudentReportData[]
  onExport?: (format: 'csv' | 'pdf' | 'excel') => void
}

export function ReportsDisplay({ reports, onExport }: ReportsDisplayProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const getRiskTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'improving':
        return '📈'
      case 'worsening':
        return '📉'
      case 'stable':
        return '➡️'
      default:
        return '➡️'
    }
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="mb-4 h-12 w-12 text-gray-400" />
          <p className="text-center text-gray-500">
            No reports generated yet. Use the filters above to generate a report.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Export actions */}
      {onExport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Reports ({reports.length})
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onExport('csv')}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button size="sm" variant="outline" onClick={() => onExport('excel')}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
                <Button size="sm" variant="outline" onClick={() => onExport('pdf')}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Reports list */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {report.name} ({report.studentId})
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {report.department} • Level {report.level}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Report Period: {format(new Date(report.reportPeriod.start), 'MMM dd, yyyy')} -{' '}
                    {format(new Date(report.reportPeriod.end), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getRiskLevelColor(report.currentRiskLevel)}>
                    {report.currentRiskLevel} Risk
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{getRiskTrendIcon(report.riskTrend)}</span>
                    {report.riskTrend}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <Brain className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                  <p className="text-2xl font-bold">{report.avgMood.toFixed(1)}</p>
                  <p className="text-xs text-gray-600">Avg Mood</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <TrendingUp className="mx-auto mb-2 h-6 w-6 text-orange-500" />
                  <p className="text-2xl font-bold">{report.avgRiskScore.toFixed(1)}</p>
                  <p className="text-xs text-gray-600">Avg Risk</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <Clock className="mx-auto mb-2 h-6 w-6 text-green-500" />
                  <p className="text-2xl font-bold">{report.avgDailyScreenTime.toFixed(1)}h</p>
                  <p className="text-xs text-gray-600">Avg Screen Time</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <Calendar className="mx-auto mb-2 h-6 w-6 text-purple-500" />
                  <p className="text-2xl font-bold">
                    {report.completedSessions}/{report.totalSessions}
                  </p>
                  <p className="text-xs text-gray-600">Sessions</p>
                </div>
              </div>

              {/* Summary sections */}
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                <div>
                  <h4 className="mb-2 font-medium">Mood Check-ins</h4>
                  <p className="text-gray-600">{report.moodCheckins.length} entries recorded</p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Screen Time</h4>
                  <p className="text-gray-600">{report.screenTimeData.length} days tracked</p>
                  <p className="text-gray-600">Total: {report.totalScreenTime.toFixed(1)} hours</p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Counseling Sessions</h4>
                  <p className="text-gray-600">{report.completedSessions} completed sessions</p>
                  {report.sessions.length > 0 && (
                    <p className="text-gray-600">
                      Last: {format(new Date(report.sessions[0].date), 'MMM dd')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
