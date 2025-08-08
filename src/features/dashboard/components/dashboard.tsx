'use client'

import { UpcomingSessions } from '@/features/student-management/components/upcoming-sessions'
import { Header } from './dashboard-header'
import { MoodHistoryChart } from './line-charts'
import { MoodCheckIns } from './mood-check-ins'
import { Notifications } from '@/shared/components/notification'
import { StudentTable } from '@/features/student-management/components/student-table'
import { MetricCard } from './metric-card'
import { interBold } from '@/shared/styles/fonts'
import AverageScreenTime from './average-screen-time'
import SocialMedia from '@/features/social-media/components/social-media'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'
import { DistressScore } from './distress-score'

export default function Dashboard() {
  const { isWidgetEnabled } = useDashboardSettings()

  const moodCheckIns = [
    {
      name: 'Sarah M.',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '10:30 AM',
      message: 'Feeling a bit overwhelmed with the workload this week.',
      emoji: '😔',
    },
    {
      name: 'Ethan R.',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '1:30 PM',
      message: 'Had a great day at the science fair!',
      emoji: '😊',
    },
    {
      name: 'Olivia L.',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '12:00 AM',
      message: 'Feeling down after a disagreement with a friend.',
      emoji: '😞',
    },
    {
      name: 'Noah K.',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '9:30 AM',
      message: 'Excited about the upcoming field trip!',
      emoji: '😄',
    },
  ]

  const metrics = [
    { title: 'Total Students', value: '1,500', change: '+10%', positive: true },
    { title: 'At-Risk Count', value: '15', change: '-5%', positive: false },
    { title: 'Avg. Mood Score', value: '7.8', change: '+2%', positive: true },
    { title: 'Screen-Time', value: '2.5hr', change: '+15%', positive: true },
    { title: 'Distress Alerts', value: '3', change: '-1%', positive: false },
  ]

  // Helper function to determine grid layout based on enabled widgets
  const getGridLayout = (enabledCount: number) => {
    if (enabledCount === 1) return 'grid-cols-1'
    return 'grid-cols-1 lg:grid-cols-2'
  }

  // Count enabled widgets for different sections
  const analysisWidgets = [
    isWidgetEnabled('mood-tracker'),
    // Add mood history chart as it's part of mood tracking
    isWidgetEnabled('mood-tracker'),
  ].filter(Boolean)

  const screenTimeWidgets = [
    isWidgetEnabled('screen-time'),
    // Social media is separate but related to screen time
    true, // Keep social media always visible for now
  ].filter(Boolean)

  const notificationWidgets = [
    isWidgetEnabled('notification-widget'),
    isWidgetEnabled('upcoming-sessions'),
  ].filter(Boolean)

  return (
    <div className="flex flex-col items-center justify-center pb-3">
      <Header />

      {/* Main Content */}
      <main className="mx-auto mt-[4rem] w-full max-w-[1152px] min-w-[320px] px-4 sm:px-6 lg:min-w-[1024px] lg:px-8 xl:px-0">
        <h1 className={`${interBold.className} text-xl text-[#121417] sm:text-2xl lg:text-[2rem]`}>
          Dashboard
        </h1>

        {/* Metrics Cards */}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:mt-[2.8125rem] lg:grid-cols-3 lg:gap-6 xl:grid-cols-5">
          {metrics.map((metric, index) => {
            // Hide distress score if the widget is disabled
            if (metric.title === 'Distress Alerts' && !isWidgetEnabled('distress-score')) {
              return null
            }
            return (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                positive={metric.positive}
              />
            )
          })}
        </div>

        {/* Analysis Overview */}
        {isWidgetEnabled('mood-tracker') && (
          <div className="mt-8 sm:mt-12 lg:mt-[4.5rem]">
            <h2
              className={`text-lg text-[#121417] sm:text-xl lg:text-[1.375rem] ${interBold.className}`}
            >
              Analysis Overview
            </h2>

            <div
              className={`mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:mt-[2rem] lg:gap-[2rem] ${getGridLayout(analysisWidgets.length)}`}
            >
              <MoodCheckIns checkIns={moodCheckIns} />
              <MoodHistoryChart />
            </div>
          </div>
        )}

        {/* Screen Time and Social Media Activity */}
        {(isWidgetEnabled('screen-time') || true) && (
          <div
            className={`mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:mt-[2rem] lg:gap-[2rem] ${getGridLayout(screenTimeWidgets.length)}`}
          >
            {isWidgetEnabled('screen-time') && <AverageScreenTime />}
            <DistressScore />
          </div>
        )}

        {/* Additional Dashboard Sections */}
        {(isWidgetEnabled('notification-widget') || isWidgetEnabled('upcoming-sessions')) && (
          <div className="mt-8 mb-8 flex flex-col gap-4 sm:mt-12 sm:mb-12 sm:gap-6 lg:mt-[5rem] lg:mb-[5rem] lg:flex-row lg:gap-[2rem]">
            {isWidgetEnabled('notification-widget') && <Notifications />}
            {isWidgetEnabled('upcoming-sessions') && (
              <div
                className={`w-full ${isWidgetEnabled('notification-widget') ? 'max-w-[806px]' : ''}`}
              >
                <UpcomingSessions />
              </div>
            )}
          </div>
        )}

        {/* Student Table */}
        {isWidgetEnabled('student-table') && <StudentTable />}
      </main>
    </div>
  )
}
