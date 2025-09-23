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
  @ApiOperation({ summary: 'Tạo một bài nhật ký mới (có thể kèm ảnh)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDiaryEntryDto }) 
  create(
    @Body() createDiaryEntryDto: CreateDiaryEntryDto,
    @UploadedFile() image?: Express.Multer.File, 
  ) {
    return this.diaryEntriesService.create(createDiaryEntryDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách nhật ký (có thể lọc theo bé)' })
  @ApiQuery({ name: 'childId', required: false, type: String })
  findAll(@Query('childId') childId?: string) {
    return this.diaryEntriesService.findAll(childId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tìm một bài nhật ký bằng ID' })
  findById(@Param('id') id: string) {
    return this.diaryEntriesService.findById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Cập nhật một bài nhật ký (có thể kèm ảnh mới)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateDiaryEntryDto })
  update(
    @Param('id') id: string,
    @Body() updateDiaryEntryDto: UpdateDiaryEntryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.diaryEntriesService.update(id, updateDiaryEntryDto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một bài nhật ký' })
  delete(@Param('id') id: string) {
    return this.diaryEntriesService.delete(id);
  }
}