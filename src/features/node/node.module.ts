import {Module} from '@nestjs/common'
import NodeController from './controller/node.controller'
import NodeService from './services/node.service'
import AbstractNodeRepository from './repositories/abstract-node.repository'
import NodeRepositoryImpl from './repositories/impl/node.repository.impl'
import PrismaModule from 'src/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [NodeController],
  providers: [
    NodeService,
    {
      provide: AbstractNodeRepository,
      useClass: NodeRepositoryImpl,
    },
  ],
})
export default class NodeModule {}
