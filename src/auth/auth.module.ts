import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

import { UsersModule } from 'src/users'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  controllers: [ AuthController ],
  providers: [ AuthService ],
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
  exports: [ PassportModule, JwtModule ]
})
export class AuthModule {}
