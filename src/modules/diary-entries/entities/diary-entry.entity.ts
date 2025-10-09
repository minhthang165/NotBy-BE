import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/modules/shared/base.entity';

export type DiaryEntryDocument = HydratedDocument<DiaryEntry>;



export enum DiaryCategory {
  VAN_DONG = 'vận động',
  NGON_NGU = 'ngôn ngữ',
  DINH_DUONG = 'dinh dưỡng',
  XA_HOI = 'xã hội',
  KHAC = 'khác',
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
export class DiaryEntry extends BaseEntity {
  constructor(entry: {
    title: string;
    content: string;
    category: DiaryCategory;
    childId: mongoose.Types.ObjectId;
  }) {
    super();
    this.title = entry?.title;
    this.content = entry?.content;
    this.category = entry?.category;
    this.childId = entry?.childId;
  }

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, enum: DiaryCategory, required: true })
  category: DiaryCategory;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: true,
  })
  childId: mongoose.Types.ObjectId;

  @Prop({ type: [String] })
  imageUrls?: string[];
}

export const DiaryEntrySchema = SchemaFactory.createForClass(DiaryEntry);