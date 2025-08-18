import Link from 'next/link'
import type { StudentTableFooterProps } from './types'

export function StudentTableFooter({
  totalStudents,
  displayedStudents,
  viewAllHref = '/students',
}: StudentTableFooterProps) {
  if (totalStudents <= displayedStudents) {
    return null
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
      <Link href={viewAllHref} className="text-sm font-medium text-blue-600 hover:text-blue-700">
        View all {totalStudents} students →
      </Link>
    </div>
  )
}
