import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchemaFactory } from './entities/article.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: Article.name,
      useFactory: ArticleSchemaFactory,
        inject: [],
        imports: [MongooseModule.forFeature([])],
      }
    ])
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
