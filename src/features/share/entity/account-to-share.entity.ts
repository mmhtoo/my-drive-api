import {Account} from 'src/features/auth/entities/account.entity'
import {Share} from './share.entity'

export interface AccountToShare {
  accountId: string
  shareId: string
  account: Account
  share: Share
  createdAt: Date
}
