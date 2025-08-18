import { UserStore } from './userStore'

// Selectors
export const selectUser = (state: UserStore) => state.user
export const selectIsLoggedIn = (state: UserStore) => !!state.user
export const selectUserLoading = (state: UserStore) => state.isLoading
export const selectUserError = (state: UserStore) => state.error

// Backward compatibility export
export const IsLoggedIn = selectIsLoggedIn
