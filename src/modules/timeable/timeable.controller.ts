import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TimetableService } from './timeable.service';
import { CreateTimetableDto } from './dto/create-timeable.dto';
import { UpdateTimeableDto } from './dto/update-timeable.dto';

@ApiTags('Timetable')
@Controller('timetables')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo một lịch mới' })
  create(@Body() createTimetableDto: CreateTimetableDto) {
    return this.timetableService.create(createTimetableDto);
  }

  @Get()
@ApiOperation({ summary: 'Lấy toàn bộ thời khóa biểu (có thể lọc, phân trang)' })
@ApiQuery({ name: 'childId', required: false, type: String })
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
findAll(
  @Query('childId') childId?: string,
  @Query('page') page = 0,
  @Query('limit') limit = 10,
) {
  const pageNum = Number(page) || 0;
  const limitNum = Number(limit) || 10;
  return this.timetableService.findAll(childId, pageNum, limitNum);
}

  @Get(':id')
  @ApiOperation({ summary: 'Tìm một lịch bằng ID' })
  findById(@Param('id') id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new BadRequestException('Invalid ID format');
    }
    return this.timetableService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật một lịch' })
  update(@Param('id') id: string, @Body() updateTimetableDto: UpdateTimeableDto) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new BadRequestException('Invalid ID format');
    }
    return this.timetableService.update(id, updateTimetableDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một lịch' })
  remove(@Param('id') id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new BadRequestException('Invalid ID format');
    }
    return this.timetableService.remove(id);
  }
}