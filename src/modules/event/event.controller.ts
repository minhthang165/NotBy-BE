import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';

@ApiTags('Event')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @Post()
  async create(@Body() dto: CreateEventDto, @Req() req) {
    const userId = req.body.createdBy || 'system'; 
    return this.eventService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sự kiện (có thể lọc theo bé)' })
  @ApiQuery({ name: 'childId', required: false, type: String })
  async findAll(@Query('childId') childId?: string) {
    return this.eventService.findAll(childId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventService.softDelete(id);
  }
}