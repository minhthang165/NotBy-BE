import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) {}

  async create(categoryData: Partial<Category>): Promise<CategoryDocument> {
    const newCategory = new this.categoryModel(categoryData);
    return newCategory.save();
  }

  async findById(id: string): Promise<CategoryDocument | null> {
    return this.categoryModel.findById(id).exec();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDocument | null> {
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec();
  }

  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryModel.find().exec();
  }

  async delete(id: string): Promise<CategoryDocument | null> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }

  async findByTitle(title: string): Promise<CategoryDocument[]> {
  return this.categoryModel.find({ Title: { $regex: title, $options: 'i' } }).exec();
}

}
