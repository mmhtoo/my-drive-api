import {
  BadRequestException,
  Body,
  Controller,
  Header,
  Post,
} from '@nestjs/common'
import {SignUpDto} from '../dtos/signup.dto'

@Controller({
  version: '1',
  path: 'auth',
})
export default class AuthController {
  constructor() {}

  @Post('signup')
  signupAccount(@Body() signupDto: SignUpDto) {
    console.log(signupDto)
    throw new BadRequestException('Bad Request')
    return 'signup'
  }

  @Post('signin')
  signinAccount() {
    return 'signin'
  }
}
