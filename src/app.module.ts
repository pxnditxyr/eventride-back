import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users'
import { AuthModule } from './auth'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule
  ]
})
export class AppModule {}
