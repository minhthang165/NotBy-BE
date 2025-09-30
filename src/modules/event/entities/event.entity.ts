import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/modules/shared/base.entity';

export type EventDocument = HydratedDocument<Event>;

export enum EventType {
  SCHOOL = 'school',
  EXTRA_CLASS = 'extraClass',
  SPORT = 'sport',
  OTHER = 'other',
}

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toJSON: { getters: true, virtuals: true },
})
export class Event extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Baby', required: true })
  childId: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Date, required: true })
  startAt: Date;

  @Prop({ type: Date, required: true })
  endAt: Date;

  @Prop({ type: String, enum: EventType, required: true })
  eventType: EventType;

  @Prop({ type: String })
  notes?: string;

}

export const EventSchema = SchemaFactory.createForClass(Event);