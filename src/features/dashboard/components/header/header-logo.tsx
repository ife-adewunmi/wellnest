import Image from 'next/image'
import { interBold } from '@/shared/styles/fonts'

export function HeaderLogo() {
  return (
    <div className="flex w-full max-w-[206px] items-center justify-center gap-1 sm:gap-2 lg:justify-start">
      <div className="flex">
        <Image
          src="/svg/distress.svg"
          alt="Logo"
          width={16}
          height={16}
          className="h-4 w-4 sm:h-5 sm:w-5"
        />
      </div>
      <h1
        className={`text-lg text-[#121417] sm:text-xl lg:text-[1.25rem] ${interBold.className}`}
      >
        Distress Detection
      </h1>
    </div>
  )
}
