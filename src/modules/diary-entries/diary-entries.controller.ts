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
import { DiaryEntriesService } from './diary-entries.service';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';

@Controller('diary-entries')
export class DiaryEntriesController {
  constructor(private readonly diaryEntriesService: DiaryEntriesService) {}

  @Post()
  async create(@Body() createDiaryEntryDto: CreateDiaryEntryDto) {
    return this.diaryEntriesService.create(createDiaryEntryDto);
  }

  @Get()
  async findAll() {
    return this.diaryEntriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entry = await this.diaryEntriesService.findById(id);
    if (!entry) throw new NotFoundException('Diary entry not found');
    return entry;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiaryEntryDto: UpdateDiaryEntryDto,
  ) {
    const updatedEntry = await this.diaryEntriesService.update(id, updateDiaryEntryDto);
    if (!updatedEntry) throw new NotFoundException('Diary entry not found');
    return updatedEntry;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedEntry = await this.diaryEntriesService.delete(id);
    if (!deletedEntry) throw new NotFoundException('Diary entry not found');
    return deletedEntry;
  }
}