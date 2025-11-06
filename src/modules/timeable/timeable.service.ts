import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { Timetable, TimetableDocument } from './entities/timeable.entity';
import { CreateTimetableDto } from './dto/create-timeable.dto';
import { UpdateTimeableDto } from './dto/update-timeable.dto';
import { Baby, BabyDocument } from '../babies/entities/baby.entity';

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable.name) private readonly timetableModel: Model<TimetableDocument>,
    @InjectModel(Baby.name) private readonly babyModel: Model<BabyDocument>,
  ) {}

  async create(createDto: CreateTimetableDto): Promise<TimetableDocument> {
    const { childId } = createDto;
    if (!Types.ObjectId.isValid(childId)) {
        throw new BadRequestException('Invalid Baby ID format');
    }
    const baby = await this.babyModel.findById(childId);
    if (!baby) {
      throw new NotFoundException(`Baby with ID "${childId}" not found`);
    }
    const newTimetable = new this.timetableModel(createDto);
    return newTimetable.save();
  }

 async findAll(
    childId?: string,
    page = 0,
    limit = 10,
    sortBy = 'dayOfWeek', // Sắp xếp theo ngày trong tuần làm mặc định
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<{ data: TimetableDocument[]; total: number; page: number; limit: number }> {
    const query: FilterQuery<TimetableDocument> = {};
    if (childId) {
      if (!Types.ObjectId.isValid(childId)) {
        throw new BadRequestException('Invalid Baby ID format');
      }
      query.childId = childId; // Không cần new Types.ObjectId()
    }
    
    // Đếm tổng số bản ghi khớp điều kiện
    const total = await this.timetableModel.countDocuments(query);
    
    // Lấy dữ liệu đã phân trang và sắp xếp
    const data = await this.timetableModel
      .find(query)
      .populate('childId')
      .sort({ [sortBy]: sortOrder })
      .skip(page * limit)
      .limit(limit)
      .exec();

    // Trả về theo cấu trúc chuẩn
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<TimetableDocument> {
    const timetable = await this.timetableModel.findById(id).populate('childId');
    if (!timetable) {
      throw new NotFoundException(`Timetable with ID "${id}" not found`);
    }
    return timetable;
  }

  async update(id: string, updateDto: UpdateTimeableDto): Promise<TimetableDocument> {
    const updated = await this.timetableModel.findByIdAndUpdate(id, updateDto, { new: true }).populate('childId');
    if (!updated) {
      throw new NotFoundException(`Timetable with ID "${id}" not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<TimetableDocument> {
    const deleted = await this.timetableModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Timetable with ID "${id}" not found`);
    }
    return deleted;
  }
}