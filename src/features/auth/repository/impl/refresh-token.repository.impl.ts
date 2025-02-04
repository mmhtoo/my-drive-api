import {Injectable} from '@nestjs/common'
import AbstractRefreshTokenRepository, {
  SaveInput,
  UpdateInput,
} from '../abstract-refresh-token.repository'
import {RefreshToken} from '@prisma/client'
import PrismaService from 'src/prisma/prisma.service'

@Injectable()
export default class RefreshTokenRepositoryImpl
  implements AbstractRefreshTokenRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  save(input: SaveInput): Promise<RefreshToken> {
    return this.prismaService.refreshToken.create({
      data: {
        token: input.refreshToken,
        accountId: input.accountId,
      },
    })
  }

  updateById(input: UpdateInput): Promise<RefreshToken | null> {
    return this.prismaService.refreshToken.update({
      where: {
        id: input.id,
      },
      data: {
        token: input.refreshToken,
        hasClaimed: input.hasClaimed,
      },
    })
  }

  findByTokenAndAccountId(
    token: string,
    accountId: string,
  ): Promise<RefreshToken | null> {
    return this.prismaService.refreshToken.findUnique({
      where: {
        token,
        accountId,
      },
    })
  }

  async deleteHasClaimedTokens(): Promise<void> {
    await this.prismaService.refreshToken.deleteMany({
      where: {
        hasClaimed: true,
      },
    })
    return
  }
}
