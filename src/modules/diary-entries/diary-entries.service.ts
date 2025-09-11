import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DiaryEntry, DiaryEntryDocument } from './entities/diary-entry.entity';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';

@Injectable()
export class DiaryEntriesService {
  constructor(
    @InjectModel(DiaryEntry.name) private readonly diaryEntryModel: Model<DiaryEntryDocument>
  ) {}

  async create(createDiaryEntryDto: CreateDiaryEntryDto): Promise<DiaryEntryDocument> {
    const newEntry = new this.diaryEntryModel(createDiaryEntryDto);
    return newEntry.save();
  }

  async findAll(): Promise<DiaryEntryDocument[]> {
    return this.diaryEntryModel
    .find()
    .exec();
  }

  async findById(id: string): Promise<DiaryEntryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Diary entry with id "${id}" not found`);
    }
    const entry = await this.diaryEntryModel.findById(id)
      .exec();
    if (!entry) {
      throw new NotFoundException(`Diary entry with id "${id}" not found`);
    }
    return entry;
  }

  async update(id: string, updateDiaryEntryDto: UpdateDiaryEntryDto): Promise<DiaryEntryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Diary entry with id "${id}" not found`);
    }
    const updated = await this.diaryEntryModel
    .findByIdAndUpdate(id, updateDiaryEntryDto, { new: true })
    .exec();
    if (!updated) {
      throw new NotFoundException(`Diary entry with id "${id}" not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<DiaryEntryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Diary entry with id "${id}" not found`);
    }
    const deleted = await this.diaryEntryModel
    .findByIdAndDelete(id)
    .exec();
    if (!deleted) {
      throw new NotFoundException(`Diary entry with id "${id}" not found`);
    }
    return deleted;
  }
}