export interface RefreshToken {
  id: number
  token: string
  hasClaimed: boolean
  createdAt: Date
  updatedAt?: Date
  accountId: string
}
