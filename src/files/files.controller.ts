import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common'
import { FormDataRequest } from 'nestjs-form-data'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import { FilesService } from './files.service'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post(':name')
  @FormDataRequest()
  create(@Body() createFileDto: CreateFileDto, @Param('name') name: string) {
    return this.filesService.create(createFileDto, name)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id)
  }
}
