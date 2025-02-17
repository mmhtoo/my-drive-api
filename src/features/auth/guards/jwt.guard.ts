import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import {Reflector} from '@nestjs/core'
import {AuthGuard} from '@nestjs/passport'
import {Observable} from 'rxjs'
import {IS_PUBLIC_KEY} from 'src/configs/decorators'
import {AppJwtPayload} from '../mappers'

@Injectable()
export default class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }
}
