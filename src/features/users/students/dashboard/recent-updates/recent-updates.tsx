import { Card, CardContent, CardHeader, CardTitle } from '@/shared-components/ui/card'
import { Button } from '@/shared-components/ui/button'
import { Settings } from 'lucide-react'

interface RecentUpdatesProps {
  hasUpdates?: boolean
}

export function RecentUpdates({ hasUpdates = false }: RecentUpdatesProps) {
  return (
    <div className="w-full max-w-[534px] border-[2px] border-[#EDF2F5] bg-[#FFFFFF] px-[1rem] py-[31px]">
      <div className="pb-3">
        <div className="flex items-center justify-between text-lg">
          <span>Recent Portal Updates</span>
          <Settings className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div>
        {!hasUpdates ? (
          <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-100 p-4">
            <p className="text-sm text-yellow-800">
              No news update at this time, check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-3">{/* Add actual updates here when hasUpdates is true */}</div>
        )}
        <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
          View All
        </Button>
      </div>
    </div>
  )
}
