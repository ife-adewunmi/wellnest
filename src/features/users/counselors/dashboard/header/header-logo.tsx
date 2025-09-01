'use client'

import Image from 'next/image'
import { interBold, interRegular } from '@/shared/styles/fonts'
import { siteConfig } from '@/shared/config/site'

interface HeaderLogoProps {
  isStudent: boolean
}

export function HeaderLogo({ isStudent }: HeaderLogoProps) {
  return (
    <div className="flex w-full max-w-[206px] items-center justify-center gap-1 sm:gap-2 lg:justify-start">
      <div className="flex">
        <Image
          src={isStudent ? siteConfig.portal.logoImage : siteConfig.logoLink}
          alt="Logo"
          width={isStudent ? 25 : 16}
          height={isStudent ? 29 : 16}
          className="h-4 w-4 sm:h-5 sm:w-5"
        />
      </div>
      {isStudent ? (
        <>
          <p className={`${interRegular.className} text-[17px] text-[#B96D68]`}>
            {siteConfig.portal.schoolName}
          </p>
          <span className={`${interRegular.className} text-[8px] text-[#C1AE7F]`}>
            {siteConfig.portal.title}
          </span>
        </>
      ) : (
        <span className={`text-lg font-semibold text-gray-900 ${interBold.className}`}>
          {siteConfig.logoText}
        </span>
      )}
    </div>
  )
}
