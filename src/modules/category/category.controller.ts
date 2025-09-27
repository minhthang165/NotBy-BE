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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const updatedCategory = await this.categoryService.update(id, updateCategoryDto);
    if (!updatedCategory) throw new NotFoundException('Category not found');
    return updatedCategory;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedCategory = await this.categoryService.delete(id);
    if (!deletedCategory) throw new NotFoundException('Category not found');
    return deletedCategory;
  }

  @Get('title/:title')
  async findByTitle(@Param('title') title: string) {
    const category = await this.categoryService.findByTitle(title);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
