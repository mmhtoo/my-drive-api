import {Controller} from '@nestjs/common'
import ShareService from '../services/share.service'

@Controller({
  version: '1',
  path: 'shares',
})
export default class ShareController {
  constructor(private readonly shareService: ShareService) {}
}
