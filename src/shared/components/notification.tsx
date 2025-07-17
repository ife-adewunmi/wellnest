"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { AlertCircle, Smartphone, Calendar } from "lucide-react"
import { Button } from "./ui/custom-button"
import { interBold, interMedium, interRegular } from "@/fonts"

import Image from 'next/image'
interface Notification {
  id: string
  type: "mood" | "screen-time" | "missed-checkin"
  title: string
  student: string
  icon: ReactNode
}

export function Notifications() {
  const [showAll, setShowAll] = useState(false)

  const notifications: Notification[] = [
    {
      id: "1",
      type: "mood",
      title: "Mood Score Below Threshold",
      student: "Alex Turner",
      icon: <Image
        src="/svg/notify-card.svg"
        alt="Missed SVG"
        width={48}
        height={48}

      />,
    },
    {
      id: "2",
      type: "screen-time",
      title: "Increased Screen Time",
      student: "Jordan Carter",
      icon: <Image
        src="/svg/increased-screen.svg"
        alt="Missed SVG"
        width={48}
        height={48}

      />,
    },
    {
      id: "3",
      type: "missed-checkin",
      title: "Missed Check-In",
      student: "Casey Evans",
      icon: <Image
        src="/svg/missed.svg"
        alt="Missed SVG"
        width={48}
        height={48}

      />,
    },
    {
      id: "4",
      type: "missed-checkin",
      title: "Missed Check-In",
      student: "Casey Evans",
      icon: <Image
        src="/svg/missed.svg"
        alt="Missed SVG"
        width={48}
        height={48}

      />,
    },
  ]

  const allNotifications: Notification[] = [
    ...notifications,
    {
      id: "5",
      type: "mood",
      title: "Mood Score Below Threshold",
      student: "Emma Rodriguez",
      icon: <Image
        src="/svg/increased-screen.svg"
        alt="Missed SVG"
        width={48}
        height={48}

      />,
    },
    {
      id: "6",
      type: "screen-time",
      title: "Increased Screen Time",
      student: "Michael Chen",
     icon:<Image
        src="/svg/increased-screen.svg"
        alt="Missed SVG"
        width={48}
        height={48}
        
       />,    },
    {
      id: "7",
      type: "missed-checkin",
      title: "Missed Check-In",
      student: "Sarah Johnson",
      icon: <Image
        src="/svg/missed.svg"
        alt="Missed SVG"
        width={48}
        height={48}

      />,
    },
  ]

  const displayedNotifications = showAll ? allNotifications : notifications

  return (
    <div className="w-[max-content]">
      <div className="flex flex-row items-center max-w-[321px] w-full justify-between">
        <h1 className={`${interBold.className} text-[#121417] text-[1.25rem] `}>Notifications</h1>
        <Button variant="ghost" className={`${interMedium.className} text-[#4A5568] text-[0.875rem]`} onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show less" : "View all"}
        </Button>
      </div>
      <div className={`mt-[1.5rem] rounded-[12px] p-[1rem] border border-[#CBD5E0] gap-[1rem] inline-flex flex-col`}>
        {displayedNotifications.map((notification) => (
          <div>

     
          <div key={notification.id} className="flex  gap-[0.875rem] ">
            <div className="">{notification.icon}</div>
            <div className="flex flex-col ">
              <p className={`text-[#121417] text-[1rem] ${interMedium.className}`}>{notification.title}</p>
              <p className={`${interRegular.className} text-[0.875rem] text-[#61758A]`}>Student: {notification.student}</p>
            </div>
          </div>
               </div>
        ))}
      </div>
    </div>
  )
}
