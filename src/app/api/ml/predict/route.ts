import { CustomError, request } from '@/shared/service/request'
import { MLService } from '@/src/shared/service/ml-model/ml.service'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // adjust based on your Vercel plan limits

export async function POST(req: NextRequest) {
  try {
    const baseUrl = process.env.ML_API_BASE_URL
    if (!baseUrl) {
      return NextResponse.json({ error: 'ML_API_BASE_URL not configured' }, { status: 500 })
    }

    const payload = await req.json()
    const url = `${baseUrl.replace(/\/$/, '')}/predict`

    const result = await MLService.predict(url, payload)

    if (!result.success) {
      return NextResponse.json(result)
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 201 },
    )

    // const data = await request.post(url, payload, {
    //   headers: {
    //     ...(process.env.ML_API_KEY ? { 'x-api-key': process.env.ML_API_KEY } : {}),
    //   },
    //   timeout: 60_000,
    // })

    return NextResponse.json(result)
  } catch (err: any) {
    if (err instanceof CustomError) {
      const status = typeof err.errorCode === 'number' ? err.errorCode : err.response?.status || 500
      return NextResponse.json(
        { error: err.errorText || 'Upstream request failed', details: err.response?.data },
        { status },
      )
    }
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 })
  }
}
