"use client"

import { useEffect, useState } from "react"
import { ReportData, ReportFilterValues } from "../types/report-types"
import { getReports } from "../services/report-service"

// Fixed TypeScript error by adding missing required properties
export function useReportData() {
  const [data, setData] = useState<ReportData[]>([])
  const [filters, setFilters] = useState<ReportFilterValues>({
    reportType: "academic",
    student: "",
    level: "400",
    startDate: "",
    endDate: "",
    exportType: "xlsx"
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const reports = await getReports(filters)
        setData(reports)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [filters])

  return { data, filters, setFilters, isLoading }
}
