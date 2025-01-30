import {Account} from '../entities/account.entity'

export function mapAccountToSignUpOutput(
  account: Account,
  tokenOptions: {
    refreshToken: string
    accessToken: string
  },
) {
  return {
    id: account.id,
    username: account.username,
    email: account.email,
    hasVerified: account.hasVerified,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    imageUrl: account.imageUrl,
    refreshToken: tokenOptions.refreshToken,
    accessToken: tokenOptions.accessToken,
  }
}
