import {AccountResponseDto} from '../dtos/account.res.dto'
import {Account} from '../entities/account.entity'

export function mapAccountToDto(account: Account): AccountResponseDto {
  return {
    id: account.id,
    username: account.username,
    email: account.email,
    hasVerified: account.hasVerified,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    imageUrl: account.imageUrl,
  }
}
