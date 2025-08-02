"use client"

import { Home, Users, MessageSquare, Calendar, FileText, Settings, Bell } from "lucide-react"
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
} from "./ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { User } from "@/shared/types/auth"

interface AppSidebarProps {
  user: User
}

const counselorNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
  },
  {
    title: "Intervention",
    url: "/intervention",
    icon: Calendar,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    badge: 3,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    badge: 5,
  },
]

const studentNavItems = [
  {
    title: "Dashboard",
    url: "/student",
    icon: Home,
  },
  {
    title: "Messages",
    url: "/student/messages",
    icon: MessageSquare,
    badge: 1,
  },
  {
    title: "Sessions",
    url: "/student/sessions",
    icon: Calendar,
  },
  {
    title: "Privacy",
    url: "/student/privacy",
    icon: Settings,
  },
]

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const navItems = user.role === "COUNSELOR" ? counselorNavItems : studentNavItems

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚠</span>
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
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
