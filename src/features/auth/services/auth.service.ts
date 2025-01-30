import {Injectable} from '@nestjs/common'
import AccountService from './account.service'
import {InvalidCredentialsException} from '../exceptions/invalid-credentials.exceptionn'
import {ConfigService} from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
import {mapAccountToJwtPayload, mapAccountToSignUpOutput} from '../mappers'

type SignUpInput = {
  email: string
  username: string
  password: string
}

export type SignUpOutput = {
  id: string
  username: string
  email: string
  hasVerified: boolean
  createdAt: Date
  updatedAt?: Date
  imageUrl?: string
} & SignInOutput

type SignInInput = {
  email: string
  password: string
}

type SignInOutput = {
  refreshToken: string
  accessToken: string
}

@Injectable({})
export default class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(input: SignUpInput): Promise<SignUpOutput> {
    try {
      const saltRounds = this.configService.get<number>('SALT_ROUND') || 10
      const salt = await bcrypt.genSalt(Number(saltRounds))
      const hashedPassword = await bcrypt.hash(input.password, salt)
      // save to database
      const result = await this.accountService.createAccount({
        ...input,
        password: hashedPassword,
        hasVerified: false,
      })
      // need to send verification email
      const autoSignInResult = await this.signIn({
        email: input.email,
        password: input.password,
      })
      return mapAccountToSignUpOutput(result, autoSignInResult)
    } catch (e) {
      throw e
    }
  }

  async signIn(input: SignInInput): Promise<SignInOutput> {
    try {
      const result = await this.accountService.findAccountByEmail(input.email)
      if (!result) {
        throw new InvalidCredentialsException('Invalid Credentials!')
      }
      // check password
      const isPasswordCorrect = await bcrypt.compare(
        input.password,
        result.password,
      )

      if (!isPasswordCorrect) {
        throw new InvalidCredentialsException('Invalid Credentials!')
      }

      const accessToken = this.jwtService.sign(mapAccountToJwtPayload(result))

      return {
        refreshToken: 'refreshToken',
        accessToken,
      }
    } catch (e) {
      throw e
    }
  }
}
