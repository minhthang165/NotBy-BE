import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { DiaryEntry, DiaryEntryDocument } from './entities/diary-entry.entity';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary-entry.dto';
import { Baby, BabyDocument } from '../babies/entities/baby.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class DiaryEntriesService {
  constructor(
    @InjectModel(DiaryEntry.name)
    private readonly diaryEntryModel: Model<DiaryEntryDocument>,
    @InjectModel(Baby.name)
    private readonly babyModel: Model<BabyDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createDiaryEntryDto: CreateDiaryEntryDto,
    file?: Express.Multer.File,
  ): Promise<DiaryEntryDocument> {
    const { childId } = createDiaryEntryDto;

    const baby = await this.babyModel.findById(childId);
    if (!baby) {
      throw new NotFoundException(`Baby with ID "${childId}" not found`);
    }

    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.cloudinaryService.uploadImage(file);
    }

    const newEntry = new this.diaryEntryModel({
      ...createDiaryEntryDto,
      imageUrl,
    });

    await newEntry.save();
    return newEntry.populate('childId');
  }

  async findAll(childId?: string): Promise<DiaryEntryDocument[]> {
    const query: FilterQuery<DiaryEntryDocument> = {};
    if (childId) {
      if (!Types.ObjectId.isValid(childId)) {
        throw new BadRequestException('Invalid Baby ID format in query');
      }
      query.childId = new Types.ObjectId(childId);
    }
    return this.diaryEntryModel.find(query).populate('childId').exec();
  }

  async findById(id: string): Promise<DiaryEntryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid diary entry ID');
    }
    const entry = await this.diaryEntryModel.findById(id).populate('childId').exec();
    if (!entry) {
      throw new NotFoundException(`Diary entry with id "${id}" not found`);
    }
    return entry;
  }

  async update(
    id: string,
    updateDiaryEntryDto: UpdateDiaryEntryDto,
    file?: Express.Multer.File,
  ): Promise<DiaryEntryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid diary entry ID');
    }

    const updatePayload: any = { ...updateDiaryEntryDto };

    if (file) {
      // SỬA LẠI: Gán trực tiếp kết quả trả về
      updatePayload.imageUrl = await this.cloudinaryService.uploadImage(file);
    }

    const updated = await this.diaryEntryModel
      .findByIdAndUpdate(id, updatePayload, { new: true })
      .populate('childId')
      .exec();

    if (!updated) {
      throw new NotFoundException(`Diary entry with id "${id}" not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<DiaryEntryDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid diary entry ID');
    }
    const deleted = await this.diaryEntryModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Diary entry with id "${id}" not found`);
    }
    return deleted;
  }
}