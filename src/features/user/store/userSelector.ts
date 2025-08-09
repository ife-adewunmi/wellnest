import type { UserStore } from './userSlice'

export const IsLoggedIn = (state: UserStore) => state.isLoggedIn
export const getUser = (state: UserStore) => state.user
