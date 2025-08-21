import { Card, CardContent, CardHeader, CardTitle } from "@/shared-components/ui/card"
import { Settings, AlertCircle } from 'lucide-react'

interface PendingIssue {
  message: string
  semester: string
  isUrgent?: boolean
}

interface PendingIssuesProps {
  issues: PendingIssue[]
}

export function PendingIssues({ issues }: PendingIssuesProps) {
  return (
    <div className="bg-[#FFFFFF] border-[2px] px-[1rem] py-[31px] border-[#EDF2F5] w-full max-w-[534px]">
      <div className="pb-3">
        <div className="flex items-center justify-between text-lg">
          <span>Pending Issues</span>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div>
        {issues.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending issues</p>
        ) : (
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div key={index} className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-600">{issue.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{issue.semester}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
