import { Body, Controller, Delete, Param, Post, Query } from '@nestjs/common'
import { FormDataRequest } from 'nestjs-form-data'
import { CreateFileDto } from './dto/create-file.dto'
import { FilesService } from './files.service'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post(':name')
  @FormDataRequest()
  create(@Body() createFileDto: CreateFileDto, @Param('name') name: string) {
    return this.filesService.create(createFileDto, name)
  }

  @Delete()
  remove(@Query('key') key: string) {
    return this.filesService.remove(key)
  }
}
