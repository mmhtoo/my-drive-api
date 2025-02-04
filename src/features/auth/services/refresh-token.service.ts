import {Injectable} from '@nestjs/common'
import AbstractRefreshTokenRepository, {
  UpdateInput,
} from '../repository/abstract-refresh-token.repository'
import {RefreshToken} from '../entities/refresh-token.entity'
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library'
import {randomUUID} from 'crypto'
import DuplicateRefreshTokenException from '../exceptions/duplicate-refresh-token.exception'

@Injectable()
export default class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepo: AbstractRefreshTokenRepository,
  ) {}

  async createNewToken(accountId: string): Promise<RefreshToken> {
    try {
      const result = await this.refreshTokenRepo.save({
        accountId,
        refreshToken: randomUUID(),
      })
      return result
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new DuplicateRefreshTokenException(
            'Failed to create refresh token!',
          )
        }
      }
    }
  }

  async updateTokenAsClaimed(input: UpdateInput): Promise<RefreshToken | null> {
    const result = await this.refreshTokenRepo.updateById(input)
    return result
  }

  async findByTokenAndAccountId(
    token: string,
    accountId: string,
  ): Promise<RefreshToken | null> {
    const result = await this.refreshTokenRepo.findByTokenAndAccountId(
      token,
      accountId,
    )
    return result
  }

  async deleteHasClaimedTokens(): Promise<void> {
    await this.refreshTokenRepo.deleteHasClaimedTokens()
    return
  }
}
