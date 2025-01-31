import {
  IsBoolean,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator'
import {NodeType} from '../entities/node.entity'
import {ApiProperty} from '@nestjs/swagger'

export class CreateNodeDto {
  @IsNotEmpty({
    message: 'Name is required!',
  })
  @MaxLength(200, {
    message: 'Name must not exceed 200 characters!',
  })
  @ApiProperty()
  name: string

  @IsNotEmpty({
    message: 'Type is required!',
  })
  @IsEnum(NodeType, {
    message: 'Invalid node type, must be FILE or FOLDER!',
  })
  @ApiProperty()
  type: keyof typeof NodeType

  @ApiProperty()
  parentId?: string

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
