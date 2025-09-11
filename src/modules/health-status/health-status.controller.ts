import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HealthStatusService } from './health-status.service';
import { CreateHealthStatusDto } from './dto/create-health-status.dto';
import { UpdateHealthStatusDto } from './dto/update-health-status.dto';

@Controller('health-status')
export class HealthStatusController {
  constructor(private readonly healthStatusService: HealthStatusService) {}

  @Post()
  async create(@Body() createHealthStatusDto: CreateHealthStatusDto) {
    return this.healthStatusService.create(createHealthStatusDto);
  }

  @Get()
  async findAll() {
    return this.healthStatusService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.healthStatusService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHealthStatusDto: UpdateHealthStatusDto,
  ) {
    return this.healthStatusService.update(id, updateHealthStatusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.healthStatusService.delete(id);
  }
}