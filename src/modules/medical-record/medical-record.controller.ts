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
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger'; 
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
  
  @Get()
  @ApiOperation({ summary: 'Get all medical records with pagination' })
  @ApiQuery({ name: 'childId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async findAll(
    @Query('childId') childId?: string,
    @Query('page') page: string | number = 0,
    @Query('limit') limit: string | number = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const pageNum = parseInt(page as string, 10) || 0;
    const limitNum = parseInt(limit as string, 10) || 10;
    
    return this.medicalRecordsService.findAll(childId, pageNum, limitNum, sortBy, sortOrder);
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