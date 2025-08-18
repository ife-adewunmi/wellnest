import React from 'react'
import type { StudentReportData } from '../types/report-types'
interface ReportPreviewProps {
  data: StudentReportData[]
  isLoading: boolean
}

export function ReportPreview({ data, isLoading }: ReportPreviewProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-1/4 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-4 rounded bg-gray-200"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200"></div>
            <div className="h-4 w-4/6 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="py-8 text-center">
          <div className="mb-2 text-lg text-gray-500">No reports found</div>
          <div className="text-sm text-gray-400">
            Try adjusting your filters to see more results
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Report Results ({data.length} {data.length === 1 ? 'report' : 'reports'})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Report
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Date Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Export Type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  {report.report}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {report.student}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {report.level}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  <span className="capitalize">{report.gender}</span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {report.startDate} - {report.endDate}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {report.exportType?.toUpperCase() || 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
