import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Express } from 'express';
import { DiaryEntriesService } from './diary-entries.service';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';

@ApiTags('DiaryEntries')
@Controller('diary-entries')
export class DiaryEntriesController {
  constructor(private readonly diaryEntriesService: DiaryEntriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDiaryEntryDto }) 
  create(
    @Body() createDiaryEntryDto: CreateDiaryEntryDto,
    @UploadedFile() image?: Express.Multer.File, 
  ) {
    return this.diaryEntriesService.create(createDiaryEntryDto, image);
  }

@Patch(':id')
@ApiConsumes('multipart/form-data')
@UseInterceptors(FileInterceptor('image'))
update(
  @Param('id') id: string,
  @Body() updateDiaryEntryDto: UpdateDiaryEntryDto,
  @UploadedFile() image?: Express.Multer.File, 
) {
  return this.diaryEntriesService.update(id, updateDiaryEntryDto, image);
}

    @Get()
    @ApiQuery({ name: 'childId', required: false, type: String })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sortBy', required: false, type: String })
	@ApiQuery({ name: 'sortOrder', required: false, type: String })
    async findAll(
  @Query('childId') childId?: string,
  @Query('page') page = 0,
  @Query('limit') limit = 10,
  @Query('sortBy') sortBy = 'createdAt',
  @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
) {
  const pageNum = Number(page) || 0;
  const limitNum = Number(limit) || 10;
  return this.diaryEntriesService.findAll(childId, pageNum, limitNum, sortBy, sortOrder);
}


  @Get(':id')
  @ApiOperation({ summary: 'Tìm một bài nhật ký bằng ID' })
  findById(@Param('id') id: string) {
    return this.diaryEntriesService.findById(id);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một bài nhật ký' })
  delete(@Param('id') id: string) {
    return this.diaryEntriesService.delete(id);
  }
}