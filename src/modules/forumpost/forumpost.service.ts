import { Get, Injectable, NotFoundException, Post } from '@nestjs/common';
import { CreateForumpostDto } from './dto/create-forumpost.dto';
import { UpdateForumpostDto } from './dto/update-forumpost.dto';
import { ForumPost, ForumPostDocument } from './entities/forumpost.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { MediaFiles } from '../mediafiles/entities/mediafile.entity';

@Injectable()
export class ForumPostService {
  constructor(
    @InjectModel(ForumPost.name) private readonly forumPostModel: Model<ForumPost>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(MediaFiles.name) private readonly mediaFilesModel: Model<MediaFiles>,
  ) {}

  async create(createForumpostDto: CreateForumpostDto): Promise<ForumPost> {
    const  { Author, Title, Content, FileId, Likes, Views } = createForumpostDto;
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
    
    const createdForumpost = new this.forumPostModel({
      Author: author._id,
      Title,
      Content,
      File: file,
      Likes,
      Views,
    });

    return createdForumpost.save();
  }

  async findById(id: string): Promise<ForumPostDocument | null> {
    return this.forumPostModel
      .findById(id)
      .populate('Author')
      .populate('File')
      .exec();
  }
  
  async findAll(): Promise<ForumPostDocument[]> {
    return this.forumPostModel
      .find()
      .populate('Author')
      .populate('File')
      .exec();
  }

  async update(id: string, updateForumpostDto: UpdateForumpostDto): Promise<ForumPostDocument | null> {
    const existingForumpost = await this.forumPostModel.findById(id);
    if (!existingForumpost) {
      throw new NotFoundException(`Forum post with id ${id} not found`);
    }
    if (updateForumpostDto.Author) {
      const author = await this.userModel.findById(updateForumpostDto.Author);
      if (!author) {
        throw new NotFoundException(`Author with id ${updateForumpostDto.Author} not found`);
      }
      existingForumpost.Author = author;
    }
    if (updateForumpostDto.FileId) {
      const file = await this.mediaFilesModel.findById(updateForumpostDto.FileId);
      if (!file) {
        throw new NotFoundException(`Media file with id ${updateForumpostDto.FileId} not found`);
      }
      existingForumpost.File = file;
    }
    return existingForumpost.save();
  }

  async delete(id: string): Promise<ForumPostDocument | null> {
    return this.forumPostModel.findByIdAndDelete(id).exec();
  }

  async findByAuthor(authorId: string): Promise<ForumPostDocument[]> {
    const author = await this.userModel.findById(authorId);
    if (!author) {
      throw new NotFoundException(`Author with id ${authorId} not found`);
    }
    return this.forumPostModel.find({ Author: author._id }).exec();
  }

  async findByTitle(title: string): Promise<ForumPostDocument[]> {
    return this.forumPostModel
      .find({ Title: { $regex: title, $options: 'i' } })
      .populate('Author')
      .populate('File')
      .exec();
  }
}