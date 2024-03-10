import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { MailService } from './mail.service'
import { PrismaService } from 'src/prisma'
import { TwoFactorAuthEntity } from './entities/two-factor-auth.entity'
import { RevokeTokenDto, SendTokenDto, VerifyTokenDto } from './dtos'

@Injectable()
export class TwoFactorAuthService {
  constructor (
    private readonly mailService : MailService,
    private readonly prismaService : PrismaService
  ) {}

  async sendToken ( { email } : SendTokenDto ) : Promise<TwoFactorAuthEntity> {
    await this.revokeLastToken({ email })
    const code = await this.createToken()
    const htmlBody = `
      <h1>Código de autenticación de dos factores</h1>
      <p>El código de autenticación de dos factores es: <strong>${ code }</strong></p>
    `
    await this.mailService.sendMail({
      to: email,
      subject: 'Código de autenticación de dos factores',
      htmlBody
    })

    try {
      const twoFactorAuth = await this.prismaService.twoFactorAuth.create({
        data: {
          email,
          secret: code,
          expiresAt: this.createExpiresAt()
        }
      })
      return twoFactorAuth
    } catch ( error ) {
      console.error( error )
      throw new InternalServerErrorException( 'Error al crear el registro de autenticación de dos factores ❌' )
    }
  }

  async verifyToken ( verifyTokenDto : VerifyTokenDto ) : Promise<TwoFactorAuthEntity> {
    const { email, token } = verifyTokenDto
    const twoFactorAuth = await this.getValidToken( email )
    if ( twoFactorAuth.isRevoked )
      throw new BadRequestException( 'El código de autenticación de dos factores se ha anulado, por favor solicite uno nuevo ❌' )
    if ( twoFactorAuth.secret !== token )
      throw new BadRequestException( 'El código de autenticación de dos factores es inválido ❌' )
    const now = new Date()
    if ( now > twoFactorAuth.expiresAt )
      throw new BadRequestException( 'El código de autenticación de dos factores ha expirado ❌' )
    if ( twoFactorAuth.isVerified )
      throw new BadRequestException( 'El código de autenticación de dos factores ya ha sido utilizado ❌' )
    const updatedTwoFactorAuth = await this.prismaService.twoFactorAuth.update({
      where: { id: twoFactorAuth.id },
      data: { isVerified: true }
    })
    return updatedTwoFactorAuth
  }

  async resendToken ( { email } : SendTokenDto ) : Promise<TwoFactorAuthEntity> {
    await this.revokeLastToken({ email })
    return await this.sendToken({ email })
  }

  private async revokeLastToken ( { email } : RevokeTokenDto ) : Promise<void> {
    const twoFactorAuth = await this.getLastToken( email )
    try {
      await this.prismaService.twoFactorAuth.update({
        where: { id: twoFactorAuth.id },
        data: { isRevoked: true }
      })
    } catch ( error ) {
      console.error( error )
      throw new InternalServerErrorException( 'Error al deprecar el registro de autenticación de dos factores ❌' )
    }
  }

  private async getValidToken ( email : string ) : Promise<TwoFactorAuthEntity> {
    const twoFactorAuth = await this.prismaService.twoFactorAuth.findMany({
      where: {
        email,
        isRevoked: false,
        isVerified: false,
      },
      orderBy: { createdAt: 'desc' },
    })
    if ( twoFactorAuth.length === 0 ) throw new BadRequestException( 'No se encontró ningún código de autenticación de dos factores válido ❌, por favor solicite uno nuevo' )
    return twoFactorAuth[ 0 ]
  }
  private async getLastToken ( email : string ) : Promise<TwoFactorAuthEntity> {
    const twoFactorAuth = await this.prismaService.twoFactorAuth.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
    })
    if ( twoFactorAuth.length === 0 ) throw new BadRequestException( 'No se encontró ningún código de autenticación de dos factores ❌' )
    return twoFactorAuth[ 0 ]
  }

  private async createToken () : Promise<string> {
    const code = Math.floor( 100000 + Math.random() * 900000 ).toString()
    return code
  }

  private createExpiresAt () : Date {
    const minutes = 10
    const expiresAt = new Date()
    expiresAt.setMinutes( expiresAt.getMinutes() + minutes )
    return expiresAt
  }
}
