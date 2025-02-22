import { NestFactory } from '@nestjs/core'
import serverlessExpress from '@codegenie/serverless-express'
import type { Callback, Context, Handler } from 'aws-lambda'
import { AppModule } from './app.module'

let server: Handler
const getApp = async () => await NestFactory.create(AppModule)

const bootstrap = async (): Promise<Handler> => {
  const app = await getApp()
  await app.init()
  const expressApp = app.getHttpAdapter().getInstance()
  return serverlessExpress({ app: expressApp })
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap())
  return server(event, context, callback)
}
