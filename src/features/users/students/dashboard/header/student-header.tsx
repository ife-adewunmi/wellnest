import { interBold, interExtraBold, interRegular } from '@/shared/styles/fonts'
import Image from 'next/image'
import { useUserStore } from '@/features/users/state'

export function StudentHeader() {
  const {user} = useUserStore()
  return (
  <header className="w-full max-w-[533px] relative">
    <Image 
      src="/images/dashboard-img.png"
      alt="Header"
      width={533}
      height={207}
    />

    {/* Centered content */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-center gap-2">
        <h1 className={`text-[#D3D0D1] text-[2rem] ${interExtraBold.className}`}>
          {user?.firstName}
        </h1>
        <h1 className={`text-[#D3D0D1] text-[2rem] ${interExtraBold.className}`}>
          {user?.lastName}
        </h1>
      </div>
      <p className={`text-[#D3D0D1] text-[2rem] ${interExtraBold.className}`}>{user?.role}</p>

      <p className={`${interRegular.className} text-[0.875rem] text-[#A8807E] mt-2`}>
        Welcome back to your portal account! You can start by using the
        menu dashboard to navigate the portal
      </p>
    </div>
  </header>
)

}

