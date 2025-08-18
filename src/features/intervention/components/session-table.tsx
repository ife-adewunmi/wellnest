'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import type { Session } from '../types/session'
import { interMedium, interRegular } from '@/shared/styles/fonts'

interface SessionsTableProps {
  sessions: Session[]
}

export function SessionsTable({ sessions }: SessionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className={`${interRegular.className} text-[0.875rem] text-[#121417]`}>
              Date
            </TableHead>
            <TableHead className={`${interRegular.className} text-[0.875rem] text-[#121417]`}>
              Student
            </TableHead>
            <TableHead className={`${interRegular.className} text-[0.875rem] text-[#121417]`}>
              Intervention Description
            </TableHead>
            <TableHead className={`${interRegular.className} text-[0.875rem] text-[#121417]`}>
              Time
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className={`${interRegular.className} text-[0.875rem] text-[#6B7582]`}>
                {session.date}
              </TableCell>
              <TableCell className={`${interRegular.className} text-[0.875rem] text-[#6B7582]`}>
                {session.student}
              </TableCell>
              <TableCell className={`${interRegular.className} text-[0.875rem] text-[#6B7582]`}>
                {session.intervention}
              </TableCell>
              <TableCell className={`${interRegular.className} text-[0.875rem] text-[#6B7582]`}>
                {session.time}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
