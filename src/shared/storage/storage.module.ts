import {Module} from '@nestjs/common'
import FirebaseModule from '../firebase/firebase.module'
import AbstractStorageRepository from './repositories/abstract-storage.repostitory'
import FirebaseStorageRepositoryImpl from './repositories/impl/firebase-storage.repository.impl'
import StorageService from './storage.service'

@Module({
  imports: [FirebaseModule],
  providers: [
    {
      provide: AbstractStorageRepository,
      useClass: FirebaseStorageRepositoryImpl,
    },
    StorageService,
  ],
  exports: [StorageService],
})
export default class StorageModule {}
