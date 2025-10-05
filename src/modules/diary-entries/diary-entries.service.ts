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
  files?: Express.Multer.File[],
): Promise<DiaryEntryDocument> {
  const { childId } = createDiaryEntryDto;

  const baby = await this.babyModel.findById(childId);
  if (!baby) {
    throw new NotFoundException(`Baby with ID "${childId}" not found`);
  }

  let imageUrls: string[] = [];
  if (files && files.length > 0) {
   
    imageUrls = await Promise.all(
      files.map(file => this.cloudinaryService.uploadImage(file))
    );
  }

  const newEntry = new this.diaryEntryModel({
    ...createDiaryEntryDto,
    imageUrls, 
  });

  await newEntry.save();
  return newEntry.populate('childId');
}

  async findAll( 
    childId?: string,
    page = 0,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<{ data: DiaryEntryDocument[]; total: number; page: number; limit: number }> {
    const query: FilterQuery<DiaryEntryDocument> = {};
    if (childId) {
      if (!Types.ObjectId.isValid(childId)) {
        throw new BadRequestException('Invalid Baby ID format in query');
      }
      query.childId = new Types.ObjectId(childId);
    }

    const total = await this.diaryEntryModel.countDocuments(query);
    const data = await this.diaryEntryModel
      .find(query)
      .populate('childId')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(page * limit)
      .limit(limit)
      .exec();

    return {
      data,
      total,
      page,
      limit,
    };
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
// trong file: diary-entries.service.ts

async update(
  id: string,
  updateDiaryEntryDto: UpdateDiaryEntryDto,
  files?: Express.Multer.File[], // <-- 1. Sửa thành mảng files
): Promise<DiaryEntryDocument> {
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundException(`Diary entry with id "${id}" not found`);
  }

  const updatePayload: any = { ...updateDiaryEntryDto };

  // 2. Sửa lại logic upload cho nhiều file
  if (files && files.length > 0) {
    const imageUrls = await Promise.all(
      files.map(file => this.cloudinaryService.uploadImage(file))
    );
    updatePayload.imageUrls = imageUrls; // Gán mảng các URL
  }
  
  // ... (logic chuyển đổi height/weight nếu có)

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