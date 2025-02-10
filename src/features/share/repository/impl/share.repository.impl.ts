import {Injectable} from '@nestjs/common'
import AbstractShareRepository, {
  DeleteInput,
  FindByAllowAccountsInput,
  FindByOwnerAccountIdInput,
  SaveInput,
  UpdateInput,
} from '../abstract-share.repository'
import {Share} from '../../entity/share.entity'
import PrismaService from 'src/prisma/prisma.service'
import ShareException from '../../exceptions/share.exceptions'
import {mapToShare} from '../../mappers/mapToShare'

interface DispatchAccountsToSharesInput {
  newAllowAccounts: string[]
  oldAllowAccounts: string[]
  shareId: string
}

@Injectable()
export default class ShareRepositoryImpl implements AbstractShareRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(input: SaveInput): Promise<Share> {
    try {
      const shareSaveResult = await this.prismaService.share.create({
        data: {
          nodeId: input.nodeId,
          ownerAccountId: input.ownerAccountId,
          allowAnyOne: input.allowAnyOne,
        },
      })
      const accountToSharesResult =
        await this.prismaService.accountsToShares.createManyAndReturn({
          data:
            input.allowAccounts?.map((accountId) => ({
              accountId,
              shareId: shareSaveResult.id,
            })) || [],
          select: {
            account: true,
            share: true,
            accountId: true,
            shareId: true,
            createdAt: true,
          },
        })
      return mapToShare({
        ...shareSaveResult,
        allowAccounts: accountToSharesResult || [],
      })
    } catch (e) {
      console.log('Error at saving share', e)
      throw new ShareException('Failed to share!')
    }
  }

  async findByOwnerAccountId(
    input: FindByOwnerAccountIdInput,
  ): Promise<Share[]> {
    try {
      const shareResult = await this.prismaService.share.findMany({
        where: {
          ownerAccountId: input.id,
        },
        include: {
          accountToShares: {
            include: {
              account: true,
              share: true,
            },
          },
        },
      })
      return shareResult.map((shareResult) =>
        mapToShare({
          ...shareResult,
          allowAccounts: shareResult.accountToShares || [],
        }),
      )
    } catch (e) {
      console.log('Error at finding shares by owner account id', e)
      throw e
    }
  }

  async delete(input: DeleteInput): Promise<void> {
    try {
      await this.prismaService.share.delete({
        where: {
          id: input.id,
          ownerAccountId: input.ownerAccountId,
        },
      })
      return
    } catch (e) {
      console.log('Error at deleting share', e)
      throw new ShareException('Failed to delete share!')
    }
  }

  async findByAllowAccounts(input: FindByAllowAccountsInput): Promise<Share[]> {
    try {
      const shareResults = await this.prismaService.share.findMany({
        where: {
          accountToShares: {
            some: {
              accountId: input.id,
            },
          },
        },
        include: {
          accountToShares: {
            include: {
              account: true,
              share: true,
            },
          },
        },
      })
      return shareResults.map((share) =>
        mapToShare({
          ...share,
          allowAccounts: share.accountToShares,
        }),
      )
    } catch (e) {
      console.log('Error at finding shares by allow accounts', e)
      throw e
    }
  }

  async update(input: UpdateInput): Promise<Share> {
    try {
      const shareResult = await this.prismaService.share.update({
        where: {
          id: input.id,
          ownerAccountId: input.ownerAccountId,
        },
        data: {
          allowAnyOne: input.allowAnyOne,
        },
        include: {
          accountToShares: {
            select: {
              accountId: true,
            },
          },
        },
      })
      const newAllowAccounts = input.allowAccounts
      const oldAllowAccounts = shareResult.accountToShares.map(
        (accountToShare) => accountToShare.accountId,
      )
      const accountToShareResult = await this.dispatchAccountsToShares({
        newAllowAccounts,
        oldAllowAccounts,
        shareId: input.id,
      })
      return mapToShare({
        ...shareResult,
        allowAccounts: accountToShareResult,
      })
    } catch (e) {
      console.log('Error at updating share', e)
      throw e
    }
  }

  private async dispatchAccountsToShares(input: DispatchAccountsToSharesInput) {
    try {
      const accountsToDelete = input.oldAllowAccounts.filter(
        (accountId) => !input.newAllowAccounts.includes(accountId),
      )
      const accountsToAdd = input.newAllowAccounts.filter(
        (accountId) => !input.oldAllowAccounts.includes(accountId),
      )
      await this.prismaService.accountsToShares.deleteMany({
        where: {
          shareId: input.shareId,
          accountId: {
            in: accountsToDelete,
          },
        },
      })
      return await this.prismaService.accountsToShares.createManyAndReturn({
        data: accountsToAdd.map((accountId) => ({
          accountId,
          shareId: input.shareId,
        })),
        select: {
          account: true,
          share: true,
          accountId: true,
          shareId: true,
          createdAt: true,
        },
      })
    } catch (e) {
      console.log('Error at dispatching accounts to shares', e)
      throw e
    }
  }
}
