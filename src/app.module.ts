import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users'
import { AuthModule, TwoFactorAuthModule } from './auth'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule, TwoFactorAuthModule
  ]
})
export class AppModule {}
