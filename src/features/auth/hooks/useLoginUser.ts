import { useMutation } from '@tanstack/react-query'
import { LoginFormData } from '@/shared/lib/validations'

interface LoginResponse {
  success: boolean
  message?: string
  user?: {
    id: number
    first_name: string
    last_name: string
    email: string
    created_at: string
    updated_at: string
  }
  error?: string
  details?: any
}

const useLoginUser = () => {
  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: async (loginData: LoginFormData) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      return data
    },
  })
}

export default useLoginUser
