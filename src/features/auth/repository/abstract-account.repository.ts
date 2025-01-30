import {Account} from '../entities/account.entity'

export type SaveAccountInput = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>
export type SaveAccountOutput = Account
export type UpdateAccountByIdInput = Omit<Account, 'createdAt' | 'updatedAt'>
export type UpdateAccountByEmailInput = Omit<
  Account,
  'id' | 'createdAt' | 'updatedAt'
>

export default abstract class AbstractAccountRepository {
  abstract save(input: SaveAccountInput): Promise<SaveAccountOutput | null>
  abstract findById(id: string): Promise<Account | null>
  abstract findByEmail(email: string): Promise<Account | null>
  abstract updateAccountById(
    input: UpdateAccountByIdInput,
  ): Promise<Account | null>
  abstract updateAccountByEmail(
    input: UpdateAccountByEmailInput,
  ): Promise<Account | null>
}
