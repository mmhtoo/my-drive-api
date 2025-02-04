import {Injectable} from '@nestjs/common'
import AbstractRefreshTokenRepository, {
  UpdateInput,
} from '../repository/abstract-refresh-token.repository'
import {RefreshToken} from '../entities/refresh-token.entity'
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library'
import {randomUUID} from 'crypto'
import DuplicateRefreshTokenException from '../exceptions/duplicate-refresh-token.exception'
import {InvalidCredentialsException} from '../exceptions/invalid-credentials.exceptionn'
import {JwtService} from '@nestjs/jwt'
import {AppJwtPayload} from '../mappers'

export interface RefreshTokenOutput {
  refreshToken: string
  accessToken: string
}

@Injectable()
export default class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepo: AbstractRefreshTokenRepository,
    private readonly jwtService: JwtService,
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

  async refreshToken(
    refreshToken: string,
    accessToken: string,
  ): Promise<RefreshTokenOutput> {
    const decodedToken = this.jwtService.decode(accessToken) as AppJwtPayload
    const result = await this.findByTokenAndAccountId(
      refreshToken,
      decodedToken.userId,
    )
    if (!result || result.hasClaimed) {
      throw new InvalidCredentialsException('Invalid token to refresh!')
    }
    const newAccessToken = this.jwtService.sign({
      userId: decodedToken.userId,
      username: decodedToken.username,
      email: decodedToken.email,
      imageUrl: decodedToken.imageUrl,
    })
    // create new
    const newRefreshToken = await this.createNewToken(decodedToken.userId)
    // update token as claimed
    this.updateTokenAsClaimed({
      id: result.id,
      refreshToken: result.token,
      ...result,
      hasClaimed: true,
    })
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
    }
  }
}
