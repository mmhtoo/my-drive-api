import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common'
import {SignUpDto} from '../dtos/signup.dto'
import {SignInDto} from '../dtos/signin.dto'
import AuthService from '../services/auth.service'
import {dataResponse} from 'src/shared/utils/response-helper'
import {Public} from 'src/configs/decorators'
import {Request as ExpressReq} from 'express'
import {AppJwtPayload} from '../mappers'
import AccountService from '../services/account.service'
import {mapAccountToDto} from '../mappers/mapAccountEntityToDto'
import {RefreshTokenDto} from '../dtos/refresh-token.dto'
import RefreshTokenService from '../services/refresh-token.service'

@Controller({
  version: '1',
  path: 'auth',
})
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

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

  @Get('whoami')
  async whoAmI(@Request() req: ExpressReq) {
    const reqUser = req.user as AppJwtPayload
    if (!reqUser.userId) {
      throw new UnauthorizedException()
    }
    const userData = await this.accountService.findAccountById(reqUser.userId)
    return dataResponse(mapAccountToDto(userData), 'Success!', HttpStatus.OK)
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    try {
      const result = await this.refreshTokenService.refreshToken(
        dto.refreshToken,
        dto.accessToken,
      )
      return dataResponse(result, 'Success!', HttpStatus.OK)
    } catch (e) {
      console.log('Error at refreshToken ', e)
      throw e
    }
  }
}
