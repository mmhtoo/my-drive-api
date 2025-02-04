import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty} from 'class-validator'

export class RefreshTokenDto {
  @IsNotEmpty({
    message: 'Refresh Token is required!',
  })
  refreshToken: string

  @IsNotEmpty({
    message: 'Access Token is required!',
  })
  accessToken: string
}
