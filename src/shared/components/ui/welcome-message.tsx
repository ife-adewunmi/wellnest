"use client"

import { interBold, interRegular } from "@/fonts"
import { useState, useEffect } from "react"

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
      className={`absolute flex text-center flex-col bottom-[6rem] left-[5.5rem] bg-white rounded-[1.25rem] p-[1.25rem] max-w-[487px] w-full transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
      }`}
    >
      <h2 className={`text-[#0D141C] text-[2rem] ${interBold.className}`}>Welcome to WellNest!</h2>
      <p className={`text-[#0D141C] text-[1rem] ${interRegular.className} mt-[1rem]`}>
       WellNest is designed to monitor student well-being and facilitate early interventions, ensuring every student has the support they need to thrive.
      </p>
    </div>
  )
}
