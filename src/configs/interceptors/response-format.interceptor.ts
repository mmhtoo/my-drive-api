import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import {map, Observable} from 'rxjs'

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map<any, APIBaseResponse>((data) => {
        return {
          ...data,
          timestamp: new Date().toISOString(),
          message: data?.message || 'Success!',
          status: data?.status ?? 200,
        }
      }),
    )
  }
}
