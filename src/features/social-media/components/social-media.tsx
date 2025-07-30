import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/shared/components/ui/custom-button'

import Image from 'next/image'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'

export default function Component() {
  const socialMediaData = [
    {
      name: 'Facebook',
      time: '18 h 3 m',
      icon: <Image src="/svg/facebook.svg" alt="Twitter" width={40} height={40} />,
      // Facebook blue
    },
    {
      name: 'TikTok',
      time: '394 h 90 m',
      icon: <Image src="/svg/tiktok.svg" alt="Twitter" width={40} height={40} />, // TikTok red
    },
    {
      name: 'Telegram',
      time: '3 h 0 m',
      icon: <Image src="/svg/telegram.svg" alt="Twitter" width={40} height={40} />, // Telegram blue
    },
    {
      name: 'X',
      time: '69 h 41 m',
      icon: <Image src="/svg/tweeter.svg" alt="Twitter" width={40} height={40} />,
    },
    {
      name: 'Instagram',
      time: '137 h 39 m',
      icon: <Image src="/svg/insta.svg" alt="Twitter" width={40} height={40} />, // Instagram red
    },
  ]

  return (
    <div className="w-full max-w-[639px]">
      <CardHeader className="flex w-full flex-row items-center justify-between">
        <h1 className={`${interBold.className} text-[22px] text-[#121417]`}>
          Social Media Activity
        </h1>
        <Button variant="dropdown" className="flex items-center gap-[8px]">
          Monthly
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CardHeader>

      <div className="mt-[1rem] w-full rounded-[12px] border border-[#CBD5E0] p-[1rem]">
        {/* Main Usage Stats */}
        <div className="">
          <h2 className={`${interMedium.className} text-[1rem] text-[#0D141C]`}>
            Most used social media app
          </h2>
          <div className="">
            <div className={`${interBold.className} text-[2rem] text-[#0D141C]`}>40 h 5 m</div>
            <div className="flex items-center">
              <span className={`${interRegular.className} text-[0.875rem] text-[#4A739C]`}>
                Last 30 days
              </span>
              <span className={`${interRegular.className} text-[0.875rem] text-[#088738]`}>
                +5%
              </span>
            </div>
          </div>
        </div>

        {/* Social Media Grid */}
        <div className="mt-[2rem] flex w-full items-center justify-between">
          {socialMediaData.map((platform, index) => (
            <div key={index} className="flex flex-col items-center gap-[1rem]">
              <div>
                {platform.name === 'Facebook' && <span>{platform.icon}</span>}
                {platform.name === 'TikTok' && <span>{platform.icon}</span>}
                {platform.name === 'YouTube' && <span>{platform.icon}</span>}
                {platform.name === 'Telegram' && <span>{platform.icon}</span>}
                {platform.name === 'X' && <span>{platform.icon}</span>}{' '}
                {platform.name === 'Instagram' && <span>{platform.icon}</span>}
              </div>

              {/* Platform Name */}
              <div className="flex flex-col items-center">
                <div className={`${interMedium.className} text-[11px] text-[#4A739C]`}>
                  {platform.name}
                </div>

                {/* Usage Time */}
                <div className={`${interBold.className} text-[12px] text-[#4A739C]`}>
                  {platform.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
