import {Body, Controller, Post} from '@nestjs/common'
import {Public} from 'src/configs/decorators'

@Controller({
  version: '1',
  path: 'utils',
})
export default class UtilityController {
  @Public()
  @Post('json-stringify')
  jsonStringify(@Body() body: Record<string, any>) {
    return {
      data: JSON.stringify(body || {}),
    }
  }
}
