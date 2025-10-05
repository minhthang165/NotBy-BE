import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { HealthStatus, HealthStatusDocument } from './entities/health-status.entity';
import { CreateHealthStatusDto } from './dto/create-health-status.dto';
import { UpdateHealthStatusDto } from './dto/update-health-status.dto';
import { Baby, BabyDocument } from '../babies/entities/baby.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class HealthStatusService {
  constructor(
    @InjectModel(HealthStatus.name) private readonly healthStatusModel: Model<HealthStatusDocument>,
    @InjectModel(Baby.name) private readonly babyModel: Model<BabyDocument>,
        private readonly cloudinaryService: CloudinaryService,
  ) {}

   async create(
  createHealthStatusDto: CreateHealthStatusDto,
  file?: Express.Multer.File,
): Promise<HealthStatusDocument> {
  const { childId, height, weight, ...rest } = createHealthStatusDto;

  const baby = await this.babyModel.findById(childId);
  if (!baby) {
    throw new NotFoundException(`Baby with ID "${childId}" not found`);
  }

  let imageUrl: string | undefined;
  if (file) {
    imageUrl = await this.cloudinaryService.uploadImage(file);
  }

  // --- SỬA LẠI Ở ĐÂY ---
  const newStatusPayload = {
    ...rest, 
    childId,
    height: Number(height), 
    weight: Number(weight), 
    imageUrl,
  };

  const newStatus = new this.healthStatusModel(newStatusPayload);
  
  try {
    await newStatus.save();
  } catch (error) {
    // In ra lỗi validation để gỡ lỗi nếu cần
    console.error("Mongoose validation error:", error);
    throw new BadRequestException(error.message);
  }

  return newStatus.populate('childId');
}

 async findAll(
    childId?: string,
    page = 0,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<{ data: HealthStatusDocument[]; total: number; page: number; limit: number }> {
    const query: FilterQuery<HealthStatusDocument> = {};
    if (childId) {
      if (!Types.ObjectId.isValid(childId)) {
        throw new BadRequestException('Invalid childId');
      }
      query.childId = childId;
    }
    const total = await this.healthStatusModel.countDocuments(query);
    const data = await this.healthStatusModel
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

  async findById(id: string): Promise<HealthStatusDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Health status with id "${id}" not found`);
    }
    const status = await this.healthStatusModel
    .findById(id)
    .populate('childId')
    .exec();
    if (!status) {
      throw new NotFoundException(`Health status with id "${id}" not found`);
    }
    return status;
  }

    async update(
    id: string,
    updateHealthStatusDto: UpdateHealthStatusDto,
    file?: Express.Multer.File,
  ): Promise<HealthStatusDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Health status with id "${id}" not found`);
    }

    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.cloudinaryService.uploadImage(file);
    }

    const updatePayload = {
      ...updateHealthStatusDto,
      ...(imageUrl && { imageUrl }),
    };

    const updated = await this.healthStatusModel
      .findByIdAndUpdate(id, updatePayload, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Health status with id "${id}" not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<HealthStatusDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Health status with id "${id}" not found`);
    }
    const deleted = await this.healthStatusModel
    .findByIdAndDelete(id)
    .exec();
    if (!deleted) {
      throw new NotFoundException(`Health status with id "${id}" not found`);
    }
    return deleted;
  }

}