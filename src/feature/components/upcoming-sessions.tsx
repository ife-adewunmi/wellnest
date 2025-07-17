"use client"

import * as React from "react"
import { Button } from "@/shared/components/ui/custom-button"
import { interBold, interMedium, interRegular } from "@/fonts"


interface Session {
  id: string
  student: string
  date: string
  time: string
  issue: string
}

export function UpcomingSessions() {
  const [showAll, setShowAll] = React.useState(false)

  const sessions: Session[] = [
    {
      id: "1",
      student: "Sophia Evans",
      date: "2024-07-29",
      time: "10:00 AM",
      issue: "Academic Planning",
    },
    {
      id: "2",
      student: "Liam Foster",
      date: "2024-07-30",
      time: "2:00 PM",
      issue: "Personal Development",
    },
    {
      id: "3",
      student: "Liam Foster",
      date: "2024-07-30",
      time: "2:00 PM",
      issue: "Personal Development",
    },
  ]

  const allSessions: Session[] = [
    ...sessions,
    {
      id: "4",
      student: "Marcus Thompson",
      date: "2024-07-31",
      time: "11:00 AM",
      issue: "Stress Management",
    },
    {
      id: "5",
      student: "Emma Rodriguez",
      date: "2024-08-01",
      time: "3:30 PM",
      issue: "Academic Support",
    },
    {
      id: "6",
      student: "David Kim",
      date: "2024-08-02",
      time: "9:00 AM",
      issue: "Career Counseling",
    },
  ]

  const displayedSessions = showAll ? allSessions : sessions

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <h1  className={`${interBold.className} text-[#121417] text-[1.25rem] `}>Upcoming Sessions</h1>
        <Button variant="ghost" className={`${interMedium.className} text-[#4A5568] text-[0.875rem]`} onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show less" : "View all"}
        </Button>
      </div>
      <div>
        <div className={`mt-[1.5rem] rounded-[12px]  border border-[#CBD5E0] gap-[1.25rem] flex flex-col`}>
       
      <table className="w-full">
  <thead>
    <tr className="border-b border-[#CBD5E0]">
      <th className={`py-[13px] pl-[1rem] text-left ${interRegular.className} text-[#121417]`}>Student</th>
      <th className={`py-[13px] pl-[1rem] text-left ${interRegular.className} text-[#121417]`}>Date</th>
      <th className={`py-[13px] pl-[1rem] text-left ${interRegular.className} text-[#121417]`}>Time</th>
      <th className={`py-[13px] pl-[1rem] text-left ${interRegular.className} text-[#121417]`}>Issue</th>
    </tr>
  </thead>
            <tbody>
              {displayedSessions.map((session) => (
                <tr key={session.id} className="border-b border-[#CBD5E0]">
                  <td className={`py-[1.625rem] pl-[1rem] ${interRegular.className} text-[#121417] text-[0.875rem]`}>{session.student}</td>
                  <td className={`py-[1.625rem] pl-[1rem] ${interRegular.className} text-[#61758A] text-[0.875rem]`}>{session.date}</td>
                  <td className={`py-[1.625rem] pl-[1rem] ${interRegular.className} text-[#61758A]  text-[0.875rem] `}>{session.time}</td>
                  <td className={`py-[1.625rem] pl-[1rem] ${interRegular.className} text-[#61758A]  text-[0.875rem]`}>{session.issue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
