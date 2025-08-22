import { Card, CardContent, CardHeader, CardTitle } from '@/shared-components/ui/card'
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
    <div className="w-full max-w-[534px] border-[2px] border-[#EDF2F5] bg-[#FFFFFF] px-[1rem] py-[31px]">
      <div className="pb-3">
        <div className="flex items-center justify-between text-lg">
          <span>Pending Issues</span>
          <Settings className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div>
        {issues.length === 0 ? (
          <p className="text-sm text-gray-500">No pending issues</p>
        ) : (
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div key={index} className="flex items-start space-x-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <div>
                  <p className="text-sm text-red-600">{issue.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{issue.semester}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
