import {Module} from '@nestjs/common'
import {AppService} from './app.service'
import AuthModule from './features/auth/auth.module'
import {ConfigModule} from '@nestjs/config'
import {APP_GUARD} from '@nestjs/core'
import JwtGuard from './features/auth/guards/jwt.guard'
import NodeModule from './features/node/node.module'
import UtilityModule from './features/utility/utility.module'

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NodeModule,
    UtilityModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
