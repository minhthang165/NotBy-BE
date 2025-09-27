import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchemaFactory } from './entities/article.entity';
import { MediaFilesModule } from '../mediafiles/mediafiles.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { Category, CategorySchema } from '../category/entities/category.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { MediaFiles, MediaFilesSchema } from '../mediafiles/entities/mediafile.entity';

@Module({
  imports: [
    CategoryModule,
    UserModule,
    MediaFilesModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: User.name, schema: UserSchema },
      { name: MediaFiles.name, schema: MediaFilesSchema }
    ]),
    MongooseModule.forFeatureAsync([{
      name: Article.name,
      useFactory: ArticleSchemaFactory,
      imports: [MongooseModule.forFeature([])],
    }]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService, MongooseModule],
})
export class ArticleModule {}
