import {Module} from '@nestjs/common'
import UtilityController from './controller/utility.controller'

@Module({
  controllers: [UtilityController],
})
export default class UtilityModule {}
