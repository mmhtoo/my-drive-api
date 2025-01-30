import {Account} from '../entities/account.entity'

export type AppJwtPayload = {
  userId: string
  username: string
  email: string
  imageUrl?: string
}

export function mapAccountToJwtPayload(account: Account): AppJwtPayload {
  return {
    userId: account.id,
    username: account.username,
    email: account.email,
    imageUrl: account.imageUrl,
  }
}
