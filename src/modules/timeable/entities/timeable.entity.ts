import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/modules/shared/base.entity';

export type TimetableDocument = HydratedDocument<Timetable>;


export enum ActivityType{
    SPORT = 'Thể thao',
    ART = 'Nghệ thuật',
    EDUCATION = 'Giáo dục',
    HEALTH = 'Sức khỏe',
    SOCIAL = 'Xã hội',
    FAMILY = 'Gia đình',
}

export enum DayOfWeek {
  MONDAY = 'Thứ Hai',
  TUESDAY = 'Thứ Ba',
  WEDNESDAY = 'Thứ Tư',
  THURSDAY = 'Thứ Năm',
  FRIDAY = 'Thứ Sáu',
  SATURDAY = 'Thứ Bảy',
  SUNDAY = 'Chủ Nhật',
}

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: { getters: true, virtuals: true },
})
export class Timetable extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Baby', required: true })
  childId: Types.ObjectId;

  @Prop({ type: String, required: true })
  activityName: string;

  @Prop({ type: String, enum: ActivityType, required: true })
  activityType: ActivityType;


  @Prop({ type: String, enum: DayOfWeek, required: true })
  dayOfWeek: DayOfWeek;

  @Prop({ type: String, required: true }) // format "HH:mm"
  startTime: string;

  @Prop({ type: String, required: true }) // format "HH:mm"
  endTime: string;

  @Prop({ type: String, required: false })
  location?: string;
  
  @Prop({ type: String, required: false })
  teacher?: string;

  @Prop({ type: String, required: false })
  notes?: string;
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);