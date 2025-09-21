import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger'; // <-- 1. Thêm ApiQuery
import { MedicalRecordsService } from './medical-record.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

@ApiTags('MedicalRecords')
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  create(@Body() dto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách hồ sơ (có thể lọc theo bé)' })
  @ApiQuery({ 
    name: 'childId',
    required: false,
    type: String,
  })
  findAll(@Query('childId') childId?: string) {
    return this.medicalRecordsService.findAll(childId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalRecordsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMedicalRecordDto) {
    return this.medicalRecordsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalRecordsService.remove(id);
  }
}