import {Module} from '@nestjs/common'
import AuthController from './controller/auth.controller'
import AuthService from './services/auth.service'
import AbstractAccountRepository from './repository/abstract-account.repository'
import AcountRepositoryImpl from './repository/impl/account.repository.impl'
import PrismaModule from 'src/prisma/prisma.module'
import AccountService from './services/account.service'
import {PassportModule} from '@nestjs/passport'
import JwtStrategy from './strategies/jwt.strategy'
import {JwtModule} from '@nestjs/jwt'
import {ConfigService} from '@nestjs/config'

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN'),
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AbstractAccountRepository,
      useClass: AcountRepositoryImpl,
    },
    AccountService,
    JwtStrategy,
  ],
})
export default class AuthModule {}
