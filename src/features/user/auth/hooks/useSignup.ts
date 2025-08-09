import { useMutation } from '@tanstack/react-query'
import { SignupCredentials, AuthResponse } from '../types'

const useSignup = () => {
  return useMutation<AuthResponse, Error, SignupCredentials>({
    mutationFn: async (credentials: SignupCredentials) => {
      // Create an AbortController for timeout handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        const data = await response.json()
        console.log('data', data)

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create user')
        }

        return data
      } catch (error) {
        clearTimeout(timeoutId)
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Signup request timed out. Please try again.')
        }
        throw error
      }
    },
  })
}

export default useSignup
