import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { plusJakarta } from '@/shared/styles/fonts'

interface DesktopNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', tab: 'Dashboard' },
  { label: 'Students', path: '/student-table', tab: 'Students' },
  { label: 'Intervention', path: '/intervention', tab: 'Intervention' },
  { label: 'Report', path: '/reports', tab: 'Reports' },
]

export function DesktopNavigation({ activeTab, setActiveTab }: DesktopNavigationProps) {
  const pathname = usePathname()

  return (
    <nav className="hidden w-full max-w-[414px] items-center lg:flex">
      <ul className="flex w-full items-center justify-between">
        {navigationItems.map((item) => (
          <li key={item.tab}>
            <button
              onClick={() => setActiveTab(item.tab)}
              className={`cursor-pointer text-sm hover:text-[#1A202C] lg:text-[0.875rem] ${
                pathname === item.path ? 'text-[#3182CE]' : 'text-[#718096]'
              } ${plusJakarta.className}`}
            >
              <Link href={item.path}>{item.label}</Link>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
