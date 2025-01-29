import {Module} from '@nestjs/common'
import AuthController from './controller/auth.controller'
import AuthService from './services/auth.service'
import AbstractAccountRepository from './repository/abstract-account.repository'
import AcountRepositoryImpl from './repository/impl/account.repository.impl'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AbstractAccountRepository,
      useClass: AcountRepositoryImpl,
    },
  ],
})
export default class AuthModule {}
