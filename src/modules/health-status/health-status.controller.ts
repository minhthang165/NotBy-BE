import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HealthStatusService } from './health-status.service';
import { CreateHealthStatusDto } from './dto/create-health-status.dto';
import { UpdateHealthStatusDto } from './dto/update-health-status.dto';
import { ApiConsumes, ApiTags, ApiQuery, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('HealthStatus')
@Controller('health-status')
export class HealthStatusController {
  constructor(private readonly healthStatusService: HealthStatusService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreateHealthStatusDto })
  async create(
    @Body() createHealthStatusDto: CreateHealthStatusDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.healthStatusService.create(createHealthStatusDto, file);
  }



  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateHealthStatusDto: UpdateHealthStatusDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.healthStatusService.update(id, updateHealthStatusDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách health status (có thể lọc theo bé, phân trang)' })
  @ApiQuery({ name: 'childId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async findAll(
    @Query('childId') childId?: string,
    @Query('page') page = 0,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    const pageNum = Number(page) || 0;
    const limitNum = Number(limit) || 10;
    return this.healthStatusService.findAll(childId, pageNum, limitNum, sortBy, sortOrder);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.healthStatusService.findById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.healthStatusService.delete(id);
  }
}