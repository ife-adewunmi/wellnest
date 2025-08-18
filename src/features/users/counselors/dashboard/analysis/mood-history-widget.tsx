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
import { useUserStore } from '@/features/users/state/userStore'
import { LoadingSpinner } from '@/shared/components/loading-spinner'

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
  const { user } = useUserStore()
  const [timeRange, setTimeRange] = React.useState('30d')
  const [moodData, setMoodData] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d')
    }
  }, [isMobile])

  // Fetch mood history data
  React.useEffect(() => {
    const fetchMoodHistory = async () => {
      if (!user?.id) return

      setIsLoading(true)
      setError(null)

      try {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
        const response = await fetch(
          `/api/counselors/dashboard/mood-history?counselorId=${user.id}&days=${days}`,
        )

        if (!response.ok) {
          throw new Error('Failed to fetch mood history')
        }

        const history = await response.json()

        // Filter out entries with null mood values
        const validData = history.filter((item: any) => item.mood !== null)
        setMoodData(validData)
      } catch (err) {
        console.error('Failed to fetch mood history:', err)
        setError('Failed to load mood history')
        // Use some default data as fallback
        setMoodData([{ date: new Date().toISOString().split('T')[0], mood: 7.2, wellbeing: 7.8 }])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMoodHistory()
  }, [user?.id, timeRange])

  const filteredData = moodData

  const averageMood =
    filteredData.length > 0
      ? (
          filteredData.reduce((sum, item) => sum + (item.mood || 0), 0) / filteredData.length
        ).toFixed(1)
      : '0.0'

  const trendPercentage = React.useMemo(() => {
    if (filteredData.length < 2) return 0

    const recentHalf = filteredData.slice(Math.floor(filteredData.length / 2))
    const olderHalf = filteredData.slice(0, Math.floor(filteredData.length / 2))

    const recentAvg =
      recentHalf.reduce((sum, item) => sum + (item.mood || 0), 0) / recentHalf.length
    const olderAvg = olderHalf.reduce((sum, item) => sum + (item.mood || 0), 0) / olderHalf.length

    if (olderAvg === 0) return 0
    return Math.round(((recentAvg - olderAvg) / olderAvg) * 100)
  }, [filteredData])

  return (
    <Card className="h-full w-full">
      <CardHeader className="relative">
        <CardTitle className={`text-[0.875rem] text-[#0F141A] ${interMedium.className}`}>
          Average Mood History
        </CardTitle>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className={`text-[1.25rem] text-[#121417] ${interBold.className}`}>
              {isLoading ? '...' : averageMood}
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-[12px] text-[#667582] ${interRegular.className}`}>
                Last {timeRange === '7d' ? '7 Days' : timeRange === '30d' ? '30 Days' : '90 Days'}
              </span>
              {trendPercentage !== 0 && (
                <span
                  className={`text-[12px] ${trendPercentage > 0 ? 'text-[#088738]' : 'text-red-500'} ${interRegular.className}`}
                >
                  {trendPercentage > 0 ? '+' : ''}
                  {trendPercentage}%
                </span>
              )}
            </div>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-8 w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="chart-container">
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <LoadingSpinner size="medium" />
          </div>
        ) : error ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-gray-500">
            {error}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-gray-500">
            No mood data available
          </div>
        ) : (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  )
}
