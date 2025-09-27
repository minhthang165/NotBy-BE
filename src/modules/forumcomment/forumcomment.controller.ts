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
import { CreateForumcommentDto } from './dto/create-forumcomment.dto';
import { UpdateForumcommentDto } from './dto/update-forumcomment.dto';
import { ForumCommentService } from './forumcomment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ForumComment')
@Controller('ForumComment')
export class ForumCommentController {
  constructor(private readonly forumCommentService: ForumCommentService) {}

  @Post()
  async create(@Body() createForumcommentDto: CreateForumcommentDto) {
    return this.forumCommentService.create(createForumcommentDto);
  }

  @Get()
  async findAll() {
    return this.forumCommentService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const forumComment = await this.forumCommentService.findById(id);
    if (!forumComment) {
      throw new NotFoundException(`Forum comment with id ${id} not found`);
    }
    return forumComment;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateForumcommentDto: UpdateForumcommentDto) {
    const updatedForumcomment = await this.forumCommentService.update(id, updateForumcommentDto);
    if (!updatedForumcomment) {
      throw new NotFoundException(`Forum comment with id ${id} not found`);
    }
    return updatedForumcomment;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedForumcomment = await this.forumCommentService.delete(id);
    if (!deletedForumcomment) {
      throw new NotFoundException(`Forum comment with id ${id} not found`);
    }
    return { message: `Forum comment with id ${id} has been deleted` };
  }

  @Get('author/:authorId')
  async findByAuthor(@Param('authorId') authorId: string) {
    const forumComments = await this.forumCommentService.findByAuthor(authorId);
    if (!forumComments || forumComments.length === 0) {
      throw new NotFoundException(`No forum comments found for author with id ${authorId}`);
    }
    return forumComments;
  }

  @Get('content/:content')
  async findByContent(@Param('content') content: string) {
    const forumComments = await this.forumCommentService.findByContent(content);
    if (!forumComments || forumComments.length === 0) {
      throw new NotFoundException(`No forum comments found with content ${content}`);
    }
    return forumComments;
  }
}