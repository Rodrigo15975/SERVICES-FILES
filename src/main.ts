import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common'

dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    credentials: true,
    origin: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  const port = Number(process.env.PORT) || 8080
  await app.listen(port, () => {
    console.log('listening on port ' + port)
  })
}
bootstrap()
