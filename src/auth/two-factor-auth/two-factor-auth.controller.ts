import { Body, Controller, Post } from '@nestjs/common'
import { TwoFactorAuthService } from './two-factor-auth.service'
import { SendTokenDto, VerifyTokenDto } from './dtos'

@Controller( 'two-factor-auth' )
export class TwoFactorAuthController {
  constructor( private readonly twoFactorAuthService : TwoFactorAuthService ) {}

  @Post( 'send-token' )
  async sendToken ( @Body() sendTokenDto : SendTokenDto ) {
    return this.twoFactorAuthService.sendToken( sendTokenDto )
  }

  @Post( 'verify-token' )
  async verifyToken ( @Body() verifyTokenDto : VerifyTokenDto ) {
    return this.twoFactorAuthService.verifyToken( verifyTokenDto )
  }

  @Post( 'resend-token' )
  async resendToken ( @Body() sendTokenDto : SendTokenDto ) {
    return this.twoFactorAuthService.resendToken( sendTokenDto )
  }
}
