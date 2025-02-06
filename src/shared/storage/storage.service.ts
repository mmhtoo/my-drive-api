import {Injectable} from '@nestjs/common'
import AbstractStorageRepository, {
  UpdateInput,
} from './repositories/abstract-storage.repostitory'

export interface UploadInput {
  filePath: string
  metadata?: string
  fileKey: string
}

export interface DeleteInput {
  refKey: string
}

@Injectable()
export default class StorageService {
  constructor(private readonly storageRepo: AbstractStorageRepository) {}

  async upload(input: UploadInput): Promise<string> {
    try {
      const result = await this.storageRepo.upload(input)
      return result
    } catch (e) {
      console.log('Error at upload ', e)
      throw e
    }
  }

  async delete(input: DeleteInput): Promise<void> {
    try {
      await this.storageRepo.delete(input.refKey)
    } catch (e) {
      console.log('Error at delete ', e)
      throw e
    }
  }

  async update(input: UpdateInput): Promise<string> {
    try {
      return await this.storageRepo.update(input)
    } catch (e) {
      console.log('Error at update ', e)
      throw e
    }
  }

  async generateSignedUrl(input: any): Promise<string> {
    try {
      return await this.storageRepo.generateSignedUrl(input)
    } catch (e) {
      console.log('Error at generateSignedUrl ', e)
      throw e
    }
  }
}
