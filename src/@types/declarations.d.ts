declare global {
  interface APIBaseResponse {
    timestamp: string
    message: string
    status: number
  }
  interface APIDataResponse<T> extends BaseResponse {
    data: T
  }
  interface APIError {
    field: 'root' | string
    issues: string[]
  }
  interface APIErrorResponse extends BaseResponse {
    errors: APIError[]
  }
}

export {}
