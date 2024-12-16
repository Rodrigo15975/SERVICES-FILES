import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MemoryStoredFile } from 'nestjs-form-data'
import * as path from 'path'
import { v4 as uuidV4 } from 'uuid'
import { CreateFileDto } from './dto/create-file.dto'
import { HandleHttps } from './utils/handled-https'
@Injectable()
export class FilesService {
  private readonly logger: Logger = new Logger(FilesService.name)
  private readonly bucketName: string = ''
  constructor(
    private readonly configService: ConfigService,
    private readonly S3: S3Client,
  ) {
    this.bucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
  }
  async create(createFileDto: CreateFileDto, name: string) {
    try {
      const { image } = createFileDto
      const typeFile = path.extname(image.originalName)
      const Key = `${name}/${uuidV4()}${image.originalName.split(typeFile).join('')}${typeFile}`

      const command = this.createCommand(image, Key)
      await this.S3.send(command)
      const url = `https://${this.bucketName}.s3.amazonaws.com/${Key}`

      return { url }
    } catch (error) {
      this.logger.error(error, error.message)
      throw new HttpException(
        'Error to upload file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  private createCommand(file: MemoryStoredFile, Key: string) {
    return new PutObjectCommand({
      Bucket: this.bucketName,
      Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
      Metadata: {
        'Content-Disposition': `attachment; filename="${file.originalName}"`,
        'Content-Type': file.mimetype,
      },
    })
  }
  private deleteCommand(Key: string) {
    return new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key,
    })
  }

  async remove(key: string) {
    try {
      const commandDelete = this.deleteCommand(key)
      await this.S3.send(commandDelete)
      return HandleHttps.ResponseSuccessfullyMessagePattern(
        'File delete successfully',
        HttpStatus.ACCEPTED,
        FilesService.name,
      )
    } catch (error) {
      this.logger.error(error.message, error, {
        message: 'Error to be delete command file-remove',
        service: FilesService.name,
      })
      throw new HttpException(
        'Error to delete file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
