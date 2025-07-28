"use client"

import { Plus } from "lucide-react"
import { Button } from "@/shared/components/ui/custom-button"
import { interBold } from "@/shared/styles/fonts"

interface ScheduleHeaderProps {
  onCreateSession: () => void
}

export function ScheduleHeader({ onCreateSession }: ScheduleHeaderProps) {
  return (
    <div className="flex items-center justify-between ">
      <h1 className={`${interBold.className} text-[1rem]  lg:text-[1.5rem] text-[#121417]`}>Schedule Session</h1>
      <Button variant="ghost" onClick={onCreateSession}>
        <Plus className="w-4 h-4 mr-2" />
        Create new session
      </Button>
    </div>
  )
}
