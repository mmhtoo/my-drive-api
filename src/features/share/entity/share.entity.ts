export interface Share {
  id: string
  nodeId: string
  ownerAccountId: string
  allowAnyOne: boolean
  allowAccounts?: {
    id: string
    username: string
    email: string
  }[]
  createdAt: Date
  updatedAt?: Date
}
