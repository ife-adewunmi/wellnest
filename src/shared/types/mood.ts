export type MoodType = 'HAPPY' | 'GOOD' | 'NEUTRAL' | 'BAD' | 'STRESSED'

export interface MoodCheckIn {
  id: string
  userId: string
  mood: MoodType
  reasons: string[]
  description?: string
  riskScore?: number
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
  mlAnalysis?: {
    riskScore: number
    category: 'low' | 'moderate' | 'high'
    recommendations: string[]
    confidence: number
  }
  createdAt: string
  syncedAt?: string
}
