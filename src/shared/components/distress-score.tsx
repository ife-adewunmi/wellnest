import { Badge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { interBold, interMedium, interRegular } from "../styles/fonts";

export function DistressScore() {
  return (
<div className="w-full max-w-[465px]">


        <CardTitle className={`${interBold.className} text-[22px] text-[#121417]`}>Distress Score</CardTitle>
    
  
          <div className="w-full rounded-[12px] border border-[#CBD5E0] p-[1rem] mt-[1rem]">
                    {/* Main Usage Stats */}
                    <div className="">
                      <h2 className={`${interMedium.className} text-[1rem] text-[#0D141C]`}>Overall distress score based on analysis</h2>
                      <div className="">
                        <div className={`${interBold.className} text-[2rem] text-[#0D141C]`}>At-Risk</div>
                        <div className="flex items-center">
                          <span className={`${interRegular.className} text-[0.875rem] text-[#4A739C]`}>Current</span>
                          <span className={`${interRegular.className} text-[0.875rem] text-[#088738]`}>+5%</span>
                        </div>
                      </div>
                 
        

          <div className="mt-[2.1875rem]">
            <div className="h-[53px] bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full"></div>
            <div className={`mt-[8px] ${interBold.className} text-[#4A739C] text-[0.875rem] flex justify-between w-full items-center`}>
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
