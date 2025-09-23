import { Injectable } from '@nestjs/common';
import { CreateMediaFilesDto } from './dto/create-mediafiles.dto';
import { UpdateMediaFilesDto } from './dto/update-mediafiles.dto';
import { MediaFiles, MediaFilesDocument } from './entities/mediafile.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MediaFilesService {
  constructor(
    @InjectModel(MediaFiles.name) private mediaFilesModel: Model<MediaFiles>
  ) {}

  async create(mediaFileData: Partial<MediaFiles>): Promise<MediaFilesDocument> {
    const newMediaFile = new this.mediaFilesModel(mediaFileData);
    return newMediaFile.save();
  }

  async findById(id: string): Promise<MediaFilesDocument | null> {
    return this.mediaFilesModel.findById(id).exec();
  }

  async update(id: string, updateMediaFilesDto: UpdateMediaFilesDto): Promise<MediaFilesDocument | null> {
    return this.mediaFilesModel.findByIdAndUpdate(id, updateMediaFilesDto, { new: true }).exec();
  }

  async findAll(): Promise<MediaFilesDocument[]> {
    return this.mediaFilesModel.find().exec();
  }

  async delete(id: string): Promise<MediaFilesDocument | null> {
    return this.mediaFilesModel.findByIdAndDelete(id).exec();
  }
}
