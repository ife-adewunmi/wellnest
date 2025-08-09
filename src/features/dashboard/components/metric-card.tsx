'use client'

import { interBold, interMedium, interSemiBold } from '@/shared/styles/fonts'
import { TrendingUp, TrendingDown, Divide } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  positive: boolean
}

export function MetricCard({ title, value, change, positive }: MetricCardProps) {
  return (
    <div className="w-full max-w-[212px] min-w-[180px] rounded-lg border border-[#CBD5E0] bg-[#F7FAFC] p-3 sm:rounded-xl sm:p-4 lg:p-6">
      <div>
        <div
          className={`text-sm text-[#1A202C] sm:text-base lg:text-[1rem] ${interSemiBold.className}`}
        >
          {title}
        </div>
      </div>
      <div className="mt-2 sm:mt-3">
        <div
          className={`text-xl text-[#1A202C] sm:text-2xl lg:text-[2.25rem] ${interBold.className}`}
        >
          {value}
        </div>
        <div className="mt-1 flex items-center">
          <span
            className={` ${positive ? 'text-[#088738]' : 'text-[#E83808]'} text-base sm:text-lg lg:text-[1.25rem] ${interMedium.className} `}
          >
            {change}
          </span>
        </div>
      </div>
    </div>
  )
}
