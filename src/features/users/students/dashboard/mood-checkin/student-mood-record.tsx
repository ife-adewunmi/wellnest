'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared-components/ui/card'
import { Button } from '@/shared-components/ui/button'
import { MoodCheckInForm } from '@/features/mood/components/mood-check-in-form'
import { Dialog, DialogContent, DialogTrigger } from '@/shared-components/ui/dialog'
import { interBold, interRegular } from '@/shared/styles/fonts'
import Image from 'next/image'
export function StudentMoodRecord() {
  const [showMoodForm, setShowMoodForm] = useState(false)

  return (
    <div className="flex w-full flex-col justify-center rounded-[12px] border border-[#CBD5E0] bg-[#F7FAFC] p-[15px]">
      <span className={`${interBold.className} text-center text-[19px] text-[#111111]`}>
        How do you feel today?
      </span>

      <div className="flex flex-col items-center justify-center">
        <Dialog open={showMoodForm} onOpenChange={setShowMoodForm}>
          <DialogTrigger asChild>
            <Button className={`${interRegular.className} text-[15px] text-[#545454]`}>
              Record Mood
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <MoodCheckInForm userName={'user.name'} onSuccess={() => setShowMoodForm(false)} />
          </DialogContent>
        </Dialog>

        <div className="mb-4 flex items-center">
          <Image src="/images/good.png" alt="Happy" width={53} height={53} />
          <Image src="/images/happy.png" alt="Happy" width={53} height={53} />
          <Image src="/images/neutral.png" alt="Happy" width={53} height={53} />
          <Image src="/images/bad.png" alt="Happy" width={53} height={53} />
          <Image src="/images/sad.png" alt="Happy" width={53} height={53} />
        </div>
      </div>
    </div>
  )
}
