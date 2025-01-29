import {ApiProperty} from '@nestjs/swagger'
import {IsEmail, IsNotEmpty, MaxLength} from 'class-validator'

export class SignUpDto {
  @IsEmail(
    {},
    {
      message: 'Invalid email format!',
    },
  )
  @IsNotEmpty({
    message: 'Email is required!',
  })
  @MaxLength(254, {
    message: 'Email must be less than 254 characters!',
  })
  @ApiProperty({})
  email: string

  @IsNotEmpty({
    message: 'Username is required!',
  })
  @MaxLength(50, {
    message: 'Username must be less than 50 characters!',
  })
  @ApiProperty({})
  username: string

  @IsNotEmpty({
    message: 'Password is required!',
  })
  @MaxLength(200, {
    message: 'Password must be less than 200 characters!',
  })
  @ApiProperty({})
  password: string
}
