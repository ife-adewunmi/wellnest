import { useMutation } from '@tanstack/react-query'
import { LoginFormData } from '@/shared/lib/validations'
import { User } from '../types'

interface LoginResponse {
  success: boolean
  message?: string
  user?: User
  error?: string
  details?: any
}

const useLoginUser = () => {
  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: async (loginData: LoginFormData) => {
      // Create an AbortController for timeout handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to login')
        }

        return data
      } catch (error) {
        clearTimeout(timeoutId)
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Login request timed out. Please try again.')
        }
        throw error
      }
    },
  })
}

export default useLoginUser
