import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/avatar'
import { useUserStore } from '@/features/users/state'
import { interMedium, interRegular, interSemiBold } from '@/shared/styles/fonts'

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
  avatarUrl,
}: StudentProfileProps) {
  const { user } = useUserStore()
  return (
    <div className="flex w-full flex-col items-center">
      <Avatar className="mb-3 h-[103px] w-[92px]">
        <AvatarImage src={user?.avatar || '/placeholder.svg'} alt={name} />
        <AvatarFallback className="bg-gray-300 text-gray-700">
          {name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <div className="flex items-center justify-center text-center">
          <h3 className={`${interSemiBold.className} text-[1rem] text-[#BA6F6A]`}>
            {user?.firstName}
          </h3>
          <h3 className={`${interSemiBold.className} text-[1rem] text-[#BA6F6A]`}>
            {user?.lastName}
          </h3>
        </div>
        <p className={`${interSemiBold.className} text-[11px] text-[#BA6F6A]`}>({user?.id})</p>

        <p className={`text-12px] ${interMedium.className} text-[#BFBFBF]`}>{user?.department}</p>
        <div className="mt-[4px] flex items-center gap-[5px]">
          <div>
            <p className={`${interSemiBold.className} text-[12px] text-[#797C83]`}>
              Current Session
            </p>
            <p className={` ${interRegular.className} text-[11px] text-[#BCBCBC]`}>2024/2025</p>
          </div>
          <div>
            <p className={`${interSemiBold.className} text-[12px] text-[#797C83]`}>
              Current Semester
            </p>
            <p className={` ${interRegular.className} text-[11px] text-[#BCBCBC]`}>2024/2025</p>
          </div>
          <div>
            <p className={`${interSemiBold.className} text-[12px] text-[#797C83]`}>Level</p>
            <p className={` ${interRegular.className} text-[11px] text-[#BCBCBC]`}>2024/2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}
