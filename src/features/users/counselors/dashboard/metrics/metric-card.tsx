'use client'

import { interBold, interMedium, interSemiBold } from '@/shared/styles/fonts'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  positive: boolean
}

export function MetricCard({ title, value, change, positive }: MetricCardProps) {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-lg border border-[#CBD5E0] bg-[#F7FAFC] p-4 sm:rounded-xl sm:p-5 lg:p-6">
      <div>
        <div
          className={`text-sm text-[#1A202C] sm:text-base lg:text-[1rem] ${interSemiBold.className}`}
        >
          {title}
        </div>
      </div>
      <div className="mt-3 flex flex-grow flex-col justify-center sm:mt-4">
        <div
          className={`text-2xl text-[#1A202C] sm:text-3xl lg:text-[2.25rem] ${interBold.className}`}
        >
          {value}
        </div>
        <div className="mt-2 flex items-center gap-1">
          {positive ? (
            <TrendingUp className="h-4 w-4 text-[#088738]" />
          ) : (
            <TrendingDown className="h-4 w-4 text-[#E83808]" />
          )}
          <span
            className={`${positive ? 'text-[#088738]' : 'text-[#E83808]'} text-sm sm:text-base lg:text-[1.125rem] ${interMedium.className}`}
          >
            {change}
          </span>
        </div>
      </div>
    </div>
  )
}
