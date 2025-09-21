import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { MedicalRecord, MedicalRecordDocument } from './entities/medical-record.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { Baby, BabyDocument } from '../babies/entities/baby.entity';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectModel(MedicalRecord.name) 
    private readonly medicalRecordModel: Model<MedicalRecordDocument>,
    @InjectModel(Baby.name)
    private readonly babyModel: Model<BabyDocument>,
  ) {}

  async create(createDto: CreateMedicalRecordDto): Promise<MedicalRecordDocument> {
    const { childId } = createDto;

    const baby = await this.babyModel.findById(childId);
    if (!baby) {
      throw new NotFoundException(`Baby with ID "${childId}" not found`);
    }

    const record = new this.medicalRecordModel(createDto);
    await record.save();
    return record.populate('childId');

  }

  async findAll(childId?: string): Promise<MedicalRecordDocument[]> {
    const query: FilterQuery<MedicalRecordDocument> = {};
    if (childId) {
      if (!Types.ObjectId.isValid(childId)) {
        throw new BadRequestException('Invalid Baby ID format in query');
      }
      query.childId = new Types.ObjectId(childId);
    }
    return this.medicalRecordModel.find(query).populate('childId').exec(); 
  }

  async findById(id: string): Promise<MedicalRecordDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const record = await this.medicalRecordModel.findById(id).populate('childId').exec(); 
    if (!record) throw new NotFoundException(`Medical record with id "${id}" not found`);
    return record;
  }

  async update(id: string, updateDto: UpdateMedicalRecordDto): Promise<MedicalRecordDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const updated = await this.medicalRecordModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('childId') 
      .exec();
    if (!updated) throw new NotFoundException(`Medical record with id "${id}" not found`);
    return updated;
  }

  async remove(id: string): Promise<MedicalRecordDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const deletedRecord = await this.medicalRecordModel.findByIdAndDelete(id).populate('childId').exec();
    if (!deletedRecord) {
      throw new NotFoundException(`Medical record with id "${id}" not found`);
    }
    return deletedRecord;
  }
}