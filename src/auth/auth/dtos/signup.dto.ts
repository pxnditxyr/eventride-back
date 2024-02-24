import { IsDateString, IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator'
import { ValidGenders } from 'src/users/users/enums'

export class SignupDto {
  @IsString({ message: 'El nombre es requerido' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string

  @IsString({ message: 'El apellido paterno es requerido' })
  @IsNotEmpty({ message: 'El apellido paterno es requerido' })
  paternalSurname: string

  @IsString({ message: 'El apellido materno es requerido' })
  @IsNotEmpty({ message: 'El apellido materno es requerido' })
  maternalSurname: string

  @IsDateString( {}, { message: 'La fecha de nacimiento es requerida' } )
  birthDate: Date

  @IsIn([ ValidGenders.MALE, ValidGenders.FEMALE, ValidGenders.OTHER ], { message: 'El género es requerido' })
  gender: ValidGenders

  @IsEmail( {}, { message: 'El correo electrónico es requerido' } )
  email: string

  @IsString({ message: 'La contraseña es requerida' })
  password: string
}
