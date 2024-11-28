import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data'
export class CreateFileDto {
  @IsFile({ message: 'The file must be an archive' })
  @MaxFileSize(1e6, { message: 'The maximum allowed size is 1MB' })
  @HasMimeType(['image/jpeg', 'image/png'], {
    message: 'Only JPEG or PNG images are allowed',
  })
  image: MemoryStoredFile
}
