'use client'

import { interBold, interRegular } from '@/shared/styles/fonts'
import { useState, useEffect } from 'react'

export default function WelcomeMessage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`absolute bottom-[6rem] left-[5.5rem] flex w-full max-w-[487px] transform flex-col rounded-[1.25rem] bg-white p-[1.25rem] text-center transition-all duration-1000 ease-out ${
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-8 scale-95 opacity-0'
      }`}
    >
      <h2 className={`text-[2rem] text-[#0D141C] ${interBold.className}`}>Welcome to WellNest!</h2>
      <p className={`text-[1rem] text-[#0D141C] ${interRegular.className} mt-[1rem]`}>
        WellNest is designed to monitor student well-being and facilitate early interventions,
        ensuring every student has the support they need to thrive.
      </p>
    </div>
  )
}
