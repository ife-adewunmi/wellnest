import { useQuery } from "@tanstack/react-query";
import { db } from "@/shared/db";
import { users } from '@/shared/db/schema';

export async function fetchUsers() {
  const allUsers = await db.select().from(users);
  return allUsers;
}

export function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}