import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'

async function bootstrap () {
  const logger = new Logger( 'App' )
  const app = await NestFactory.create<NestExpressApplication>( AppModule )
  await app.listen( process.env.PORT || 3000 )
  
  logger.verbose( `This Application is running 🏃 on: ${ await app.getUrl() } 🌐` )
}
bootstrap()
