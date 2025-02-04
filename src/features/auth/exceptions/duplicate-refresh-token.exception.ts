import {InternalServerErrorException} from '@nestjs/common'

export default class DuplicateRefreshTokenException extends InternalServerErrorException {}
