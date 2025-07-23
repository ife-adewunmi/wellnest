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
    <div className="w-full rounded-[12px] border border-[#CBD5E0] bg-[#F7FAFC] p-[1.5rem]">
      <div>
        <div className={`text-[1rem] text-[#1A202C] ${interSemiBold.className}`}>{title}</div>
      </div>
      <div>
        <div className={`text-[2.25rem] text-[#1A202C] ${interBold.className}`}>{value}</div>
        <div className="mt-1 flex items-center">
          <span
            className={` ${positive ? 'text-[#088738]' : 'text-[#E83808]'} text-[1.25rem] ${interMedium.className} `}
          >
            {change}
          </span>
        </div>
      </div>
    </div>
  )
}
