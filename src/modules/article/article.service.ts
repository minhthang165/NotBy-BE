import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './entities/article.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { MediaFiles } from '../mediafiles/entities/mediafile.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MediaFiles.name) private readonly mediaFilesModel: Model<MediaFiles>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const { CategoryId, Author, Title, Content, FileId, Likes, Views, Tags, ReadTime, Description } =
      createArticleDto;

    const category = await this.categoryModel.findById(CategoryId);
    if (!category) {
      throw new NotFoundException(`Category with id ${CategoryId} not found`);
    }

    const author = await this.userModel.findById(Author);
    if (!author) {
      throw new NotFoundException(`Author with id ${Author} not found`);
    }

    let file = null;
    if (FileId) {
      file = await this.mediaFilesModel.findById(FileId); 
    if (!file) {
      throw new NotFoundException(`Media file with id ${FileId} not found`);
      }
    }

    const newArticle = new this.articleModel({
      Category: category,
      Author: author,
      Title,
      Content,
      File: file,
      Likes: Likes ?? 0,
      Views: Views ?? 0,
      Tags: Tags ?? [],
      ReadTime: ReadTime ?? 0,
      Description: Description ?? '',
    });

    return newArticle.save();
  }

  async findById(id: string): Promise<ArticleDocument | null> {
    return this.articleModel
      .findById(id)
      .populate('Category')
      .populate('Author')
      .populate('File')
      .exec();
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<ArticleDocument | null> {
    const article = await this.articleModel.findById(id);
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    
    if (updateArticleDto.CategoryId) {
      const category = await this.categoryModel.findById(updateArticleDto.CategoryId);
      if (!category) {
        throw new NotFoundException(`Category with id ${updateArticleDto.CategoryId} not found`);
      }
      article.Category = category;
    }
    
    if (updateArticleDto.FileId) {
      const file = await this.mediaFilesModel.findById(updateArticleDto.FileId);
      if (!file) {
        throw new NotFoundException(`Media file with id ${updateArticleDto.FileId} not found`);
      }
      article.File = file;
    }

    if (updateArticleDto.Author) {
      const author = await this.userModel.findById(updateArticleDto.Author);
      if (!author) {
        throw new NotFoundException(`Author with id ${updateArticleDto.Author} not found`);
      }
      article.Author = author;
    }
    
    if (updateArticleDto.Title) article.Title = updateArticleDto.Title;
    if (updateArticleDto.Content) article.Content = updateArticleDto.Content;
    if (updateArticleDto.Likes !== undefined) article.Likes = updateArticleDto.Likes;
    if (updateArticleDto.Views !== undefined) article.Views = updateArticleDto.Views;
    if (updateArticleDto.Tags) article.Tags = updateArticleDto.Tags;
    if (updateArticleDto.ReadTime !== undefined) article.ReadTime = updateArticleDto.ReadTime;
    if (updateArticleDto.Description) article.Description = updateArticleDto.Description;
    
    return article.save();
  }

  async findAll(): Promise<ArticleDocument[]> {
    return this.articleModel
      .find()
      .populate('Category')
      .populate('Author')
      .populate('File')
      .exec();
  }

  async delete(id: string): Promise<ArticleDocument | null> {
    return this.articleModel.findByIdAndDelete(id).exec();
  }

  async findByTitle(title: string): Promise<ArticleDocument[]> {
    return this.articleModel
      .find({ Title: { $regex: title, $options: 'i' } })
      .populate('Category')
      .populate('Author')
      .populate('File')
      .exec();
  }

}
