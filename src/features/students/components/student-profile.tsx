import { AvatarFallback, AvatarImage, Avatar } from "@/components/avatar"
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
  return (
    <div className="flex flex-col items-center border-b">
      <Avatar className="w-16 h-16 mb-3">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="bg-gray-300 text-gray-700">
          {name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h3 className={`${interSemiBold.className} text-[#BA6F6A] text-[1rem]`}>{name}</h3>
        <p  className={`${interSemiBold.className} text-[#BA6F6A] text-[1rem]`}>({studentId})</p>
        <p className={`text-[#BFBFBF] text-[12px] ${interMedium.className}`}>{department}</p>
        <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-500">
          <div>
            <p className={`${interSemiBold.className} text-[#797C83] text-[12px]`}>Current Session</p>
            <p className={`${interRegular.className} text-[#BCBCBC] text-[11px}`}>{currentSession}</p>
          </div>
          <div>
            <p  className={`${interSemiBold.className} text-[#797C83] text-[12px]`}>Current Semester</p>
            <p className={`${interRegular.className} text-[#BCBCBC] text-[11px}`}>{currentSemester}</p>
          </div>
          <div>
            <p  className={`${interSemiBold.className} text-[#797C83] text-[12px]`}>Level</p>
            <p className={`${interRegular.className} text-[#BCBCBC] text-[11px}`}>{level}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
