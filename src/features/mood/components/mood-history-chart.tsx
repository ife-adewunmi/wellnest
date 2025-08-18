'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface MoodHistoryChartProps {
  userId: string
}

export function MoodHistoryChart({ userId }: MoodHistoryChartProps) {
  // Mock data - replace with actual data fetching
  const data = [
    { date: 'Mon', mood: 4, label: 'Good' },
    { date: 'Tue', mood: 3, label: 'Neutral' },
    { date: 'Wed', mood: 5, label: 'Happy' },
    { date: 'Thu', mood: 2, label: 'Bad' },
    { date: 'Fri', mood: 3, label: 'Neutral' },
    { date: 'Sat', mood: 4, label: 'Good' },
    { date: 'Sun', mood: 4, label: 'Good' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trend</CardTitle>
        <CardDescription>Your mood patterns over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={[1, 5]}
              tickFormatter={(value) => ['😰', '😞', '😐', '🙂', '😊'][value - 1]}
            />
            <Tooltip
              formatter={(value: any, name: any, props: any) => [props.payload.label, 'Mood']}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#4299E1"
              strokeWidth={2}
              dot={{ fill: '#4299E1', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
