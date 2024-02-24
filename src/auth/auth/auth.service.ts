import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UsersService } from 'src/users/users/users.service'
import { ValidRoles } from 'src/users/users/enums'
import { SigninDto, SignupDto } from './dtos'
import { AuthResponse, UserResponse } from './types'
import { User } from 'src/users/users/entities/user.entity'
import { compareSync } from 'bcrypt'

@Injectable()
export class AuthService {
  constructor (
    private readonly usersService : UsersService,
    private readonly jwtService : JwtService
  ) {}

  async signup ( signupDto : SignupDto ) : Promise<AuthResponse> {
    const user = await this.usersService.create({
      ...signupDto,
      role: ValidRoles.USER
    })
    return {
      user: this.userToUserReponse( user ),
      token: this.generateToken( user.id )
    }
  }

  async signin ( signinDto : SigninDto ) : Promise<AuthResponse> {
    try {
      const user = await this.usersService.findByEmail( signinDto.email )
      if ( !user.status ) throw new UnauthorizedException()
      if ( !compareSync( signinDto.password, user.password ) ) throw new UnauthorizedException()
      return {
        user: this.userToUserReponse( user ),
        token: this.generateToken( user.id )
      }
    } catch ( error ) {
      throw new UnauthorizedException( 'Las credenciales son incorrectas 🛡️' ) 
    }
  }

  async validateUser ( id : string ) : Promise<User> {
    const user = await this.usersService.findOne( id )
    return user
  }

  async renewToken ( user : User ) : Promise<AuthResponse> {
    const { id } = user
    return {
      user: this.userToUserReponse( user ),
      token: this.generateToken( id )
    }
  }

  private generateToken ( id : string ) : string {
    const jwt = this.jwtService.sign({ id })
    return jwt
  }

  private userToUserReponse ( user : User ) : UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      paternalSurname: user.paternalSurname,
      maternalSurname: user.maternalSurname,
      birthDate: user.birthDate,
      gender: user.gender,
      role: user.role
    }
  }
}
