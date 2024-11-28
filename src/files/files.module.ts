import { Module } from '@nestjs/common'
import { FilesService } from './files.service'
import { FilesController } from './files.controller'
import { S3Client } from '@aws-sdk/client-s3'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { NestjsFormDataModule } from 'nestjs-form-data'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    NestjsFormDataModule.config({
      isGlobal: true,
    }),
  ],
  controllers: [FilesController],
  providers: [
    FilesService,

    {
      provide: S3Client,
      useFactory: (configService: ConfigService) =>
        new S3Client({
          region: configService.getOrThrow('S3_REGION'),
          credentials: {
            secretAccessKey: configService.getOrThrow('S3_SECRET_ACCESS_KEY'),
            accessKeyId: configService.getOrThrow('S3_ACCESS_KEY'),
          },
        }),
      inject: [ConfigService],
    },
  ],
})
export class FilesModule {}
