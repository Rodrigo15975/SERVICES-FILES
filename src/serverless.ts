import { NestFactory } from '@nestjs/core'
import { configure as serverlessExpress } from '@vendia/serverless-express'
// import { Callback, Context, Handler } from 'aws-lambda'
import { AppModule } from './app.module'

let server

// probar con task sin db
export const handler = async (event, context) => {
  if (!server) {
    const app = await NestFactory.create(AppModule)
    await app.init()
    server = serverlessExpress({
      app: app.getHttpAdapter().getInstance(),
    })
  }
  return server(event, context)
}
