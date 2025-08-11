'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card } from '@/shared/components/ui/card'
import { CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'
import { ChartContainer } from '@/shared/components/ui/chart'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'

const data = [
  { day: 'Mon', hours: 3.0, displayhour: '3h' },
  { day: 'Tue', hours: 4.2, displayhour: '4h 12m' },
  { day: 'Wed', hours: 2.8, displayhour: '2h 48m' },
  { day: 'Thu', hours: 4.5, displayhour: '4h 30m' },
  { day: 'Fri', hours: 7.2, displayhour: '7h 12m' },
  { day: 'Sat', hours: 8.8, displayhour: '8h 48m' },
  { day: 'Sun', hours: 5.1, displayhour: '5h 6m' },
]

const CustomBar = (props: any) => {
  const { fill, tooltipPosition, dataKey, ...rest } = props
  return (
    <g>
      <rect {...rest} fill="#E2E8F0" rx={2} />
      <rect x={rest.x} y={rest.y} width={rest.width} height={4} fill="#EF4444" rx={2} />
    </g>
  )
}

export default function ScreenTimeDashboard() {
  return (
    <div className="w-full rounded-[12px] border border-[#CBD5E0] px-[1rem] pt-[1rem]">
      <div className="w-full">
        <CardHeader className="">
          <CardTitle className={`${interMedium.className} text-[0.875rem] text-[#1A202C]`}>
            Average Screen Time
          </CardTitle>
          <div className="flex flex-col gap-[8px]">
            <div className={`${interBold.className} text-[1.25rem] text-[#0F141A]`}>4h 30m</div>
            <div className="flex items-center">
              <span className={`${interRegular.className} text-[12px] text-[#59738C]`}>
                Last 7 Days
              </span>
              <span className={`text-[#088738] ${interRegular.className}`}>+15%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              hours: {
                label: 'Hours',
                color: '#E2E8F0',
              },
            }}
            className="w-full"
            style={{ height: '199px' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  //   right: 30,
                  //   left: 20,
                  bottom: 5,
                }}
                // barCategoryGap="20%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  className="text-gray-500"
                />
                <YAxis
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  domain={[0, 9]}
                  ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                  tickFormatter={(value) => `${value}h`}
                />
                <Bar dataKey="hours" shape={CustomBar} radius={[2, 2, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </div>
    </div>
  )
}
