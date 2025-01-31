import {Module} from '@nestjs/common'
import * as admin from 'firebase-admin'
import {Firebase} from './firebase'
import * as path from 'path'
import {ConfigService} from '@nestjs/config'

@Module({
  providers: [
    {
      provide: Firebase,
      useFactory: () => {
        const basePath = process.cwd()
        const firebaseConfigPath = path.join(basePath + '/firebase.json')
        if (admin.apps.length > 1) {
          return admin.apps[0]
        }
        return admin.initializeApp({
          credential: admin.credential.cert(firebaseConfigPath),
          storageBucket: 'rainbow-development.appspot.com',
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: [Firebase],
})
export default class FirebaseModule {}
