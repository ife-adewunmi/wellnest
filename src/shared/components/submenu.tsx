'use client'

import React, { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { interMedium } from '../styles/fonts'
import Image from 'next/image'

export default function WellnessDashboard() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  return (
    <div className="w-full">
      <div className="relative">
        {/* Three Dot Menu Button - Hidden on mobile since we have hamburger menu */}
        <div className="flex justify-end">
          <div
            onClick={toggleMenu}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        {/* Dropdown Content - Responsive */}
        {menuOpen && (
          <div className="absolute top-[-15px] right-0 z-10 flex w-64 flex-col gap-[1rem] rounded-[12px] bg-white p-[1rem] shadow-lg sm:w-72">
            {/* Items */}
            <div className="flex cursor-pointer items-center gap-4 hover:bg-gray-50">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Image src="/svg/prompt.svg" alt="notes" width={24} height={24} />{' '}
              </div>
              <span className={`${interMedium.className} flex-1 text-[1rem] text-[#1A202C]`}>
                Prompt Mood Check-in Action
              </span>
            </div>

            <div className="flex cursor-pointer items-center gap-4 hover:bg-gray-50">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Image src="/svg/note.svg" alt="notes" width={24} height={24} />
              </div>
              <span className={`${interMedium.className} flex-1 text-[1rem] text-[#1A202C]`}>
                Add Note
              </span>
            </div>
            <div className="flex cursor-pointer items-center gap-4 hover:bg-gray-50">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Image src="/svg/check-session.svg" alt="notes" width={24} height={24} />
              </div>
              <span className={`${interMedium.className} flex-1 text-[1rem] text-[#1A202C]`}>
                Schedule Session
              </span>
            </div>
            <div className="flex cursor-pointer items-center gap-4 hover:bg-gray-50">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Image src="/svg/mail.svg" alt="notes" width={24} height={24} />
              </div>
              <span className={`${interMedium.className} flex-1 text-[1rem] text-[#1A202C]`}>
                Send Mail
              </span>
            </div>

            <div className="flex cursor-pointer items-center gap-4 hover:bg-gray-50">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Image src="/svg/download.svg" alt="notes" width={24} height={24} />{' '}
              </div>
              <span className={`${interMedium.className} flex-1 text-[1rem] text-[#1A202C]`}>
                Download Report
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
