import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BabiesService } from './babies.service';
import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('babies')
export class BabiesController {
  constructor(private readonly babiesService: BabiesService) {}

  @Post()
  async create(@Body() createBabyDto: CreateBabyDto) {
    return await this.babiesService.create(createBabyDto);
  }
@Get()
@ApiQuery({ name: 'pageNumber', required: false, type: Number })
@ApiQuery({ name: 'pageSize', required: false, type: Number })
@ApiQuery({ name: 'searchPhase', required: false, type: String })
@ApiQuery({ name: 'sortBy', required: false, type: String })
@ApiQuery({ name: 'sortOrder', required: false, type: String })
@ApiQuery({ name: 'parentId', required: false, type: String }) 
async findAll(
    @Query('searchPhase') searchPhase?: string,
    @Query('pageNumber') page = '0',
    @Query('pageSize') limit = '10',
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('parentId') parentId?: string, 
) {
    return await this.babiesService.findAll(
        searchPhase,
        parseInt(page, 10),
        parseInt(limit, 10),
        sortBy,
        sortOrder,
        parentId,
    );
}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.babiesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBabyDto: UpdateBabyDto) {
    return await this.babiesService.update(id, updateBabyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.babiesService.remove(id);
  }
}
