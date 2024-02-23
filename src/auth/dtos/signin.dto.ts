import { IsEmail, Matches } from 'class-validator'

export class SigninDto {

  @IsEmail( {}, { message: 'Parece que el correo electrónico no es válido ❌' } )
  email: string

  @Matches( /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: 'La contraseña debe de tener al menos 8 caracteres, una letra mayúscula y un número' } )
  password: string
}
