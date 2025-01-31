import {Injectable} from '@nestjs/common'
import AbstractNodeRepository, {
  SaveNodeInput,
  UpdateNodeByIdInput,
} from '../abstract-node.repository'
import {Node} from '../../entities/node.entity'
import PrismaService from 'src/prisma/prisma.service'
import {PrismaPromise} from '@prisma/client'

@Injectable()
export default class NodeRepositoryImpl implements AbstractNodeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  save(input: SaveNodeInput): Promise<Node | null> {
    return this.prismaService.node.create({
      data: input,
    })
  }

  async findById(id: string, ownerAccountId?: string): Promise<Node | null> {
    const result = await this.prismaService.node.findUnique({
      where: {
        id,
        ownerAccountId,
      },
    })
    return result
  }

  async findByName(
    name: string,
    ownerAccountId?: string,
  ): Promise<Array<Node> | null> {
    const result = await this.prismaService.node.findMany({
      where: {
        name,
        ownerAccountId,
      },
    })
    return result
  }

  async updateById(input: UpdateNodeByIdInput): Promise<Node | null> {
    const result = await this.prismaService.node.update({
      where: {
        id: input.id,
      },
      data: input,
    })
    return result
  }

  async deleteById(id: string): Promise<void> {
    await this.prismaService.node.delete({
      where: {
        id,
      },
    })
    return
  }
}
