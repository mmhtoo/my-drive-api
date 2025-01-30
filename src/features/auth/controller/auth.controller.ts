import {Body, Controller, HttpStatus, Post} from '@nestjs/common'
import {SignUpDto} from '../dtos/signup.dto'
import {SignInDto} from '../dtos/signin.dto'
import AuthService from '../services/auth.service'
import {dataResponse} from 'src/shared/utils/response-helper'
import {Public} from 'src/configs/decorators'

@Controller({
  version: '1',
  path: 'auth',
})
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signupAccount(@Body() signUpDto: SignUpDto) {
    const result = await this.authService.signUp(signUpDto)
    return dataResponse(result, 'Successfully signed up!', HttpStatus.CREATED)
  }

  @Public()
  @Post('signin')
  async signinAccount(@Body() signInDto: SignInDto) {
    const result = await this.authService.signIn(signInDto)
    return dataResponse(result, 'Success!', HttpStatus.OK)
  }
}
