"use client"

import { UpcomingSessions } from "@/feature/components/upcoming-sessions"
import { Header } from "./dashboard-header"
import { MoodHistoryChart } from "./line-charts"
import { MoodCheckIns } from "./mood-checkIn"
import { Notifications } from "./notification"
import { SocialMediaActivity } from "./social-media-activity"
import { StudentTable } from "./student-table"
import { MetricCard } from "./metric-card"
import { interBold } from "@/fonts"
import AverageScreenTime from "./average-screen-time"


export default function Dashboard() {
  const moodCheckIns = [
    {
      name: "Sarah M.",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "10:30 AM",
      message: "Feeling a bit overwhelmed with the workload this week.",
      emoji: "😔",
    },
    {
      name: "Ethan R.",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "1:30 PM",
      message: "Had a great day at the science fair!",
      emoji: "😊",
    },
    {
      name: "Olivia L.",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "12:00 AM",
      message: "Feeling down after a disagreement with a friend.",
      emoji: "😞",
    },
    {
      name: "Noah K.",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "9:30 AM",
      message: "Excited about the upcoming field trip!",
      emoji: "😄",
    },
  ]

  const metrics = [
    { title: "Total Students", value: "1,500", change: "+10%",  positive: true },
    { title: "At-Risk Count", value: "15", change: "-5%",  positive: false },
    { title: "Avg. Mood Score", value: "7.8", change: "+2%", positive: true  },
    { title: "Screen-Time", value: "2.5hr", change: "+15%", positive: true  },
    { title: "Distress Alerts", value: "3", change: "-1%",  positive: false },
  ]

  return (
    <div className="flex justify-center flex-col items-center pb-3">
      <Header />

      {/* Main Content */}
      <main className="w-full max-w-[1152px] mt-[4.44vh]">
        <h1 className={`${interBold.className} text-[#121417] text-[2rem]`}>Dashboard</h1>

        {/* Metrics Cards */}
        <div className="flex items-center gap-[1.5rem] mt-[2.8125rem]">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              positive={metric.positive}
            />
          ))}
        </div>

        {/* Analysis Overview */}
        <div className="mt-[4.5rem]">
          <h2 className={`text-[#121417] text-[1.375rem] ${interBold.className}`}>Analysis Overview</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2rem] mt-[2rem]">
            <MoodCheckIns checkIns={moodCheckIns} />
            <MoodHistoryChart />
          </div>
        </div>

        {/* Screen Time and Social Media Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2rem]  mt-[2rem]">
          <AverageScreenTime />
          <SocialMediaActivity />
        </div>

        {/* Additional Dashboard Sections */}
        <div className="flex gap-[2rem] mt-[5rem]  mb-[5rem]">
          <Notifications />
          <div className="w-full max-w-[806px] ">

          
          <UpcomingSessions />
          </div>
        </div>

        {/* Student Table */}
        <StudentTable />
      </main>
    </div>
  )
}
