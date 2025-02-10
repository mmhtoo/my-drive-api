import {ApiProperty} from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

export class CreateShareDto {
  @IsNotEmpty({
    message: 'Node id is required!',
  })
  @IsUUID(undefined, {
    message: 'Invalid node id!',
  })
  @ApiProperty()
  nodeId: string

  @IsBoolean({
    message: 'Invalid value, must be boolean!',
  })
  @IsOptional()
  @ApiProperty()
  allowAnyOne: boolean

  @IsArray({
    message: 'Invalid value, must be string array!',
  })
  @IsOptional()
  @IsString({
    each: true,
  })
  allowAccounts: string[]
}
