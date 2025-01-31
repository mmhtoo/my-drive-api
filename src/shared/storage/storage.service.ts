import {Injectable} from '@nestjs/common'
import AbstractStorageRepository from './repositories/abstract-storage.repostitory'

export interface UploadInput {
  filePath: string
  metadata?: string
  fileKey: string
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
}
