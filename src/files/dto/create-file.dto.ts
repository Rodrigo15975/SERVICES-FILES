import { IsFile, MemoryStoredFile } from 'nestjs-form-data'
export class CreateFileDto {
  @IsFile({ message: 'The file must be an archive' })
  image: MemoryStoredFile
}
