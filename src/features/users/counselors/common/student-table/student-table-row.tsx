'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import type { StudentTableRowProps } from './types'
import {
  getMoodEmoji,
  getRiskLevelColor,
  formatScreenTime,
  formatCheckInDate,
  formatLastCheckIn,
} from './utils'

export function StudentTableRow({ student }: StudentTableRowProps) {
  const router = useRouter()

  const handleStudentClick = (studentId: string) => {
    router.push(`/students/${studentId}`)
  }

  return (
    <tr
      className="cursor-pointer transition-colors hover:bg-gray-50"
      key={student.id}
      onClick={() => handleStudentClick(student.id)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              {student.avatar ? (
                <img className="h-10 w-10 rounded-full" src={student.avatar} alt={student.name} />
              ) : (
                <span className="font-medium text-gray-600">
                  {student.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">{student.studentId}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
        {formatLastCheckIn(student.lastCheckIn)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs leading-5 font-semibold ${getRiskLevelColor(student.riskLevel)}`}
        >
          {student.riskLevel}
        </span>
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
        <span className="flex items-center gap-2">
          <span className="text-lg">{getMoodEmoji(student.currentMood)}</span>
          {student.currentMood || 'Unknown'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
        {formatScreenTime(student.screenTimeToday!)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          href={`/students/${student.id}`}
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Eye className="mr-1 h-3 w-3" />
          View Detail
        </Link>
      </td>
    </tr>
  )
}
