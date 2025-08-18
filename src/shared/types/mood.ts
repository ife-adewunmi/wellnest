import type { MoodType, RiskLevel, MLRiskCategory } from './common.types'

export interface MoodCheckIn {
  id: string
  userId: string
  mood: MoodType
  reasons: string[]
  description?: string
  riskScore?: number
  riskLevel?: RiskLevel
  mlAnalysis?: {
    riskScore: number
    category: MLRiskCategory
    recommendations: string[]
    confidence: number
  }
  createdAt: string
  syncedAt?: string
}
