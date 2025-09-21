import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './entities/article.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>
  ) {}

  async create(articleData: Partial<Article>): Promise<ArticleDocument> {
    const newArticle = new this.articleModel(articleData);
    return newArticle.save();
  }

  async findById(id: string): Promise<ArticleDocument | null> {
    return this.articleModel.findById(id).exec();
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<ArticleDocument | null> {
    return this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true }).exec();
  }

  async findAll(): Promise<ArticleDocument[]> {
    return this.articleModel.find().exec();
  }

  async delete(id: string): Promise<ArticleDocument | null> {
    return this.articleModel.findByIdAndDelete(id).exec();
  }

  async findByTitle(title: string): Promise<ArticleDocument[]> {
    return this.articleModel.find({ Title: { $regex: title, $options: 'i' } }).exec();
  }

}
