"use client"

import { interBold, interMedium, interSemiBold } from "@/fonts"
import { TrendingUp, TrendingDown, Divide } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  positive: boolean
}

export function MetricCard({ title, value, change, positive }: MetricCardProps) {
  return (
    <div className="border border-[#CBD5E0] bg-[#F7FAFC] rounded-[12px] p-[1.5rem] w-full">
      <div >
        <div className={`text-[#1A202C] text-[1rem] ${interSemiBold.className}`}>{title}</div>
      </div>
      <div>
        <div className={`text-[#1A202C] text-[2.25rem] ${interBold.className}`}>{value}</div>
        <div className="flex items-center mt-1">
     
          <span className={` ${positive ? 'text-[#088738]' : 'text-[#E83808]'} text-[1.25rem] ${interMedium.className} `}>{change}</span>
        </div>
      </div>
    </div>
  )
}
