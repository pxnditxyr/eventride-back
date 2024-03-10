import { IsEmail } from 'class-validator'

export class RevokeTokenDto {
  @IsEmail( {}, { message: 'El correo electrónico es inválido ❌' } )
  email: string
}
