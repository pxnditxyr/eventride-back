import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator'

export class VerifyTokenDto {
  @IsEmail( {}, { message: 'El correo electrónico es inválido' } )
  email : string

  @IsNumberString( { no_symbols: true }, { message: 'El código de autenticación de dos factores debe ser numérico' } )
  @IsNotEmpty( { message: 'El código de autenticación de dos factores no puede estar vacío' } )
  token : string
}
