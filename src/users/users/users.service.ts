import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { CreateUserDto, UpdateUserDto } from './dto'
import { PrismaService } from 'src/prisma'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {

  constructor (
    private readonly prismaService : PrismaService
  ) {}

  async create ( createUserDto : CreateUserDto ) : Promise<User> {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          birthDate: new Date( createUserDto.birthDate )
        }
      })
      return user
    } catch ( error ) {
      this.handlerDBExceptions( error )
    }
  }

  async findAll () : Promise<User[]> {
    const users = await this.prismaService.user.findMany()
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
          birthDate: updateUserDto.birthDate ? new Date( updateUserDto.birthDate ) : undefined
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
