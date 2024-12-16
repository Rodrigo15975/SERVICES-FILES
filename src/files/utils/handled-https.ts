import { HttpStatus } from '@nestjs/common'

export class HandleHttps {
  static ResponseSuccessfullyMessagePattern(
    message: string,
    statusCode: HttpStatus,
    service: string,
  ) {
    return {
      message,
      statusCode,
      service,
      timestamp: new Date().toISOString(),
    }
  }
}
