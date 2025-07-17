"use client"

import * as React from "react"
import Avatar from "./ui/avatar"
import { Button } from "./ui/custom-button"
import { interBold, interMedium, interRegular } from "@/fonts"

interface MoodCheckIn {
  name: string
  avatar: string
  time: string
  message: string
  emoji: string
}

interface MoodCheckInsProps {
  checkIns: MoodCheckIn[]
}

export function MoodCheckIns({ checkIns }: MoodCheckInsProps) {
  const [showAll, setShowAll] = React.useState(false)

  const allCheckIns = [
    ...checkIns,
    {
      name: "Emma S.",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "8:45 AM",
      message: "Had a really productive study session today!",
      emoji: "😊",
    },
    {
      name: "Marcus T.",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "11:20 AM",
      message: "Feeling anxious about the upcoming exams.",
      emoji: "😰",
    },
    {
      name: "Zara K.",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "3:15 PM",
      message: "Great day with friends at the campus event!",
      emoji: "😄",
    },
    {
      name: "David L.",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "5:30 PM",
      message: "Struggling with time management lately.",
      emoji: "😔",
    },
  ]

  const displayedCheckIns = showAll ? allCheckIns : checkIns

  return (
    <div className="rounded-[12px] p-[1rem] border border-[#CBD5E0] ">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className={`${interBold.className} text-[#121417] text-[1.25rem] `}>Mood Check-Ins</h1>
          <h2 className={`${interRegular.className} text-[#667582] text-[0.875rem]`}>Recent student mood check-in responses</h2>
        </div>
        {/* <Button variant="ghost" className="text-blue-600 hover:text-blue-700" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show less" : "View all"}
        </Button> */}
      </div>
      <div className={`space-y-4 ${showAll ? "max-h-96 overflow-y-auto" : ""} overflow-y-auto `}>
        {displayedCheckIns.map((checkIn, index) => (
          <div key={index} className="flex py-[8px] gap-[1rem]">
            <Avatar
              size={40}
              type="user"
            //   headerImage={user?.header_image}
            //   profilePicture={user?.thumbnail}
              customDefault="thumbnail" // ✅ Forces fallback to DefaultThumbnail on this page only
            />
            <div className="flex flex-col w-full">
              <div className="flex items-center w-full justify-between">
                <p className={`text-[1rem] ${interMedium.className} text-[#121417]`}>
                  {checkIn.name} - {checkIn.emoji}
                </p>
                <span className={`${interRegular.className} text-[#667582] text-[0.875rem]`}>{checkIn.time}</span>
              </div>
              <p className={`${interRegular.className}  text-[#667582] text-[0.875rem]`}>{checkIn.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
