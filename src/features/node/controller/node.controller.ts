import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import NodeService from '../services/node.service'
import {ApiBearerAuth} from '@nestjs/swagger'
import {CreateNodeDto} from '../dtos/create-node.dto'
import {AppJwtPayload} from 'src/features/auth/mappers'
import {GetNodesDto} from '../dtos/get-nodes.dto'
import StorageService from 'src/shared/storage/storage.service'
import {FileInterceptor} from '@nestjs/platform-express'
import ParseJsonPipe from 'src/configs/pipes/parse-json.pipe'
import {unlink} from 'fs'
import {NodeType} from '../entities/node.entity'
import {dataResponse} from 'src/shared/utils/response-helper'

@Controller({
  version: '1',
  path: 'nodes',
})
export default class NodeController {
  constructor(
    private readonly nodeService: NodeService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  async createNewNode(
    @UploadedFile() file: Express.Multer.File,
    @Body('data', new ParseJsonPipe(CreateNodeDto))
    createNodeDto: string,
    @Request() req: any,
  ) {
    try {
      const dto = createNodeDto as any as CreateNodeDto
      const reqUser = req.user as AppJwtPayload
      let tempLink
      let sourceRefKey = ''
      // only type is FILE
      // upload to cloud storage or disk
      if (dto.type === NodeType.FILE && file) {
        sourceRefKey = `${reqUser.userId}/${file.filename}`
        tempLink = await this.storageService.upload({
          filePath: file.path,
          fileKey: sourceRefKey,
        })
      }

      // save node record to db
      const result = await this.nodeService.createNode({
        ...dto,
        ownerAccountId: reqUser.userId,
        isHidden: dto.isHidden ?? false,
        sourceTempLink: tempLink,
        sourceRefKey,
        extension: file?.mimetype || undefined,
        size: file?.size || undefined,
      })
      // delete temp file, do not wait to finish, should send to queue
      if (file) unlink(file.path, () => {})

      return {
        data: result,
      }
    } catch (e) {
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
      // delete node record from db
      const deletedNode = await this.nodeService.forceDeleteNode({
        id,
        ownerAccountId: reqUser.userId,
      })
      // delete from cloud storage or disk
      // TODO: needing to think about deleting folder with children files
      // to delete with queue based
      await this.storageService.delete({
        refKey: deletedNode.sourceRefKey,
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

  @Get(':id')
  @ApiBearerAuth()
  async getNodeById(
    @Param('id', new ParseUUIDPipe({optional: false})) id: string,
    @Request() req: any,
  ) {
    try {
      const reqUser = req.user as AppJwtPayload
      const result = await this.nodeService.findNodeById({
        id,
        ownerAccountId: reqUser.userId,
      })
      if (!result) throw new NotFoundException('Node not found!')
      return {
        data: result,
      }
    } catch (e) {
      console.log('Error at get Nodes ', e)
      throw e
    }
  }

  @Patch('/:id/archive-or-unarchive')
  @ApiBearerAuth()
  async archiveOrUnarchiveNode(
    @Param('id', new ParseUUIDPipe({optional: false})) id: string,
    @Query('isArchived', new ParseBoolPipe({})) isArchived: boolean,
    @Request() req: any,
  ) {
    try {
      const reqUser = req.user as AppJwtPayload
      await this.nodeService.updateArchiveNode({
        id,
        ownerAccountId: reqUser.userId,
        isArchived,
      })
      return dataResponse(
        null,
        isArchived ? 'Archived!' : 'Unarchived!',
        HttpStatus.OK,
      )
    } catch (e) {
      console.log('Error at archiveOrUnarchiveNode ', e)
      throw e
    }
  }
}
