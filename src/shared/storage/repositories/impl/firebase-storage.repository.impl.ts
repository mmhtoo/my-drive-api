import {Inject, Injectable} from '@nestjs/common'
import AbstractStorageRepository, {
  GenerateSignedUrl,
  UpdateInput,
  UploadInput,
} from '../abstract-storage.repostitory'
import {Firebase} from 'src/shared/firebase/firebase'
import * as admin from 'firebase-admin'
import * as dayjs from 'dayjs'
import {UploadException} from '../../exceptions/upload.exception'
import {FileRefException} from '../../exceptions/file-ref.exception'

@Injectable()
export default class FirebaseStorageRepositoryImpl
  implements AbstractStorageRepository
{
  private readonly storage: admin.storage.Storage

  constructor(@Inject(Firebase) private readonly firebase: admin.app.App) {
    this.storage = this.firebase.storage()
  }

  async generateSignedUrl(input: GenerateSignedUrl): Promise<string> {
    try {
      const expiresIn = input.expiresIn || dayjs().add(1, 'day').toDate()
      const [url] = await this.storage
        .bucket()
        .file(input.fileKey)
        .getSignedUrl({
          action: 'read',
          expires: expiresIn,
        })
      return url
    } catch (e) {
      console.log('Error at generateSignedUrl ', e)
      throw new FileRefException(e?.message || 'Failed to generate signed url!')
    }
  }

  async update(input: UpdateInput): Promise<string> {
    try {
      await this.delete(input.fileKey)
      const result = await this.storage.bucket().upload(input.filePath, {
        metadata: JSON.parse(input.metadata || '{}'),
        gzip: true,
        destination: input.fileKey,
      })
      const [url] = await result[0].getSignedUrl({
        action: 'read',
        expires: dayjs().add(1, 'day').toDate(),
      })
      return url
    } catch (e) {
      console.log('Error at update', e)
      throw new UploadException(e?.message || 'Failed to update file!')
    }
  }

  async upload(input: UploadInput): Promise<string> {
    try {
      const result = await this.storage.bucket().upload(input.filePath, {
        metadata: JSON.parse(input.metadata || '{}'),
        gzip: true,
        destination: input.fileKey,
      })
      const [url] = await result[0].getSignedUrl({
        action: 'read',
        expires: dayjs().add(1, 'day').toDate(),
      })
      return url
    } catch (e) {
      console.log('Error at upload', e)
      throw new UploadException(e?.message || 'Failed to upload to bucket!')
    }
  }

  async delete(keyName: string): Promise<void> {
    try {
      await this.storage.bucket().file(keyName).delete()
      return
    } catch (e) {
      console.log('Error at delete ', e)
      throw new FileRefException(e?.message || 'Failed to delete file!')
    }
  }
}
