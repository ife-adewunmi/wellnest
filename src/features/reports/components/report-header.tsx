'use client'

import { CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/custom-button'
import { interMedium, interSemiBold } from '@/shared/styles/fonts'
import { Download } from 'lucide-react'

interface ReportHeaderProps {
  onDownload?: () => void
  isDownloading?: boolean
}

export function ReportHeader({ onDownload, isDownloading }: ReportHeaderProps) {
  return (
    <CardHeader>
  <div className="flex w-full justify-between flex-wrap gap-4">
    <div className='w-full max-w-[83%] min-w-[200px]'>
      <CardTitle>Reports</CardTitle>
      <CardDescription className="mt-[1rem]">
        Generate, preview, and export individual or aggregate student well-being reports
      </CardDescription>
    </div>
    <div className='mt-[10px] flex justify-end lg:mt-0 lg:w-auto lg:h-[48px]'>
      <Button 
        variant="ghost"
        className={`${interMedium.className} text-sm lg:text-[0.875rem] text-[#4A5568] self-start sm:self-auto`}
        onClick={onDownload}
        disabled={isDownloading}
      >
        {isDownloading ? 'Generating...' : 'Download Report'}
      </Button>
    </div>
  </div>
</CardHeader>

  )
}
