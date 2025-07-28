"use client"

import { ReportFilters } from "./components/reports-filter"
import { ReportPreview } from "./components/report-preview"
import { useReportData } from "./hooks/use-report-data"


export function ReportsPage() {
  const { data, filters, setFilters, isLoading } = useReportData()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="space-y-6">
          <ReportFilters 
            filters={filters} 
            onFilterChange={setFilters} 
          />
          <ReportPreview 
            data={data} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  )
}