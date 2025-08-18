import { isServer } from '@/shared/lib/is-server'
import { LoginCredentials } from '@/users/auth/types'

export const rememberUser = (user: LoginCredentials) => {
  if (isServer) return

  if (user.email && user.password) {
    localStorage.setItem('rememberEmail', user.email)
    localStorage.setItem('rememberPassword', user.password)
  } else {
    localStorage.removeItem('rememberEmail')
    localStorage.removeItem('rememberPassword')
  }
}
