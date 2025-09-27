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
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';


@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  async findAll() {
    return this.articleService.findAll();
  }

  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    const article = await this.articleService.findById(id);
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const updatedArticle = await this.articleService.update(id, updateArticleDto);
    if (!updatedArticle) throw new NotFoundException('Article not found');
    return updatedArticle;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedArticle = await this.articleService.delete(id);
    if (!deletedArticle) throw new NotFoundException('Article not found');
    return deletedArticle;
  }

  @Get('title/:title')
  async findByTitle(@Param('title') title: string) {
    const articles = await this.articleService.findByTitle(title);
    if (!articles) throw new NotFoundException('Articles not found');
    return articles;
  }
}
