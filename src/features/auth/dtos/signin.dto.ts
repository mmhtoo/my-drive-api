import {ApiProperty} from '@nestjs/swagger'
import {IsEmail, IsNotEmpty} from 'class-validator'

export class SignInDto {
  @IsEmail(
    {},
    {
      message: 'Invalid email format!',
    },
  )
  @IsNotEmpty({
    message: 'Email is required!',
  })
  @ApiProperty({})
  email: string

  @IsNotEmpty({
    message: 'Password is required!',
  })
  @ApiProperty({})
  password: string
}
