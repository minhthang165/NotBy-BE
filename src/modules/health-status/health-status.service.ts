import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HealthStatus, HealthStatusDocument } from './entities/health-status.entity';
import { CreateHealthStatusDto } from './dto/create-health-status.dto';
import { UpdateHealthStatusDto } from './dto/update-health-status.dto';

@Injectable()
export class HealthStatusService {
  constructor(
    @InjectModel(HealthStatus.name) private readonly healthStatusModel: Model<HealthStatusDocument>,
  ) {}

  async create(createHealthStatusDto: CreateHealthStatusDto): Promise<HealthStatusDocument> {
    const newStatus = new this.healthStatusModel(createHealthStatusDto);
    return newStatus.save();
  }

  async findAll(): Promise<HealthStatusDocument[]> {
    return this.healthStatusModel
    .find()
    .populate('childId')
    .exec();
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

  async update(id: string, updateHealthStatusDto: UpdateHealthStatusDto): Promise<HealthStatusDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Health status with id "${id}" not found`);
    }
    const updated = await this.healthStatusModel
    .findByIdAndUpdate(id, updateHealthStatusDto, { new: true })
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