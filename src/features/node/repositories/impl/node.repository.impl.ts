import {Injectable, NotFoundException} from '@nestjs/common'
import AbstractNodeRepository, {
  FindInput,
  SaveNodeInput,
  UpdateNodeByIdInput,
} from '../abstract-node.repository'
import {Node} from '../../entities/node.entity'
import PrismaService from 'src/prisma/prisma.service'
import {Prisma} from '@prisma/client'

@Injectable()
export default class NodeRepositoryImpl implements AbstractNodeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async find(input: FindInput): Promise<Node[]> {
    const result = await this.prismaService.node.findMany({
      where: input,
    })
    return result || []
  }

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

  async deleteById(id: string): Promise<Node | null> {
    try {
      const result = await this.prismaService.node.delete({
        where: {
          id,
        },
      })
      return result || null
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException('Node not found to delete!')
        }
      }
    }
  }
}
