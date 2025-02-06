import {Injectable} from '@nestjs/common'
import AbstractShareRepository from '../repository/abstract-share.repository'

@Injectable()
export default class ShareService {
  constructor(private readonly shareRepo: AbstractShareRepository) {}
}
