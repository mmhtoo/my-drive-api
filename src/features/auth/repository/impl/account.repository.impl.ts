import {Injectable} from '@nestjs/common'
import AbstractAccountRepository, {
  SaveAccountInput,
  SaveAccountOutput,
  UpdateAccountByEmailInput,
  UpdateAccountByIdInput,
} from '../abstract-account.repository'
import {Account} from '@prisma/client'
import PrismaService from 'src/prisma/prisma.service'

@Injectable({})
export default class AcountRepositoryImpl implements AbstractAccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(input: SaveAccountInput): Promise<SaveAccountOutput | null> {
    const result = await this.prismaService.account.create({
      data: input,
    })
    return result || null
  }

  async findById(id: string): Promise<Account | null> {
    const result = await this.prismaService.account.findUnique({
      where: {
        id,
      },
    })
    return result || null
  }

  async findByEmail(email: string): Promise<Account | null> {
    const result = await this.prismaService.account.findUnique({
      where: {
        email: email,
      },
    })
    return result || null
  }

  async updateAccountById(
    input: UpdateAccountByIdInput,
  ): Promise<Account | null> {
    const result = await this.prismaService.account.update({
      where: {
        id: input.id,
      },
      data: input,
    })
    return result
  }

  async updateAccountByEmail(
    input: UpdateAccountByEmailInput,
  ): Promise<Account | null> {
    const result = await this.prismaService.account.update({
      where: {
        email: input.email,
      },
      data: input,
    })
    return result || null
  }
}
