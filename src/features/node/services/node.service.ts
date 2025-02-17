import {HttpStatus, Injectable} from '@nestjs/common'
import AbstractNodeRepository, {
  UpdateNodeByIdInput,
} from '../repositories/abstract-node.repository'
import {Node, NodeType} from '../entities/node.entity'
import {CreateNodeException} from '../exceptions/create-node.exception'
import {InvalidParentException} from '../exceptions/invalid-parent.exception'
import {Prisma} from '@prisma/client'

export interface CreateNodeInput {
  name: string
  type: keyof typeof NodeType
  isHidden: boolean
  extension?: string
  parentId?: string
  ownerAccountId: string
  metadata?: string
  size?: number
  sourceTempLink?: string
  sourceRefKey?: string
}

export interface ArchiveNodeInput {
  id: string
  isArchived: boolean
  ownerAccountId: string
}

export interface FindNodeByIdInput {
  id: string
  ownerAccountId: string
}

export interface DeleteNodeByIdInput {
  id: string
  ownerAccountId: string
}

export interface GetNodesInput {
  ownerAccountId: string
  parentId?: string
  isIncludeHidden?: boolean
}

@Injectable()
export default class NodeService {
  constructor(private readonly nodeRepo: AbstractNodeRepository) {}

  async createNode(input: CreateNodeInput): Promise<Node | null> {
    try {
      // check if parent node exists and parent node's type must be FOLDER
      if (input.parentId) {
        const result = await this.findNodeById({
          id: input.parentId,
          ownerAccountId: input.ownerAccountId,
        })
        if (!result)
          throw new InvalidParentException('Invalid parent id reference!')
        if (result.type !== NodeType.FOLDER)
          throw new InvalidParentException('Parent node must be a folder!')
      }
      const result = await this.nodeRepo.save(input)
      return result || null
    } catch (e) {
      console.log('Error at createNode', e)
      throw new CreateNodeException(
        e?.message || 'Failed to create node!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async updateArchiveNode(input: ArchiveNodeInput): Promise<Node | null> {
    try {
      const result = await this.nodeRepo.updateById(input)
      return result || null
    } catch (e) {
      console.log('Error at updateArchiveNode', e)
      throw new CreateNodeException(
        e?.message || 'Failed to update node!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findNodeById(input: FindNodeByIdInput): Promise<Node | null> {
    try {
      const result = await this.nodeRepo.findById(
        input.id,
        input.ownerAccountId,
      )
      return result || null
    } catch (e) {
      console.log('Error at findNodeById', e)
      throw new CreateNodeException(
        e?.message || 'Failed to find node!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async forceDeleteNode(input: DeleteNodeByIdInput): Promise<Node | null> {
    try {
      return await this.nodeRepo.deleteById(input.id)
    } catch (e) {
      console.log('Error at forceDeleteNode', e)
      throw new CreateNodeException(
        e?.message || 'Failed to delete node!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async getNodes(input: GetNodesInput): Promise<Node[]> {
    try {
      const result = await this.nodeRepo.find({
        parentId: input.parentId,
        ownerAccountId: input.ownerAccountId,
        isHidden: input.isIncludeHidden,
      })
      return result || []
    } catch (e) {
      console.log('Error at getNodes', e)
      throw new CreateNodeException(
        e?.message || 'Failed to get nodes!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async updateNode(input: UpdateNodeByIdInput): Promise<Node | null> {
    try {
      const result = await this.nodeRepo.updateById(input)
      return result || null
    } catch (e) {
      console.log('Error at updateNode', e)
      throw new CreateNodeException(
        e?.message || 'Failed to update node!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
