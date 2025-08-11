'use client'

import Image from 'next/image'
import { interBold } from '@/shared/styles/fonts'
import { siteConfig } from '@/shared/config/site'

export function HeaderLogo() {
  return (
    <div className="flex w-full max-w-[206px] items-center justify-center gap-1 sm:gap-2 lg:justify-start">
      <div className="flex">
        <Image
          src={siteConfig.logoLink}
          alt="Logo"
          width={16}
          height={16}
          className="h-4 w-4 sm:h-5 sm:w-5"
        />
      </div>
      <span className={`text-lg font-semibold text-gray-900 ${interBold.className}`}>
        {siteConfig.logoText}
      </span>
    </div>
  )
}
