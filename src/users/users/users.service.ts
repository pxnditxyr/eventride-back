import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { CreateUserDto, UpdateUserDto } from './dto'
import { PrismaService } from 'src/prisma'
import { User } from './entities/user.entity'
import { hashSync } from 'bcrypt'

@Injectable()
export class UsersService {

  constructor (
    private readonly prismaService : PrismaService
  ) {}

  async create ( createUserDto : CreateUserDto ) : Promise<User> {
    try {
      const encryptedPassword = hashSync( createUserDto.password, 10 )
      const user = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          birthDate: new Date( createUserDto.birthDate ),
          password: encryptedPassword
        }
      })
      return user
    } catch ( error ) {
      this.handlerDBExceptions( error )
    }
  }

  async findAll () : Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { creator: true , updater: true }
    })
    return users
  }

  async findOne ( id : string ) : Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id }
    })
    if ( !user ) throw new NotFoundException( `El usuario 🙍 no existe` )
    return user
  }

  async findByEmail ( email : string ) : Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email }
    })
    if ( !user ) throw new NotFoundException( `El usuario 🙍 no existe` )
    return user
  }

  async update ( id : string, updateUserDto : UpdateUserDto ) : Promise<User> {
    await this.findOne( id )
    try {
      const user = await this.prismaService.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          birthDate: updateUserDto.birthDate ? new Date( updateUserDto.birthDate ) : undefined,
          password: updateUserDto.password ? hashSync( updateUserDto.password, 10 ) : undefined
        }
      })
      return user
    } catch ( error ) {
      this.handlerDBExceptions( error )
    }
  }

  async toggleStatus ( id : string ) {
    const currentUser = await this.findOne( id )
    try {
      const user = await this.prismaService.user.update({
        where: { id },
        data: {
          status: !currentUser.status
        }
      })
      return user
    } catch ( error ) {
      this.handlerDBExceptions( error )
    }
  }

  private handlerDBExceptions ( error : any ) : never {
    if ( error.code === 'P2002' ) {
      throw new BadRequestException( 'El email 💥 ingresado ya está registrado' )
    }
    console.error( error )
    throw new InternalServerErrorException( 'Ups! 💥 Algo salió mal, por favor revisa los Logs' )
  }
}
