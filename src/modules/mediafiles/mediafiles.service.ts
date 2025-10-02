import { Injectable } from '@nestjs/common';
import { CreateMediaFilesDto } from './dto/create-mediafiles.dto';
import { UpdateMediaFilesDto } from './dto/update-mediafiles.dto';
import { MediaFiles, MediaFilesDocument } from './entities/mediafile.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MediaFilesService {
  constructor(
    @InjectModel(MediaFiles.name) private mediaFilesModel: Model<MediaFiles>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async create(createMediaFilesDto: CreateMediaFilesDto): Promise<MediaFilesDocument> {
    const { fileUrl, fileName, fileType, Author } = createMediaFilesDto;
    const author = await this.userModel.findById(Author);
    if (!author) {
      throw new Error(`Author with id ${Author} not found`);
    }
    const newMediaFile = new this.mediaFilesModel({
      fileUrl : fileUrl,
      fileName: fileName,
      fileType: fileType,
      Author: author
    });
    return newMediaFile.save();
  }

  async findById(id: string): Promise<MediaFilesDocument | null> {
    return this.mediaFilesModel.findById(id).populate('Author').exec();
  }

  async update(id: string, updateMediaFilesDto: UpdateMediaFilesDto): Promise<MediaFilesDocument | null> {
    const mediaFile = await this.mediaFilesModel.findById(id);
    if (!mediaFile) {
      throw new Error(`Media file with id ${id} not found`);
    }
    if (updateMediaFilesDto.Author) {
      const author = await this.userModel.findById(updateMediaFilesDto.Author);
      if (!author) {
        throw new Error(`Author with id ${updateMediaFilesDto.Author} not found`);
      }
      mediaFile.Author = author; 
    }
    if (updateMediaFilesDto.fileUrl) mediaFile.fileUrl = updateMediaFilesDto.fileUrl;
    if (updateMediaFilesDto.fileName) mediaFile.fileName = updateMediaFilesDto.fileName;
    if (updateMediaFilesDto.fileType) mediaFile.fileType = updateMediaFilesDto.fileType;
    return mediaFile.save();
  }

  async findAll(): Promise<MediaFilesDocument[]> {
    return this.mediaFilesModel.find().populate('Author').exec();
  }

  async delete(id: string): Promise<MediaFilesDocument | null> {
    return this.mediaFilesModel.findByIdAndDelete(id).exec();
  }

  async findByFileType(fileType: string): Promise<MediaFilesDocument[]> {
    return this.mediaFilesModel.find({ fileType: fileType }).populate('Author').exec();
  }

  async findByFileName(fileName: string): Promise<MediaFilesDocument[]> {
    return this.mediaFilesModel.find({ fileName: fileName }).populate('Author').exec();
  }
}
