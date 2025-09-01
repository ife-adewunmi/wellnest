import { NextRequest, NextResponse } from 'next/server'
import { ReportService } from '@/features/users/counselors/services/reports.service'
import { ReportFilters } from '@/users/counselors/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action parameter is required' },
        { status: 400 },
      )
    }

    if (action === 'generate') {
      return await handleGenerateReport(searchParams)
    }

    if (action === 'summary') {
      return await handleSummaryReport(searchParams)
    }

    return NextResponse.json({ success: false, error: 'Invalid action parameter' }, { status: 400 })
  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

async function handleGenerateReport(searchParams: URLSearchParams) {
  const studentId = searchParams.get('studentId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const department = searchParams.get('department')
  const level = searchParams.get('level')

  if (!studentId || !startDate || !endDate) {
    return NextResponse.json(
      { success: false, error: 'studentId, startDate, and endDate are required' },
      { status: 400 },
    )
  }

  const filters: ReportFilters = {
    startDate,
    endDate,
    ...(department && { department }),
    ...(level && { level }),
  }

  const result = await ReportService.generateStudentReport(studentId, filters)

  if (!result.success) {
    return NextResponse.json(result, { status: 400 })
  }

  return NextResponse.json(result)
}

async function handleSummaryReport(searchParams: URLSearchParams) {
  const counselorId = searchParams.get('counselorId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const department = searchParams.get('department')
  const level = searchParams.get('level')
  const studentId = searchParams.get('studentId')

  if (!counselorId || !startDate || !endDate) {
    return NextResponse.json(
      { success: false, error: 'counselorId, startDate, and endDate are required' },
      { status: 400 },
    )
  }

  const filters: ReportFilters = {
    startDate,
    endDate,
    ...(department && { department }),
    ...(level && { level }),
    ...(studentId && { studentId }),
  }

  const result = await ReportService.generateStudentsSummaryReport(counselorId, filters)

  if (!result.success) {
    return NextResponse.json(result, { status: 400 })
  }

  return NextResponse.json(result)
}
