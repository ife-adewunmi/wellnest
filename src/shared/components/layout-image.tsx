import React from 'react'
import Image from 'next/image'
import WelcomeMessage from './ui/welcome-message'

 export default function LayoutImage(){
  return (
    <div className='relative'>
     <div className=' w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[960px] xl:w-[674px]'>
        <Image 
          src="/images/onboarding.png"
          alt="Layout"
          fill
          className='object-cover object-center'
          sizes="100vw"
          priority
        />
      </div>
        <div className='absolute  bottom-[6rem] left-[5rem]'>

     
     
        <WelcomeMessage />
     </div>
    </div>
  )
}

