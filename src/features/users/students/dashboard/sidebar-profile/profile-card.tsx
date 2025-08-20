import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { useUserStore } from '@/features/users/state'
import { interMedium, interRegular, interSemiBold } from "@/shared/styles/fonts"


interface StudentProfileProps {
  name: string
  studentId: string
  department: string
  currentSession: string
  currentSemester: string
  level: string
  avatarUrl?: string
}

export function StudentProfile({
  name,
  studentId,
  department,
  currentSession,
  currentSemester,
  level,
  avatarUrl
}: StudentProfileProps) {
      const { user } = useUserStore()
  return (
    <div className="flex flex-col items-center w-full">
      <Avatar className="w-[92px] h-[103px] mb-3">
        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="bg-gray-300 text-gray-700">
          {name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <div  className=" flex items-center text-center justify-center">
        <h3 className={`${interSemiBold.className} text-[#BA6F6A] text-[1rem]`}>{user?.firstName}</h3>
           <h3 className={`${interSemiBold.className} text-[#BA6F6A] text-[1rem]`}>{user?.lastName}</h3>
           </div>
        <p className={`${interSemiBold.className} text-[#BA6F6A] text-[11px]`}>({user?.id})</p>
     
        <p className={`text-12px] ${interMedium.className} text-[#BFBFBF]`}>{user?.department}</p>
        <div className="flex items-center gap-[5px] mt-[4px]">
          <div>
            <p className={`${interSemiBold.className} text-[12px] text-[#797C83]`}>Current Session</p>
            <p className={` ${interRegular.className} text-[#BCBCBC] text-[11px]`}>2024/2025</p>
          </div>
          <div>
            <p className={`${interSemiBold.className} text-[12px] text-[#797C83]`}>Current Semester</p>
            <p className={` ${interRegular.className} text-[#BCBCBC] text-[11px]`}>2024/2025</p>

          </div>
          <div>
            <p className={`${interSemiBold.className} text-[12px] text-[#797C83]`}>Level</p>
                        <p className={` ${interRegular.className} text-[#BCBCBC] text-[11px]`}>2024/2025</p>

          </div>
        </div>
      </div>
    </div>
  )
}
