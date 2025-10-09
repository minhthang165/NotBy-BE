import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchemaFactory } from './entities/group.entity';
import { MediaFilesModule } from '../mediafiles/mediafiles.module';
import { CategoryModule } from '../category/category.module';
import { Category, CategorySchema } from '../category/entities/category.entity';
import { MediaFiles, MediaFilesSchema } from '../mediafiles/entities/mediafile.entity';

@Module({
  imports: [
    CategoryModule,
    MediaFilesModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: MediaFiles.name, schema: MediaFilesSchema }
    ]),
    MongooseModule.forFeatureAsync([{
      name: Group.name,
      useFactory: GroupSchemaFactory,
      imports: [MongooseModule.forFeature([])],
    }]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
