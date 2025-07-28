"use client"

import { Badge } from "@/shared/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import type { LogEntry } from "../types/session"
import { interRegular } from "@/shared/styles/fonts"

interface LogHistoryTableProps {
  logEntries: LogEntry[]
}

export function LogHistoryTable({ logEntries }: LogHistoryTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
            {status}
          </Badge>
        )
      case "Scheduled":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {status}
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            {status}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className={`${interRegular.className} text-[#121417] text-[0.875rem]`}>Date</TableHead>
            <TableHead className={`${interRegular.className} text-[#121417] text-[0.875rem]`}>Student</TableHead>
            <TableHead className={`${interRegular.className} text-[#121417] text-[0.875rem]`}>Intervention</TableHead>
            <TableHead className={`${interRegular.className} text-[#121417] text-[0.875rem]`}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logEntries.map((entry, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className={`${interRegular.className} text-[#6B7582] text-[0.875rem]`}>{entry.date}</TableCell>
              <TableCell className={`${interRegular.className} text-[#6B7582] text-[0.875rem]`}>{entry.student}</TableCell>
              <TableCell className={`${interRegular.className} text-[#6B7582] text-[0.875rem]`}>{entry.intervention}</TableCell>
              <TableCell>{getStatusBadge(entry.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
