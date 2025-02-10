import {AccountToShare} from '../entity/account-to-share.entity'
import {Share} from '../entity/share.entity'

export interface MapToShareInput {
  id: string
  nodeId: string
  ownerAccountId: string
  allowAnyOne?: boolean
  allowAccounts: AccountToShare[]
  createdAt: Date
  updatedAt: Date
}

export function mapToShare(input: MapToShareInput): Share {
  return {
    id: input.id,
    nodeId: input.nodeId,
    ownerAccountId: input.ownerAccountId,
    allowAnyOne: input.allowAnyOne,
    allowAccounts: input.allowAccounts?.map((accountToShare) => ({
      id: accountToShare.accountId,
      username: accountToShare.account.username,
      email: accountToShare.account.email,
    })),
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
  }
}
