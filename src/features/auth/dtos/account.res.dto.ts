export type AccountResponseDto = {
  id: string
  username: string
  email: string
  hasVerified: boolean
  createdAt: Date
  updatedAt?: Date
  imageUrl?: string
}
