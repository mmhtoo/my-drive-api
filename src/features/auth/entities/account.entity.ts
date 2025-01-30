export interface Account {
  id: string
  username: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date
  hasVerified: boolean
  imageUrl?: string
}
