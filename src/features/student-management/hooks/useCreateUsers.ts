import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateUserData } from '@/features/users/auth/lib/validations'

interface ApiResponse {
  success: boolean
  user?: any
  error?: string
  details?: any
}

const useCreateUsers = () => {
  const queryClient = useQueryClient()

  return useMutation<ApiResponse, Error, CreateUserData>({
    mutationFn: async (userData: CreateUserData) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export default useCreateUsers
