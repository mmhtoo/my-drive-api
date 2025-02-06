import {
  IsBoolean,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class UpdateNodeDto {
  @IsNotEmpty({
    message: 'Name is required!',
  })
  @MaxLength(200, {
    message: 'Name must not exceed 200 characters!',
  })
  @ApiProperty()
  name: string

  @IsBoolean({
    message: 'Invalid value!',
  })
  @IsOptional({})
  @ApiProperty()
  isHidden?: boolean

  @IsJSON({
    message: 'Invalid metadata, must be json string!',
  })
  @IsOptional({})
  @ApiProperty()
  metadata?: string
}
