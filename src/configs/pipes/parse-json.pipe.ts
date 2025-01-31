import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import {validate} from 'class-validator'
import {ValidationException} from '../exceptions'

@Injectable()
export default class ParseJsonPipe implements PipeTransform {
  constructor(private readonly classRef: any) {}

  async transform(value: any, _metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      try {
        const parsedData = JSON.parse(String(value))
        const targetObj = Object.assign(new this.classRef(), parsedData)
        const errors = await validate(targetObj)
        if (errors.length > 0) {
          throw new ValidationException(errors, HttpStatus.BAD_REQUEST)
        }
        return targetObj
      } catch (e) {
        console.log(e)
        throw new BadRequestException('Invalid JSON!')
      }
    }
    return value
  }
}
