import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from '../auth.service'
import { IJwtPayload } from '../interfaces'

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
  constructor (
    private readonly authService : AuthService,
    configService : ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>( 'JWT_SECRET' )
    })
  }

  async validate ( payload : IJwtPayload ) : Promise<any> {
    const { id } = payload
    const user = await this.authService.validateUser( id )
    if ( !user.status ) throw new UnauthorizedException( `❌ Parece que tu cuenta ha sido desactivada, contacta a soporte` )
    return user
  }
}
