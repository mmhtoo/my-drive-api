import {Injectable} from '@nestjs/common'
import AbstractAccountRepository from '../abstract-account.repository'

@Injectable({})
export default class AcountRepositoryImpl
  implements AbstractAccountRepository {}
