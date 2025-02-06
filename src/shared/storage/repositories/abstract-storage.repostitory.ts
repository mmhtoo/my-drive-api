export interface UploadInput {
  filePath: string
  metadata?: string
  fileKey: string
}

export interface UpdateInput {
  filePath: string
  metadata?: string
  fileKey: string
}

export interface GenerateSignedUrl {
  fileKey: string
  expiresIn?: Date
}

export default abstract class AbstractStorageRepository {
  abstract upload(input: UploadInput): Promise<string>
  abstract delete(keyName: string): Promise<void>
  abstract update(input: UpdateInput): Promise<string>
  abstract generateSignedUrl(input: GenerateSignedUrl): Promise<string>
}
