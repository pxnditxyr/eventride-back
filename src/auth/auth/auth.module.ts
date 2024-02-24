import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

import { UsersModule } from 'src/users'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './strategies'

@Module({
  controllers: [ AuthController ],
  providers: [
    AuthService,
    JwtStrategy
  ],
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: async ( configService : ConfigService ) => ({
        secret: configService.get( 'JWT_SECRET' ),
        signOptions: {
          expiresIn: configService.get( 'JWT_EXPIRES_IN' )
        }
      })
    })
  ],
  exports: [ PassportModule, JwtModule, JwtStrategy ]
})
export class AuthModule {}
