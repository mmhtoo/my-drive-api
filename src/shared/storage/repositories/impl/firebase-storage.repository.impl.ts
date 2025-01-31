import {Inject, Injectable} from '@nestjs/common'
import AbstractStorageRepository, {
  UploadInput,
} from '../abstract-storage.repostitory'
import {Firebase} from 'src/shared/firebase/firebase'
import * as admin from 'firebase-admin'
import * as dayjs from 'dayjs'

@Injectable()
export default class FirebaseStorageRepositoryImpl
  implements AbstractStorageRepository
{
  constructor(@Inject(Firebase) private readonly firebase: admin.app.App) {}

  async upload(input: UploadInput): Promise<string> {
    const storage = this.firebase.storage()
    const result = await storage.bucket().upload(input.filePath, {
      metadata: JSON.parse(input.metadata || '{}'),
      gzip: true,
      destination: input.fileKey,
    })
    const [url] = await result[0].getSignedUrl({
      action: 'read',
      expires: dayjs().add(1, 'day').toDate(),
    })
    return url
  }

  async delete(keyName: string): Promise<void> {
    const storage = this.firebase.storage()
    await storage.bucket().file(keyName).delete()
    return
  }
}
