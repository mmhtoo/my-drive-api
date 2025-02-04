import {RefreshToken} from '@prisma/client'

export interface SaveInput {
  refreshToken: string
  accountId: string
}

export interface UpdateInput extends SaveInput {
  id: number
  hasClaimed?: boolean
}

export default abstract class AbstractRefreshTokenRepository {
  abstract save(input: SaveInput): Promise<RefreshToken>
  abstract updateById(input: UpdateInput): Promise<RefreshToken | null>
  abstract findByTokenAndAccountId(
    token: string,
    accountId: string,
  ): Promise<RefreshToken | null>
  abstract deleteHasClaimedTokens(): Promise<void>
}
