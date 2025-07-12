import React from 'react'
import Image from 'next/image'
import WelcomeMessage from './ui/welcome-message'

 export default function LayoutImage(){
  return (
    <div className='relative'>
        <div className='w-max '>

      
      <Image 
        src="/assets/images/onboarding.png"
        alt="Layout"
        width={674}
        height={960}
        className=''
      />
        </div>
        <div>

     
     
        <WelcomeMessage />
     </div>
    </div>
  )
}

