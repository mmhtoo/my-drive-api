import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common'
import ShareService from '../services/share.service'
import {CreateShareDto} from '../dtos/create-share.dto'
import {AppJwtPayload} from 'src/features/auth/mappers'
import {dataResponse} from 'src/shared/utils/response-helper'
import {GetSharesDto} from '../dtos/get-shares.dto'
import {UpdateShareDto} from '../dtos/update-share.dto'

@Controller({
  version: '1',
  path: 'shares',
})
export default class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Post()
  async createShare(@Body() dto: CreateShareDto, @Request() req: any) {
    try {
      const reqUser = req.user as AppJwtPayload
      await this.shareService.createShare({
        nodeId: dto.nodeId,
        ownerAccountId: reqUser.userId,
        allowAnyOne: dto.allowAnyOne,
        allowAccounts: dto.allowAccounts,
      })
      return dataResponse('No Content!', 'Created!', HttpStatus.CREATED)
    } catch (e) {
      if (e instanceof HttpException) {
        throw e
      }
      throw new InternalServerErrorException('Failed to share!')
    }
  }

  @Delete(':id')
  async deleteShare(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: any,
  ) {
    try {
      const reqUser = req.user as AppJwtPayload
      await this.shareService.deleteShare({
        id,
        ownerAccountId: reqUser.userId,
      })
      return dataResponse('No Content!', 'Deleted!', HttpStatus.NO_CONTENT)
    } catch (e) {
      if (e instanceof HttpException) {
        throw e
      }
      throw new InternalServerErrorException('Failed to delete share!')
    }
  }

  @Get()
  async findSharesByAccountId(
    @Query('from', new ParseEnumPipe(GetSharesDto)) from: GetSharesDto,
    @Request() req: any,
  ) {
    try {
      const reqUser = req.user as AppJwtPayload
      if (from === GetSharesDto.ME) {
        const result = await this.shareService.findSharesByOwnerAccountId(
          reqUser.userId,
        )
        return dataResponse(result, 'Success!', HttpStatus.OK)
      }
      const result = await this.shareService.findSharesByAllowAccounts(
        reqUser.userId,
      )
      return dataResponse(result, 'Success!', HttpStatus.OK)
    } catch (e) {
      if (e instanceof HttpException) {
        throw e
      }
      throw new InternalServerErrorException('Failed to get shares!')
    }
  }

  @Put(':id')
  async updateShare(
    @Body() dto: UpdateShareDto,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: any,
  ) {
    try {
      const reqUser = req.user as AppJwtPayload
      await this.shareService.updateShare({
        id,
        ownerAccountId: reqUser.userId,
        allowAnyOne: dto.allowAnyOne,
        allowAccounts: dto.allowAccounts,
        nodeId: dto.nodeId,
      })
      return dataResponse('No Content!', 'Updated!', HttpStatus.NO_CONTENT)
    } catch (e) {
      if (e instanceof HttpException) {
        throw e
      }
      throw new InternalServerErrorException('Failed to update share!')
    }
  }
}
