import {PrismaPromise} from '@prisma/client'
import {Node, NodeType} from '../entities/node.entity'

export interface SaveNodeInput {
  name: string
  type: keyof typeof NodeType
  isHidden: boolean
  extension?: string
  parentId?: string
  ownerAccountId: string
  metadata?: string
  size?: number
  sourceLink?: string
  isArchived?: boolean
}

export interface UpdateNodeByIdInput extends Partial<SaveNodeInput> {
  id: string
}

export default abstract class AbstractNodeRepository {
  abstract save(input: SaveNodeInput): Promise<Node | null>
  abstract findById(id: string, ownerAccountId?: string): Promise<Node | null>
  abstract findByName(
    name: string,
    ownerAccountId?: string,
  ): Promise<Array<Node> | null>
  abstract updateById(input: UpdateNodeByIdInput): Promise<Node | null>
  abstract deleteById(id: string): Promise<void>
}
