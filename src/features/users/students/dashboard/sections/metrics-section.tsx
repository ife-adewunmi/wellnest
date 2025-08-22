import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

export function StudentMetricsSection({
  weeklyCheckIns,
  totalCheckIns,
  averageMood,
  moodEmoji,
}: {
  weeklyCheckIns: number
  totalCheckIns: number
  averageMood: string
  moodEmoji: string
}) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Check-ins (Week)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{weeklyCheckIns}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{totalCheckIns}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">
            {averageMood} {moodEmoji}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Next Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">See sessions module</div>
        </CardContent>
      </Card>
    </div>
  )
}
