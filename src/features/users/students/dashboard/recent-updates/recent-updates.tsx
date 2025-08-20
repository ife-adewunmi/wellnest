import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings } from 'lucide-react'

interface RecentUpdatesProps {
  hasUpdates?: boolean
}

export function RecentUpdates({ hasUpdates = false }: RecentUpdatesProps) {
  return (
    <div className="bg-[#FFFFFF] border-[2px] px-[1rem] py-[31px] border-[#EDF2F5] w-full max-w-[534px]">
      <div className="pb-3">
        <div className="flex items-center justify-between text-lg">
          <span>Recent Portal Updates</span>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div>
        {!hasUpdates ? (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              No news update at this time, check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Add actual updates here when hasUpdates is true */}
          </div>
        )}
        <Button 
          variant="destructive" 
          size="sm"
          className="bg-red-600 hover:bg-red-700"
        >
          View All
        </Button>
      </div>
    </div>
  )
}
