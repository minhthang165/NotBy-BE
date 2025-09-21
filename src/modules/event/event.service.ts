import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Baby, BabyDocument } from '../babies/entities/baby.entity';


@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(Baby.name) private readonly babyModel: Model<BabyDocument>,
  ) {}

  async create(createDto: CreateEventDto, userId: string): Promise<EventDocument> {
  
    const baby = await this.babyModel.findById(createDto.childId);
    if (!baby) {
      throw new NotFoundException(`Baby with ID "${createDto.childId}" not found`);
    }

    const eventPayload = {
      ...createDto,
      createdBy: userId,
    };

    const newEvent = new this.eventModel(eventPayload);
    return newEvent.save();
  }


  
  async findAll(childId?: string): Promise<EventDocument[]> {
    const query: any = { isActive: { $ne: false } };
    if (childId) {
      if (!Types.ObjectId.isValid(childId)) {
        throw new NotFoundException('Invalid childId');
      }
      query.childId = childId;
    }
    return this.eventModel.find(query).populate('childId').populate('createdBy').exec();
  }

  async findById(id: string): Promise<EventDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid event id');
    }
    const event = await this.eventModel.findById(id).populate('childId').populate('createdBy').exec();
    if (!event || event.isActive === false) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, updateDto: UpdateEventDto): Promise<EventDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid event id');
    }
    const updated = await this.eventModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('childId')
      .populate('createdBy')
      .exec();
    if (!updated || updated.isActive === false) throw new NotFoundException('Event not found');
    return updated;
  }

  async softDelete(id: string): Promise<EventDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid event id');
    }
    const deleted = await this.eventModel
      .findByIdAndUpdate(id, { isActive: false, deletedAt: new Date() }, { new: true })
      .exec();
    if (!deleted) throw new NotFoundException('Event not found');
    return deleted;
  }
}