import { IsEmail } from 'class-validator'

export class SendTokenDto {
  @IsEmail({}, { message: 'El correo electrónico es inválido' })
  email: string
}
