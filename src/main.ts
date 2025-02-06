import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common'

dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  const port = Number(process.env.PORT) || 8080
  await app.listen(port, () => {
    if (process.env.NODE_ENV === 'development') {
      return console.log(
        'listening on port ' + port,
        ' mode: ',
        process.env.NODE_ENV,
      )
    }

    console.log('listening on port ' + port, ' mode: ', process.env.NODE_ENV)
  })
}
bootstrap()
