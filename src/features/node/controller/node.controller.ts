import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common'
import NodeService from '../services/node.service'
import {ApiBearerAuth} from '@nestjs/swagger'
import {CreateNodeDto} from '../dtos/create-node.dto'
import {AppJwtPayload} from 'src/features/auth/mappers'
import {GetNodesDto} from '../dtos/get-nodes.dto'

@Controller({
  version: '1',
  path: 'nodes',
})
export default class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post()
  @ApiBearerAuth()
  async createNewNode(
    @Body() createNodeDto: CreateNodeDto,
    @Request() req: any,
  ) {
    try {
      const reqUser = req.user as AppJwtPayload
      // upload to cloud storage or disk
      // save node record to db
      const result = await this.nodeService.createNode({
        ...createNodeDto,
        ownerAccountId: reqUser.userId,
        isHidden: createNodeDto.isHidden ?? false,
      })
      return {
        data: result,
      }
    } catch (e) {
      console.log('Error at createNewNode', e)
      throw e
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  async forceDeleteNode(
    @Param('id', new ParseUUIDPipe({optional: false})) id: string,
    @Request() req: any,
  ) {
    try {
      const reqUser = req.user as AppJwtPayload
      // delete from cloud storage or disk
      // delete node record from db
      await this.nodeService.forceDeleteNode({
        id,
        ownerAccountId: reqUser.userId,
      })
      return
    } catch (e) {
      console.log('Error at forceDeleteNode ', e)
      throw e
    }
  }

  @Get()
  @ApiBearerAuth()
  async getNodes(@Query() searchQuery: GetNodesDto, @Request() req: any) {
    try {
      const reqUser = req.user as AppJwtPayload
      const result = await this.nodeService.getNodes({
        ownerAccountId: reqUser.userId,
        parentId: searchQuery.parentId,
        isIncludeHidden: searchQuery.isIncludeHidden ? undefined : false,
      })
      return {
        data: result,
      }
    } catch (e) {
      console.log('Error at get Nodes ', e)
    }
  }
}
