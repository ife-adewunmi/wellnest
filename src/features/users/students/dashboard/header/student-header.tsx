import { interExtraBold, interRegular } from '@/shared/styles/fonts'
import Image from 'next/image'
import { useUserStore } from '@/features/users/state'

export function StudentHeader() {
  const { user } = useUserStore()
  return (
    <header className="relative w-full max-w-[533px]">
      <Image src="/images/dashboard-img.png" alt="Header" width={533} height={207} />

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="flex items-center gap-2">
          <h1 className={`text-[2rem] text-[#D3D0D1] ${interExtraBold.className}`}>
            {user?.firstName}
          </h1>
          <h1 className={`text-[2rem] text-[#D3D0D1] ${interExtraBold.className}`}>
            {user?.lastName}
          </h1>
        </div>
        <p className={`text-[2rem] text-[#D3D0D1] ${interExtraBold.className}`}>{user?.role}</p>

        <p className={`${interRegular.className} mt-2 text-[0.875rem] text-[#A8807E]`}>
          Welcome back to your portal account! You can start by using the menu dashboard to navigate
          the portal
        </p>
      </div>
    </header>
  )
}
