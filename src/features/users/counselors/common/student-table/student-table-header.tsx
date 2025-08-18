import Link from 'next/link'
import type { StudentTableHeaderProps } from './types'

export function StudentTableHeader({
  title = 'Student Overview',
  description = 'Monitor all assigned students',
  viewAllHref = '/students',
}: StudentTableHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Link href={viewAllHref} className="text-sm font-medium text-blue-600 hover:text-blue-700">
        View all →
      </Link>
    </div>
  )
}
