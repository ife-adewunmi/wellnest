import { api } from '@/shared/service/api'
import type { MoodType } from '@/shared/types/mood'

export interface MoodCheckInData {
  mood: MoodType
  reasons?: string[]
  description?: string
}

export interface MoodCheckInResponse {
  id: string
  mood: MoodType
  reasons: string[]
  description?: string
  riskScore?: number
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
}

export async function submitMoodCheckIn(data: MoodCheckInData): Promise<MoodCheckInResponse> {
  const response = await api.post('/api/mood-check-in', data)
  return response.data as MoodCheckInResponse
}

export async function getMoodHistory(userId: string, limit = 30): Promise<MoodCheckInResponse[]> {
  const response = await api.get(`/api/mood-check-in/history?userId=${userId}&limit=${limit}`)
  return response.data as MoodCheckInResponse[]
}

export async function analyzeMood(checkInId: string): Promise<{
  riskScore: number
  category: 'low' | 'moderate' | 'high'
  recommendations: string[]
}> {
  const response = await api.post<{
    riskScore: number
    category: 'low' | 'moderate' | 'high'
    recommendations: string[]
  }>(`/api/analyze`, { checkInId })
  return response.data
}
