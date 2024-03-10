import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport } from 'nodemailer'
import { ISendEmailOptions } from './interfaces'

@Injectable()
export class MailService {

  private transporter : any

  constructor (
    private readonly configService : ConfigService
  ) {
    const service = this.configService.get<string>( 'MAILER_SERVICE' )
    const email = this.configService.get<string>( 'MAILER_EMAIL' )
    const secretKey = this.configService.get<string>( 'MAILER_SECRET_KEY' )
    this.transporter = createTransport({
      service,
      auth: {
        user: email,
        pass: secretKey
      }
    })
  }
  
  async sendMail ( options : ISendEmailOptions ) : Promise<string> {
    const { to, subject, htmlBody } = options
    try {
      await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody
      })
      return `El correo ha sido enviado 📫`
    } catch ( error ) {
      console.error( error )
      throw new InternalServerErrorException( `Error al enviar el correo 📫, por favor revise los logs` )
    }
  }
}                                             
