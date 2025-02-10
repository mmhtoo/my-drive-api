import {Share} from '../entity/share.entity'

export interface SaveInput {
  nodeId: string
  ownerAccountId: string
  allowAnyOne?: boolean
  allowAccounts?: string[]
}

export interface UpdateInput extends SaveInput {
  id: string
}

export interface FindByOwnerAccountIdInput {
  id: string
}

export interface DeleteInput {
  id: string
  ownerAccountId: string
}

export interface FindByAllowAccountsInput {
  id: string
}

export default abstract class AbstractShareRepository {
  abstract save(input: SaveInput): Promise<Share>
  abstract findByOwnerAccountId(
    input: FindByOwnerAccountIdInput,
  ): Promise<Share[]>
  abstract delete(input: DeleteInput): Promise<void>
  abstract findByAllowAccounts(
    input: FindByAllowAccountsInput,
  ): Promise<Share[]>
  abstract update(input: UpdateInput): Promise<Share>
}
