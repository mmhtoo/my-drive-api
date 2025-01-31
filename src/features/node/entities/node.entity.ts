export const NodeType = {
  FILE: 'FILE',
  FOLDER: 'FOLDER',
}

export interface Node {
  id: string
  name: string
  type: keyof typeof NodeType
  parentId?: string
  size?: number
  createdAt: Date
  updatedAt: Date
  isArchived: boolean
  archivedAt?: Date
  metadata?: string
  isHidden: boolean
  extension: string
  ownerAccountId: string
  sourceTempLink?: string
  sourceRefKey?: string
}
