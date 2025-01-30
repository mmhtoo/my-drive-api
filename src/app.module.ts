import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import AuthModule from './features/auth/auth.module'
import {ConfigModule} from '@nestjs/config'
import {APP_GUARD} from '@nestjs/core'
import JwtGuard from './features/auth/guards/jwt.guard'

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
