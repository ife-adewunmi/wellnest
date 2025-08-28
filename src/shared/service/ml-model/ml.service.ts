// Frontend ML service using the shared Request helper
// Calls the internal Next.js proxy route at /api/ml/predict

import { request } from '../request'

export type PredictRequest = { features: any }
export type PredictResponse = {
  success: boolean
  error?: string
  data: ModelResponse
}

export type ModelResponse = {
  prediction: number
  proba: number
  stress_level: number
}

export interface PredictOptions {
  timeout?: number
  headers?: Record<string, string>
}

export class MLService {
  // Predict via the Next.js API route, which proxies to the Python ML API
  static async predict(url: string, data: any, options?: PredictOptions): Promise<PredictResponse> {
    const result = await request.post(url, data, {
      timeout: options?.timeout ?? 60_000,
      // headers: {
      //   ...(options?.headers || {}),
      // },
    })

    return result as PredictResponse
  }
}
