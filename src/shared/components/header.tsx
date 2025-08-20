'use client'

import { Button } from '@/components/ui/button'
import { Bell, Settings, Moon, Clock, MessageSquare, LogOut } from "lucide-react"

import { useRouter } from 'next/navigation'
import { User } from '@/features/users/auth/types'
import Image from 'next/image'
import { interRegular } from '../styles/fonts'

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/signin')
    router.refresh()
  }

  return (
    <header className="flex w-full justify-center py-[23px]">
      <div className='w-full max-w-[1379px] flex justify-between'>
        <div className='flex items-center'>
        <Image 
          src="/images/header-img.png"
          alt="Logo"
          width={25}
          height={29}
        />
        <p className={`${interRegular.className} text-[17px] text-[#B96D68]`}>OAUSTECH</p>
        <span className={`${interRegular.className} text-[8px] text-[#C1AE7F]`}>EDUPORTAL</span>
</div>
      {/* <SidebarTrigger className="-ml-1" /> */}
{/* 
      <div className="flex flex-1 items-center gap-4">
      
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input placeholder="Search students, sessions, or messages..." className="pl-10" />
        </div>
      </div> */}
 <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Moon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Clock className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="outline" onClick={handleSignOut} size="sm" className="cursor-pointer text-red-500 border-none hover:bg-red-50 bg-[#E9EFED]">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}
