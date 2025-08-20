import React from 'react'
import { useRouter } from 'next/navigation'
import { Home, CreditCard, BookOpen, FileText, Briefcase, User, LogOut, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
interface NavigationItem {
  icon: React.ComponentType<any>
  label: string
  href: string
  hasSubmenu?: boolean
}

const navigationItems: NavigationItem[] = [
  { icon: Home, label: "My Home", href: "/student" },
  { icon: CreditCard, label: "Payment Accounts", href: "/student/payments", hasSubmenu: true },
  { icon: BookOpen, label: "Courses Management", href: "/student/courses", hasSubmenu: true },
  { icon: FileText, label: "Results Management", href: "/student/results", hasSubmenu: true },
  { icon: Briefcase, label: "SWEP/SIWES Programme", href: "/student/swep", hasSubmenu: true },
  { icon: User, label: "Profile Management", href: "/student/profile", hasSubmenu: true },
  { icon: LogOut, label: "Sign Out", href: "/signin" },
]

export function SidebarNavigation() {
  const router = useRouter()

  const handleNavigation = (href: string, label: string) => {
    if (label === "Sign Out") {
      // Handle sign out logic here
      router.push(href)
    } else {
      router.push(href)
    }
  }

  return (
    <nav className="flex-1 p-2">
      {navigationItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className="w-full justify-start mb-1 h-auto py-3 px-3 text-left hover:bg-gray-100"
          onClick={() => handleNavigation(item.href, item.label)}
        >
          <item.icon className="w-4 h-4 mr-3 text-gray-600" />
          <span className="text-sm text-gray-700 flex-1">{item.label}</span>
          {item.hasSubmenu && <ChevronRight className="w-4 h-4 text-gray-400" />}
        </Button>
      ))}
    </nav>
  )
}
