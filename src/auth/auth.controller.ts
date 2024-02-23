import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignupDto, SigninDto } from './dtos'
import { AuthResponse } from './types'

@Controller( 'auth' )
export class AuthController {

  constructor( private readonly authService : AuthService ) {}

  @Post( 'signup' )
  async signup (
    @Body() signupDto : SignupDto
  ) : Promise<AuthResponse> {
    return this.authService.signup( signupDto )
  }

  @Post( 'signin' )
  async signin (
    @Body() signinDto : SigninDto
  ) : Promise<AuthResponse> {
    return this.authService.signin( signinDto )
  }
}
