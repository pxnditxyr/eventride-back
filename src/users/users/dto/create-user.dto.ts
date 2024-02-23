import { IsDateString, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'
import { ValidRoles, ValidGenders } from '../enums'

export class CreateUserDto {

  @IsString({ message: 'El nombre es requerido' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string

  @IsString({ message: 'El apellido paterno es requerido' })
  @IsNotEmpty({ message: 'El apellido paterno es requerido' })
  paternalSurname: string

  @IsString({ message: 'El apellido materno es requerido' })
  @IsNotEmpty({ message: 'El apellido materno es requerido' })
  maternalSurname: string

  @IsOptional()
  @IsString({ message: 'El número de carnet de identidad es requerido' })
  @IsNotEmpty({ message: 'Debe de ingresar un número de carnet de identidad' })
  ci?: string

  @IsOptional()
  @IsString({ message: 'El número de teléfono es requerido' })
  @IsNotEmpty({ message: 'Debe de ingresar un número de teléfono' })
  phone?: string

  @IsOptional()
  @IsString({ message: 'La dirección es requerida' })
  @IsNotEmpty({ message: 'Debe de ingresar una dirección' })
  address?: string

  @IsDateString( {}, { message: 'La fecha de nacimiento es requerida' } )
  birthDate: Date

  @IsIn([ ValidGenders.MALE, ValidGenders.FEMALE, ValidGenders.OTHER ], { message: 'El género es requerido' })
  gender: ValidGenders

  @IsEmail( {}, { message: 'El correo electrónico es requerido' } )
  email: string

  @Matches( /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: 'La contraseña debe de tener al menos 8 caracteres, una letra mayúscula y un número' } )
  password: string

  @IsIn( [ ValidRoles.ADMIN, ValidRoles.USER, ValidRoles.OWNER ], { message: 'El rol es requerido' } )
  role: ValidRoles
}
