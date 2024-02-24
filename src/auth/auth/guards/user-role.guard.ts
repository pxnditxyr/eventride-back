import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'

import { User } from 'src/users/users/entities/user.entity'
import { META_ROLES } from '../decorators'


@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor (
    private readonly reflector : Reflector

  ) {}
  canActivate ( context : ExecutionContext ) : boolean | Promise<boolean> | Observable<boolean> {
    const validRoles : string[] = this.reflector.get<string[]>( META_ROLES, context.getHandler() )
    if ( !validRoles || validRoles.length === 0 ) return true
    const request = context.switchToHttp().getRequest()
    const user = request.user as User
    if ( !user ) throw new BadRequestException( `Parece que no estás autenticado 🛡️` )
    if ( validRoles.includes( user.role ) ) return true
    throw new BadRequestException( `❌ Parece que no tienes permisos para realizar esta acción 🚫`)
  }
}
