"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card } from "./ui/card"
import { CardHeader, CardTitle, CardContent } from "./ui/card"
import { ChartContainer } from "./ui/chart"
import { interBold, interMedium, interRegular } from "@/fonts"

const data = [
  { day: "Mon", hours: 3.0, displayHours: "3h" },
  { day: "Tue", hours: 4.2, displayHours: "4h 12m" },
  { day: "Wed", hours: 2.8, displayHours: "2h 48m" },
  { day: "Thu", hours: 4.5, displayHours: "4h 30m" },
  { day: "Fri", hours: 7.2, displayHours: "7h 12m" },
  { day: "Sat", hours: 8.8, displayHours: "8h 48m" },
  { day: "Sun", hours: 5.1, displayHours: "5h 6m" },
]

const CustomBar = (props: any) => {
  const { fill, ...rest } = props
  return (
    <g>
      <rect {...rest} fill="#E2E8F0" rx={2} />
      <rect x={rest.x} y={rest.y} width={rest.width} height={4} fill="#EF4444" rx={2} />
    </g>
  )
}

export default function ScreenTimeDashboard() {
  return (
    <div className="w-full rounded-[12px] pt-[1rem] px-[1rem] border border-[#CBD5E0]">
      <div className="w-full">
        <CardHeader className="">
          <CardTitle className={`${interMedium.className} text-[0.875rem] text-[#1A202C]`}>Average Screen Time</CardTitle>
          <div className="flex flex-col gap-[8px]">
            <div className={`${interBold.className} text-[#0F141A] text-[1.25rem]`}>4h 30m</div>
            <div className="flex items-center  ">
              <span className={`${interRegular.className} text-[#59738C] text-[12px]`}>Last 7 Days</span>
              <span className={`text-[#088738] ${interRegular.className}`}>+15%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              hours: {
                label: "Hours",
                color: "#E2E8F0",
              },
            }}
            className="h-80 w-full"
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
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  className="text-gray-500"
                />
                <YAxis
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
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
