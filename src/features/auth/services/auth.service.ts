import {Injectable} from '@nestjs/common'
import AbstractAccountRepository from '../repository/abstract-account.repository'

@Injectable({})
export default class AuthService {
  constructor(private readonly accountRepo: AbstractAccountRepository) {}

  async signUp() {}

  async signIn() {}
}
