"use client"

import { CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/custom-button"
import { interSemiBold } from "@/shared/styles/fonts"
import { Download } from "lucide-react"

interface ReportHeaderProps {
  onDownload?: () => void
  isDownloading?: boolean
}

export function ReportHeader({ onDownload, isDownloading }: ReportHeaderProps) {
  return (
    <CardHeader className="">
      <div className="flex justify-between">
        <div>
          <CardTitle>Reports</CardTitle>
          <CardDescription className="mt-[1rem] ">
            Generate, preview, and export individual or aggregate student well-being reports
          </CardDescription>
        </div>
        <div>

        
        <Button variant="ghost"
        onClick={onDownload} disabled={isDownloading}>
          {isDownloading ? "Generating..." : "Download Report"}
        </Button>
        </div>
      </div>
    </CardHeader>
  )
}
