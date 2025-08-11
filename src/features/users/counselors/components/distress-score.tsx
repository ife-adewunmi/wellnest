import { Badge } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'

export function DistressScore() {
  return (
    <div className="w-full max-w-[465px]">
      {/* <CardTitle className={`${interBold.className} text-[22px] text-[#121417]`}>Distress Score</CardTitle> */}

      <div className="mt-[1rem] w-full rounded-[12px] border border-[#CBD5E0] p-[1rem]">
        {/* Main Usage Stats */}
        <div className="">
          <h2 className={`${interMedium.className} text-[1rem] text-[#0D141C]`}>
            Overall distress score based on analysis
          </h2>
          <div className="">
            <div className={`${interBold.className} text-[2rem] text-[#0D141C]`}>At-Risk</div>
            <div className="flex items-center">
              <span className={`${interRegular.className} text-[0.875rem] text-[#4A739C]`}>
                Current
              </span>
              <span className={`${interRegular.className} text-[0.875rem] text-[#088738]`}>
                +5%
              </span>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 lg:mt-[6.25rem]">
            <div className="h-8 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 sm:h-12 lg:h-[53px]"></div>
            <div
              className={`mt-2 sm:mt-3 lg:mt-[8px] ${interBold.className} flex w-full items-center justify-between text-xs text-[#4A739C] sm:text-sm lg:text-[0.875rem]`}
            >
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
