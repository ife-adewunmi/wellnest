import { Home, CreditCard, BookOpen, FileText, Briefcase, User, LogOut, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/custom-button"

interface NavigationItem {
  icon: React.ComponentType<any>
  label: string
  href: string
  hasSubmenu?: boolean
}

const navigationItems: NavigationItem[] = [
  { icon: Home, label: "My Home", href: "/home" },
  { icon: CreditCard, label: "Payment Accounts", href: "/payments", hasSubmenu: true },
  { icon: BookOpen, label: "Courses Management", href: "/courses", hasSubmenu: true },
  { icon: FileText, label: "Results Management", href: "/results", hasSubmenu: true },
  { icon: Briefcase, label: "SWEP/SIWES Programme", href: "/swep", hasSubmenu: true },
  { icon: User, label: "Profile Management", href: "/profile", hasSubmenu: true },
  { icon: LogOut, label: "Sign Out", href: "/logout" },
]

export function SidebarNavigation() {
  return (
    <nav className="flex-1 p-2">
      {navigationItems.map((item, index) => (
        <Button
          key={index}
         
          className="w-full flex justify-start mb-1 h-auto py-3 px-3 text-left "
        >
          <item.icon className="w-4 h-4 mr-3 text-gray-600" />
          <span className="text-sm text-gray-700 flex-1">{item.label}</span>
          {item.hasSubmenu && <ChevronRight className="w-4 h-4 text-gray-400" />}
        </Button>
      ))}
    </nav>
  )
}
