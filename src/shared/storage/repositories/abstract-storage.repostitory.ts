export interface UploadInput {
  filePath: string
  metadata?: string
  fileKey: string
}

export default abstract class AbstractStorageRepository {
  abstract upload(input: UploadInput): Promise<string>
  abstract delete(keyName: string): Promise<void>
}
