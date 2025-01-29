import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import {ValidationError} from 'class-validator'
import {Response} from 'express'
import {ValidationException} from '../exceptions'

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception?.getStatus() ?? 500
    const errorData = exception.getResponse()

    if (exception instanceof ValidationException) {
      let rawErrorData = errorData as ValidationError[]
      return response.status(status).json({
        timestamp: new Date().toISOString(),
        message: 'Validation Failed!',
        status,
        errors: rawErrorData.map((error) => ({
          field: error.property,
          issues: Object.values(error.constraints || {}),
        })),
      })
    }

    return response.status(status).json({
      timestamp: new Date().toISOString(),
      message: exception?.message || 'Unknown Error!',
      status,
      errors: [
        {
          field: 'root',
          issues: [
            typeof errorData === 'string'
              ? errorData
              : (errorData as any)?.message || 'Unknown Error!',
          ],
        },
      ],
    })
  }
}
