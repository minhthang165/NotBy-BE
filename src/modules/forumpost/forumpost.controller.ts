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
import { CreateForumpostDto } from './dto/create-forumpost.dto';
import { UpdateForumpostDto } from './dto/update-forumpost.dto';
import { ForumPostService } from './forumpost.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Forumpost')
@Controller('Forumpost')
export class ForumPostController {
  constructor(private readonly forumPostService: ForumPostService) {}

  @Post()
  async create(@Body() createForumpostDto: CreateForumpostDto) {
    return this.forumPostService.create(createForumpostDto);
  }

  @Get()
  async findAll() {
    return this.forumPostService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const forumpost = await this.forumPostService.findById(id);
    if (!forumpost) {
      throw new NotFoundException(`Forum post with id ${id} not found`);
    }
    return forumpost;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateForumpostDto: UpdateForumpostDto) {
    const updatedForumpost = await this.forumPostService.update(id, updateForumpostDto);
    if (!updatedForumpost) {
      throw new NotFoundException(`Forum post with id ${id} not found`);
    }
    return updatedForumpost;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedForumpost = await this.forumPostService.delete(id);
    if (!deletedForumpost) {
      throw new NotFoundException(`Forum post with id ${id} not found`);
    }
    return { message: `Forum post with id ${id} has been deleted` };
  }

  @Get('author/:authorId')
  async findByAuthor(@Param('authorId') authorId: string) {
    const forumposts = await this.forumPostService.findByAuthor(authorId);
    if (!forumposts || forumposts.length === 0) {
      throw new NotFoundException(`No forum posts found for author with id ${authorId}`);
    }
    return forumposts;
  }

  @Get('title/:title')
  async findByTitle(@Param('title') title: string) {
    const forumposts = await this.forumPostService.findByTitle(title);
    if (!forumposts || forumposts.length === 0) {
      throw new NotFoundException(`No forum posts found with title ${title}`);
    }
    return forumposts;
  }
}