import React from 'react'
import Image from 'next/image'
import WelcomeMessage from './ui/welcome-message'

export default function LayoutImage() {
return (
  <div className="relative w-full lg:max-w-[530px] xl:max-w-[674px] h-full max-h-[960px] rounded-lg lg:rounded-xl overflow-hidden aspect-[674/960]">
    <Image
      src="/images/onboarding.png"
      alt="Layout"
      width={674}
      height={960}
      className="w-full h-full object-cover rounded-lg lg:rounded-xl"
    />
    <div className="absolute bottom-[10%] left-[7.5%] w-[85%] ">
      <WelcomeMessage />
    </div>
  </div>
)
}
