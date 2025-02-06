import {Module} from '@nestjs/common'
import ShareController from './controller/share.controller'
import ShareService from './services/share.service'
import AbstractShareRepository from './repository/abstract-share.repository'
import ShareRepositoryImpl from './repository/impl/share.repository.impl'

@Module({
  controllers: [ShareController],
  providers: [
    ShareService,
    {
      provide: AbstractShareRepository,
      useClass: ShareRepositoryImpl,
    },
  ],
})
export default class ShareModule {}
