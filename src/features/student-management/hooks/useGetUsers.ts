import { useQuery } from '@tanstack/react-query'
import {
  studentApi,
  type StudentListItem,
} from '@/features/student-management/services/student-api'

export async function fetchUsers() {
  // Use API route via request client to avoid server-only imports
  const data = await studentApi.list({ limit: 50 })
  return data
}

export function useGetUsers() {
  return useQuery<StudentListItem[]>({
    queryKey: ['users', { limit: 50 }],
    queryFn: fetchUsers,
  })
}
