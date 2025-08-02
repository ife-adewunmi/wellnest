'use client'

import * as React from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'

const moodData = [
  { date: '2024-04-01', mood: 7.2, wellbeing: 6.8 },
  { date: '2024-04-02', mood: 6.9, wellbeing: 7.1 },
  { date: '2024-04-03', mood: 7.5, wellbeing: 7.3 },
  { date: '2024-04-04', mood: 7.8, wellbeing: 7.6 },
  { date: '2024-04-05', mood: 8.1, wellbeing: 7.9 },
  { date: '2024-04-06', mood: 7.6, wellbeing: 7.4 },
  { date: '2024-04-07', mood: 7.3, wellbeing: 7.0 },
  { date: '2024-04-08', mood: 8.2, wellbeing: 8.0 },
  { date: '2024-04-09', mood: 6.5, wellbeing: 6.3 },
  { date: '2024-04-10', mood: 7.1, wellbeing: 6.9 },
  { date: '2024-04-11', mood: 7.9, wellbeing: 7.7 },
  { date: '2024-04-12', mood: 7.4, wellbeing: 7.2 },
  { date: '2024-04-13', mood: 8.0, wellbeing: 7.8 },
  { date: '2024-04-14', mood: 6.8, wellbeing: 6.6 },
  { date: '2024-04-15', mood: 6.7, wellbeing: 6.5 },
  { date: '2024-04-16', mood: 7.0, wellbeing: 6.8 },
  { date: '2024-04-17', mood: 8.3, wellbeing: 8.1 },
  { date: '2024-04-18', mood: 8.0, wellbeing: 7.8 },
  { date: '2024-04-19', mood: 7.2, wellbeing: 7.0 },
  { date: '2024-04-20', mood: 6.6, wellbeing: 6.4 },
  { date: '2024-04-21', mood: 7.0, wellbeing: 6.8 },
  { date: '2024-04-22', mood: 7.3, wellbeing: 7.1 },
  { date: '2024-04-23', mood: 7.1, wellbeing: 6.9 },
  { date: '2024-04-24', mood: 8.1, wellbeing: 7.9 },
  { date: '2024-04-25', mood: 7.5, wellbeing: 7.3 },
  { date: '2024-04-26', mood: 6.8, wellbeing: 6.6 },
  { date: '2024-04-27', mood: 8.2, wellbeing: 8.0 },
  { date: '2024-04-28', mood: 7.0, wellbeing: 6.8 },
  { date: '2024-04-29', mood: 7.6, wellbeing: 7.4 },
  { date: '2024-04-30', mood: 8.3, wellbeing: 8.1 },
]

const chartConfig = {
  mood: {
    label: 'Mood Score',
    color: 'hsl(var(--chart-1))',
  },
  wellbeing: {
    label: 'Wellbeing',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function MoodHistoryChart() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState('30d')

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d')
    }
  }, [isMobile])

  const filteredData = moodData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2024-04-30')
    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const averageMood =
    filteredData.length > 0
      ? (filteredData.reduce((sum, item) => sum + item.mood, 0) / filteredData.length).toFixed(1)
      : '7.2'

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle className={`text-[0.875rem] text-[#0F141A] ${interMedium.className}`}>
          Average Mood History
        </CardTitle>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className={`text-[1.25rem] text-[#121417] ${interBold.className}`}>
              {averageMood}
            </div>
            <div className="flex items-center">
              <span className={`text-[12px] text-[#667582] ${interRegular.className}`}>
                Last 7 Days
              </span>
              <span className={`text-[12px] text-[#088738] ${interRegular.className}`}>+10%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="chart-container">
        <style jsx>{`
          .chart-container rect {
            width: 60px !important;
          }
          /* Alternative: Target specific chart elements */
          .chart-container .recharts-bar-rectangle {
            width: 60px !important;
          }
          /* Target specific rect elements by fill color */
          .chart-container rect[fill='rgb(226, 232, 240)'] {
            width: 60px !important;
          }
        `}</style>
        <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
          <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mood)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mood)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillWellbeing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-wellbeing)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-wellbeing)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            {/* <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            /> */}
            {/* <Area
              dataKey="wellbeing"
              type="natural"
              fill="url(#fillWellbeing)"
              stroke="var(--color-wellbeing)"
              stackId="a"
            /> */}
            <Area
              dataKey="mood"
              type="natural"
              fill="url(#fillMood)"
              stroke="var(--color-mood)"
              stackId="a"
            />
          </AreaChart>

          {/* Alternative BarChart with custom bar width */}
          {/* Uncomment this section if you want bars instead of area chart */}
          {/*
          <BarChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillMoodBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mood)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mood)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Bar
              dataKey="mood"
              fill="url(#fillMoodBar)"
              radius={2}
              maxBarSize={60}
            />
          </BarChart>
          */}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
