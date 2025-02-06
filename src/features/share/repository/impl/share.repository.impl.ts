import {Injectable} from '@nestjs/common'
import AbstractShareRepository from '../abstract-share.repository'

@Injectable()
export default class ShareRepositoryImpl implements AbstractShareRepository {}
