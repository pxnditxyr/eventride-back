import { UserResponse } from './user-response.type'

export class AuthResponse {
  user: UserResponse
  token: string
}
