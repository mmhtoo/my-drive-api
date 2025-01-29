import {Injectable} from '@nestjs/common'
import AbstractAccountRepository from '../repository/abstract-account.repository'

@Injectable({})
export default class AccountService {
  constructor(private readonly accountRepo: AbstractAccountRepository) {}
}
