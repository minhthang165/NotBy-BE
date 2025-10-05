import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/modules/shared/base.entity';
import { Type } from 'class-transformer';

export type HealthStatusDocument = HydratedDocument<HealthStatus>;

export enum CheckpointType {
  HOME = 'tại nhà',
  HOSPITAL = 'bệnh viện',
  CLINIC = 'phòng khám',
  OTHER = 'khác',
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class HealthStatus extends BaseEntity {
  constructor(status: {
    childId: mongoose.Types.ObjectId;
    height: number;
    weight: number;
    checkedAt: CheckpointType;
    description?: string;
    imageId?: mongoose.Types.ObjectId;
  }) {
    super();
    this.childId = status?.childId;
    this.height = status?.height;
    this.weight = status?.weight;
    this.checkedAt = status?.checkedAt;
    this.description = status?.description;
  }

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: true,
  })
  childId: mongoose.Types.ObjectId;

  @Prop({ type: Number, required: true })
  @Type(() => Number)
  height: number;

  @Prop({ type: Number, required: true })
  @Type(() => Number)
  weight: number;

  @Prop({ type: String, enum: CheckpointType, required: true })
  checkedAt: CheckpointType;

  @Prop({ type: String })
  description?: string;


 @Prop({ type: [String] })
  imageUrls?: string[];
}

export const HealthStatusSchema = SchemaFactory.createForClass(HealthStatus);