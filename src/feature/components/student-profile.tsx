import React from 'react'
import { useViewContext } from '@/context/view-context'
import Avatar from '@/shared/components/ui/avatar'
import { interBold, monropeRegular } from '@/fonts'
import { MoodHistoryChart } from '@/shared/components/line-charts'
import { Button } from '@/shared/components/ui/custom-button'
import ScreenTimeDashboard from '@/shared/components/average-screen-time'
import Submenu from '@/shared/components/submenu'

interface Student {
  id: string
  studentId: string
  lastCheckIn: string
  riskLevel: "High" | "Medium" | "Low"
  mood: string
  screenTime: string
}

interface ProfileProps {
  student: Student | null
}

const Profile = ({ student }: ProfileProps) => {
  const { setCurrentView } = useViewContext();
  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No student selected</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1152px]">
      <div className="bg-white ">
        <div className='flex items-center justify-between'>

        </div>
         <div className="flex items-center gap-[1rem]">
      <Avatar
          
              size={128}
              type="user"
            //   headerImage={user?.header_image}
            //   profilePicture={user?.thumbnail}
              // ✅ Forces fallback to DefaultThumbnail on this page only
            />
          <div className='flex flex-col'>

      
          <div className="flex items-center"> 
              <label className={`text-[#4A739C] text-[1rem] ${monropeRegular.className}`}>Risk Level</label>
              <span className={`text-[#4A739C] text-[1rem] ${monropeRegular.className} `}>
                {student.riskLevel}
              </span>
            </div>
              <div className='flex items-center'>
              <label className={`text-[#4A739C] text-[1rem] ${monropeRegular.className} `}>Student ID</label>
              <p className={`text-[#4A739C] text-[1rem] ${monropeRegular.className} `}>{student.studentId}</p>
            </div>
            <div>
    </div>
         

    
           
          </div>

       
        </div>
        <div>
          <Submenu />
        </div>
        <div className="flex flex-col"></div>
        <div className='flex items-center w-full justify-between mt-[3rem] mb-[1rem]'>

   
 <label className={` ${interBold.className} text-[#121417] text-[1.375rem]`}>Mood History</label>
 <Button
 variant="dropdown"
 >
Weekly
 </Button>
      </div>
       <MoodHistoryChart />
       </div>
       <div className="flex flex-col">

      

    <div className='flex items-center w-full justify-between mt-[3rem] mb-[1rem]'>

   
 <label className={` ${interBold.className} text-[#121417] text-[1.375rem]`}>Screen Time</label>
 <Button
 variant="dropdown"
 >
Weekly
 </Button>
   </div>
 <ScreenTimeDashboard />
 </div>
    
        {/* Back button */}

        <div className="mt-6 p">
          <button
            onClick={() => setCurrentView('students')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Students Table
          </button>
        </div>
      </div>
 
  )
}

export default Profile
