import {HttpStatus, Injectable} from '@nestjs/common'
import AbstractAccountRepository, {
  SaveAccountInput,
  SaveAccountOutput,
  UpdateAccountByEmailInput,
  UpdateAccountByIdInput,
} from '../repository/abstract-account.repository'
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library'
import {DuplicateAccountException} from '../exceptions'
import {Account} from '../entities/account.entity'

@Injectable({})
export default class AccountService {
  constructor(private readonly accountRepo: AbstractAccountRepository) {}

  async createAccount(
    input: SaveAccountInput,
  ): Promise<SaveAccountOutput | null> {
    try {
      const savedAccount = await this.accountRepo.save(input)
      return savedAccount || null
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new DuplicateAccountException(
            'Email already exists!',
            HttpStatus.BAD_REQUEST,
          )
        }
      }
    }
  }

  async findAccountById(id: string): Promise<Account | null> {
    const result = await this.accountRepo.findById(id)
    return result || null
  }

  async findAccountByEmail(email: string): Promise<Account | null> {
    const result = await this.accountRepo.findByEmail(email)
    return result || null
  }

  async updateAccountById(
    input: UpdateAccountByIdInput,
  ): Promise<Account | null> {
    try {
      const result = await this.accountRepo.updateAccountById(input)
      return result
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new DuplicateAccountException(
            'Email already exists!',
            HttpStatus.BAD_REQUEST,
          )
        }
      }
    }
  }

  async updateAccountByEmail(
    input: UpdateAccountByEmailInput,
  ): Promise<Account | null> {
    try {
      const result = await this.accountRepo.updateAccountByEmail(input)
      return result || null
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new DuplicateAccountException(
            'Email already exists!',
            HttpStatus.BAD_REQUEST,
          )
        }
      }
    }
  }
}
