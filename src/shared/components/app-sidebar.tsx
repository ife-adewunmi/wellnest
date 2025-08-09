'use client'

import { Home, Users, MessageSquare, Calendar, FileText, Settings, Bell } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from './ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User } from '@/user/auth/types'
import { useEffect } from 'react'

interface AppSidebarProps {
  user: User
}

const counselorNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Students',
    url: '/students',
    icon: Users,
  },
  {
    title: 'Intervention',
    url: '/intervention',
    icon: Calendar,
  },
  {
    title: 'Messages',
    url: '/messages',
    icon: MessageSquare,
    badge: 3,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: FileText,
  },
  {
    title: 'Notifications',
    url: '/notifications',
    icon: Bell,
    badge: 5,
  },
]

const studentNavItems = [
  {
    title: 'Dashboard',
    url: '/student',
    icon: Home,
  },
  {
    title: 'Messages',
    url: '/student/messages',
    icon: MessageSquare,
    badge: 1,
  },
  {
    title: 'Sessions',
    url: '/student/sessions',
    icon: Calendar,
  },
  {
    title: 'Privacy',
    url: '/student/privacy',
    icon: Settings,
  },
]

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const navItems = user.role === 'COUNSELOR' ? counselorNavItems : studentNavItems

  // Prefetch the intervention page for faster navigation
  useEffect(() => {
    if (user.role === 'COUNSELOR' && router.prefetch) {
      router.prefetch('/intervention')
    }
  }, [router, user.role])

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-sm font-bold text-white">⚠</span>
            </div>
            <span className="font-semibold">Distress Detection</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || '/placeholder.svg'} />
            <AvatarFallback>{`${user?.firstName} ${user?.lastName}`}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
            <p className="text-muted-foreground text-xs capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
