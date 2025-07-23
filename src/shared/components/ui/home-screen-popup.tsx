'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from './custom-button'
import { interMedium, interRegular } from '@/shared/styles/fonts'

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
      className={`flex transform items-center justify-between rounded-[1rem] bg-[#0000000F] px-[1rem] py-[8px] transition-all duration-1000 ease-out ${
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-8 scale-95 opacity-0'
      }`}
    >
      <div className="flex items-center gap-[1rem]">
        <Image src="/svg/home-screen.svg" alt="Layout" width={48} height={48} />
        <div className="flex flex-col">
          <p className={`text-[1rem] text-[#0D141C] ${interMedium.className}`}>
            Add To Home Screen
          </p>
          <span className={`text-[#4A739C] ${interRegular.className} text-[13px]`}>
            Quick access to student well-being insights
          </span>
        </div>
        <div></div>
        <Button variant={'link'}>Add to home screen</Button>
      </div>
    </div>
  )
}
