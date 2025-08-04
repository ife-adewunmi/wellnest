import { Badge } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'

export function DistressScore() {
  return (
    <div className="w-full ">
      <div className="w-full rounded-lg sm:rounded-xl border border-[#CBD5E0] p-3 sm:p-4 lg:p-[1rem]">
        {/* Main Usage Stats */}
        <div className="">
          <h2 className={`${interMedium.className} text-sm sm:text-base lg:text-[1rem] text-[#0D141C]`}>
            Overall distress score based on analysis
          </h2>
          <div className="mt-2 sm:mt-3">
            <div className={`${interBold.className} text-xl sm:text-2xl lg:text-[2rem] text-[#0D141C]`}>At-Risk</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#4A739C]`}>Current</span>
              <span className={`${interRegular.className} text-xs sm:text-sm lg:text-[0.875rem] text-[#088738]`}>+5%</span>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 lg:mt-[6.25rem]">
            <div className="h-8 sm:h-12 lg:h-[53px] bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full"></div>
            <div className={`mt-2 sm:mt-3 lg:mt-[8px] ${interBold.className} text-[#4A739C] text-xs sm:text-sm lg:text-[0.875rem] flex justify-between w-full items-center`}>
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
