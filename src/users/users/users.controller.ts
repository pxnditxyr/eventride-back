import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto, UpdateUserDto } from './dto'

@Controller( 'users' )
export class UsersController {

  constructor( private readonly usersService: UsersService ) {}

  @Post()
  async create ( @Body() createUserDto : CreateUserDto ) {
    return this.usersService.create( createUserDto )
  }

  @Get()
  async findAll () {
    return this.usersService.findAll()
  }

  @Get( ':id' )
  async findOne (
    @Param( 'id', ParseUUIDPipe ) id : string
  ) {
    return this.usersService.findOne( id )
  }

  @Patch( ':id' )
  async update (
    @Param( 'id', ParseUUIDPipe ) id : string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update( id, updateUserDto )
  }

  @Delete( ':id' )
  async toggleStatus (
    @Param( 'id', ParseUUIDPipe ) id : string
  ) {
    return this.usersService.toggleStatus( id )
  }
}
