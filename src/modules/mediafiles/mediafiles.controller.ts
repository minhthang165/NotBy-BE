import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { MediaFilesService } from './mediafiles.service';
import { CreateMediaFilesDto } from './dto/create-mediafiles.dto';
import { UpdateMediaFilesDto } from './dto/update-mediafiles.dto';

@Controller('MediaFiles')
export class MediaFilesController {
  constructor(private readonly mediaFilesService: MediaFilesService) {}

  @Post()
  async create(@Body() createMediaFilesDto: CreateMediaFilesDto) {
    return this.mediaFilesService.create(createMediaFilesDto);
  }

  @Get()
  async findAll() {
    return this.mediaFilesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const mediaFile = await this.mediaFilesService.findById(id);
    if (!mediaFile) throw new NotFoundException('Media file not found');
    return mediaFile;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMediaFilesDto: UpdateMediaFilesDto,
  ) {
    const updatedMediaFile = await this.mediaFilesService.update(id, updateMediaFilesDto);
    if (!updatedMediaFile) throw new NotFoundException('Media file not found');
    return updatedMediaFile;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedMediaFile = await this.mediaFilesService.delete(id);
    if (!deletedMediaFile) throw new NotFoundException('Media file not found');
    return deletedMediaFile;
  }
}
