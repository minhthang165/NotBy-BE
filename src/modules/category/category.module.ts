import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchemaFactory } from './entities/category.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: Category.name,
      useFactory: CategorySchemaFactory,
        inject: [],
        imports: [MongooseModule.forFeature([])],
      }
    ])
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
