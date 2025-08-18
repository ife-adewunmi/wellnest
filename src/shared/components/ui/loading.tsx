'use client'

import { interMedium } from '@/shared/styles/fonts'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#4299E1]"></div>
      <p className={`text-[1rem] text-[#666666] ${interMedium.className}`}>Loading...</p>
    </div>
  )
}
