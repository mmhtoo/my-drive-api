import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import AbstractShareRepository, {
  DeleteInput,
  SaveInput,
  UpdateInput,
} from '../repository/abstract-share.repository'
import {Share} from '../entity/share.entity'
import NodeService from 'src/features/node/services/node.service'

@Injectable()
export default class ShareService {
  constructor(
    private readonly shareRepo: AbstractShareRepository,
    private readonly nodeService: NodeService,
  ) {}

  async createShare(input: SaveInput): Promise<Share> {
    try {
      const nodeData = await this.nodeService.findNodeById({
        id: input.nodeId,
        ownerAccountId: input.ownerAccountId,
      })
      if (!nodeData) throw new NotFoundException('Node not found!')
      if (nodeData.ownerAccountId !== input.ownerAccountId)
        throw new UnauthorizedException('You do not own this node!')
      if (
        input?.allowAccounts?.length > 0 &&
        input.allowAccounts.includes(nodeData.ownerAccountId)
      )
        throw new UnauthorizedException('You cannot share with yourself!')
      return await this.shareRepo.save(input)
    } catch (e) {
      console.log('Error at creating share', e)
      throw e
    }
  }

  async deleteShare(input: DeleteInput): Promise<void> {
    try {
      return await this.shareRepo.delete(input)
    } catch (e) {
      console.log('Error at deleting share', e)
      throw e
    }
  }

  async findSharesByOwnerAccountId(input: string): Promise<Share[]> {
    try {
      return await this.shareRepo.findByOwnerAccountId({id: input})
    } catch (e) {
      console.log('Error at finding shares by owner account id', e)
      throw e
    }
  }

  async findSharesByAllowAccounts(input: string): Promise<Share[]> {
    try {
      return await this.shareRepo.findByAllowAccounts({id: input})
    } catch (e) {
      console.log('Error at finding shares by allow accounts', e)
      throw e
    }
  }

  async updateShare(input: UpdateInput): Promise<Share> {
    try {
      const shareData = await this.nodeService.findNodeById({
        id: input.nodeId,
        ownerAccountId: input.ownerAccountId,
      })
      if (!shareData) throw new NotFoundException('Share not found!')
      if (shareData.ownerAccountId !== input.ownerAccountId)
        throw new UnauthorizedException('You do not own this share!')
      if (
        input?.allowAccounts?.length > 0 &&
        input.allowAccounts.includes(shareData.ownerAccountId)
      )
        throw new UnauthorizedException('You cannot share with yourself!')
      return this.shareRepo.update(input)
    } catch (e) {
      console.log('Error at updateShare ', e)
      throw e
    }
  }
}
