import { Endpoints } from '@/shared-enums/endpoints'
import { request } from '@/shared/service/request'
import { PredictRequest, PredictResponse } from './ml.service'

interface MLApiRequests {
  predictedData: (input: PredictRequest) => Promise<PredictResponse>
}

export class MLApi implements MLApiRequests {
  /**
   * Send a new request to the ML modal
   */
  public async predictedData(input: PredictRequest): Promise<PredictResponse> {
    try {
      return await request.post(Endpoints.ML.PREDICT, input.features)
    } catch (error) {
      console.error('Failed to fetch prediction from model:', error)
      throw error
    }
  }
}

export const mlApi = new MLApi()
