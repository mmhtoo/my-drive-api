import {Module} from '@nestjs/common'
import NodeController from './controller/node.controller'
import NodeService from './services/node.service'
import AbstractNodeRepository from './repositories/abstract-node.repository'
import NodeRepositoryImpl from './repositories/impl/node.repository.impl'
import PrismaModule from 'src/prisma/prisma.module'
import StorageModule from 'src/shared/storage/storage.module'
import {MulterModule} from '@nestjs/platform-express'
import * as path from 'path'
import {diskStorage} from 'multer'
import * as dayjs from 'dayjs'
import {ConfigService} from '@nestjs/config'

@Module({
  imports: [
    PrismaModule,
    StorageModule,
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: path.join(process.cwd(), 'tmp/uploads'),
          filename: (_req, file, cb) => {
            const fileName = `${dayjs().format('YYYYMMDDhhmmss')}-${Math.round(Math.random() * 100)}-${file.originalname}`
            cb(null, fileName)
          },
        }),
        limits: {
          fileSize: Number(
            configService.getOrThrow<number>('MAX_SIZE_PER_FILE'),
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NodeController],
  providers: [
    NodeService,
    {
      provide: AbstractNodeRepository,
      useClass: NodeRepositoryImpl,
    },
  ],
  exports: [NodeService],
})
export default class NodeModule {}
