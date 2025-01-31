import {ApiProperty} from '@nestjs/swagger'
import {Transform} from 'class-transformer'
import {IsBoolean, IsOptional, IsUUID} from 'class-validator'

export class GetNodesDto {
  @IsUUID(undefined, {
    message: 'Invalid parent id!',
  })
  @IsOptional({})
  @ApiProperty()
  parentId?: string

  @IsBoolean({
    message: 'Invalid value for isIncludeHidden, must be boolean value!',
  })
  @IsOptional({})
  @Transform(({value}) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  })
  @ApiProperty()
  isIncludeHidden?: boolean
}
