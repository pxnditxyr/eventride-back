
export class TwoFactorAuthEntity {
  id: string
  email: string
  secret: string
  isVerified: boolean
  isRevoked: boolean
  createdAt: Date
  expiresAt: Date
  updatedAt: Date
}
