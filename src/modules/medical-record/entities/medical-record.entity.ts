import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/modules/shared/base.entity';

export type MedicalRecordDocument = HydratedDocument<MedicalRecord>;

export enum RecordType {
  ILLNESS = 'illness',
  VACCINATION = 'vaccination',
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class MedicalRecord extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Baby', required: true })
  childId: Types.ObjectId;

  @Prop({ type: String, enum: RecordType, required: true })
  recordType: RecordType;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date, required: true })
  recordDate: Date;

  @Prop({ type: String })
  location?: string;

  @Prop({ type: String })
  notes?: string;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);

