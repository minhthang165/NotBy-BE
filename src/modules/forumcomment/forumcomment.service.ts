import { Get, Injectable, NotFoundException, Post } from '@nestjs/common';
import { CreateForumcommentDto } from './dto/create-forumcomment.dto';
import { UpdateForumcommentDto } from './dto/update-forumcomment.dto';
import { ForumComment, ForumCommentDocument } from './entity/forumcomment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { MediaFiles } from '../mediafiles/entities/mediafile.entity';
import { ForumPost } from '../forumpost/entities/forumpost.entity';

@Injectable()
export class ForumCommentService {
  constructor(
    @InjectModel(ForumComment.name) private readonly forumCommentModel: Model<ForumComment>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MediaFiles.name) private readonly mediaFilesModel: Model<MediaFiles>,
    @InjectModel(ForumPost.name) private readonly forumpostModel: Model<ForumPost>,
  ) {}

  async create(createForumcommentDto: CreateForumcommentDto): Promise<ForumComment> {
    const { ForumPostId, CreatedBy, Content, FileId, Likes = 0 } = createForumcommentDto;
    
    // Validate author
    const author = await this.userModel.findById(CreatedBy);
    if (!author) {
      throw new NotFoundException(`Author with id ${CreatedBy} not found`);
    }
    
    // Validate forum post
    const forumPost = await this.forumpostModel.findById(ForumPostId);
    if (!forumPost) {
      throw new NotFoundException(`Forum post with id ${ForumPostId} not found`);
    }
    
    // Validate file if provided
    let file = null;
    if (FileId) {
      file = await this.mediaFilesModel.findById(FileId);
      if (!file) {
        throw new NotFoundException(`Media file with id ${FileId} not found`);
      }
    }

    // Create comment
    const createdForumComment = new this.forumCommentModel({
      Post: forumPost,
      CreatedBy: author._id,
      Content,
      File: file,
      Likes: Likes || 0,
    });

    return createdForumComment.save();
  }

  async findById(id: string): Promise<ForumCommentDocument | null> {
    return this.forumCommentModel
      .findById(id)
      .populate('Post')
      .populate('CreatedBy')
      .populate('File')
      .exec();
  }

  async findAll(): Promise<ForumCommentDocument[]> {
    return this.forumCommentModel
      .find()
      .populate('Post')
      .populate('CreatedBy')
      .populate('File')
      .exec();
  }

  async update(id: string, updateForumCommentDto: UpdateForumcommentDto): Promise<ForumCommentDocument | null> {
    const existingForumComment = await this.forumCommentModel.findById(id);
    if (!existingForumComment) {
      throw new NotFoundException(`Forum comment with id ${id} not found`);
    }
    if (updateForumCommentDto.CreatedBy) {
      const author = await this.userModel.findById(updateForumCommentDto.CreatedBy);
      if (!author) {
        throw new NotFoundException(`Author with id ${updateForumCommentDto.CreatedBy} not found`);
      }
      existingForumComment.CreatedBy = author;
    }
    if (updateForumCommentDto.FileId) {
      const file = await this.mediaFilesModel.findById(updateForumCommentDto.FileId);
      if (!file) {
        throw new NotFoundException(`Media file with id ${updateForumCommentDto.FileId} not found`);
      }
      existingForumComment.File = file;
    }
    if (updateForumCommentDto.Likes !== undefined) {
      existingForumComment.Likes = updateForumCommentDto.Likes;
    }
    if (updateForumCommentDto.Content !== undefined) {
      existingForumComment.Content = updateForumCommentDto.Content;
    }
    return existingForumComment.save();
  }

  async delete(id: string): Promise<ForumCommentDocument | null> {
    return this.forumCommentModel.findByIdAndDelete(id).exec();
  }

  async findByAuthor(authorId: string): Promise<ForumCommentDocument[]> {
    const author = await this.userModel.findById(authorId);
    if (!author) {
      throw new NotFoundException(`Author with id ${authorId} not found`);
    }
    return this.forumCommentModel.find({ CreatedBy: author._id }).exec();
  }

  async findByContent(content: string): Promise<ForumCommentDocument[]> {
    return this.forumCommentModel
      .find({ Content: { $regex: content, $options: 'i' } })
      .populate('Post')
      .populate('CreatedBy')
      .populate('File')
      .exec();
  }

  async findByPost(postId: string): Promise<ForumCommentDocument[]> {
    const post = await this.forumpostModel.findById(postId);
    if (!post) {
      throw new NotFoundException(`Forum post with id ${postId} not found`);
    }
    return this.forumCommentModel.find({ Post: post._id })
    .populate('CreatedBy')
    .populate('File')
    .exec();
  }
}