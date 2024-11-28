import { Injectable, Logger } from '@nestjs/common'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import { ConfigService } from '@nestjs/config'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import * as path from 'path'
import { v4 as uuidV4 } from 'uuid'
import { MemoryStoredFile } from 'nestjs-form-data'
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
    }
  }

  getUrl() {}

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

  update(id: number, updateFileDto: UpdateFileDto) {
    console.log(updateFileDto)

    return `This action updates a #${id} file`
  }

  remove(id: number) {
    return `This action removes a #${id} file`
  }
}
