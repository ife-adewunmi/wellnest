'use client'

import { interMedium } from '@/shared/styles/fonts'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4299E1]"></div>
      <p className={`text-[#666666] text-[1rem] ${interMedium.className}`}>
        Loading...
      </p>
    </div>
  )
}
