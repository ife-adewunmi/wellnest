import { request } from '@/shared/service/request'
import { AuthResponse, LoginCredentials, SignupCredentials } from '@/users/auth/types'
import { Endpoints } from '@/shared/enums/endpoints'

interface AuthApiRequests {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  signup: (credentials: SignupCredentials) => Promise<AuthResponse>
  logout: () => Promise<void>
}

export class AuthApi implements AuthApiRequests {
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await request.post(Endpoints.API.concat(Endpoints.AUTH_ROUTES.SIGNIN), credentials)
  }

  public async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    return await request.post(Endpoints.API.concat(Endpoints.AUTH_ROUTES.SIGNUP), credentials)
  }

  public async logout(): Promise<void> {
    return await request.post(Endpoints.API.concat(Endpoints.AUTH_ROUTES.SIGNOUT))
  }
}

export const authApi = new AuthApi()
