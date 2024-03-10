import { Module } from '@nestjs/common'
import { TwoFactorAuthService } from './two-factor-auth.service'
import { TwoFactorAuthController } from './two-factor-auth.controller'
import { MailService } from './mail.service'
import { PrismaService } from 'src/prisma'
import { ConfigModule } from '@nestjs/config'

@Module({
  controllers: [ TwoFactorAuthController ],
  providers: [
    TwoFactorAuthService,
    MailService,
    PrismaService
  ],
  imports: [ ConfigModule ]
})
export class TwoFactorAuthModule {}
